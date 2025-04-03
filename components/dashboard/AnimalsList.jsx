"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Edit, Trash2, Plus, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import EmptyState from "@/components/EmptyState";
import ApiRefresh from "@/components/ApiRefresh";
import { UploadButton } from "@/components/ui/upload-button";
import { Textarea } from "@/components/ui/textarea";

const initialFormData = {
  name: "",
  species: "",
  breed: "",
  neutered: false,
  vaccinated: false,
  status: "ADOPTION",
  image: "",
  description: "",
  contactPhone: "",
  volunteerId: "",
};

export default function AnimalsList({ animals = [], volunteers = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localAnimals, setLocalAnimals] = useState([]);
  const [animalToEdit, setAnimalToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDirectFetched, setHasDirectFetched] = useState(false);
  const formRef = useRef(null);
  
  // Debug logging
  useEffect(() => {
    if (Array.isArray(animals) && animals.length > 0) {
      setLocalAnimals(animals);
    } else if (!hasDirectFetched) {
      fetchAnimalsDirectly();
      setHasDirectFetched(true);
    }
  }, [animals]);
  
  // Add auto-refresh for animal data every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAnimalsDirectly();
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to fetch animals directly
  const fetchAnimalsDirectly = async () => {
    try {
      const response = await fetch('/api/animals', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setLocalAnimals(data);
      }
    } catch (error) {
      console.error("Error fetching animals:", error);
    }
  };
  
  const handleEdit = (animal) => {
    setAnimalToEdit(animal);
    setFormData({
      name: animal.name || "",
      species: animal.species || "",
      breed: animal.breed || "",
      neutered: animal.neutered || false,
      vaccinated: animal.vaccinated || false,
      status: animal.status || "ADOPTION",
      image: animal.image || "",
      description: animal.description || "",
      contactPhone: animal.contactPhone || "",
      // volunteerId is deliberately excluded for edit operations
    });
    setOpen(true);
  };
  
  const handleAdd = () => {
    setAnimalToEdit(null);
    setFormData(initialFormData);
    setOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this animal?")) return;
    
    try {
      const response = await fetch(`/api/animals?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete animal');
      }
      
      toast.success('Animal deleted successfully!');
      setLocalAnimals(localAnimals.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting animal:", error);
      toast.error(error.message);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const url = '/api/animals';
    const method = animalToEdit ? 'PATCH' : 'POST';
    
    // Create a clean copy of the form data
    const cleanedFormData = { ...formData };
    
    // Remove volunteerId if it's empty or if we're updating (as it's not in the schema)
    if (animalToEdit || !cleanedFormData.volunteerId) {
      delete cleanedFormData.volunteerId;
    }
    
    const payload = animalToEdit ? { ...cleanedFormData, id: animalToEdit.id } : cleanedFormData;
    
    console.log(`Submitting animal form to ${url} with method ${method}`);
    
    try {
      // Clear any previous toast notifications
      toast.dismiss();
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(payload),
      });
      
      // Get response as text first to properly handle JSON parse errors
      const responseText = await response.text();
      console.log(`API ${method} response:`, response.status, responseText);
      
      let result;
      try {
        // Try to parse as JSON if possible
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        result = { error: responseText || "Unknown error" };
      }
      
      if (!response.ok) {
        const errorMessage = result.error || `Failed to ${animalToEdit ? 'update' : 'create'} animal: ${response.status}`;
        console.error(`API error: ${response.status}`, errorMessage);
        throw new Error(errorMessage);
      }
      
      toast.success(`Animal ${animalToEdit ? 'updated' : 'created'} successfully!`);
      
      // Update local state
      if (animalToEdit) {
        setLocalAnimals(localAnimals.map(a => (a.id === animalToEdit.id ? { ...a, ...formData, id: animalToEdit.id } : a)));
      } else if (result && result.id) {
        setLocalAnimals(prev => [...prev, result]);
      }
      
      setOpen(false);
      setFormData(initialFormData);
      
      // Refresh data from API after a short delay
      setTimeout(() => {
        fetchAnimalsDirectly();
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "An error occurred while saving the animal");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter animals based on search term and remove any potential sample data
  const filteredAnimals = Array.isArray(localAnimals) 
    ? localAnimals
        .filter(animal => 
          // First filter out any sample data by checking for sample ID prefix or other sample indicators
          !animal.id.includes('sample') && 
          animal.id !== 'sample-1' && 
          animal.id !== 'sample-2' && 
          animal.id !== 'sample-3' &&
          !(animal.createdBy && animal.createdBy.id === 'sample')
        )
        .filter((animal) =>
          // Then filter by search term
          animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          animal.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          animal.status?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];
  
  // Group by status
  const animalsByStatus = {
    ADOPTION: filteredAnimals.filter(animal => animal.status === "ADOPTION"),
    FOSTER: filteredAnimals.filter(animal => animal.status === "FOSTER"),
    STREET: filteredAnimals.filter(animal => animal.status === "STREET"),
    OTHER: filteredAnimals.filter(animal => animal.status === "OTHER" || !animal.status)
  };
  
  // Format status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "ADOPTION":
        return <Badge className="bg-green-100 text-green-800">For Adoption</Badge>;
      case "FOSTER":
        return <Badge className="bg-blue-100 text-blue-800">Foster</Badge>;
      case "STREET":
        return <Badge className="bg-orange-100 text-orange-800">Street Dog</Badge>;
      case "OTHER":
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
    }
  };

  // Define a function to handle image upload
  const handleImageUpload = async (result) => {
    if (result && result.url) {
      setFormData(prev => ({
        ...prev,
        image: result.url
      }));
      toast.success("Image uploaded successfully!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search animals..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {animalToEdit ? "Edit Animal" : "Add New Animal"}
              </DialogTitle>
              <DialogDescription>
                {animalToEdit 
                  ? "Update the animal's information below." 
                  : "Fill in the details to add a new animal."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4" ref={formRef}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="species">Species</Label>
                  <Input
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADOPTION">For Adoption</SelectItem>
                      <SelectItem value="FOSTER">Foster</SelectItem>
                      <SelectItem value="STREET">Street Dog</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex flex-col space-y-2">
                    {formData.image && (
                      <div className="relative w-full h-40 mt-2 mb-2 rounded-md overflow-hidden">
                        <img 
                          src={formData.image} 
                          alt="Animal preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({...formData, image: ""})}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    {!formData.image && (
                      <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <p className="text-sm text-gray-500 mb-2">Upload an image of the animal</p>
                        <UploadButton 
                          endpoint="animalImageUploader"
                          onClientUploadComplete={handleImageUpload}
                          onUploadError={(error) => {
                            toast.error(`Error uploading: ${error.message}`);
                          }}
                        />
                      </div>
                    )}
                    <Input
                      id="image"
                      name="image"
                      placeholder="Or enter image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="neutered"
                      name="neutered"
                      checked={formData.neutered}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="neutered" className="text-sm font-medium">
                      Neutered
                    </Label>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="vaccinated"
                      name="vaccinated"
                      checked={formData.vaccinated}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="vaccinated" className="text-sm font-medium">
                      Vaccinated
                    </Label>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Share details about this animal's personality, history, and needs..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : animalToEdit ? (
                    <>Save Changes</>
                  ) : (
                    <>Create Animal</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Handle empty state */}
      {!Array.isArray(localAnimals) || localAnimals.length === 0 ? (
        <EmptyState
          title="No animals yet"
          description="Add your first animal to get started"
          icon={<Plus className="h-10 w-10" />}
          action={
            <Button onClick={handleAdd}>
              Add Animal
            </Button>
          }
        />
      ) : filteredAnimals.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No animals matching '{searchTerm}'</p>
          <Button variant="link" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </div>
      ) : (
        // Show animals grouped by status
        <div className="space-y-8">
          {/* Adoption section */}
          {animalsByStatus.ADOPTION.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">For Adoption</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animalsByStatus.ADOPTION.map(renderAnimalCard)}
              </div>
            </div>
          )}
          
          {/* Foster section */}
          {animalsByStatus.FOSTER.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Foster</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animalsByStatus.FOSTER.map(renderAnimalCard)}
              </div>
            </div>
          )}
          
          {/* Street Dog section */}
          {animalsByStatus.STREET.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-600">Street Dogs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animalsByStatus.STREET.map(renderAnimalCard)}
              </div>
            </div>
          )}
          
          {/* Other section */}
          {animalsByStatus.OTHER.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-600">Other</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animalsByStatus.OTHER.map(renderAnimalCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  // Helper function to render animal cards
  function renderAnimalCard(animal) {
    return (
      <Card key={animal.id} className="overflow-hidden">
        <div className="h-48 overflow-hidden relative">
          <div className="w-full h-full bg-gray-200 animate-pulse absolute" />
          {animal.image ? (
            <Image
              src={animal.image}
              alt={animal.name}
              width={400}
              height={300}
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                // Remove the loading animation
                if (e.currentTarget.parentElement) {
                  const loader = e.currentTarget.parentElement.querySelector('div');
                  if (loader) loader.classList.remove('animate-pulse');
                }
                // Set a fallback image without triggering another load error
                e.currentTarget.onerror = null; // Prevent infinite loop
                e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
                e.currentTarget.style.opacity = 1;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image Available
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{animal.name}</CardTitle>
              <CardDescription>
                {animal.species} • {animal.breed || 'Unknown breed'}
              </CardDescription>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(animal)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(animal.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {getStatusBadge(animal.status)}
              {animal.neutered && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Neutered
                </Badge>
              )}
              {animal.vaccinated && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Vaccinated
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Added by {animal.createdBy?.name || animal.createdBy?.firstName + ' ' + animal.createdBy?.lastName || 'Unknown'} 
              • {new Date(animal.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}