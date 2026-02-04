// ============================================================
// Schema.org JSON-LD Component
// ============================================================
// Adds structured data for rich search results
// ============================================================

import {
  generateOrganizationSchema,
  generateProductSchema,
  generateFAQSchema,
  generateSoftwareApplicationSchema,
  generateBreadcrumbSchema,
  OrganizationSchema,
  ProductSchema,
  FAQItem,
} from '@/lib/sxo';

interface SchemaMarkupProps {
  type: 'organization' | 'product' | 'faq' | 'software' | 'breadcrumb' | 'multiple';
  organization?: OrganizationSchema;
  product?: ProductSchema;
  faq?: FAQItem[];
  software?: {
    name: string;
    description: string;
    applicationCategory: string;
    operatingSystem: string;
    offers: { price: number; currency: string }[];
  };
  breadcrumb?: { name: string; url: string }[];
  schemas?: object[];
}

export function SchemaMarkup({
  type,
  organization,
  product,
  faq,
  software,
  breadcrumb,
  schemas,
}: SchemaMarkupProps) {
  let schemaData: object | object[] = {};

  switch (type) {
    case 'organization':
      if (organization) schemaData = generateOrganizationSchema(organization);
      break;
    case 'product':
      if (product) schemaData = generateProductSchema(product);
      break;
    case 'faq':
      if (faq) schemaData = generateFAQSchema(faq);
      break;
    case 'software':
      if (software) schemaData = generateSoftwareApplicationSchema(software);
      break;
    case 'breadcrumb':
      if (breadcrumb) schemaData = generateBreadcrumbSchema(breadcrumb);
      break;
    case 'multiple':
      schemaData = schemas || [];
      break;
  }

  if (!schemaData || (Array.isArray(schemaData) && schemaData.length === 0)) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 0),
      }}
    />
  );
}

// ============================================================
// Pre-configured Schema for Social0n
// ============================================================
export function Social0nSchemas() {
  const organizationSchema = generateOrganizationSchema({
    name: 'Social0n',
    url: 'https://social0n.com',
    logo: 'https://social0n.com/logo.png',
    description: 'Campaign-as-a-Service platform for AI-powered social media automation that delivers real business results.',
    sameAs: [
      'https://twitter.com/social0n',
      'https://linkedin.com/company/social0n',
    ],
    contactPoint: {
      email: 'support@social0n.com',
      contactType: 'customer support',
    },
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: 'Social0n',
    description: 'AI-powered social media campaign automation platform',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      { price: 197, currency: 'USD' },
      { price: 247, currency: 'USD' },
      { price: 297, currency: 'USD' },
      { price: 497, currency: 'USD' },
    ],
  });

  const faqSchema = generateFAQSchema([
    {
      question: 'What is Social0n?',
      answer: 'Social0n is a Campaign-as-a-Service platform that automates your social media marketing with AI-powered, outcome-driven campaigns. Using data science and behavioral analytics, we generate content proven to drive engagement.',
    },
    {
      question: 'How long does a campaign last?',
      answer: 'Each campaign runs for 30 days with a defined posting schedule and clear objectives. This time-boxed approach is based on engagement cycle research showing optimal momentum building within 4-week intervals.',
    },
    {
      question: 'Which social platforms are supported?',
      answer: 'Social0n supports LinkedIn, Facebook, Instagram, and Google Business Profile. Our platform-safe posting rules ensure your accounts stay in good standing while maximizing algorithmic reach.',
    },
    {
      question: 'Do I need to create content myself?',
      answer: 'No. Our AI generates all content based on your business information and campaign objectives. The system uses 14 scientifically-validated content modules optimized for 2026 algorithm behavior.',
    },
    {
      question: 'Is there a long-term contract?',
      answer: 'No contracts. You pay per campaign. Run one campaign or many - each campaign is a one-time purchase with measurable outcomes.',
    },
    {
      question: 'How does Social0n use AI differently than other tools?',
      answer: 'Social0n treats content generation as a science, not guesswork. Our AI is trained on engagement patterns, optimal posting cadences, and platform-specific algorithms current to 2026.',
    },
    {
      question: 'What makes the content scientifically optimized?',
      answer: 'We analyze psychological triggers, timing patterns, and platform-specific engagement data to craft content that resonates. Every post is optimized for hook, value delivery, and call-to-action placement.',
    },
    {
      question: 'Can I pause a campaign?',
      answer: 'Yes. You can pause and resume campaigns at any time from your dashboard. Your remaining posts will be rescheduled automatically while preserving optimal timing patterns.',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
