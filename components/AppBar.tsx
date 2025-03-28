import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const AppBar: React.FC<{}> = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b  ">
      <div className="">
        <h3 className="text-2xl">Smart City Dashboard</h3>
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
