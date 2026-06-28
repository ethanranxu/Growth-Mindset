import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { participant_id, module_type, started_at, engagement_data } = await request.json();

    if (!participant_id || !module_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from('intervention_logs')
      .insert({
        participant_id,
        module_type,
        started_at,
        completed_at: new Date().toISOString(),
        completion_status: true,
        engagement_data,
      });

    if (error) {
      console.error('Intervention insert error:', error);
      return NextResponse.json({ error: 'Save failed' }, { status: 500 });
    }

    await supabase
      .from('participants')
      .update({ status: 'posttest' })
      .eq('participant_id', participant_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Intervention API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
