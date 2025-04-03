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
import { Loader2, User, BookOpen, PlusCircle, Search, Edit, Trash2, Calendar, Image as ImageIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import RichTextEditor from '@/components/RichTextEditor';
import { UploadButton } from "@/components/ui/upload-button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

function slugify(text: string) {
  return text
    .toString()
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface StoryData {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featured: boolean;
  image: string;
  id?: string;
}

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
  const [storyData, setStoryData] = useState<StoryData>({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    featured: false,
    image: ""
  });
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [storyDialogOpen, setStoryDialogOpen] = useState(false);
  interface Story {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    featured: boolean;
    image?: string;
    slug: string;
  }
  const [volunteerStories, setVolunteerStories] = useState<Story[]>([]);
  const [storySearchTerm, setStorySearchTerm] = useState("");
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [isDeletingStory, setIsDeletingStory] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
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

  useEffect(() => {
    async function loadStories() {
      if (!session?.user?.id) return;
      
      try {
        setIsLoadingStories(true);
        const response = await fetch("/api/volunteer-stories/by-volunteer");
        
        if (response.ok) {
          const data = await response.json();
          setVolunteerStories(data);
        } else {
          throw new Error("Failed to load stories");
        }
      } catch (error) {
        console.error("Error loading stories:", error);
        toast.error("Failed to load your volunteer stories");
      } finally {
        setIsLoadingStories(false);
      }
    }

    loadStories();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      publicProfile: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const errorMessage = error.message || "Failed to update profile";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to update profile: " + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleStoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setStoryData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStoryImageUpload = (result: { url: string }) => {
    if (result && result.url) {
      setStoryData(prev => ({
        ...prev,
        image: result.url
      }));
      toast.success("Image uploaded successfully!");
    }
  };

  const handleEditStory = (story: Story) => {
    setStoryToEdit(story);
    setStoryData({
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
      date: new Date(story.date).toISOString().split('T')[0],
      featured: story.featured,
      image: story.image || "",
      id: story.id
    });
    setStoryDialogOpen(true);
  };

  const handleDeleteStory = async () => {
    if (!storyToDelete) return;
    
    try {
      setIsDeletingStory(true);
      
      const response = await fetch(`/api/volunteer-stories?id=${storyToDelete.id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        toast.success("Story deleted successfully");
        setVolunteerStories(prev => prev.filter(s => s.id !== storyToDelete.id));
        setStoryToDelete(null);
      } else {
        const error = await response.json();
        const errorMessage = error.message || "Failed to delete story";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to delete story: " + errorMessage);
    } finally {
      setIsDeletingStory(false);
    }
  };

  const handleSaveStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsCreatingStory(true);
      
      const isEditing = !!storyToEdit;
      
      const slug = isEditing ? 
        (storyToEdit.slug || slugify(storyData.title)) : 
        slugify(storyData.title);
      
      const payload = {
        ...storyData,
        authorName: `${formData.firstName} ${formData.lastName}`,
        slug,
        volunteerId: session?.user?.id
      };
      
      const method = isEditing ? "PATCH" : "POST";
      
      const response = await fetch("/api/volunteer-stories", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const savedStory = await response.json();
        
        toast.success(`Story ${isEditing ? 'updated' : 'created'} successfully`);
        setStoryDialogOpen(false);
        
        if (isEditing) {
          setVolunteerStories(prev => prev.map(s => 
            s.id === savedStory.id ? savedStory as Story : s
          ));
        } else {
          setVolunteerStories(prev => [savedStory as Story, ...prev]);
        }
        
        setStoryData({
          title: "",
          excerpt: "",
          content: "",
          date: new Date().toISOString().split('T')[0],
          featured: false,
          image: ""
        });
        setStoryToEdit(null);
      } else {
        const error = await response.json();
        const errorMessage = error.message || `Failed to ${isEditing ? 'update' : 'create'} story`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(`Error ${storyToEdit ? 'updating' : 'creating'} story:`, error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to ${storyToEdit ? 'update' : 'create'} your story: ${errorMessage}`);
    } finally {
      setIsCreatingStory(false);
    }
  };

  const filteredStories = volunteerStories.filter(story => 
    story.title.toLowerCase().includes(storySearchTerm.toLowerCase()) ||
    story.excerpt.toLowerCase().includes(storySearchTerm.toLowerCase())
  );

  const StoryCard = ({ story }: { story: Story }) => (
    <Card key={story.id} className="mb-4 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {story.image && (
          <div className="w-full md:w-1/3 h-48 relative">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className={`flex-1 p-6 ${!story.image ? 'w-full' : 'md:w-2/3'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(story.date).toLocaleDateString()}</span>
                {story.featured && (
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">Featured</Badge>
                )}
              </div>
              <p className="mb-4 line-clamp-2">{story.excerpt}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEditStory(story)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500"
                onClick={() => setStoryToDelete(story)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link 
              href={`/volunteer/stories/${story.slug}`} 
              className="text-sm text-primary hover:underline"
            >
              Read Full Story →
            </Link>
            <div className="text-xs text-muted-foreground">
              {story.slug}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const StoriesTabContent = () => (
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
              <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handleSaveStory}>
                  <DialogHeader>
                    <DialogTitle>
                      {storyToEdit ? "Edit Volunteer Story" : "Create a Volunteer Story"}
                    </DialogTitle>
                    <DialogDescription>
                      {storyToEdit 
                        ? "Update your story to reflect your latest experiences." 
                        : "Share your experience as a volunteer to inspire others. Your story will be published on our website."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Story Image</Label>
                      <div className="flex flex-col space-y-2">
                        {storyData.image && (
                          <div className="relative w-full h-40 mt-2 mb-2 rounded-md overflow-hidden">
                            <Image 
                              src={storyData.image} 
                              alt="Story preview" 
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => setStoryData({...storyData, image: ""})}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {!storyData.image && (
                          <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-4">Upload an image for your story</p>
                            <UploadButton 
                              endpoint="storyImageUploader"
                              onClientUploadComplete={handleStoryImageUpload}
                              onUploadError={(error: { message: string }) => {
                                toast.error(`Error uploading: ${error.message}`);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
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
                        rows={12}
                        required
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use paragraphs separated by line breaks. You can use simple formatting like <code>**bold**</code> 
                        and <code>*italic*</code> for emphasis.
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
                      disabled={isCreatingStory}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isCreatingStory}
                    >
                      {isCreatingStory ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : storyToEdit ? (
                        "Update Story"
                      ) : (
                        "Create Story"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingStories ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : volunteerStories.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Stories Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any volunteer stories yet. Share your experiences to inspire others.
              </p>
              <Button onClick={() => setStoryDialogOpen(true)}>
                Create Your First Story
              </Button>
            </div>
          ) : (
            <div>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your stories..."
                  className="pl-10"
                  value={storySearchTerm}
                  onChange={(e) => setStorySearchTerm(e.target.value)}
                />
              </div>
              
              {filteredStories.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Matching Stories</h3>
                  <p className="text-muted-foreground mb-4">
                    No stories match your search term. Try a different search or clear the filter.
                  </p>
                  <Button onClick={() => setStorySearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div>
                  {filteredStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!storyToDelete} onOpenChange={(open) => !open && setStoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the story "{storyToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStory}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeletingStory}
            >
              {isDeletingStory ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );

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
            Your Stories {volunteerStories.length > 0 && (
              <Badge variant="secondary" className="ml-1">{volunteerStories.length}</Badge>
            )}
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
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
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
        
        {StoriesTabContent()}
      </Tabs>
    </div>
  );
}