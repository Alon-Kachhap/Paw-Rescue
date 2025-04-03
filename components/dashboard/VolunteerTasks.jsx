"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo, Clock, CheckCircle, CalendarClock } from "lucide-react";

export default function VolunteerTasks({ volunteer }) {
  // This is a placeholder component - you would implement actual tasks functionality
  
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle>Tasks & Assignments</CardTitle>
        <CardDescription>
          Track your volunteer assignments and tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-16">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <ListTodo className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tasks assigned yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Your organization will assign tasks to you for animal care, events, and more.
          </p>
          <Button onClick={() => {}}>
            <CalendarClock className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 