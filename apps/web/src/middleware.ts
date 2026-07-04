import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware that exposes the request pathname to Server Components
 * via a custom header. The public layout reads this to determine the
 * active navigation item without making the header a Client Component.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathway-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all routes except static assets and Next.js internals.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
