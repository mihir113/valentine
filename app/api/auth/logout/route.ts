import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear authentication cookies
  response.cookies.set({
    name: 'user_token',
    value: '',
    maxAge: 0,
  });

  response.cookies.set({
    name: 'admin_token',
    value: '',
    maxAge: 0,
  });

  return response;
}
