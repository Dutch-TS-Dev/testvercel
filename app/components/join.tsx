"use client";

import React, { useState } from "react";
import { useAtom, atom } from "jotai";
import { userAtom } from "../useAtoms";
import { Player } from "@/types";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

// Component types
type GameType = "SINGLES" | "DOUBLES" | null;

// Form input types
interface JoinFormInputs {
  teamName: string;
  partnerEmail: string;
}

// Jotai atoms for form state
const gameTypeAtom = atom<GameType>(null);
const stepAtom = atom<number>(1); // 1: Info, 2: Form, 3: Confirmation

interface JoinPageProps {}

// Join Page Component
const JoinPage: React.FC<JoinPageProps> = () => {
  const [user] = useAtom(userAtom);
  const [gameType, setGameType] = useAtom(gameTypeAtom);
  const [step, setStep] = useAtom(stepAtom);
  const router = useRouter(); // Use Next.js router to handle navigation

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinFormInputs>({
    defaultValues: {
      teamName: "",
      partnerEmail: "",
    },
  });

  // Form submission handler
  const onSubmit: SubmitHandler<JoinFormInputs> = async (data) => {
    // In a real app, you would send the data to your backend here
    console.log({
      gameType,
      user,
      teamName: data.teamName,
      partnerEmail: data.partnerEmail,
    });

    // Move to confirmation step
    setStep(3);
  };

  // Handle game type selection
  const handleGameTypeChange = (type: GameType) => {
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
    setStep(1);
    setGameType(null);
    reset();

    // Use Next.js router for smooth navigation
    router.push("/");
  };

  // If user is not logged in, show login message
  if (!user || !user.id) {
    return (
      <div className="mobile-wrap">
        <div className="mobile clearfix">
          <div className="header">
            <span className="title">Join Ladder</span>
          </div>
          <div className="content">
            <div className="html visible">
              <div className="title bounceInDown animated">Not Logged In</div>
              <p className="flipInX animated">
                Please login first to join the ladder competition.
              </p>
              <div className="action flipInY animated">
                <button className="btn" onClick={() => router.push("/login")}>
                  Go to Login
                </button>
              </div>
            </div>
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
                    onChange={() => handleGameTypeChange("SINGLES")}
                    checked={gameType === "SINGLES"}
                  />
                  <label htmlFor="singles">Singles</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="doubles"
                    name="gameType"
                    onChange={() => handleGameTypeChange("DOUBLES")}
                    checked={gameType === "DOUBLES"}
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
            {gameType === "SINGLES"
              ? "Singles Registration"
              : "Doubles Registration"}
          </div>

          {gameType === "SINGLES" ? (
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
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                    <div className="action flipInY animated back-button">
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
          <div className="title bounceInDown animated">
            Registration Complete
          </div>
          <div className="confirmation-content flipInX animated">
            <p>
              Good news! The email you gave is registered with us and we have
              sent a notification. As soon as they confirm by email, your team
              will be registered for the upcoming ladder round.
            </p>
            <p>
              As soon as they accept, both of you will receive a confirmation
              email.
            </p>
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

export default JoinPage;
