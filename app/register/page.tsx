"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, Heart } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Join Paw Rescue</h1>
        <p className="text-muted-foreground text-center mb-8">
          Choose how you want to contribute to animal welfare
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Organization Registration Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <Building2 className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-bold">Organization</h2>
              <p className="text-muted-foreground">
                Register your animal welfare organization and reach more supporters
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Create organization profile</li>
                <li>✓ Manage rescue operations</li>
                <li>✓ Accept donations</li>
                <li>✓ Coordinate volunteers</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register/organization-registration">Register Organization</Link>
              </Button>
            </div>
          </Card>

          {/* Volunteer Registration Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <Users className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-bold">Volunteer</h2>
              <p className="text-muted-foreground">
                Join as a volunteer and help animals in your local area
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Create volunteer profile</li>
                <li>✓ Join rescue missions</li>
                <li>✓ Track your contributions</li>
                <li>✓ Connect with organizations</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register/volunteer-registration">Register as Volunteer</Link>
              </Button>
            </div>
          </Card>

          {/* Donor Registration Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <Heart className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-bold">Donor</h2>
              <p className="text-muted-foreground">
                Support animal welfare through donations and sponsorships
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Create donor profile</li>
                <li>✓ Track your donations</li>
                <li>✓ Get tax receipts</li>
                <li>✓ Support multiple causes</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register/donor">Register as Donor</Link>
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
