import { BusinessContext, Platform, ContentPattern } from '../campaigns/types';
import { PLATFORM_RULES } from '../campaigns/modules';

interface GenerateContentOptions {
  pattern: ContentPattern;
  businessContext: BusinessContext;
  platform: Platform;
  previousPosts?: string[];
}

interface GeneratedContent {
  content: string;
  hashtags: string[];
  suggestedMedia?: string;
}

async function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  return new Anthropic({ apiKey });
}

export async function generatePostContent(
  options: GenerateContentOptions
): Promise<GeneratedContent> {
  const { pattern, businessContext, platform, previousPosts = [] } = options;
  const platformRules = PLATFORM_RULES[platform];

  const systemPrompt = `You are an expert social media content creator for ${businessContext.businessName}, a ${businessContext.industry} business.

Target Audience: ${businessContext.targetAudience}
Unique Value: ${businessContext.uniqueValue || 'Not specified'}
Brand Tone: ${businessContext.tone}
${businessContext.location ? `Location: ${businessContext.location}` : ''}

Platform: ${platform.toUpperCase()}
Character Limit: ${platformRules.characterLimits.post}
Max Hashtags: ${platformRules.characterLimits.hashtags}

RULES:
- Write in the brand's ${businessContext.tone} tone
- Stay within character limits
- Use relevant hashtags (max ${platformRules.characterLimits.hashtags})
- Include a clear call-to-action when appropriate
- Make content platform-native (don't write the same for all platforms)
- NEVER use "Click the link in bio" or similar - be specific
- Avoid overused phrases like "game-changer" or "unlock your potential"
- Be authentic and human, not robotic`;

  const userPrompt = `Create a ${pattern.type} post based on this template:
"${pattern.template}"

${businessContext.keywords?.length ? `Include these keywords naturally: ${businessContext.keywords.join(', ')}` : ''}

${previousPosts.length ? `Previous posts (avoid similar content):
${previousPosts.slice(-3).join('\n---\n')}` : ''}

Respond in this exact JSON format:
{
  "content": "The full post content",
  "hashtags": ["hashtag1", "hashtag2"],
  "suggestedMedia": "Brief description of ideal image/video"
}`;

  try {
    const anthropic = await getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      system: systemPrompt,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and clean content
    let content = parsed.content || '';
    const hashtags = (parsed.hashtags || []).slice(0, platformRules.characterLimits.hashtags);

    // Ensure content fits platform limits
    if (content.length > platformRules.characterLimits.post) {
      content = content.substring(0, platformRules.characterLimits.post - 3) + '...';
    }

    return {
      content,
      hashtags,
      suggestedMedia: parsed.suggestedMedia,
    };
  } catch (error) {
    console.error('AI content generation error:', error);
    throw new Error('Failed to generate content');
  }
}

export async function generateContentBatch(
  patterns: ContentPattern[],
  businessContext: BusinessContext,
  batchSize: number = 5
): Promise<Map<string, GeneratedContent>> {
  const results = new Map<string, GeneratedContent>();
  const previousPosts: string[] = [];

  for (let i = 0; i < patterns.length; i += batchSize) {
    const batch = patterns.slice(i, i + batchSize);

    const promises = batch.map(async (pattern) => {
      const platform = pattern.platforms[0]; // Use first platform as primary
      const content = await generatePostContent({
        pattern,
        businessContext,
        platform,
        previousPosts,
      });

      previousPosts.push(content.content);
      return { pattern, content };
    });

    const batchResults = await Promise.all(promises);

    for (const { pattern, content } of batchResults) {
      results.set(`${pattern.type}-${pattern.platforms[0]}`, content);
    }
  }

  return results;
}

export async function improveContent(
  originalContent: string,
  feedback: string,
  businessContext: BusinessContext
): Promise<string> {
  const anthropic = await getAnthropicClient();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Improve this social media post based on the feedback:

Original Post:
${originalContent}

Feedback:
${feedback}

Business Context:
- Business: ${businessContext.businessName}
- Industry: ${businessContext.industry}
- Tone: ${businessContext.tone}

Return only the improved post content, nothing else.`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : originalContent;
}

export async function generateHashtags(
  content: string,
  platform: Platform,
  industry: string
): Promise<string[]> {
  const maxHashtags = PLATFORM_RULES[platform].characterLimits.hashtags;

  const anthropic = await getAnthropicClient();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Generate ${maxHashtags} relevant hashtags for this ${platform} post in the ${industry} industry:

"${content}"

Return only the hashtags as a JSON array like ["hashtag1", "hashtag2"], without the # symbol.`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  const jsonMatch = text.match(/\[[\s\S]*\]/);

  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]).slice(0, maxHashtags);
    } catch {
      return [];
    }
  }

  return [];
}
