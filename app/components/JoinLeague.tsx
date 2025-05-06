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

// Extended invitation status to include role
enum EXTENDED_INVITATION_STATUS {
  PENDING_INVITER = "PENDING_INVITER",
  PENDING_INVITEE = "PENDING_INVITEE",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// Join Page Component
const Join: React.FC<JoinPageProps> = () => {
  const [user] = useAtom(userAtom);
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [step, setStep] = useAtom(stepAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationStatus, setInvitationStatus] = useAtom(invitationStatusAtom);
  const [partnerName, setPartnerName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setCurrentView = useSetAtom(currentViewAtom);
  const setAuthMode = useSetAtom(authModeAtom);
  const [overRulingStatus, setOverRulingStatus] = useState<
    EXTENDED_INVITATION_STATUS | undefined
  >();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

  // Update the form when team name is set
  useEffect(() => {
    if (teamName) {
      setValue("teamName", teamName);
    }
  }, [teamName, setValue]);

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

      // Check invitations where the user is the partner/invitee
      const partnerInvitations = await getDocuments<Invitation>(
        COLLECTIONS.INVITATIONS,
        {
          partnerId: user.id,
        }
      );

      // Process inviter invitations
      if (inviterInvitations.length > 0) {
        // Sort by most recent first
        const sortedInvitations = inviterInvitations.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(0);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        const mostRecentInvitation = sortedInvitations[0];

        // Get partner info
        const partner = await getPlayerInfo(mostRecentInvitation.partnerId);
        if (partner) {
          setPartnerName(partner.name || "Partner");
        }

        // Set team name if available
        if (mostRecentInvitation.teamName) {
          console.log(
            "Team name from inviter invitation:",
            mostRecentInvitation.teamName
          );
          setTeamName(mostRecentInvitation.teamName);
        }

        // Determine status based on invitation status
        if (mostRecentInvitation.status === INVITATION_STATUS.ACCEPTED) {
          setOverRulingStatus(EXTENDED_INVITATION_STATUS.ACCEPTED);
        } else if (mostRecentInvitation.status === INVITATION_STATUS.PENDING) {
          setOverRulingStatus(EXTENDED_INVITATION_STATUS.PENDING_INVITER);
        } else if (mostRecentInvitation.status === INVITATION_STATUS.REJECTED) {
          setOverRulingStatus(EXTENDED_INVITATION_STATUS.REJECTED);
        }

        setInvitationStatus(mostRecentInvitation.status as INVITATION_STATUS);
        setGameType(MATCH_TYPE.DOUBLES);
      }
      // If no inviter invitations, check partner invitations
      else if (partnerInvitations.length > 0) {
        // Sort by most recent first
        const sortedPartnerInvitations = partnerInvitations.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(0);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        const mostRecentPartnerInvitation = sortedPartnerInvitations[0];

        // Get inviter info
        const inviter = await getPlayerInfo(
          mostRecentPartnerInvitation.inviterId
        );
        if (inviter) {
          setPartnerName(inviter.name || "Partner");
        }

        // Set team name if available
        if (mostRecentPartnerInvitation.teamName) {
          console.log(
            "Team name from partner invitation:",
            mostRecentPartnerInvitation.teamName
          );
          setTeamName(mostRecentPartnerInvitation.teamName);
        }

        // Determine status based on invitation status
        if (mostRecentPartnerInvitation.status === INVITATION_STATUS.ACCEPTED) {
          setOverRulingStatus(EXTENDED_INVITATION_STATUS.ACCEPTED);
        } else if (
          mostRecentPartnerInvitation.status === INVITATION_STATUS.PENDING
        ) {
          setOverRulingStatus(EXTENDED_INVITATION_STATUS.PENDING_INVITEE);
        } else if (
          mostRecentPartnerInvitation.status === INVITATION_STATUS.REJECTED
        ) {
          setOverRulingStatus(EXTENDED_INVITATION_STATUS.REJECTED);
        }

        setInvitationStatus(
          mostRecentPartnerInvitation.status as INVITATION_STATUS
        );
        setGameType(MATCH_TYPE.DOUBLES);
      } else {
        // No invitations found
        setOverRulingStatus(undefined);
        setInvitationStatus(undefined);
        setTeamName("");
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

    // Destructure form data
    const { teamName, partnerEmail } = data;

    // Check if partner email is the same as current user's email
    if (user?.email === partnerEmail) {
      toast.error("You cannot be your own partner!");
      setIsSubmitting(false);
      return;
    }

    try {
      const toastId = toast.loading("Sending invitation...");

      // Send invitation request to the backend API
      const response = await fetch("/api/createteam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: partnerEmail,
          teamName: teamName,
          userId: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send invitation");
      }

      toast.success("Invitation sent successfully!", { id: toastId });
      console.log("Team invitation sent successfully to", partnerEmail);

      // Update invitation status and move to confirmation step
      setInvitationStatus(INVITATION_STATUS.PENDING);
      setOverRulingStatus(EXTENDED_INVITATION_STATUS.PENDING_INVITER);
      setPartnerName(result.partner?.name || partnerEmail);
      setTeamName(teamName);
      setStep(3);
    } catch (error) {
      console.error("Error creating team invitation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while sending the invitation. Please try again."
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

  // Updated renderInvitationStatusMessage function using overRulingStatus
  const renderInvitationStatusMessage = () => {
    switch (overRulingStatus) {
      case EXTENDED_INVITATION_STATUS.PENDING_INVITER:
        return (
          <div className="invitation-status pending flipInX animated mt-[30px] small-info-text">
            <p className="text-center">
              * You have already sent an invitation for team "
              <strong>{teamName}</strong>". As soon as {partnerName} accepts it,
              your team will be added to the ladder.
            </p>
          </div>
        );
      case EXTENDED_INVITATION_STATUS.PENDING_INVITEE:
        return (
          <div className="invitation-status pending flipInX animated mt-[30px] small-info-text">
            <p className="text-center">
              You have received a team invitation from {partnerName} for team "
              <strong>{teamName}</strong>". Please check your notifications to
              accept or decline.
            </p>
            <div className="action flipInY animated">
              <button className="btn" onClick={navigateToHome}>
                Return to Home
              </button>
            </div>
          </div>
        );
      case EXTENDED_INVITATION_STATUS.ACCEPTED:
        return (
          <div className="invitation-status accepted flipInX animated mt-[30px] small-info-text">
            <p className="text-center">
              Welcome aboard! Your teammember has accepted your invite and
              <strong> {teamName} </strong> is ready to compete!
            </p>
            <p className="text-center">
              You will receive match information as soon as possible.
            </p>
            <div className="action flipInY animated">
              <button className="btn" onClick={() => router.push("/ladder")}>
                Go to Ladder
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
      case EXTENDED_INVITATION_STATUS.REJECTED:
        return (
          <div className="invitation-status rejected flipInX animated mt-[30px] small-info-text">
            <p className="text-center">
              Your invitation for team "<strong>{teamName}</strong>" has been
              rejected by your partner. You can look for a new partner.
            </p>
            <div className="action flipInY animated">
              <button
                className="btn"
                onClick={() => {
                  setInvitationStatus(undefined);
                  setOverRulingStatus(undefined);
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
          <div className="info-content flipInX animated">
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
          ) : overRulingStatus ? (
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
              Good news! The invitation for team "<strong>{teamName}</strong>"
              has been sent to {partnerName}'s email address.
            </p>
            <p>
              As soon as your teammate accepts the invitation, both of you will
              receive a confirmation email. If they decline, you'll be notified
              so you can invite someone else.
            </p>
            {/* <div className="action flipInY animated">
              <button className="btn" onClick={navigateToHome}>
                Return to Home
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Join;
