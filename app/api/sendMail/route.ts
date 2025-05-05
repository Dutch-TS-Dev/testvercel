import { Invitation, Player } from "@/types";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { COLLECTIONS } from "../crons/rounds/route";
import { getDocument } from "@/db";

export async function POST(req: Request) {
  const { userId, inviteeEmail } = await req.json();

  const player = await getDocument<Player>(COLLECTIONS.PLAYERS, userId);

  const invite = await getDocument<Invitation>(COLLECTIONS.INVITATIONS, {
    inviterId: userId,
  });

  const message = `Dear dude/dudette,

${player?.name} has invited you to join their pickleball team "${invite?.teamName}" for the upcoming ladder competition.

To accept this invitation, please click here: ${invite?.confirmationToken}

To decline this invitation, please click here: ${invite?.rejectionToken}

.

Best regards,

Leaqx Team`;

  // const { from, to, subject, text } = await req.json();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Leaqx Team",
      inviteeEmail,
      subject: "Invitation pickeball league",
      message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Resend API error:", errorData);
    throw new Error(errorData.error?.message || "Failed to send email");
  }
}
