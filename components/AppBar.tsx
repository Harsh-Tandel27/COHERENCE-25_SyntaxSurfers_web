import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import React from "react";

const AppBar: React.FC<{}> = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b  ">
      <div className="flex items-center gap-4 gap-x-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <BarChart3 className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">Smart City Dashboard</span>

        <Link href="/">Home</Link>
      </div>
      <SignedOut>
        <Link href="/sign-in">Sign In</Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default AppBar;
