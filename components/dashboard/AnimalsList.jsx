"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X, Pencil, Trash2, PlusCircle } from "lucide-react";

export default function AnimalsList({ animals, volunteers }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    vaccinated: false,
    neutered: false,
    createdById: "",
  });
  
  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      breed: "",
      vaccinated: false,
      neutered: false,
      createdById: "",
    });
    setEditingAnimal(null);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingAnimal
        ? `/api/animals/${editingAnimal.id}`
        : "/api/animals";
      
      const method = editingAnimal ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        resetForm();
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save animal:", error);
    }
  };
  
  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      name: animal.name,
      species: animal.species,
      breed: animal.breed || "",
      vaccinated: animal.vaccinated,
      neutered: animal.neutered,
      createdById: animal.createdById,
    });
    setOpen(true);
  };
  
  const handleDelete = async (animalId) => {
    if (!confirm("Are you sure you want to delete this animal?")) return;
    
    try {
      const response = await fetch(`/api/animals/${animalId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete animal:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Animals</CardTitle>
        <Dialog open={open} onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>Add Animal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAnimal ? "Edit Animal" : "Add New Animal"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Species</label>
                <Input
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Breed (Optional)</label>
                <Input
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="vaccinated"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="vaccinated">Vaccinated</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="neutered"
                    name="neutered"
                    checked={formData.neutered}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="neutered">Neutered/Spayed</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Created By</label>
                <Select
                  name="createdById"
                  value={formData.createdById}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, createdById: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a volunteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteers.map((volunteer) => (
                      <SelectItem key={volunteer.id} value={volunteer.id}>
                        {volunteer.firstName} {volunteer.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" type="button" onClick={() => {
                  resetForm();
                  setOpen(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAnimal ? "Update" : "Add"} Animal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {animals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No animals added yet. Add your first animal!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Vaccinated</TableHead>
                <TableHead>Neutered</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.name}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.breed || "N/A"}</TableCell>
                  <TableCell>
                    {animal.vaccinated ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {animal.neutered ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {animal.createdBy.firstName} {animal.createdBy.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(animal)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(animal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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