"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"volunteer" | "organization">(() => {
    // Check for stored preference on component mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferredLoginType');
      return (stored === 'organization' ? 'organization' : 'volunteer') as "volunteer" | "organization";
    }
    return 'volunteer';
  });

  useEffect(() => {
    // Clear the stored preference after it's been used
    localStorage.removeItem('preferredLoginType');
  }, []);

  const handleLoginTypeChange = (type: "volunteer" | "organization") => {
    setLoginType(type);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Add your authentication logic here
      toast.success(`Successfully logged in as ${loginType}`);
      router.push(`/${loginType}/dashboard`);
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-6">
          <div className="flex justify-center space-x-2">
            <Button
              variant={loginType === "volunteer" ? "default" : "outline"}
              onClick={() => handleLoginTypeChange("volunteer")}
              className="flex-1 max-w-[160px]"
            >
              Volunteer Login
            </Button>
            <Button
              variant={loginType === "organization" ? "default" : "outline"}
              onClick={() => handleLoginTypeChange("organization")}
              className="flex-1 max-w-[160px]"
            >
              Organization Login
            </Button>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              {loginType === "volunteer" 
                ? "Continue your journey of making a difference"
                : "Manage your organization and connect with volunteers"
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-center block">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="text-center"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-center block">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="text-center"
                />
              </div>
            </div>
            <div className="space-y-6">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="text-sm text-center">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Button 
                  variant="link" 
                  className="px-1"
                  onClick={() => router.push(`/register/${loginType}-registration`)}
                >
                  Register here
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
