import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// GET: Fetch all events
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: 'Unable to fetch events' },
        { status: 500 }
      );
    }

    return NextResponse.json({ events: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}

// POST: Create new event (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminToken = request.cookies.get('admin_token');
    console.log('POST /api/events - admin_token cookie:', adminToken?.value ?? adminToken);
    if (!adminToken) {
      console.warn('Unauthorized attempt to create event: missing admin_token');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, date, image_url } = body;

    if (!title || !description || !date) {
      return NextResponse.json(
        { message: 'Title, description, and date are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('timeline_events')
      .insert([
        {
          title,
          description,
          date,
          image_url: image_url || null,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { message: 'Unable to create event', detail: error.message ?? error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Event created successfully', event: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
