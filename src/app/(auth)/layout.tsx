import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whisper — Sign In",
  description: "Sign in to your anonymous message inbox.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
