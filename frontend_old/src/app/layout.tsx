import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Legal Intelligence System",
  description: "Advanced AI Platform for Indian Legal Assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8FAFC] dark:bg-[#0F172A]`}>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
