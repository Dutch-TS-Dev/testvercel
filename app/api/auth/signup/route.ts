import { adminAuth, db } from "@/lib/firebaseAdmin";
import { Player } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name, age } = await req.json();

    // 1. Create a user using Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    // 2. Store user information in Firestore
    const player: Player = {
      id: userRecord.uid, // Firebase UID
      name,
      age,
      email,
    };

    await db.collection("players").doc(userRecord.uid).set(player);

    console.log("✅ Success! Data written to Firestore");

    return NextResponse.json(
      { uid: userRecord.uid, email, name, age },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}