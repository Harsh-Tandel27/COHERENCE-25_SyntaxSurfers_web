"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  Globe2Icon,
  Home,
  LightbulbIcon,
  Map,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Globe2Icon />
          <span className="hidden font-bold sm:inline-block">CitySurfer</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Navigation */}
        <nav
          className={`absolute md:static top-14 left-0 w-full bg-background border-b md:border-none md:flex md:items-center md:justify-center md:gap-6 flex-col md:flex-row transition-all duration-300 ${
            isMobileMenuOpen ? "flex" : "hidden"
          }`}
        >
          <Link
            href="/"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary p-4 md:p-0"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary p-4 md:p-0"
          >
            <BarChart3 className="h-4 w-4" /> Dashboard
          </Link>
          <Link
            href="/traffic"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary p-4 md:p-0"
          >
            <Map className="h-4 w-4" /> Traffic
          </Link>
          <Link
            href="/energy"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary p-4 md:p-0"
          >
            <LightbulbIcon className="h-4 w-4" /> Energy
          </Link>
          <Link
            href="/water-level"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary p-4 md:p-0"
          >
            <LightbulbIcon className="h-4 w-4" /> Water Level
          </Link>
        </nav>

        {/* Right Side: User & Theme Toggle */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="text-sm font-medium">
              Sign in
            </Link>
          </SignedOut>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
