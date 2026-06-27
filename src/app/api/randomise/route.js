import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { simpleRandomise } from '@/lib/randomise';

export async function POST(request) {
  try {
    const { participant_id } = await request.json();

    if (!participant_id) {
      return NextResponse.json({ error: '缺少参与者ID' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check if already allocated
    const { data: participant } = await supabase
      .from('participants')
      .select('allocation_group')
      .eq('participant_id', participant_id)
      .single();

    if (participant?.allocation_group) {
      return NextResponse.json({
        allocation: participant.allocation_group,
        already_allocated: true,
      });
    }

    // Perform randomisation
    const allocation = simpleRandomise();

    const { error } = await supabase
      .from('participants')
      .update({
        allocation_group: allocation,
        allocation_timestamp: new Date().toISOString(),
        randomisation_method: 'simple',
        status: 'intervention',
      })
      .eq('participant_id', participant_id);

    if (error) {
      console.error('Randomisation update error:', error);
      return NextResponse.json({ error: '分组失败' }, { status: 500 });
    }

    return NextResponse.json({ allocation });
  } catch (err) {
    console.error('Randomise API error:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
