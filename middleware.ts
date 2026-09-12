import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, uploads, lock page, and lock API route
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/api/lock') ||
    pathname === '/lock' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const siteAccess = request.cookies.get('site_access');
  if (!siteAccess || siteAccess.value !== 'true') {
    return NextResponse.redirect(new URL('/lock', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
