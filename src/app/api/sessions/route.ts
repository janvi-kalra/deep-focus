import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('deep_work_sessions')
      .select('*')
      .order('start', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { start, end, total_time, tag, description } = await req.json();

    if (!start || !tag || !description) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await supabase
      .from('deep_work_sessions')
      .insert([{ start, end, total_time, tag, description }])
      .select()
      .single();

    if (error) throw error;

    return new NextResponse(JSON.stringify(data), { status: 201 });
  } catch (error: any) {
    console.error('Error inserting session:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}
