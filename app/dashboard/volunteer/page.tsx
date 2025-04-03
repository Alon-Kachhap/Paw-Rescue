"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, InfoIcon, Settings } from "lucide-react";
import Link from "next/link";

export default function VolunteerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      if (!session || !session.user) {
        return;
      }

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Volunteer Dashboard</h1>
      
      {!loading && profileData && (
        <>
          {profileData.publicProfile ? (
            <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <InfoIcon className="h-4 w-4 text-green-600 dark:text-green-500" />
              <AlertTitle>Your profile is visible on the public website</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>Your volunteer profile can be featured on the landing page and in volunteer stories.</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/volunteer/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Change Settings
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertTitle>Your profile is hidden from the public website</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>Your volunteer profile won't be featured on the landing page or volunteer stories.</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/volunteer/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Change Settings
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
      
      {/* Rest of dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards and content here */}
      </div>
    </div>
  );
} 