"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, UserCircle, CheckCircle2, ClipboardCheck } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { signOut } from "next-auth/react";

export default function VolunteerPendingVerification({ volunteer }) {
  return (
    <div className="container max-w-2xl mx-auto p-4 flex flex-col min-h-[80vh] justify-center">
      <Card className="bg-background border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 mx-auto mb-2">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Pending Verification
          </Badge>
          <CardTitle className="text-2xl font-bold text-foreground">
            Your Application is Being Reviewed
          </CardTitle>
          <CardDescription>
            Thank you for your interest in volunteering with us. Your application is currently under review.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-accent/20 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <UserCircle className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{volunteer.firstName} {volunteer.lastName}</h3>
                <p className="text-sm text-muted-foreground">{volunteer.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Application Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-yellow-400 dark:bg-yellow-500 h-2 rounded-full w-1/2"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">50%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Application Submitted</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Information Received</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm">Review in Progress</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  <span className="text-sm">Final Approval</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              We'll notify you via email once your application has been reviewed. This typically takes 1-3 business days.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
          <Button onClick={() => window.location.href = "mailto:support@pawrescue.org"}>
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 