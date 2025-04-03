"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OrganizationProfile({ organization }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    type: organization.type,
    registrationNumber: organization.registrationNumber,
    email: organization.email,
    phone: organization.phone,
    address: organization.address,
    website: organization.website || "",
    mission: organization.mission,
    description: organization.description,
    facebook: organization.facebook || "",
    twitter: organization.twitter || "",
    instagram: organization.instagram || "",
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the correct API endpoint based on organization ID
      const response = await fetch(`/api/organisations/${organization.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      // Get response as text first to properly handle JSON parse errors
      const responseText = await response.text();
      console.log(`API response:`, response.status, responseText);
      
      let result;
      try {
        // Try to parse as JSON if possible
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        result = { error: responseText || "Unknown error" };
      }
      
      if (!response.ok) {
        const errorMessage = result.error || `Failed to update profile: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      toast.success("Organization profile updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Organization Profile</CardTitle>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              {isEditing ? (
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.name}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              {isEditing ? (
                <Input 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.type}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Registration Number</label>
              {isEditing ? (
                <Input 
                  name="registrationNumber" 
                  value={formData.registrationNumber} 
                  onChange={handleChange} 
                  readOnly={true}
                  className="bg-gray-100"
                />
              ) : (
                <div className="text-lg">{organization.registrationNumber}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              {isEditing ? (
                <Input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.email}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              {isEditing ? (
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.phone}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              {isEditing ? (
                <Input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.address}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              {isEditing ? (
                <Input 
                  name="website" 
                  value={formData.website} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.website || "N/A"}</div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mission</label>
            {isEditing ? (
              <Textarea 
                name="mission" 
                value={formData.mission} 
                onChange={handleChange} 
                rows={3}
              />
            ) : (
              <div className="text-lg">{organization.mission}</div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            {isEditing ? (
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={5}
              />
            ) : (
              <div className="text-lg">{organization.description}</div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              {isEditing ? (
                <Input 
                  name="facebook" 
                  value={formData.facebook} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.facebook || "N/A"}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              {isEditing ? (
                <Input 
                  name="twitter" 
                  value={formData.twitter} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.twitter || "N/A"}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              {isEditing ? (
                <Input 
                  name="instagram" 
                  value={formData.instagram} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="text-lg">{organization.instagram || "N/A"}</div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}