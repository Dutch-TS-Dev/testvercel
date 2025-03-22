import { useState, useEffect } from "react";
import { auth, db } from "@/db";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); 
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string, age: number) => {
    setLoading(true);
    setError("");
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      
      // Store user information in Firestore
      const player = {
        id: currentUser.uid,
        name,
        email,
        age,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "players", currentUser.uid), player);
      
      // Send email verification
      await sendEmailVerification(currentUser);
      setVerificationSent(true);
      
      return currentUser; 
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      
      // Check if email is verified
      if (!currentUser.emailVerified) {
        // Sign out the user if email is not verified
        await signOut(auth);
        setError("Please verify your email before logging in. Check your inbox.  ");
        return null;
      }
      
      setUser(currentUser);
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
      setUser(null);
      return true; // Indicates successful logout
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