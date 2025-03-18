"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { sendMail } from "@/lib/mailer";

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const { user, error, loading, login, register: authRegister } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true); // 控制登录或注册
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        // login
        await login(data.email, data.password);
        setSuccessMessage("Login successful! Redirecting...");
      } else {
        //register
        await authRegister(data.email, data.password, data.name, data.age);
        setSuccessMessage("Registration successful! Redirecting...");

         // After successful registration, send an email.
         await sendMail({
          from: "teamworkforever2025@gmail.com", 
           to: "oscar.vanvelsen@gmail.com",
          // to: "jian.lu.ou@gmail.com", 
          subject: "New User Registration", 
          text: `A new user has registered:\n\nName: ${data.name}\nEmail: ${data.email}\nAge: ${data.age}`, 
          attachments: [], 
        });

        reset();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
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
                        <div className="error-text">{errors.name.message}</div>
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
                        <div className="error-text">{errors.age.message}</div>
                      )}
                    </div>
                  </>
                )}

{/* email and password */}
<div className={`group clearfix ${isLogin ? "fadeInUp" : "slideInRight"} animated`} style={{animationDelay: isLogin ? '0.1s' : '0.3s'}}>
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

<div className={`group clearfix ${isLogin ? "fadeInUp" : "slideInLeft"} animated`} style={{animationDelay: isLogin ? '0.2s' : '0.4s', marginTop: '15px', marginBottom: '15px'}}>
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
                        {errors.confirmPassword.message}
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