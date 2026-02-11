import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Check for protected routes
  if (url.pathname.startsWith('/timeline')) {
    const userToken = request.cookies.get('user_token');
    if (!userToken) {
      // Redirect to home if not authenticated
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith('/admin/dashboard')) {
    const adminToken = request.cookies.get('admin_token');
    if (!adminToken) {
      // Redirect to admin login if not authenticated
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: ['/timeline/:path*', '/admin/dashboard/:path*'],
};
