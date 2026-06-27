import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { session_id, consent_given, consent_version } = await request.json();

    if (!session_id || consent_given === undefined) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('consent_records')
      .insert({
        session_id,
        consent_given,
        consent_version,
        consent_timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Consent insert error:', error);
      return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Consent API error:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
