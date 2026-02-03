import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { generatePostContent } from '@/lib/ai/content-generator';
import { STRATEGIC_MODULES } from '@/lib/campaigns/modules';
import { Platform } from '@/lib/campaigns/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: campaignId } = await params;

    // Get campaign
    const { data: campaign } = await supabaseAdmin
      .from('social0n_campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', session.user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    // Get posts that need content
    const { data: posts } = await supabaseAdmin
      .from('social0n_posts')
      .select('*')
      .eq('campaign_id', campaignId)
      .is('content', null)
      .order('scheduled_for', { ascending: true })
      .limit(10); // Generate in batches of 10

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts need content generation',
        generated: 0,
      });
    }

    // Get recent posts for context
    const { data: recentPosts } = await supabaseAdmin
      .from('social0n_posts')
      .select('content')
      .eq('campaign_id', campaignId)
      .not('content', 'is', null)
      .order('scheduled_for', { ascending: false })
      .limit(5);

    const previousContent = recentPosts?.map(p => p.content).filter(Boolean) || [];

    // Generate content for each post
    const updates: { id: string; content: string }[] = [];

    for (const post of posts) {
      const module = STRATEGIC_MODULES[post.module_id];
      if (!module) continue;

      const pattern = module.contentPatterns.find(p => p.type === post.content_type);
      if (!pattern) continue;

      try {
        const generated = await generatePostContent({
          pattern,
          businessContext: campaign.business_context,
          platform: post.platform as Platform,
          previousPosts: previousContent,
        });

        // Combine content with hashtags
        const fullContent = generated.hashtags.length
          ? `${generated.content}\n\n${generated.hashtags.map(h => `#${h}`).join(' ')}`
          : generated.content;

        updates.push({
          id: post.id,
          content: fullContent,
        });

        previousContent.push(generated.content);
      } catch (error) {
        console.error(`Failed to generate content for post ${post.id}:`, error);
      }
    }

    // Batch update posts
    for (const update of updates) {
      await supabaseAdmin
        .from('social0n_posts')
        .update({ content: update.content, updated_at: new Date().toISOString() })
        .eq('id', update.id);
    }

    return NextResponse.json({
      success: true,
      generated: updates.length,
      remaining: posts.length - updates.length,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
