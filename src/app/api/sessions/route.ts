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
    const { start, end, focused, tag, description } = await req.json();

    if (!start || !tag || !description) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await supabase
      .from('deep_work_sessions')
      .insert([{ start, end, focused, tag, description }])
      .select()
      .single();

    if (error) throw error;

    return new NextResponse(JSON.stringify(data), { status: 201 });
  } catch (error: any) {
    console.error('Error inserting session:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { error } = await supabase
      .from('deep_work_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { description, end, focused } = await req.json();

  try {
    // Fetch existing session to merge with new data
    const { data: existingSession, error: fetchError } = await supabase
      .from('deep_work_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Update fields and merge with existing data
    const updatedSession = {
      ...existingSession,
      description,
      end: end || existingSession.end,
      focused: focused || existingSession.focused,
    };

    const { error } = await supabase
      .from('deep_work_sessions')
      .update(updatedSession)
      .eq('id', id);

    if (error) throw error;

    return new NextResponse(JSON.stringify(updatedSession), { status: 200 });
  } catch (error: any) {
    console.error('Error updating session:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}
