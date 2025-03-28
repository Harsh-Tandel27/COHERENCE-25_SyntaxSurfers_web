import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const geistSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart City Dashboard",
  description: "Hackathon Project",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <DashboardSidebar>{children}</DashboardSidebar> */}
      {/* <LandingPage></LandingPage> */}
      {children}
    </>
  );
}
