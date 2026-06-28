import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { participant_id, responses, demographics, started_at } = await request.json();

    if (!participant_id || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from('baseline_responses')
      .insert({
        participant_id,
        responses,
        demographics,
        started_at,
        submitted_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Baseline insert error:', error);
      return NextResponse.json({ error: 'Save failed' }, { status: 500 });
    }

    // Update participant status
    await supabase
      .from('participants')
      .update({ status: 'randomisation' })
      .eq('participant_id', participant_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Baseline API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
