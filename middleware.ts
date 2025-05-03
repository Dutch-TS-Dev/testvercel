import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;

  // // Check if it's a public path (login, register, public assets)
  // const isPublicPath =
  //   path === "/" || path === "/register" || path.startsWith("/api/");

  // // Get the token from JWT
  // const token = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  // // Redirect authenticated users away from login page
  // if (isPublicPath && token) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to match specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /icons, /images (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|fonts|icons|images|favicon.ico|sitemap.xml).*)",
  ],
};
