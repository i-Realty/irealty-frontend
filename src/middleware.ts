import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIX = '/dashboard';
const LOGIN_PAGE = '/auth/login';
const SESSION_COOKIE = 'irealty-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard dashboard routes
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE);

  if (!session) {
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    // Preserve the originally requested URL so login can redirect back
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
