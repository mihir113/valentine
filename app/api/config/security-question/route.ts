import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch security question
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('auth_config')
      .select('security_question, id')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: 'Unable to fetch security question' },
        { status: 500 }
      );
    }

    return NextResponse.json({ question: data.security_question }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}

// POST: Update security question (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication via cookie
    const adminToken = request.cookies.get('admin_token');
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { message: 'Question and answer are required' },
        { status: 400 }
      );
    }

    // Get the existing config ID
    const { data: existingData, error: fetchError } = await supabase
      .from('auth_config')
      .select('id')
      .single();

    if (fetchError || !existingData) {
      return NextResponse.json(
        { message: 'Unable to update security question' },
        { status: 500 }
      );
    }

    // Update the security question and answer
    const { error: updateError } = await supabase
      .from('auth_config')
      .update({
        security_question: question,
        security_answer: answer,
      })
      .eq('id', existingData.id);

    if (updateError) {
      return NextResponse.json(
        { message: 'Unable to update security question' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Security question updated successfully' },
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
