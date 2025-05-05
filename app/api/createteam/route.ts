import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getDocument, getNowInSeconds, setDocument, uuid } from "@/db";
import { COLLECTIONS, INVITATION_STATUS, MATCH_TYPE } from "@/types";
import { Player, Invitation } from "@/types";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

console.log(
  "logged: process.env.FIREBASE_PROJECT_ID",
  process.env.FIREBASE_PROJECT_ID
);

import { resendMail } from "@/lib/resend";

import * as admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// // Check if Firebase Admin is already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail:
//         "firebase-adminsdk-fbsvc@sportapp-11a3e.iam.gserviceaccount.com",
//       privateKey:
//         `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw8Q2zyNUbuM8g\nhFn3Ed/FgL1Z7lK75dtNVyiQwaymxf9/X+DhKqQhAzeagisUY5rDhPMkrUa4C3LY\nimgVc5iXfEm4JXRpdcLnbkdBvnjrfYqocwSlZgvu0Nmt39cFBtMn4coipPT7MAy+\nYtQp6Na5jRGRtvQBCOdXk8pZcDXMEa+YZ+DBNz8ozGMeMAY/OBA5UlUTZYwQbg+G\nBLZGn1MQS+z+ZSDF4pjHLEpTwEE0ar9owgWvDzDjHwtj385jQDZRkS8Dc9MSLt57\nUOBfMz1+v13I9XmktT+rCS+uJxIBirBKKxVWM93Zo5lnKDtg+O9FdEa4h5oC5BP6\n9Pb+Y6jBAgMBAAECggEAFxlI5CT+KRHNvF16zyW+tC5TyccydsQRhn2v1oHqE5V6\nfrraBRsHdSXR3vJKRG2iWQ7knO+f8UvRUNJ0twQxsejwSMFe+pt8d7DuTXdbmsZ3\nUPk+7IavXRxXpnq3u7jB3Q19UVt+fcIuj7YgI155lZyEZCThorbyWHz7KATdiQe3\nvhMRtYYTKEi+vPRiYEPB815sMbxRluKk0bZab5GGcbqbNr5z8MGlLSOZahP0XhfS\nh8P3421Zfw9d90TkUXUnUkbdD3gahTkGRA3Grvl9spCA/qjATcUR8jb0Ekex26iL\nu/oDsWPWTJBiIYSA7P+EuumD0/fH8j997tdfh2ye7wKBgQD5+tCOEEP4Z0a27Km8\nAbpFJAv8hzo8N5s9GwatfJGjOeGtPHmxtOHpTApJi0R7XrGW0wlu0Wbv0djHP79/\nFl8vKheKOxLWvRtcpp7N/ARbFVMQGBGMTW1cFTTKI7cKcedeP+dd9Rv33spBJAb8\noxzfpfnKdC0JquqEjZASSs9YPwKBgQC1M/DyWoqO18mJIi+M5w6Q1esNGAKymW0c\nKmo2wJG7xNlh0EMs5uoYno1zzI6M91XT7p7DBPAlDEgTYPKOVgk8MYnZ+X3JQpzh\ncfNqO1JK0uxHfgAKSkS19dLFtDdSnExHoGCKlqdAFCw5QDGGRVHEtvH1Np297erN\nnFzocqS+/wKBgQDPczDuJFtz4qkRlxdI2ZouVLrJx6MxY+glbq88+9qUva0mKcDI\nE9dC14LWA4hCZZQ1GU+Dsq2dKeWffKy7l+JH7sN4SIvavzbczb2OLa2jtO+otICj\nkYHG4CZd9gOp3FrooVmtZILgUfhA1Ngjgm2swD2qoHzbwAY9GInOVFz72wKBgDJb\nZfmkKd96npqKspZA3C5qFLGF27IQq17pdq0SpS1+jj79pr2CysnevkbRMUiBsAt+\nxAZEiAxztlAUYDQoOtbMmZfHGyrkZT7N8SyzobIDngBcRtyVOTUsRNAGvl0p7JT3\nP/0j0wUe1g9vBJRhDVFS2jkgXYQb62YKr1M2EQy3AoGAJMvYopu7d+cH6uMPcjkr\nN7XpVE9SmQF4aoPcfotKp1J9a8ogVq9aapV/ehLwf6L+CpXY604JnL+bTf5Si9qm\n8LDix3FivdBNEx9hhtK/VXG49f5qaI1sNgyDbFqNz4w1X8yQdjXvNyYlE9/2wpsQ\n/rgdq42qpYA3vEZGKigeMgY=\n-----END PRIVATE KEY-----`?.replace(
//           /\\n/g,
//           "\n"
//         ),
//     }),
//     databaseURL: process.env.FIREBASE_DATABASE_URL,
//   });
// }

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// // Check if Firebase Admin is already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//     databaseURL: process.env.FIREBASE_DATABASE_URL,
//   });
// }

async function deleteAllUsers() {
  const listUsersResult = await admin.auth().listUsers();

  for (const user of listUsersResult.users) {
    await admin.auth().deleteUser(user.uid);
    // Optional: Add a delay to avoid hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("All users deleted");
}

// deleteAllUsers();

export async function POST(request: Request) {
  // // First check if partner exists in Firebase Auth
  // let userRecord;
  // try {
  //   userRecord = await getAuth().getUserByEmail("oavanvelsen@gmail.com");

  //   console.log("logged: userRecord", userRecord);

  //   if (!userRecord.emailVerified) {
  //     return NextResponse.json(
  //       { error: "Partner's email is not verified" },
  //       { status: 400 }
  //     );
  //   }
  // } catch (error) {
  //   return NextResponse.json(
  //     { error: "Partner not found in our system" },
  //     { status: 404 }
  //   );
  // }

  try {
    // Parse request body
    const { email, teamName, userId } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!teamName) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get the current user's details for the invitation
    const currentUser = await getDocument<Player>(COLLECTIONS.PLAYERS, {
      id: userId,
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user profile not found" },
        { status: 404 }
      );
    }

    // Check if the partner email is the same as current user's email
    if (currentUser.email === email) {
      return NextResponse.json(
        { error: "You cannot be your own partner" },
        { status: 400 }
      );
    }

    // First check if partner exists in Firebase Auth
    let userRecord;
    try {
      userRecord = await getAuth().getUserByEmail(email);

      if (!userRecord.emailVerified) {
        return NextResponse.json(
          { error: "Partner's email is not verified" },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Partner not found in our system" },
        { status: 404 }
      );
    }

    // Then get partner's profile from Firestore
    const partnerPlayer = await getDocument<Player>(COLLECTIONS.PLAYERS, {
      email: email,
    });

    if (!partnerPlayer) {
      return NextResponse.json(
        {
          error:
            "Partner profile not found. They may need to complete registration.",
        },
        { status: 404 }
      );
    }

    // // Check for existing invitations
    // const existingInvitation = await getDocument<Invitation>(
    //   COLLECTIONS.INVITATIONS,
    //   {
    //     inviterId: userId,
    //     partnerId: partnerPlayer.id,
    //     status: INVITATION_STATUS.PENDING,
    //   }
    // );

    // if (existingInvitation) {
    //   return NextResponse.json(
    //     { error: "You already have a pending invitation with this partner" },
    //     { status: 400 }
    //   );
    // }

    // Create invitation
    const confirmationToken = uuid();
    const rejectionToken = uuid();

    const invite: Invitation = {
      id: uuid(),
      teamName: teamName,
      matchType: MATCH_TYPE.DOUBLES,
      inviterId: userId,
      partnerId: partnerPlayer.id,
      status: INVITATION_STATUS.PENDING,
      createdAt: getNowInSeconds(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      confirmationToken: confirmationToken,
      rejectionToken: rejectionToken,
    };

    // Save the invitation to Firestore
    await setDocument(COLLECTIONS.INVITATIONS, invite);

    // Create confirmation and rejection URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const confirmUrl = `${baseUrl}/api/invite?confirm=${confirmationToken}`;
    const rejectUrl = `${baseUrl}/api/invite?reject=${rejectionToken}`;

    const opts = {
      from: "registerteam@leaqx.com",
      to: email,
      subject: `Team Invitation: ${
        currentUser.name || currentUser.email
      } wants you to join their pickleball team!`,
      html: `
Hello ${partnerPlayer.name || email},

${
  currentUser.name || currentUser.email
} has invited you to join their pickleball team "${teamName}" for the upcoming ladder competition.

To accept this invitation, please click here: ${confirmUrl}

To decline this invitation, please click here: ${rejectUrl}

This invitation will expire in 7 days.

Best regards,
The Pickleball Ladder Team
      `,
      attachments: [],
    };

    console.log("logged: opts", opts);

    // Send email to partner
    await resendMail({
      from: "register@leaqx.com",
      to: email,
      subject: `Team Invitation: ${
        currentUser.name || currentUser.email
      } wants you to join their pickleball team!`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pickleball Team Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; border-top: 4px solid #38b2ac;">
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #38b2ac; margin: 0; font-size: 24px;">Team Invitation</h1>
    </div>
    
    <p style="margin-top: 0;">Hi ${partnerPlayer.name || email},</p>
    
    <p><strong>${
      currentUser.name || currentUser.email
    }</strong> has invited you to join their pickleball team <strong>"${teamName}"</strong> for the upcoming ladder competition!</p>
    
    <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; margin: 25px 0; border: 1px solid #e1e4e8;">
      <p style="margin-top: 0; font-weight: bold;">Team Details:</p>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li>Team Name: <strong>${teamName}</strong></li>
        <li>Partner: <strong>${
          currentUser.name || currentUser.email
        }</strong></li>
        <li>Competition Type: <strong>Doubles Ladder</strong></li>
      </ul>
    </div>
    
    <p>Please respond to this invitation by clicking one of the buttons below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${confirmUrl}" style="display: inline-block; background-color: #38b2ac; color: white; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-weight: bold; margin-right: 10px;">Accept Invitation</a>
      <a href="${rejectUrl}" style="display: inline-block; background-color: #e53e3e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-weight: bold;">Decline Invitation</a>
    </div>
    
    <p style="color: #718096; font-size: 14px;"><em>Note: This invitation will expire in 7 days.</em></p>
    
    <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 25px 0;">
    
    <p style="margin-bottom: 0;">Best regards,<br>
    <strong>The Pickleball Ladder Team</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
    <p>If you have any questions, please contact us at <a href="mailto:support@pickleball-ladder.com" style="color: #38b2ac;">support@pickleball-ladder.com</a></p>
  </div>
</body>
</html>
      `,
      attachments: [],
    });

    console.log("after");

    // Return success with partner data
    return NextResponse.json({
      success: true,
      partner: {
        id: partnerPlayer.id,
        name: partnerPlayer.name,
        email: partnerPlayer.email,
      },
      invitation: {
        id: invite.id,
        status: invite.status,
      },
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
