import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answer } = body;

    if (!answer) {
      return NextResponse.json(
        { message: 'Answer is required' },
        { status: 400 }
      );
    }

    // Fetch security config from database
    const { data, error } = await supabase
      .from('auth_config')
      .select('security_answer')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: 'Unable to verify security question' },
        { status: 500 }
      );
    }

    // Compare the answer (case-insensitive)
    const isCorrect = answer.toLowerCase() === data.security_answer.toLowerCase();

    if (isCorrect) {
      // Create response and set authentication cookie
      const response = NextResponse.json(
        { message: 'Login successful' },
        { status: 200 }
      );

      response.cookies.set({
        name: 'user_token',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { message: 'Incorrect answer' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
