"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, Heart, Paw, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background pt-16 pb-24">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Paw className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Paw Rescue</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Be part of our mission to rescue, rehabilitate, and rehome animals in need
            </p>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              fill="hsl(var(--background))"
              fillOpacity="1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Registration Options */}
      <div className="container px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Choose how you want to contribute</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Organization Registration Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all group hover:shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full transform -translate-y-6 translate-x-6"></div>
              <div className="p-6 h-full flex flex-col">
                <div className="bg-primary/10 rounded-full p-3 w-fit mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Organization</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Register your animal welfare organization and expand your reach
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Create organizational profile
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Manage multiple volunteers
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Post animals for adoption
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Organize rescue campaigns
                  </li>
                </ul>
                <Button className="w-full group" asChild>
                  <Link href="/register/organization-registration" className="flex items-center justify-center">
                    Register Organization
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Volunteer Registration Card */}
            <Card className="relative overflow-hidden border-2 border-primary hover:border-primary transition-all group hover:shadow-lg">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/70 rounded-full"></div>
              <div className="absolute top-3 right-3 z-10 bg-primary text-white text-xs font-medium py-1 px-2 rounded">Popular</div>
              <div className="p-6 h-full flex flex-col">
                <div className="bg-primary/10 rounded-full p-3 w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Volunteer</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Join as a volunteer and help animals in your local area
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Create volunteer profile
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Join rescue missions
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Track your contributions
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Connect with organizations
                  </li>
                </ul>
                <Button className="w-full group" asChild>
                  <Link href="/register/volunteer-registration" className="flex items-center justify-center">
                    Register as Volunteer
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Donor Registration Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all group hover:shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full transform -translate-y-6 translate-x-6"></div>
              <div className="p-6 h-full flex flex-col">
                <div className="bg-primary/10 rounded-full p-3 w-fit mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Donor</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Support our cause through donations and make a real difference
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Make one-time or recurring donations
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Track your giving history
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Get tax receipts automatically
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    Choose specific projects to support
                  </li>
                </ul>
                <Button className="w-full group" asChild>
                  <Link href="/register/donor-registration" className="flex items-center justify-center">
                    Register as Donor
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              Already have an account?
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login" className="flex items-center">
                Sign in to your account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
