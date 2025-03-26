"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleOrgLogin = () => {
    // Store the login type preference in localStorage
    localStorage.setItem('preferredLoginType', 'organization');
    router.push('/login');
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo section - visible on all screen sizes */}
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PawPrint className="h-6 w-6" />
            <span className="font-bold">
              Paw Rescue
            </span>
          </Link>
        </div>

        {/* Navigation links - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
        </div>

        {/* Right side menu - always visible */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Get Involved</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/donate">Donate</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/adopt">Adopt</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/foster">Foster</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/volunteer">Volunteer</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOrgLogin}>
                  Organization
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/register">Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </nav>
  );
}