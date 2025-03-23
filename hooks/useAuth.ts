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
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { userAtom } from "@/app/useAtoms";
import * as Types from "@/types";

export const useAuth = () => {
  // Keep the original user state for Firebase authentication
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); 
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  
  // Add Jotai state
  const [_, setJotaiUser] = useAtom(userAtom);

  // Keep the original onAuthStateChanged listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // If user is logged in, synchronize the Jotai state
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "players", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Types.Player;
            // Include emailVerified from Firebase Auth
            setJotaiUser({
              ...userData,
              emailVerified: currentUser.emailVerified
            });
            
            console.log("Updated Jotai user with auth state:", {
              ...userData,
              emailVerified: currentUser.emailVerified
            });
          } else {
            // User exists in Auth but not in Firestore
            // Create default user data with emailVerified from Auth
            const defaultUserData = {
              id: currentUser.uid,
              name: currentUser.displayName || "New User",
              email: currentUser.email || "",
              age: 0,
              emailVerified: currentUser.emailVerified
            };
            setJotaiUser(defaultUserData);
            console.log("Created default Jotai user:", defaultUserData);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        // User logged out, reset Jotai state
        const defaultUser = {
          id: "",
          name: "",
          age: 0,
          email: "",
          emailVerified: false,
        };
        setJotaiUser(defaultUser);
        console.log("Reset Jotai user to default:", defaultUser);
      }
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, [setJotaiUser]);

  const register = async (email: string, password: string, name: string, age: number) => {
    setLoading(true);
    setError("");
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      
      // Create player object
      const player: Types.Player = {
        id: currentUser.uid,
        name,
        email,
        age,
        emailVerified: currentUser.emailVerified,
      };

      // Store user information in Firestore
      await setDoc(doc(db, "players", currentUser.uid), {
        ...player,
        createdAt: new Date().toISOString(),
      });
      
      // Update Jotai atom state
      setJotaiUser(player);
      console.log("Registered user and updated Jotai state:", player);
      
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
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      
      // Check if email is verified
      if (!currentUser.emailVerified) {
        // If email is not verified, sign out the user
        await signOut(auth);
        setError("Please verify your email before logging in. Check your inbox.");
        return null;
      }
      
      // Fetch user data from Firestore and update Jotai atom state
      const userDoc = await getDoc(doc(db, "players", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as Types.Player;
        // Add emailVerified from Firebase Auth
        const updatedUserData = {
          ...userData,
          emailVerified: currentUser.emailVerified
        };
        setJotaiUser(updatedUserData);
        console.log("Logged in and updated Jotai state:", updatedUserData);
      } else {
        // User exists in Auth but not in Firestore
        // Create a default user object with emailVerified
        const defaultUserData = {
          id: currentUser.uid,
          name: currentUser.displayName || "User",
          email: currentUser.email || "",
          age: 0,
          emailVerified: currentUser.emailVerified
        };
        setJotaiUser(defaultUserData);
        console.log("Created default user data for login:", defaultUserData);
      }
      
      // onAuthStateChanged will automatically set user state
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
      // onAuthStateChanged will handle setting user to null
      
      // Reset Jotai atom state to default value
      const defaultUser = {
        id: "",
        name: "",
        age: 0,
        email: "",
        emailVerified: false,
      };
      setJotaiUser(defaultUser);
      console.log("Logged out and reset Jotai state:", defaultUser);
      
      return true; // Indicates successful logout
    } catch (err: any) {
      setError(err.message || "Logout failed. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Maintain the original return structure
  return { 
    user, // Keep the same user key as in the original code
    error, 
    loading, 
    verificationSent,
    login, 
    register, 
    logout,
  };
};