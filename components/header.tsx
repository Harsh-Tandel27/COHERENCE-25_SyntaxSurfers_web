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
  Home,
  LightbulbIcon,
  Map,
  Menu,
  Moon,
  Search,
  Sun,
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Smart City Dashboard
            </span>
          </a>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center justify-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/traffic"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Map className="h-4 w-4" />
            Traffic
          </Link>
          <Link
            href="/energy"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <LightbulbIcon className="h-4 w-4" />
            Energy
          </Link>
          <Link
            href="/water-level"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <LightbulbIcon className="h-4 w-4" />
            Water Level
          </Link>

          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">Sign in</Link>
          </SignedOut>
        </nav>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* <form
            onSubmit={handleSearch}
            className={`flex-1 md:flex-initial ${
              isSearchOpen ? "block" : "hidden md:block"
            }`}
          >
            <Input
              type="search"
              placeholder="Search cities..."
              className="h-9 md:w-[300px] lg:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form> */}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

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
