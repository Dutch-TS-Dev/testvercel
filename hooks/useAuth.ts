import { useState, useEffect } from "react";
import { auth, db } from "@/db";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); 

  const register = async (email: string, password: string, name: string, age: number) => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store user information in Firestore
      const player = {
        id: userCredential.user.uid,
        name,
        age,
        email,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "players", userCredential.user.uid), player);
      return userCredential.user; // Return the user object for further operations
    } catch (err: any) {
        setError('This email is already in use.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user; // Return the user object for further operations
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      return true; // Indicates successful logout
    } catch (err: any) {
      setError(err.message || "Logout failed. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, login, register, logout };
};