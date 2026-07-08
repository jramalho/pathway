import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy that exposes the request pathname to Server Components
 * via a custom header. The public layout reads this to determine the
 * active navigation item without making the header a Client Component.
 *
 * Renamed from middleware.ts per Next.js 16 deprecation
 * (https://nextjs.org/docs/app/api-reference/file-conventions/proxy).
 */
export function proxy(request: NextRequest) {
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
