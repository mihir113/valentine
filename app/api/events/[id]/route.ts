import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// PUT: Update event (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const adminToken = request.cookies.get('admin_token');
    console.log('PUT /api/events/[id] - admin_token cookie:', adminToken?.value ?? adminToken);
    if (!adminToken) {
      console.warn('Unauthorized attempt to update event: missing admin_token');
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
      .update({
        title,
        description,
        date,
        image_url,
      })
      .eq('id', params.id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { message: 'Unable to update event', detail: error.message ?? error },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event updated successfully', event: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}

// DELETE: Delete event (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const adminToken = request.cookies.get('admin_token');
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error } = await supabaseAdmin
      .from('timeline_events')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { message: 'Unable to delete event', detail: error.message ?? error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
