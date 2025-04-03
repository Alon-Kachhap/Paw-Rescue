"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserCircle, Building, CheckCircle, Eye, EyeOff } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import ProfileImageUploadFix from "./ProfileImageUploadFix";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VolunteerDashboardHeader({ volunteer, organization }) {
  const [isPublic, setIsPublic] = useState(volunteer.publicProfile || false);
  const [isUpdating, setIsUpdating] = useState(false);

  const togglePublicProfile = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/volunteers/${volunteer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          publicProfile: !isPublic
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile visibility");
      }
      
      setIsPublic(!isPublic);
      toast.success(`Your profile is now ${!isPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error("Error updating profile visibility:", error);
      toast.error("Failed to update profile visibility");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="bg-background border-border">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <ProfileImageUploadFix 
              userId={volunteer.id}
              currentImage={volunteer.image}
              size="medium"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {volunteer.firstName} {volunteer.lastName}
                </h1>
                {isPublic ? (
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-800">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{volunteer.email}</p>
            </div>
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Verified Volunteer
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {organization && (
              <div className="flex items-center space-x-2 text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-full">
                <Building className="h-4 w-4" />
                <span>{organization.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-3 mr-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="public-profile"
                  checked={isPublic}
                  onCheckedChange={togglePublicProfile}
                  disabled={isUpdating}
                />
                <Label htmlFor="public-profile" className="text-sm cursor-pointer">
                  Share My Stories
                </Label>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs px-2">
                <Link href="/dashboard/volunteer/profile">
                  Edit
                </Link>
              </Button>
            </div>
            <LogoutButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 