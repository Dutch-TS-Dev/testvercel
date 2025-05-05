import { getDocument, getDocumentsByField, setDocument } from "@/db";
import { COLLECTIONS, Invitation, INVITATION_STATUS } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const confirm = searchParams.get("confirm") || undefined;
  const reject = searchParams.get("reject") || undefined;

  if (!confirm && !reject) {
    return NextResponse.json(
      { message: "No confirmation or rejection token provided" },
      { status: 400 }
    );
  }

  if (confirm) {
    const invitation = await getDocument<Invitation>(COLLECTIONS.INVITATIONS, {
      confirmationToken: confirm,
    });

    if (invitation) {
      invitation.status = INVITATION_STATUS.ACCEPTED;
      await setDocument(COLLECTIONS.INVITATIONS, invitation);
      return NextResponse.json({
        status: 200,
        message: "Invitation confirmed",
      });
    }
  }

  if (reject) {
    const invitation = await getDocument<Invitation>(COLLECTIONS.INVITATIONS, {
      rejectionToken: reject,
    });
    if (invitation) {
      invitation.status = INVITATION_STATUS.REJECTED;
      await setDocument(COLLECTIONS.INVITATIONS, invitation);
      return NextResponse.json({ status: 200, message: "Invitation rejected" });
    }
  }
  throw new Error("No invitation found");
}
