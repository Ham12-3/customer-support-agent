import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For dashboard routes, we'll let the client-side layout handle auth
  // This middleware mainly handles cookie-based auth if available
  const token = request.cookies.get('access_token')?.value;

  // If we have a token cookie and user tries to access login/register, redirect to dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For dashboard routes without cookie, let client-side handle it
  // The dashboard layout will check localStorage and redirect if needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};

