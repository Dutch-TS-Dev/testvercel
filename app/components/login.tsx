// // File structure:
// // - app/
// //   - page.tsx (Homepage)
// //   - login/page.tsx (Login page)
// //   - register/page.tsx (Registration page)
// //   - dashboard/page.tsx (Protected dashboard)
// //   - api/auth/login/route.ts
// //   - api/auth/register/route.ts
// //   - api/auth/logout/route.ts
// // - components/
// //   - AuthForm.tsx
// //   - Navbar.tsx
// // - lib/
// //   - firebase.ts (Firebase config)
// //   - auth.ts (Auth context/provider)

// // lib/firebase.ts - Firebase configuration
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyA0E2nL2hCqoxdS8Rr-sHwlOlwqS2atJgg",
//   authDomain: "coincloud-live.firebaseapp.com",
//   projectId: "coincloud-live",
//   storageBucket: "coincloud-live.appspot.com",
//   messagingSenderId: "802403017725",
//   appId: "1:802403017725:web:a4b82b86c81339c8d9ef94",
//   measurementId: "G-GBEW3C1TVW",
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // lib/auth.ts - Auth context provider
// ("use client");

// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
//   type User,
// } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";

// import { auth } from "./firebase";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signUp: (email: string, password: string) => Promise<void>;
//   signIn: (email: string, password: string) => Promise<void>;
//   logOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   signUp: async () => {},
//   signIn: async () => {},
//   logOut: async () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const signUp = async (email: string, password: string) => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       router.push("/dashboard");
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push("/dashboard");
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   };

//   const logOut = async () => {
//     try {
//       await signOut(auth);
//       router.push("/");
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// // components/AuthForm.tsx - Reusable authentication form
// ("use client");

// import { useState } from "react";
// import { useAuth } from "@/lib/auth";

// interface AuthFormProps {
//   type: "login" | "register";
// }

// export default function AuthForm({ type }: AuthFormProps) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { signIn, signUp } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       if (type === "login") {
//         await signIn(email, password);
//       } else {
//         await signUp(email, password);
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
//       {error && (
//         <div className="bg-red-50 border border-red-500 text-red-700 p-3 rounded">
//           {error}
//         </div>
//       )}

//       <div>
//         <label
//           htmlFor="email"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Email
//         </label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
//           required
//         />
//       </div>

//       <div>
//         <label
//           htmlFor="password"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Password
//         </label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
//       >
//         {loading ? "Processing..." : type === "login" ? "Sign In" : "Sign Up"}
//       </button>
//     </form>
//   );
// }

// // components/Navbar.tsx - Navigation bar with auth state
// ("use client");

// import Link from "next/link";
// import { useAuth } from "@/lib/auth";

// export default function Navbar() {
//   const { user, logOut, loading } = useAuth();

//   return (
//     <nav className="bg-white shadow">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <Link href="/" className="text-xl font-bold text-indigo-600">
//                 My App
//               </Link>
//             </div>
//           </div>
//           <div className="flex items-center">
//             {!loading && (
//               <>
//                 {user ? (
//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm text-gray-500">{user.email}</span>
//                     <Link
//                       href="/dashboard"
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       Dashboard
//                     </Link>
//                     <button
//                       onClick={logOut}
//                       className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//                     >
//                       Sign Out
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-x-4">
//                     <Link
//                       href="/login"
//                       className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
//                     >
//                       Sign In
//                     </Link>
//                     <Link
//                       href="/register"
//                       className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//                     >
//                       Sign Up
//                     </Link>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// // app/layout.tsx - Root layout with auth provider
// ("use client");

// import { AuthProvider } from "@/lib/auth";
// import "./globals.css";
// import Navbar from "@/components/Navbar";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           <Navbar />
//           <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             {children}
//           </main>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

// // app/page.tsx - Homepage
// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[70vh]">
//       <h1 className="text-4xl font-bold mb-8">Welcome to My App</h1>
//       <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
//         A simple application with Firebase authentication.
//       </p>
//     </div>
//   );
// }

// // app/login/page.tsx - Login page
// ("use client");

// import Link from "next/link";
// import AuthForm from "@/components/AuthForm";

// export default function Login() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[70vh]">
//       <h1 className="text-3xl font-bold mb-8">Sign In</h1>
//       <AuthForm type="login" />
//       <p className="mt-4 text-sm text-gray-600">
//         Don't have an account?{" "}
//         <Link
//           href="/register"
//           className="text-indigo-600 hover:text-indigo-800"
//         >
//           Sign up
//         </Link>
//       </p>
//     </div>
//   );
// }

// // app/register/page.tsx - Registration page
// ("use client");

// import Link from "next/link";
// import AuthForm from "@/components/AuthForm";

// export default function Register() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[70vh]">
//       <h1 className="text-3xl font-bold mb-8">Create Account</h1>
//       <AuthForm type="register" />
//       <p className="mt-4 text-sm text-gray-600">
//         Already have an account?{" "}
//         <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
//           Sign in
//         </Link>
//       </p>
//     </div>
//   );
// }

// // app/dashboard/page.tsx - Protected dashboard page
// ("use client");

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/auth";

// export default function Dashboard() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
//         <p className="text-gray-600">
//           You are now signed in. This is your protected dashboard.
//         </p>
//       </div>
//     </div>
//   );
// }
