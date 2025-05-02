"use client";

import { Toaster } from "react-hot-toast";
import JotaiProvider from "./components/JotaiProvider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <JotaiProvider>
      {children}
      <Toaster />
    </JotaiProvider>
  );
}
