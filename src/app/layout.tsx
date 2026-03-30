import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Whisper — Anonymous Messages",
  description: "Send and receive anonymous messages from anyone, anywhere. Safe, private, and instant.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" className={inter.variable}>
        <body className="font-sans">
          <Navbar />
          {children}
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </AuthProvider>
  );
}
