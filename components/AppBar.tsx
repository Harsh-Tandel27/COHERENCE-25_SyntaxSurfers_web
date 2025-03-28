import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";

const AppBar: React.FC<{}> = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default AppBar;
