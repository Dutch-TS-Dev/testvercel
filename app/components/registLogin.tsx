"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { sendMail } from "@/lib/mailer";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const {
    user,
    error: authError,
    loading,
    verificationSent,
    login,
    register: authRegister,
    resendVerificationEmail
  } = useAuth();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredPassword, setRegisteredPassword] = useState("");


  // Update error message when authError changes
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
    }
  }, [authError]);

  // Clear messages when switching between login and register modes
  useEffect(() => {
    setErrorMessage("");
  }, [isLogin]);

  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        // Login process
        const user = await login(data.email, data.password);
        if (user) {
          // Show success toast notification
          toast.success("Login successful! Redirecting...", {
            duration: 3000,
            position: "top-center",
          });

          // Redirect after a short delay upon successful login
          setTimeout(() => {
            window.location.href = '/'; // Redirect to the home page
          }, 1500);
        } else {
          // Error message will be set by the useAuth hook
          setErrorMessage(authError);
        }
      } else {
        // Register process
        const newUser = await authRegister(data.email, data.password, data.name, data.age);
        if (newUser) {
          // Store credentials for potential resend
          setRegisteredEmail(data.email);
          setRegisteredPassword(data.password);
          // Show success toast notification
          toast.success("Registration successful! Please check your email to verify your account before logging in.", {
            duration: 5000,
            position: "top-center",
          });

          // After successful registration, send an admin notification email
          await sendMail({
            from: "teamworkforever2025@gmail.com",
            to: "jian.lu.ou@gmail.com",
            subject: "New User Registration",
            text: `A new user has registered:\n\nName: ${data.name}\nEmail: ${data.email}\nAge: ${data.age}\n\nUser needs to verify their email address.`,
            attachments: [],
          });

          reset();
        } else {
          setErrorMessage(authError || "Registration failed. Please try again.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    }
  };

  // Handle resending verification email
  const handleResendVerification = async () => {
    const success = await resendVerificationEmail(registeredEmail, registeredPassword);
    if (success) {
      toast.success("Verification email resent. Please check your inbox.", {
        duration: 3000,
        position: "top-center",
      });
    } else {
      setErrorMessage(authError || "Failed to resend verification email.");
    }
  };

  return (
    <div className="mobile-wrap">
      <div className="mobile clearfix">
        <div className="header">
          <Link href="/" className="ion-ios-arrow-back pull-left">
            <i></i>
          </Link>
          <span className="title">{isLogin ? "Login" : "Register"}</span>
        </div>
        <div className="content">
          <div className="html register visible">
            <div className="title bounceInDown animated">
              {isLogin ? "Welcome Back" : "Create Account"}
            </div>

            {errorMessage && (
              <div className="error-message flipInX animated">
                {errorMessage}
                {errorMessage.includes("verify your email") && (
                  <div className="mt-2">
                    <button
                      onClick={handleResendVerification}
                      className="text-blue-500 hover:underline text-sm cursor-pointer"
                    >
                      Resend verification email
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="forms">
              <form onSubmit={handleSubmit(onSubmit)}>
                {!isLogin && (
                  <>
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
                        <div className="error-text">{(errors.name as any)?.message}</div>
                      )}
                    </div>

                    <div className="group clearfix slideInLeft animated">
                      <label className="pull-left" htmlFor="register-age">
                        <span className="ion-ios-person-outline"></span> Age
                      </label>
                      <div className="clearfix"></div>
                      <input
                        className="pull-right"
                        id="register-age"
                        type="number"
                        {...register("age", {
                          required: "Age is required",
                          min: {
                            value: 1,
                            message: "Age must be at least 1",
                          },
                        })}
                      />
                      {errors.age && (
                        <div className="error-text">{(errors.age as any)?.message}</div>
                      )}
                    </div>
                  </>
                )}

                {/* email and password */}
                <div className={`group clearfix ${isLogin ? "fadeInUp" : "slideInRight"} animated`} style={{ animationDelay: isLogin ? '0.1s' : '0.3s' }}>
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
                    onFocus={() => setErrorMessage("")}
                  />
                  {errors.email && (
                    <div className="error-text">{(errors.email as any)?.message}</div>
                  )}
                </div>

                <div className={`group clearfix ${isLogin ? "fadeInUp" : "slideInLeft"} animated`} style={{ animationDelay: isLogin ? '0.2s' : '0.4s', marginTop: '15px', marginBottom: '15px' }}>
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
                    onFocus={() => setErrorMessage("")}
                  />

                  {errors.password && (
                    <div className="error-text">{(errors.password as any)?.message}</div>
                  )}
                </div>

                {!isLogin && (
                  <div className="group clearfix slideInRight animated">
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
                        {(errors.confirmPassword as any)?.message}
                      </div>
                    )}
                  </div>
                )}

                <div className="action flipInY animated">
                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                  </button>
                </div>

                <div className="login-link fadeInUp animated">
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="text-blue-500 hover:underline"
                      >
                        Register
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-blue-500 hover:underline"
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;