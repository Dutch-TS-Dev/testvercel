"use client";

import React, { useState, useEffect } from "react";
import { useAtom, atom, useSetAtom } from "jotai";
import { gameTypeAtom, invitationStatusAtom, userAtom } from "../useAtoms";
import {
  Player,
  INVITATION_STATUS,
  COLLECTIONS,
  MATCH_TYPE,
  Invitation,
} from "@/types";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { authModeAtom, currentViewAtom } from "@/app/viewAtoms";
import { serverTimestamp } from "firebase/firestore";
import { getDocument, getDocuments, setDocument, uuid } from "@/db";
import { toast } from "react-hot-toast";

// Import the sendMail function
import { sendMail } from "@/lib/mailer";

// Jotai atoms for form state
const stepAtom = atom<number>(1); // 1: Info, 2: Form, 3: Confirmation

interface JoinPageProps {}

// Form input types
interface JoinFormInputs {
  teamName: string;
  partnerEmail: string;
}

// Utility function to get player information
const getPlayerInfo = async (playerId: string): Promise<Player | undefined> => {
  try {
    return await getDocument<Player>(COLLECTIONS.PLAYERS, { id: playerId });
  } catch (error) {
    console.error("Error getting player information:", error);
    return undefined;
  }
};

enum PARTICIPATION_STEPS {
  INFO = 1,
  FORM = 2,
  CONFIRMATION = 3,
}

// Join Page Component
const Join: React.FC<JoinPageProps> = () => {
  const [user] = useAtom(userAtom);
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [step, setStep] = useAtom(stepAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationStatus, setInvitationStatus] = useAtom(invitationStatusAtom);
  const [partnerName, setPartnerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setCurrentView = useSetAtom(currentViewAtom);
  const setAuthMode = useSetAtom(authModeAtom);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JoinFormInputs>({
    defaultValues: {
      teamName: "",
      partnerEmail: "",
    },
  });

  // Check for existing invitations when component mounts
  useEffect(() => {
    if (user?.id) {
      checkExistingInvitations();
    }
  }, [user]);

  const checkExistingInvitations = async () => {
    setIsLoading(true);

    try {
      // Check invitations where the user is the inviter
      const inviterInvitations = await getDocuments<Invitation>(
        COLLECTIONS.INVITATIONS,
        {
          inviterId: user.id,
        }
      );

      // Filter for relevant status values
      const relevantInviterInvitations = inviterInvitations.filter((inv) =>
        Object.values(INVITATION_STATUS).includes(inv.status)
      );

      if (relevantInviterInvitations.length > 0) {
        // Get invitations where user is the partner
        const partnerInvitations = await getDocuments<Invitation>(
          COLLECTIONS.INVITATIONS,
          {
            partnerId: user.id,
          }
        );

        if (partnerInvitations.length > 0) {
          // Handle case of most recent invitation
          const [invitation] = partnerInvitations.sort((a, b) => {
            const dateA = a.createdAt?.toDate
              ? a.createdAt.toDate()
              : new Date(0);
            const dateB = b.createdAt?.toDate
              ? b.createdAt.toDate()
              : new Date(0);
            return dateB.getTime() - dateA.getTime(); // Sort descending (newest first)
          });

          if (invitation) {
            // Fetch partner information since it's not stored in invitation
            const partner = await getPlayerInfo(invitation.partnerId);

            if (partner) {
              setPartnerName(partner.name || "Partner");
            } else {
              // Fallback if partner info can't be retrieved
              setPartnerName("Partner");
            }

            setInvitationStatus(invitation.status as INVITATION_STATUS);
            setGameType(MATCH_TYPE.DOUBLES);
          }
        }
      } else {
        // Check if user is a partner in any accepted invitation
        const acceptedPartnerInvitations = await getDocuments<Invitation>(
          COLLECTIONS.INVITATIONS,
          {
            partnerId: user.id,
            status: INVITATION_STATUS.ACCEPTED,
          }
        );

        if (acceptedPartnerInvitations.length > 0) {
          const [partnerInvitation] = acceptedPartnerInvitations;

          // Need to fetch inviter information
          const inviter = await getPlayerInfo(partnerInvitation.inviterId);

          if (inviter) {
            setPartnerName(inviter.name || "Partner");
          } else {
            // Fallback if inviter info can't be retrieved
            setPartnerName("Partner");
          }

          setInvitationStatus(INVITATION_STATUS.ACCEPTED);
          setGameType(MATCH_TYPE.DOUBLES);
        } else {
          setInvitationStatus(undefined);
        }
      }
    } catch (error) {
      console.error("Error checking existing invitations:", error);
      toast.error("An error occurred while checking your invitations.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<JoinFormInputs> = async (data) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Check if partner email is the same as current user's email
    if (user?.email === data.partnerEmail) {
      toast.error("You cannot be your own partner!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Query Firebase Auth to find the partner by email
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const { fetchSignInMethodsForEmail } = await import("firebase/auth");

      // Check if the email exists in Firebase Auth
      const methods = await fetchSignInMethodsForEmail(auth, data.partnerEmail);

      if (methods.length === 0) {
        toast.error("No verified player found with this email!");
        setIsSubmitting(false);
        return;
      }

      // Get partner profile from Firestore after confirming they exist in Auth
      const partnerPlayer = await getDocument<Player>(COLLECTIONS.PLAYERS, {
        email: data.partnerEmail,
      });

      if (!partnerPlayer) {
        toast.error(
          "Player exists but profile is incomplete. Please try again later."
        );
        setIsSubmitting(false);
        return;
      }

      const toastId = toast.loading("Sending invitation...");

      const invite: Invitation = {
        id: uuid(),
        teamName: data.teamName,
        matchType: gameType,
        inviterId: user.id,
        partnerId: partnerPlayer.id,
        status: INVITATION_STATUS.PENDING,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        confirmationToken: uuid(),
        rejectionToken: uuid(), // acbd11111
      };

      // Save the invitation
      await setDocument(COLLECTIONS.INVITATIONS, invite);

      const confirmUrl = `http://localhost:3000/api/invite?confirm=${invite.confirmationToken}`;
      const rejectUrl = `http://localhost:3000/api/invite?reject=${invite.rejectionToken}`;

      // Send email to partner
      sendMail({
        from:
          process.env.NEXT_PUBLIC_EMAIL_FROM || "noreply@pickleball-ladder.com",
        to: data.partnerEmail,
        subject: `Team Invitation: ${
          user.name || user.email
        } wants you to join their pickleball team!`,
        text: `
Hello ${partnerPlayer.name || data.partnerEmail},

${user.name || user.email} has invited you to join their pickleball team "${
          data.teamName
        }" for the upcoming ladder competition.

To accept this invitation, please click here: ${confirmUrl}

To decline this invitation, please click here: ${rejectUrl}

This invitation will expire in 7 days.

Best regards,
The Pickleball Ladder Team
        `,
        attachments: [],
      });

      toast.success("Invitation sent successfully!", { id: toastId });
      console.log("Team invitation sent successfully to", data.partnerEmail);

      // Update invitation status and move to confirmation step
      setInvitationStatus(INVITATION_STATUS.PENDING);
      setPartnerName(partnerPlayer.name || data.partnerEmail);
      setStep(3);
    } catch (error) {
      console.error("Error creating team invitation:", error);
      toast.error(
        "An error occurred while sending the invitation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle game type selection
  const handleGameTypeChange = (type: MATCH_TYPE) => {
    setGameType(type);
  };

  // Handle paste event to maintain styling
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Small timeout to let the paste complete then reset styles
    setTimeout(() => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#fff";
    }, 10);
  };

  // Navigate to home without the flash
  const navigateToHome = () => {
    // Reset form state first
    setGameType(undefined);
    reset();

    // Use Next.js router for smooth navigation instead of window.location
    router.push("/");
  };

  // Render invitation status message
  const renderInvitationStatusMessage = () => {
    switch (invitationStatus) {
      case INVITATION_STATUS.PENDING:
        return (
          <div className="invitation-status pending flipInX animated mt-[30px] small-info-text">
            <p className="text-center">
              Your partner has not confirmed the invitation yet. Please wait.
            </p>
            <div className="action flipInY animated">
              <button className="btn" onClick={navigateToHome}>
                Return to Home
              </button>
            </div>
          </div>
        );
      case INVITATION_STATUS.ACCEPTED:
        return (
          <div className="invitation-status accepted flipInX animated mt-[30px] small-info-text">
            <p className="text-center">
              You have already formed a team with {partnerName}. At the moment,
              you cannot change your partner.
            </p>
            <div className="action flipInY animated">
              <button className="btn" onClick={navigateToHome}>
                Return to Home
              </button>
            </div>
          </div>
        );
      case INVITATION_STATUS.REJECTED:
        return (
          <div className="invitation-status rejected flipInX animated mt-[30px] small-info-text">
            <p className="text-center">
              Your partner has rejected the invitation. You can look for a new
              partner.
            </p>
            <div className="action flipInY animated">
              <button
                className="btn"
                onClick={() => {
                  setInvitationStatus(undefined);
                  setStep(2);
                }}
              >
                Invite New Partner
              </button>
              <button
                className="btn btn-secondary mt-2"
                onClick={navigateToHome}
              >
                Return to Home
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // If user is not logged in, show login message
  if (!user || !user.id) {
    return (
      <div className="mobile clearfix">
        <div className="header">
          <span className="title">Join Ladder</span>
        </div>
        <div className="content">
          <div className="html visible">
            <div className="mt-[15px] ml-[15px] small-info-text bounceInDown animated ">
              Not Logged In
            </div>
            <p className="ml-[15px] flipInX animated small-info-text">
              Please login first to join the ladder competition.
            </p>
            <div className="action flipInY animated">
              <button
                className="btn"
                onClick={() => {
                  setAuthMode("login");
                  setCurrentView("auth");
                }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading indicator while checking invitations
  if (isLoading) {
    return (
      <div className="mobile-wrap join">
        <div className="html visible">
          <div className="title bounceInDown animated">Loading</div>
          <div className="loading-content flipInX animated text-center">
            <p>Checking your invitation status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-wrap join">
      {/* Step 1: Information about the ladder */}
      {step === 1 && (
        <div className="html visible">
          <div className="title bounceInDown animated">Ladder Information</div>
          {/* @jian: wenn einladung nach partner geschickt: dan text: "wir warten auf genehmigung deines partner
          fuer team ${teamname}" */}
          <div className="info-content flipInX animated">
            <p>
              Welcome to the Pickleball Ladder Competition! Here are some key
              details:
            </p>

            <ul className="info-list">
              <li>
                <strong>Singles:</strong> Compete one-on-one against opponents
              </li>
              <li>
                <strong>Doubles:</strong> Form a team with a partner and compete
                against other teams
              </li>
            </ul>

            <p>
              By joining the ladder, you agree to follow the competition rules
              and participate in matches as scheduled.
            </p>

            <div className="game-type-selection">
              <p>
                <strong>Select your game type:</strong>
              </p>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="singles"
                    name="gameType"
                    onChange={() => handleGameTypeChange(MATCH_TYPE.SINGLES)}
                    checked={gameType === MATCH_TYPE.SINGLES}
                  />
                  <label htmlFor="singles">Singles</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="doubles"
                    name="gameType"
                    onChange={() => handleGameTypeChange(MATCH_TYPE.DOUBLES)}
                    checked={gameType === MATCH_TYPE.DOUBLES}
                  />
                  <label htmlFor="doubles">Doubles</label>
                </div>
              </div>
            </div>

            <div className="action flipInY animated">
              <button
                onClick={() => setStep(2)}
                disabled={!gameType}
                className={`btn ${!gameType ? "btn-disabled" : ""}`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Form based on selection */}
      {step === 2 && (
        <div className="html visible">
          <div className="title bounceInDown animated">
            {gameType === MATCH_TYPE.SINGLES
              ? "Singles Registration"
              : "Doubles Registration"}
          </div>

          {gameType === MATCH_TYPE.SINGLES ? (
            <div className="singles-unavailable flipInX animated">
              <p className="text-center">
                Singles play is currently not available.
              </p>
              <p className="text-center">
                Please check back later or consider joining doubles play.
              </p>
              <div className="action flipInY animated">
                <button className="btn" onClick={() => setStep(1)}>
                  Go Back
                </button>
              </div>
            </div>
          ) : invitationStatus ? (
            // Show status message if user has an existing invitation
            renderInvitationStatusMessage()
          ) : (
            <div className="flipInX animated">
              <div className="form-container">
                <p>
                  <strong>Step 1</strong>
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="forms">
                  <div className="group clearfix slideInRight animated join-input-group">
                    <label className="join-label" htmlFor="team-name">
                      Team Name
                    </label>
                    <input
                      className="join-input"
                      id="team-name"
                      type="text"
                      onPaste={handlePaste}
                      {...register("teamName", {
                        required: "Team name is required",
                        minLength: {
                          value: 3,
                          message: "Team name must be at least 3 characters",
                        },
                      })}
                    />
                    {errors.teamName && (
                      <p className="error-message">{errors.teamName.message}</p>
                    )}
                  </div>
                  <div className="group clearfix slideInLeft animated join-input-group">
                    <label className="join-label" htmlFor="partner-email">
                      Partner's Email
                    </label>
                    <input
                      className="join-input"
                      id="partner-email"
                      type="email"
                      placeholder="They must have an account"
                      onPaste={handlePaste}
                      {...register("partnerEmail", {
                        required: "Partner's email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.partnerEmail && (
                      <p className="error-message">
                        {errors.partnerEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="action-group">
                    <div className="action flipInY animated">
                      <button
                        type="submit"
                        className="btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Sending invitation..."
                          : "Send Invitation"}
                      </button>
                    </div>
                    <div className="action flipInY animated back-button mt-0!">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setStep(1);
                          reset();
                        }}
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="html visible">
          <div className="title bounceInDown animated">Invitation Sent</div>
          <div className="confirmation-content flipInX animated">
            <p>
              Good news! The invitation has been sent to your partner's email
              address.
            </p>
            <p>
              As soon as they accept the invitation, both of you will receive a
              confirmation email. If they decline, you'll be notified so you can
              invite someone else.
            </p>
            <p>The invitation will expire in 7 days if no action is taken.</p>
            <div className="action flipInY animated">
              <button className="btn" onClick={navigateToHome}>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Join;
