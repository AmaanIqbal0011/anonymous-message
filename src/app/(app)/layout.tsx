import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";



export const metadata: Metadata = {
  title: "Anonymous Message",
  description: "Receive anonymous messages from anyone, anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body>
        
        <Navbar />
        {children}
        <Toaster />
      
      </body>
        </AuthProvider>
      
    </html>
  );
}
