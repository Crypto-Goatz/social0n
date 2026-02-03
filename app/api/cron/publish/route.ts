import { NextRequest, NextResponse } from 'next/server';
import { publishDuePosts } from '@/lib/campaigns/publisher';

// This endpoint should be called by a cron job (e.g., Vercel Cron)
// Configure in vercel.json: { "crons": [{ "path": "/api/cron/publish", "schedule": "*/5 * * * *" }] }

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await publishDuePosts();

    return NextResponse.json({
      success: true,
      published: results.published,
      failed: results.failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron publish error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish posts' },
      { status: 500 }
    );
  }
}
