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
import { userAtom } from "@/app/useAtoms";
import * as Types from "@/types";

// Default user structure
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

  const [_, setJotaiUser] = useAtom(userAtom);

  useEffect(() => {
    const testAuthFlow = async () => {
      const email = "johndoenl24@gmail.com"; // Replace with existing user email
      const password = "123456"; // Replace with existing user password

      console.log("Attempting to log in...");
      const loggedInUser = await login(email, password);

      console.log("logged: loggedInUser", loggedInUser);

      if (loggedInUser) {
        console.log("✅ Login successful:", loggedInUser.email);
        console.log("Email verified:", loggedInUser.emailVerified);
      } else {
        console.log("❌ Login failed:", error);
      }

      // const testEmail = "a@ceee.com";
      // const testPassword = "test1234";
      // const testName = "Test User";
      // const testAge = 30;
      // console.log("pppp");
      // console.log("🔄 Registering...");
      // const newUser = await register(
      //   testEmail,
      //   testPassword,
      //   testName,
      //   testAge
      // );
      // console.log("logged: newUser", newUser);
      // if (!newUser) {
      //   console.log("❌ Registration failed (maybe email already in use)");
      //   return;
      // }
      // console.log("✅ Registered:", newUser.email);
      // // Optional: wait for email verification in real case
      // console.log("🔒 Logging out...");
      // await logout();
      // console.log("🔐 Logging in again...");
      // const loggedInUser = await login(testEmail, testPassword);
      // if (loggedInUser) {
      //   console.log("✅ Successfully logged in:", loggedInUser.email);
      // } else {
      //   console.log("❌ Login failed (maybe email not verified)");
      // }
    };

    // testAuthFlow();
  }, []);

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

          setJotaiUser(completeUserData);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setJotaiUser({
            ...DEFAULT_USER,
            id: currentUser.uid,
            emailVerified: currentUser.emailVerified,
          });
        }
      } else {
        setJotaiUser(DEFAULT_USER);
      }
    });

    return () => unsubscribe();
  }, [setJotaiUser]);

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

      setJotaiUser(player);
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
    debugger;
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("logged: currentUser", userCredential);
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
      setJotaiUser(updatedUserData);

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
      setJotaiUser(DEFAULT_USER);
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
