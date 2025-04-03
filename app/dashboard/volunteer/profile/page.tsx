"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, BookOpen, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { slugify } from "@/lib/utils";

export default function VolunteerProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    about: "",
    publicProfile: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storyData, setStoryData] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    featured: false
  });
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [storyDialogOpen, setStoryDialogOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        
        if (!session || !session.user) {
          toast.error("You must be logged in to view this page");
          router.push("/login");
          return;
        }

        const response = await fetch("/api/user/profile");
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            street: data.street || "",
            city: data.city || "",
            state: data.state || "",
            zip: data.zip || "",
            about: data.about || "",
            publicProfile: data.publicProfile !== undefined ? data.publicProfile : true,
          });
        } else {
          throw new Error("Failed to load profile");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load your profile information");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [session, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prevData) => ({
      ...prevData,
      publicProfile: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStoryData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    
    try {
      setIsCreatingStory(true);
      
      // Create a slug from the title
      const slug = slugify(storyData.title);
      
      const payload = {
        ...storyData,
        authorName: `${formData.firstName} ${formData.lastName}`,
        slug,
        volunteerId: session?.user?.id
      };
      
      const response = await fetch("/api/volunteer-stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        toast.success("Your volunteer story has been created");
        setStoryDialogOpen(false);
        setStoryData({
          title: "",
          excerpt: "",
          content: "",
          date: new Date().toISOString().split('T')[0],
          featured: false
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create story");
      }
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to create your story: " + error.message);
    } finally {
      setIsCreatingStory(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile Information
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Your Stories
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>
                  Update your mailing address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>About You</CardTitle>
                <CardDescription>
                  Tell us about yourself and your experience with animals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your profile visibility on the public website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Profile on Website</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, your profile may appear on the public landing page and volunteer stories
                    </p>
                  </div>
                  <Switch
                    checked={formData.publicProfile}
                    onCheckedChange={handleSwitchChange}
                    aria-label="Toggle public profile"
                  />
                </div>
                
                {formData.publicProfile ? (
                  <div className="mt-4 p-4 bg-muted/40 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>With visibility enabled:</strong>
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      <li>Your name, photo, and story contributions will be visible on the public website</li>
                      <li>Your profile can be featured in volunteer stories on the landing page</li>
                      <li>Other volunteers and visitors can contact you through your email</li>
                      <li>You can share your experiences and inspire others to volunteer</li>
                    </ul>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-muted/40 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>With visibility disabled:</strong>
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      <li>Your profile will not be shown on the public website</li>
                      <li>Your volunteer stories will still be displayed but without your personal details</li>
                      <li>Your contact information will remain private</li>
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="stories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Volunteer Stories</CardTitle>
                  <CardDescription>
                    Share your experiences as a volunteer to inspire others
                  </CardDescription>
                </div>
                
                <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleCreateStory}>
                      <DialogHeader>
                        <DialogTitle>Create a Volunteer Story</DialogTitle>
                        <DialogDescription>
                          Share your experience as a volunteer to inspire others. Your story will be published on our website.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Story Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={storyData.title}
                            onChange={handleStoryInputChange}
                            placeholder="My Volunteer Journey"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="excerpt">Short Summary</Label>
                          <Textarea
                            id="excerpt"
                            name="excerpt"
                            value={storyData.excerpt}
                            onChange={handleStoryInputChange}
                            placeholder="A brief summary of your story (will appear in story cards)"
                            rows={2}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="content">Story Content</Label>
                          <Textarea
                            id="content"
                            name="content"
                            value={storyData.content}
                            onChange={handleStoryInputChange}
                            placeholder="Share your full volunteer experience here..."
                            rows={8}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            You can use HTML formatting for headings, paragraphs, and emphasis
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="date">Date of Experience</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={storyData.date}
                            onChange={handleStoryInputChange}
                            required
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <input
                            id="featured"
                            name="featured"
                            type="checkbox"
                            checked={storyData.featured}
                            onChange={handleStoryInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="featured" className="text-sm font-normal">
                            Request to feature this story (subject to admin approval)
                          </Label>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStoryDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isCreatingStory}>
                          {isCreatingStory ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Publish Story"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Your volunteer stories are a powerful way to share your experiences and inspire others to volunteer. 
                Stories will be displayed on the public website with your name and profile details (if your profile is set to public).
              </p>
              
              <div className="p-6 text-center border rounded-md bg-muted/20">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Create Your First Story</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your volunteer journey, experiences, and the impact you've made
                </p>
                <Button onClick={() => setStoryDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 