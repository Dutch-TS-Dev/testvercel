import { NextResponse } from "next/server";

export async function POST() {
  // Delete "token" Cookie
  const cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;

  return NextResponse.json(
    { message: "Logout successful" },
    {
      headers: { "Set-Cookie": cookie }, // Set Cookie
    }
  );
}