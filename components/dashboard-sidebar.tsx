"use client";

import type React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import { BarChart3, Home, LayoutDashboardIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isSignedIn) return router.replace("/sign-in");
  // }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Smart City</span>
                <span className="text-xs text-muted-foreground">
                  Dashboard v0
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard">
                    <LayoutDashboardIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-4" />

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          {/* <SidebarFooter>
            <div className="p-2">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </SidebarFooter> */}
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <div className="sticky bg-white top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
            <SidebarTrigger />
            <div className="text-lg font-semibold">Smart City Dashboard</div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <main className="flex-1 p-4 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
