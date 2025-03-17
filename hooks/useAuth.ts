import { useState } from "react";
import { auth } from "@/db"; // Import Firebase client auth and db
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "@/db";  // Ensure Firestore instance is imported

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const register = async (email: string, password: string, name: string, age: number) => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      // 1. Create a user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set user data

      // 2. Store user information in the Firestore "players" collection
      const player = {
        id: userCredential.user.uid, // Use the user's UID as the document ID
        name,
        age,
        email,
      };

      console.log("player", player);
      await setDoc(doc(db, "players", userCredential.user.uid), player); // Write to Firestore
      // alert("Registration successful!");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again later."); // Set error message
      setUser(null); // Clear user data
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set user data
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your email or password."); // Set error message
      setUser(null); // Clear user data
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth); // Use Firebase client to log out
      setUser(null); // Clear user data
      setError(""); // Clear error message
    } catch (err: any) {
      setError(err.message || "Logout failed. Please try again later."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, login, register, logout };
};