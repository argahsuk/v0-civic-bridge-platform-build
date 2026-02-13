"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Landmark, Menu, LayoutDashboard, PlusCircle, Shield, BarChart3 } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Landmark className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">CivicBridge</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/issues/new">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              Report Issue
            </Button>
          </Link>
          <Link href="/official">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Shield className="h-4 w-4" />
              Official Panel
            </Button>
          </Link>
          <Link href="/official/analytics">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/dashboard">
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link href="/issues/new">
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </DropdownMenuItem>
              </Link>
              <Link href="/official">
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Official Panel
                </DropdownMenuItem>
              </Link>
              <Link href="/official/analytics">
                <DropdownMenuItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
