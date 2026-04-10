import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIX = '/dashboard';
const LOGIN_PAGE = '/auth/login';
const SUSPENDED_PAGE = '/suspended';
const UNAUTHORIZED_PAGE = '/403';
const SESSION_COOKIE = 'irealty-session';

/**
 * Maps URL path segments to allowed roles.
 * Only the first segment after /dashboard/ is checked.
 */
const ROLE_ROUTE_MAP: Record<string, string> = {
  admin:     'Admin',
  agent:     'Agent',
  developer: 'Developer',
  landlord:  'Landlord',
  seeker:    'Property Seeker',
  diaspora:  'Diaspora',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard dashboard routes
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  if (!sessionCookie?.value) {
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode stored role from cookie (set as URL-encoded role string)
  const cookieRole = decodeURIComponent(sessionCookie.value);

  // Check for suspended accounts (role prefixed with "suspended:")
  if (cookieRole.startsWith('suspended:')) {
    if (!pathname.startsWith(SUSPENDED_PAGE)) {
      return NextResponse.redirect(new URL(SUSPENDED_PAGE, request.url));
    }
    return NextResponse.next();
  }

  // Extract the role segment from the path: /dashboard/{roleSegment}/...
  const pathParts = pathname.split('/');
  const roleSegment = pathParts[2]; // e.g. "admin", "agent", "seeker"

  if (roleSegment && ROLE_ROUTE_MAP[roleSegment]) {
    const requiredRole = ROLE_ROUTE_MAP[roleSegment];
    if (cookieRole !== requiredRole) {
      // Redirect to the correct dashboard for the user's actual role
      const actualSegment = Object.entries(ROLE_ROUTE_MAP).find(([, r]) => r === cookieRole)?.[0];
      if (actualSegment) {
        return NextResponse.redirect(new URL(`/dashboard/${actualSegment}`, request.url));
      }
      return NextResponse.redirect(new URL(UNAUTHORIZED_PAGE, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
