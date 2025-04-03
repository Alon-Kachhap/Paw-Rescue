"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { UserCircle, CheckCircle, XCircle, UserPlus, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function PendingVolunteers({ pendingVolunteers, organizationId }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredVolunteers = pendingVolunteers.filter(volunteer => 
    volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveVolunteer = async (volunteerId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/volunteer-registration/${volunteerId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to approve volunteer");
      }
      
      toast.success("Volunteer approved successfully!");
      setIsViewDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error approving volunteer:", error);
      toast.error(error.message || "Failed to approve volunteer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectVolunteer = async (volunteerId) => {
    if (!confirm("Are you sure you want to reject this volunteer application?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/volunteer-registration/${volunteerId}/reject`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reject volunteer");
      }
      
      toast.success("Volunteer application rejected");
      setIsViewDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
      toast.error(error.message || "Failed to reject volunteer");
    } finally {
      setIsLoading(false);
    }
  };

  const viewVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsViewDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Volunteer Applications</CardTitle>
          <CardDescription>Review and approve volunteer registrations</CardDescription>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search volunteers..."
            className="pl-8 w-[200px] md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {pendingVolunteers.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <UserPlus className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No pending volunteer applications</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              When volunteers apply to join your organization, they will appear here for review.
            </p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold mb-2">No matching volunteers found</h3>
            <p className="text-muted-foreground mb-4">
              Try changing your search terms or clear the search to see all pending applications.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map((volunteer) => (
                  <TableRow key={volunteer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          {volunteer.firstName.charAt(0)}{volunteer.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{volunteer.firstName} {volunteer.lastName}</div>
                          <Badge variant="outline" className="text-xs mt-1">Pending</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{volunteer.email}</span>
                        <span className="text-xs text-muted-foreground">{volunteer.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {volunteer.city}, {volunteer.state}
                      </div>
                      <div className="text-xs text-muted-foreground">{volunteer.zip}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(volunteer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewVolunteer(volunteer)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {selectedVolunteer && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Volunteer Application Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
                  {selectedVolunteer.firstName.charAt(0)}{selectedVolunteer.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedVolunteer.firstName} {selectedVolunteer.lastName}</h3>
                  <p className="text-muted-foreground">Applied on {new Date(selectedVolunteer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedVolunteer.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedVolunteer.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedVolunteer.street}</p>
                  <p className="font-medium">{selectedVolunteer.city}, {selectedVolunteer.state} {selectedVolunteer.zip}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Referred By</p>
                  <p className="font-medium capitalize">{selectedVolunteer.referral.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">About</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p>{selectedVolunteer.aboutYourself}</p>
                </div>
              </div>

              <DialogFooter className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  onClick={() => handleRejectVolunteer(selectedVolunteer.id)}
                  disabled={isLoading}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Application
                </Button>
                <Button 
                  onClick={() => handleApproveVolunteer(selectedVolunteer.id)}
                  disabled={isLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : "Approve & Add to Organization"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
} 