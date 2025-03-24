"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PawPrint className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Paw Rescue
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/organizations"
              className={pathname === "/organizations" ? "text-foreground" : "text-foreground/60"}
            >
              Organizations
            </Link>
            <Link
              href="/aboutus"
              className={pathname === "/aboutus" ? "text-foreground" : "text-foreground/60"}
            >
              About Us
            </Link>
            <Link
              href="/donate"
              className={pathname === "/donate" ? "text-foreground" : "text-foreground/60"}
            >
              Donate
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Get Involved</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login/volunteer">Volunteer Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login/organization">Organization Login</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/register/volunteer">Volunteer Registration</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register/organization">Organization Registration</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register/donor">Donor Registration</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </nav>
  );
}