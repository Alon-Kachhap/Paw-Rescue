"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Search, Mail, Phone, UserX, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VolunteerManagement({ volunteers = [], organizationId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/volunteers/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          organizationId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send invitation");
      }

      toast.success("Invitation sent successfully!");
      setInviteEmail("");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVolunteer = async (volunteerId) => {
    if (!confirm("Are you sure you want to remove this volunteer?")) return;

    try {
      const response = await fetch(`/api/volunteers/${volunteerId}/organization`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove volunteer");
      }

      toast.success("Volunteer removed successfully");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to remove volunteer");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center sm:justify-between">
        <div>
          <CardTitle>Volunteer Management</CardTitle>
          <CardDescription>Invite and manage volunteers for your organization</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search volunteers..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a Volunteer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="volunteer@example.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send an invitation email with instructions to join your organization.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {filteredVolunteers.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-muted/30 inline-flex h-12 w-12 items-center justify-center rounded-full mx-auto mb-3">
              <UserPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No volunteers found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              {searchTerm
                ? "No volunteers match your search criteria. Try a different search term."
                : "Your organization doesn't have any volunteers yet. Invite volunteers to join your organization."}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div
                          className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 overflow-hidden"
                        >
                          {volunteer.image ? (
                            <img
                              src={volunteer.image}
                              alt={`${volunteer.firstName}'s profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-primary">
                              {volunteer.firstName?.[0]}{volunteer.lastName?.[0]}
                            </span>
                          )}
                        </div>
                        {volunteer.firstName} {volunteer.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>{volunteer.email}</span>
                        </div>
                        {volunteer.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span>{volunteer.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {volunteer.city ? (
                        <span>
                          {volunteer.city}, {volunteer.state}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/volunteer/${volunteer.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/20 hover:bg-destructive/10"
                          onClick={() => handleRemoveVolunteer(volunteer.id)}
                        >
                          <UserX className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}