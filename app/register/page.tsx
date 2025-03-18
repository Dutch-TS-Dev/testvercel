"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { userAtom } from "../useAtoms";
import { players } from "../data/players";
import Link from "next/link";

// User class definition
class User {
  constructor(
    id,
    name,
    email,
    password,
    rank = players.length + 1,
    image = "https://raw.githubusercontent.com/khadkamhn/secret-project/master/img/usr-default.png",
    teamId = null
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.rank = rank;
    this.image = image;
    this.teamId = teamId;
  }
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [user, setUser] = useAtom(userAtom);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = (data) => {
    try {
      // Check if email already exists
      const emailExists = players.some((player) => player.email === data.email);
      if (emailExists) {
        setErrorMessage(
          "Email already registered. Please use a different email."
        );
        setSuccessMessage("");
        return;
      }

      // Create new user from User class
      const newUser = new User(
        `player-${Date.now()}`, // Generate a unique ID
        data.name,
        data.email,
        data.password
      );

      // Add user to players array (in a real application, this would be a server API call)
      players.push(newUser);

      // Set current user
      setUser(newUser);

      // Show success message
      setSuccessMessage("Registration successful! Redirecting to home page...");
      setErrorMessage("");

      // Reset form
      reset();

      // In a real app, you would redirect to home page after a short delay
      // For demonstration, we'll just console.log the new player
      console.log("New player registered:", newUser);
      console.log("Updated players list:", players);
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      setSuccessMessage("");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="mobile-wrap">
      <div className="mobile clearfix">
        <div className="header">
          <Link href="/" className="ion-ios-arrow-back pull-left">
            <i></i>
          </Link>
          <span className="title">Register</span>
        </div>
        <div className="content">
          <div className="html register visible">
            <div className="title bounceInDown animated">Create Account</div>

            {successMessage && (
              <div className="success-message flipInX animated">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="error-message flipInX animated">
                {errorMessage}
              </div>
            )}

            <div className="forms">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="group clearfix slideInRight animated">
                  <label className="pull-left" htmlFor="register-name">
                    <span className="ion-ios-person-outline"></span> Full Name
                  </label>
                  <input
                    className="pull-right"
                    id="register-name"
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <div className="error-text">{errors.name.message}</div>
                  )}
                </div>

                <div className="group clearfix slideInLeft animated">
                  <label className="pull-left" htmlFor="register-email">
                    <span className="ion-ios-email-outline"></span> Email
                  </label>
                  <input
                    className="pull-right"
                    id="register-email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="error-text">{errors.email.message}</div>
                  )}
                </div>

                <div className="group clearfix slideInRight animated">
                  <label className="pull-left" htmlFor="register-password">
                    <span className="ion-ios-locked-outline"></span> Password
                  </label>
                  <input
                    className="pull-right"
                    id="register-password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <div className="error-text">{errors.password.message}</div>
                  )}
                </div>

                <div className="group clearfix slideInLeft animated">
                  <label
                    className="pull-left"
                    htmlFor="register-confirm-password"
                  >
                    <span className="ion-ios-locked-outline"></span> Confirm
                    Password
                  </label>
                  <input
                    className="pull-right"
                    id="register-confirm-password"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <div className="error-text">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                <div className="action flipInY animated">
                  <button type="submit" className="btn">
                    Register
                  </button>
                </div>

                <div className="login-link fadeInUp animated">
                  Already have an account? <Link href="/login">Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
