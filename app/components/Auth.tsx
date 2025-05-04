"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { useAtom } from "jotai";
import { authModeAtom, currentViewAtom } from "@/app/viewAtoms";
import { useSession } from "next-auth/react";

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();

  const {
    user,
    error: authError,
    loading,
    verificationSent,
    login,
    register: authRegister,
    forgotPassword,
  } = useAuth();

  // Get session status from NextAuth
  const { status } = useSession();

  const [authMode, setAuthMode] = useAtom(authModeAtom);
  const [isLogin, setIsLogin] = useState<boolean>(authMode === "login");
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(
    authMode === "forgot-password"
  );
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [_, setCurrentView] = useAtom(currentViewAtom);

  // Redirect to ladder view if authenticated
  useEffect(() => {
    if (status === "authenticated") {
      setCurrentView("ladder");
    }
  }, [status, setCurrentView]);

  // Update states when authMode changes
  useEffect(() => {
    setIsLogin(authMode === "login");
    setIsForgotPassword(authMode === "forgot-password");
  }, [authMode]);

  // Update error message when authError changes
  useEffect(() => {
    if (authError) {
      if (authError === "CredentialsSignin") {
        return setErrorMessage("wrong password");
      }
      setErrorMessage(authError);
    }
  }, [authError]);

  // Clear messages when switching between modes
  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
    setResetSent(false);
  }, [isLogin, isForgotPassword]);

  useEffect(() => {
    // Reset form and clear errors when user changes
    if (!user) {
      reset(); // Reset form
      clearErrors();
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [user, reset, clearErrors]);

  const onSubmit = async (data: any) => {
    try {
      if (isForgotPassword) {
        // Forgot password process
        const success = await forgotPassword(data.email);
        if (success) {
          setSuccessMessage(
            "Password reset email sent. Please check your inbox."
          );
          setResetSent(true);
          toast.success("Password reset email sent!", {
            duration: 4000,
            position: "top-center",
          });
        } else {
          // Error message will be set by useAuth hook
          setErrorMessage(
            authError || "Failed to send reset email. Please try again."
          );
        }
      } else if (isLogin) {
        // Login process using NextAuth
        const result = await login(data.email, data.password);

        if (result && !result.error) {
          // Show success toast notification
          toast.success("Login successful!.", {
            duration: 3000,
            position: "top-center",
          });

          // NextAuth session will cause a redirect via the useEffect above
        } else {
          // Error message will be set by the useAuth hook
          setErrorMessage(authError || "Login failed. Please try again.");
        }
      } else {
        // Register process
        const newUser = await authRegister(
          data.email,
          data.password,
          data.name,
          data.age || 0
        );
        if (newUser) {
          // Show success toast notification
          toast.success(
            "Registration successful! Please check your email to verify your account before logging in.",
            {
              duration: 5000,
              position: "top-center",
            }
          );
          reset();
        } else {
          setErrorMessage(
            authError || "Registration failed. Please try again."
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    }
  };

  // Handle mode toggles with authModeAtom
  const handleLoginToggle = () => {
    setAuthMode("login");
  };

  const handleRegisterToggle = () => {
    setAuthMode("register");
  };

  const handleForgotPasswordToggle = () => {
    setAuthMode("forgot-password");
  };

  const handleBackToLogin = () => {
    setAuthMode("login");
  };

  return (
    <div className="mobile clearfix">
      <div className="header">
        <div className="auth-toggle">
          {!isForgotPassword && (
            <>
              <button
                className={isLogin ? "active" : ""}
                onClick={handleLoginToggle}
              >
                Login
              </button>
              <button
                className={!isLogin && !isForgotPassword ? "active" : ""}
                onClick={handleRegisterToggle}
              >
                Register
              </button>
            </>
          )}
          {isForgotPassword && (
            <button onClick={handleBackToLogin}>&larr; Back to Login</button>
          )}
        </div>
      </div>
      <div className="content">
        <div className="html register visible relative">
          {errorMessage && (
            <div className="pl-6 pt-2 error-message flipInX animated absolute -top-23 left-0 w-full">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="success-message flipInX animated absolute -top-23 left-0 w-full text-green-500">
              {successMessage}
            </div>
          )}

          <div className="forms">
            <form onSubmit={handleSubmit(onSubmit)}>
              {!isLogin && !isForgotPassword && (
                <>
                  <div className="group clearfix slideInRight animated">
                    <label className="pull-left" htmlFor="register-name">
                      <span className="ion-ios-person-outline"></span> Full Name
                    </label>
                    <input
                      className="pull-right input-underline"
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
                      <div className="error-text absolute bottom-5 left-0 w-full ">
                        {(errors.name as any)?.message}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Email field */}
              <div
                className={`group clearfix ${
                  isLogin || isForgotPassword ? "fadeInUp" : "slideInRight"
                } animated`}
                style={{ animationDelay: isLogin ? "0.1s" : "0.3s" }}
              >
                {isLogin && !isForgotPassword && (
                  <p className="small-info-text mb-[20px]">
                    Don't have an account yet?
                    <br /> Please click on register{" "}
                  </p>
                )}

                {isForgotPassword && (
                  <p className="small-info-text mb-[20px]">
                    Enter your email address to receive a password reset link.
                  </p>
                )}

                <label className="pull-left" htmlFor="register-email">
                  <span className="ion-ios-email-outline"></span> Email
                </label>
                <input
                  className="pull-right input-underline"
                  id="register-email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  onFocus={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                />
                {errors.email && (
                  <div className="error-text absolute bottom-5 left-0 w-full ">
                    {(errors.email as any)?.message}
                  </div>
                )}
              </div>

              {/* Password field - only show for login and register */}
              {!isForgotPassword && (
                <div
                  className={`group clearfix ${
                    isLogin ? "fadeInUp" : "slideInLeft"
                  } animated`}
                  style={{
                    animationDelay: isLogin ? "0.2s" : "0.4s",
                    marginBottom: "15px",
                  }}
                >
                  <label className="pull-left" htmlFor="register-password">
                    <span className="ion-ios-locked-outline"></span> Password
                  </label>
                  <input
                    className="pull-right input-underline"
                    id="register-password"
                    type="password"
                    {...register("password", {
                      required: !isForgotPassword
                        ? "Password is required"
                        : false,
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    onFocus={() => {
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                  />
                  {errors.password && (
                    <div className="error-text absolute bottom-5 left-0 w-full ">
                      {(errors.password as any)?.message}
                    </div>
                  )}
                </div>
              )}

              <div className="action flipInY animated">
                <button
                  type="submit"
                  className="btn"
                  disabled={
                    loading ||
                    status === "loading" ||
                    (isForgotPassword && resetSent)
                  }
                >
                  {loading || status === "loading"
                    ? "Loading..."
                    : isForgotPassword
                    ? "Reset Password"
                    : isLogin
                    ? "Login"
                    : "Register"}
                </button>

                {/* Forgot Password link - only show on login screen */}
                {isLogin && !isForgotPassword && (
                  <div className="mt-3 text-center mt-2 mb-4">
                    <button
                      type="button"
                      className="text-sm hover:underline"
                      onClick={handleForgotPasswordToggle}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
