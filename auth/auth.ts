import NextAuth from "next-auth";
import { FirebaseAdapter } from "./firebase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/db";
import { doc, getDoc } from "firebase/firestore";
import type { DefaultSession } from "next-auth";
import type { Player } from "@/types";
import { COLLECTIONS } from "@/app/api/crons/rounds/route";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Player & DefaultSession["user"];
  }
}

export const {
  handlers,
  auth: getAuth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      id: "firebase-credentials",
      name: "Firebase Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("logged: credentials", credentials);
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email.toString(),
            credentials.password.toString() //
          );

          const currentUser = userCredential.user;

          // Check if email is verified
          if (!currentUser.emailVerified) {
            // Send verification email again
            await sendEmailVerification(currentUser);
            throw new Error(
              "Please verify your email before logging in. Check your inbox."
            );
          }

          // Fetch user data from Firestore
          const userDoc = await getDoc(
            doc(db, COLLECTIONS.PLAYERS, currentUser.uid)
          );
          if (!userDoc.exists()) {
            throw new Error("User profile not found.");
          }

          const userData = userDoc.data() as Player;

          // Return user data for NextAuth session
          return {
            id: currentUser.uid,
            name: userData.name,
            email: userData.email,
            age: userData.age,
            emailVerified: currentUser.emailVerified,
          };
        } catch (error: any) {
          console.error("Firebase authentication error:", error);
          // Send a clean error message to the client
          if (
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/invalid-credential"
          ) {
            return null;
          } else if (error.code === "auth/too-many-requests") {
            return null;
          } else if (error.message) {
            return null;
          } else {
            return null;
          }
        }
      },
    }),
  ],
  adapter: FirebaseAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user just signed in, add their data to the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.emailVerified = user.emailVerified;
        token.picture = user.image || null;
      }
      return token;
    },
    async session({ session, token }) {
      // Use token data to populate the session
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.age = token.age as number;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.image = (token.picture as string) || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home page for sign in
    error: "/", // Authentication errors will redirect to home
  },
  debug: process.env.NODE_ENV === "development",
});
