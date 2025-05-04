import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.next();
  }

  // Clone the request and add user data
  const requestHeaders = new Headers(request.headers);
  // Add verified user ID to headers (don't include sensitive data)
  requestHeaders.set("x-user-id", token.sub as string);

  // Optionally add other non-sensitive user data
  if (token.email) requestHeaders.set("x-user-email", token.email as string);

  // Create a new request with the modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
