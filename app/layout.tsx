import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
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
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {" "}
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`${geistSans.className} antialiased w-full h-full`}>
            {/* <AppBar /> */}
            <DashboardSidebar>{children}</DashboardSidebar>
            {/* {children} */}
          </body>
        </html>
      </ClerkProvider>
    </ThemeProvider>
  );
}
