"use client";

import { Toaster } from "react-hot-toast";
import JotaiProvider from "./components/JotaiProvider";
import AuthProvider from "./components/AuthProvider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <JotaiProvider>
        {children}
        <Toaster />
      </JotaiProvider>
    </AuthProvider>
  );
}
