import AppBar from "@/components/AppBar";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart City Dashboard",
  description: "Hackathon Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.className} antialiased w-full h-full`}>
          <AppBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
