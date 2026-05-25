import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Not logged in → trying to access protected route
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in → trying to access auth pages
  if (authRoutes.includes(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*",],
};