"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hourglass, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function OrganizationPendingVerification({ organization }) {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-10">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-4">
              <Hourglass className="h-10 w-10 text-amber-600 dark:text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification Pending</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your organization account is awaiting verification by our admin team. This process usually takes 1-2 business days.
            </p>
            
            <div className="bg-muted p-4 rounded-lg w-full mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">While you wait:</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                    <li>Make sure your contact information is up to date</li>
                    <li>Check your email (including spam folder) for verification requests</li>
                    <li>Contact support if verification takes longer than 3 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}