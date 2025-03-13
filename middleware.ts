import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Paths that require authentication
  const authRequiredPaths = [
    "/dashboard",
    "/profile",
    // Add other protected routes here
  ];

  // Check if the path requires authentication
  const isAuthRequired = authRequiredPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if authentication is required but user is not authenticated
  if (isAuthRequired && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect to dashboard if user is already authenticated and trying to access login/register
  if (
    isAuthenticated &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    // Add other paths that should be checked by the middleware
  ],
};
