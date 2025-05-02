import { useState, useEffect } from "react";
import { auth, db } from "@/db";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { userAtom, store } from "@/app/useAtoms";
import * as Types from "@/types";

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

  // Use the global userAtom from the store
  const [globalUser, setGlobalUser] = useAtom(userAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "players", currentUser.uid));
          const userData = userDoc.exists()
            ? (userDoc.data() as Types.Player)
            : {
                ...DEFAULT_USER,
                id: currentUser.uid,
                name: currentUser.displayName || "New User",
                email: currentUser.email || "",
              };

          const completeUserData = {
            ...userData,
            emailVerified: currentUser.emailVerified,
          };

          setGlobalUser(completeUserData);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setGlobalUser({
            ...DEFAULT_USER,
            id: currentUser.uid,
            emailVerified: currentUser.emailVerified,
          });
        }
      } else {
        setGlobalUser(DEFAULT_USER);
      }
    });

    return () => unsubscribe();
  }, [setGlobalUser]);

  const register = async (
    email: string,
    password: string,
    name: string,
    age: number
  ) => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = userCredential.user;

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

      setGlobalUser(player);
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
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const currentUser = userCredential.user;

      if (!currentUser.emailVerified) {
        await signOut(auth);
        setError(
          "Please verify your email before logging in. Check your inbox."
        );
        return null;
      }

      const userDoc = await getDoc(doc(db, "players", currentUser.uid));
      const userData = userDoc.exists()
        ? (userDoc.data() as Types.Player)
        : {
            ...DEFAULT_USER,
            id: currentUser.uid,
            name: currentUser.displayName || "User",
            email: currentUser.email || "",
          };

      const updatedUserData = {
        ...userData,
        emailVerified: currentUser.emailVerified,
      };

      await setDoc(doc(db, "players", currentUser.uid), updatedUserData);
      setGlobalUser(updatedUserData);

      return currentUser;
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setGlobalUser(DEFAULT_USER);
      return true;
    } catch (err: any) {
      setError(err.message || "Logout failed. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    error,
    loading,
    verificationSent,
    login,
    register,
    logout,
  };
};
