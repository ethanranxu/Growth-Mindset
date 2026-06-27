import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { participant_id, responses, started_at } = await request.json();
    if (!participant_id || !responses) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('posttest_responses').insert({
      participant_id,
      responses,
      started_at,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Posttest insert error:', error);
      return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }

    await supabase.from('participants').update({ status: 'completed' }).eq('participant_id', participant_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Posttest API error:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
