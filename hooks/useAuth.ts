import { useState, useEffect } from "react";
import { auth, db } from "@/db";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { userAtom } from "@/app/useAtoms";
import * as Types from "@/types";
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from "next-auth/react";

// Use the DEFAULT_USER from the global store
const DEFAULT_USER: Types.Player = {
  id: "",
  name: "",
  age: 0,
  email: "",
  emailVerified: false,
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const { data: session, status } = useSession();

  // Use the global userAtom from the store
  const [globalUser, setGlobalUser] = useAtom(userAtom);

  // Update global user when session changes
  useEffect(() => {
    if (session?.user) {
      setGlobalUser({
        id: session.user.id,
        name: session.user.name || "",
        age: session.user.age || 0,
        email: session.user.email || "",
        emailVerified: session.user.emailVerified || false,
      });
    } else if (status === "unauthenticated") {
      setGlobalUser(DEFAULT_USER);
    }
  }, [session, status, setGlobalUser]);

  const register = async (
    email: string,
    password: string,
    name: string,
    age: number
  ) => {
    setLoading(true);
    setError("");
    try {
      // Create user with Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = userCredential.user;

      // Create user profile in Firestore
      const player: Types.Player = {
        id: currentUser.uid,
        name,
        email,
        age,
        emailVerified: currentUser.emailVerified,
      };

      await setDoc(doc(db, "players", currentUser.uid), {
        ...player,
        createdAt: new Date().toISOString(),
      });

      // Send verification email
      await sendEmailVerification(currentUser);
      setVerificationSent(true);

      return currentUser;
    } catch (err: any) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already in use."
          : "Registration failed. Please try again."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log("login old?");
    setLoading(true);
    setError("");
    try {
      // Use NextAuth to sign in which will use our Firebase credentials provider
      const result = await nextAuthSignIn("firebase-credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return null;
      }

      return result;
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Use NextAuth to sign out
      await nextAuthSignOut({ redirect: false });
      setGlobalUser(DEFAULT_USER);
      return true;
    } catch (err: any) {
      setError(err.message || "Logout failed. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setVerificationSent(true);
      return true;
    } catch (err: any) {
      setError(
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : "Password reset failed. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user: session?.user || null,
    error,
    loading: loading || status === "loading",
    verificationSent,
    login,
    register,
    logout,
    forgotPassword,
  };
};
