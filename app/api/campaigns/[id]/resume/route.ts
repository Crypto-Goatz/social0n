import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { resumeCampaign } from '@/lib/campaigns/engine';

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

    // Verify ownership and status
    const { data: campaign } = await supabaseAdmin
      .from('social0n_campaigns')
      .select('id, status, user_id')
      .eq('id', campaignId)
      .eq('user_id', session.user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'paused') {
      return NextResponse.json(
        { success: false, error: 'Only paused campaigns can be resumed' },
        { status: 400 }
      );
    }

    const success = await resumeCampaign(campaignId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to resume campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resume campaign error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
