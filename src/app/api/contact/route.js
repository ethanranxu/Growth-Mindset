import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { participant_id, preferred_name, email, phone, wechat, consent_to_contact } = await request.json();

    if (!participant_id || !consent_to_contact) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase.from('contact_followup').insert({
      participant_id,
      preferred_name,
      email: email || null,
      phone: phone || null,
      wechat: wechat || null,
      consent_to_contact,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Contact insert error:', error);
      return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
