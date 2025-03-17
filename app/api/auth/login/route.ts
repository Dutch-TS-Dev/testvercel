import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Get Firebase ID Token
    const token = await userCredential.user.getIdToken();

    // Store the token in an HttpOnly cookie
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`;

    return NextResponse.json(
      { message: "Login successful", user: { email: userCredential.user.email } },
      {
        headers: { "Set-Cookie": cookie }, // Set Cookie
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}