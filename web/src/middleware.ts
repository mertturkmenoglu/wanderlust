import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // there are some public paths and there are some protected paths
  // the public path should not be visible when the user has the token
  // the private path should not be visible when the user doesn't have the token
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/sign-in' || path === '/sign-up';
  // check if the token exists
  const token = request.cookies.get('token')?.value ?? '';
  if (isPublicPath && token.length > 0) {
    // redirect them to home page
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  if (!isPublicPath && token.length <= 0) {
    // redirect them to the login page
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
  }
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile', '/sign-in', '/sign-up'],
};
