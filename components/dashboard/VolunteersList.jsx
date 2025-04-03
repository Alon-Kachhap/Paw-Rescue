"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserCircle } from "lucide-react";

export default function VolunteersList({ volunteers, organizationId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [volunteerEmail, setVolunteerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  const addVolunteer = async (e) => {
    e.preventDefault();
    if (!volunteerEmail) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/volunteers/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: volunteerEmail, organizationId }),
      });
      
      if (response.ok) {
        setVolunteerEmail("");
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to invite volunteer:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const removeVolunteer = async (volunteerId) => {
    if (!confirm("Are you sure you want to remove this volunteer?")) return;
    
    try {
      const response = await fetch(`/api/volunteers/${volunteerId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to remove volunteer:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Volunteers</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Invite Volunteer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a Volunteer</DialogTitle>
            </DialogHeader>
            <form onSubmit={addVolunteer} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={volunteerEmail}
                onChange={(e) => setVolunteerEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {volunteers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No volunteers yet. Invite your first volunteer!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {volunteer.image ? (
                        <img src={volunteer.image} alt={volunteer.firstName} className="w-8 h-8 rounded-full" />
                      ) : (
                        <UserCircle className="w-8 h-8 text-muted-foreground" />
                      )}
                      <span>{volunteer.firstName} {volunteer.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{volunteer.email}</TableCell>
                  <TableCell>{volunteer.phone}</TableCell>
                  <TableCell>
                    {volunteer.city}, {volunteer.state}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVolunteer(volunteer.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
