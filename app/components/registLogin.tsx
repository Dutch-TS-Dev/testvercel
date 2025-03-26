"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { sendMail } from "@/lib/mailer";
import { toast } from "react-hot-toast";
import { useAtom } from "jotai";
import {authModeAtom, currentViewAtom} from "@/app/viewAtoms";

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    clearErrors
  } = useForm();

  const {
    user,
    error: authError,
    loading,
    verificationSent,
    login,
    register: authRegister,
  } = useAuth();

  const [authMode, setAuthMode] = useAtom(authModeAtom);
  const [isLogin, setIsLogin] = useState<boolean>(authMode === 'login');

  // const [isLogin, setIsLogin] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const[_, setCurrentView] = useAtom(currentViewAtom);

   // Update isLogin state when authMode changes
   useEffect(() => {
    setIsLogin(authMode === 'login');
  }, [authMode]);
  
 
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

  useEffect(() => {
    // Reset form and clear errors when user changes
    if (!user) {
      reset(); // Reset form
      clearErrors(); 
      setErrorMessage(""); 
    }
  }, [user, reset, clearErrors]);

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
         
          setTimeout(() => {
            setCurrentView('welcome');
          }, 1000);
        } else {
          // Error message will be set by the useAuth hook
          setErrorMessage(authError);
        }
      } else {
        // Register process
        const newUser = await authRegister(
          data.email,
          data.password,
          data.name,
          data.age
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
          setErrorMessage(
            authError || "Registration failed. Please try again."
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    }
  };

  // Handle login/register toggle with authModeAtom
 const handleLoginToggle = () => {
  setIsLogin(true);
  setAuthMode('login');
};

const handleRegisterToggle = () => {
  setIsLogin(false);
  setAuthMode('register');
};

  return (
    <div className="mobile clearfix">
      <div className="header">
        <div className="auth-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={handleLoginToggle}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={handleRegisterToggle}
          >
            Register
          </button>
        </div>
      </div>
      <div className="content">
        <div className="html register visible relative">
          {errorMessage && (
            <div className="error-message flipInX animated absolute  -top-23 left-0 w-full">{errorMessage}</div>
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

                  <div className="group clearfix slideInLeft animated">
                    <label className="pull-left" htmlFor="register-age">
                      <span className="ion-ios-person-outline"></span> Age
                    </label>
                    <input
                      className="pull-right input-underline"
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
                      <div className="error-text absolute bottom-5 left-0 w-full ">
                        {(errors.age as any)?.message}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* email and password */}
              <div
                className={`group clearfix ${
                  isLogin ? "fadeInUp" : "slideInRight"
                } animated`}
                style={{ animationDelay: isLogin ? "0.1s" : "0.3s" }}
              >
              {isLogin &&  <p className="small-info-text mb-[20px]">
                  Don't have an account yet?
                  <br /> Please click on register{" "}
                </p>} 
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
                  onFocus={() => setErrorMessage("")}
                />
                {errors.email && (
                  <div className="error-text absolute bottom-5 left-0 w-full ">
                    {(errors.email as any)?.message}
                  </div>
                )}
              </div>

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
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                   onFocus={() => setErrorMessage("")}
                />
                {errors.password && (
                  <div className="error-text absolute bottom-5 left-0 w-full ">
                    {(errors.password as any)?.message}
                  </div>
                )}
              </div>

              <div className="action flipInY animated">
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

