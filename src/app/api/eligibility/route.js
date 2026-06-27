import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateParticipantId } from '@/lib/participant-id';

export async function POST(request) {
  try {
    const { session_id, responses, is_eligible } = await request.json();

    if (!session_id || !responses) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Save eligibility record
    const { error: eligError } = await supabase
      .from('eligibility_records')
      .insert({
        session_id,
        responses,
        is_eligible,
        created_at: new Date().toISOString(),
      });

    if (eligError) {
      console.error('Eligibility insert error:', eligError);
      return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }

    // If eligible, create participant record
    if (is_eligible) {
      // Count today's participants for ID generation
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      const participantId = generateParticipantId(count || 0);

      const { error: partError } = await supabase
        .from('participants')
        .insert({
          participant_id: participantId,
          session_id,
          status: 'baseline',
          is_test: false,
          created_at: new Date().toISOString(),
        });

      if (partError) {
        console.error('Participant insert error:', partError);
        return NextResponse.json({ error: '创建参与者记录失败' }, { status: 500 });
      }

      return NextResponse.json({ eligible: true, participant_id: participantId });
    }

    return NextResponse.json({ eligible: false });
  } catch (err) {
    console.error('Eligibility API error:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
