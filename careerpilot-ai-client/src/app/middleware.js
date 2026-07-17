import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect to login if not authenticated
    if (!token) {
      if (path.startsWith('/dashboard') || 
          path.startsWith('/resume') || 
          path.startsWith('/saved-jobs')) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Redirect to dashboard if already logged in
    if (token && (path === '/login' || path === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/resume/:path*',
    '/saved-jobs/:path*',
    '/login',
    '/register',
  ],
};