// this is the middleware file for the application
// it is used to check if the user is authenticated and redirect them to the login page if they are not
// it is also used to redirect the user to the profile page if they are already authenticated and trying to access the login/register page

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Get the token and check authentication status
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;

  // Define paths that require authentication
  const authRequiredPaths = [
    "/profile",
    "/job-applications",
    "/portfolio",
    "/", // Add root path to protected routes
  ];

  // Define public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/api/auth",
    "/auth/error",
  ];

  // Check if the path is for static assets
  const isStaticAsset =
    path.startsWith("/_next") ||
    path.includes("/images/") ||
    path.includes(".ico") ||
    path.includes("/fonts/");

  // If it's a static asset, allow the request
  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Check if the path requires authentication
  const isAuthRequired = authRequiredPaths.some(
    (authPath) => path === authPath || path.startsWith(`${authPath}/`)
  );

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  // Log information only in development environment
  if (process.env.NODE_ENV === "development") {
    console.log("Path:", path);
    console.log("Auth required:", isAuthRequired);
    console.log("Is authenticated:", isAuthenticated);
    console.log("Is public path:", isPublicPath);
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (isAuthRequired && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.nextUrl.href));
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if user is already authenticated and trying to access login/register
  if (isAuthenticated && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes (except /api/auth which is handled separately)
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (static assets)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/(?!auth)|_next|fonts|images|favicon.ico|sitemap.xml).*)",
    "/api/auth/:path*",
  ],
};
