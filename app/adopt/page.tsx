"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { redirectToLogin } from "@/lib/utils/auth";

interface Animal {
  id: string;
  name: string;
  type: "Dog" | "Cat" | "Other";
  breed: string;
  age: string;
  gender: "Male" | "Female";
  image: string;
  description: string;
  status: "Available" | "Reserved" | "Adopted";
}

const animals: Animal[] = [
  {
    id: "1",
    name: "Max",
    type: "Dog",
    breed: "Labrador Retriever",
    age: "2 years",
    gender: "Male",
    image: "/animals/dog1.jpg",
    description: "Friendly and energetic Labrador looking for an active family.",
    status: "Available"
  },
  {
    id: "2",
    name: "Luna",
    type: "Cat",
    breed: "Persian",
    age: "1.5 years",
    gender: "Female",
    image: "/animals/cat1.jpg",
    description: "Gentle Persian cat with beautiful long fur, perfect for a quiet home.",
    status: "Available"
  },
  {
    id: "3",
    name: "Rocky",
    type: "Dog",
    breed: "German Shepherd",
    age: "3 years",
    gender: "Male",
    image: "/animals/dog2.jpg",
    description: "Well-trained German Shepherd, great with families and other pets.",
    status: "Available"
  },
  {
    id: "4",
    name: "Bella",
    type: "Dog",
    breed: "Golden Retriever",
    age: "1 year",
    gender: "Female",
    image: "/animals/dog3.jpg",
    description: "Playful Golden Retriever puppy, loves swimming and fetch.",
    status: "Reserved"
  },
  {
    id: "5",
    name: "Oliver",
    type: "Cat",
    breed: "Siamese",
    age: "2 years",
    gender: "Male",
    image: "/animals/cat2.jpg",
    description: "Talkative Siamese cat who loves attention and playtime.",
    status: "Available"
  }
];

// Helper function to generate more animals
const generateMoreAnimals = () => {
  const names = ["Charlie", "Lucy", "Cooper", "Bailey", "Milo", "Leo", "Lily", "Daisy", "Molly", "Buddy", 
                "Ruby", "Jack", "Sadie", "Tucker", "Duke", "Bear", "Stella", "Bentley", "Zeus", "Shadow"];
  
  const dogBreeds = ["Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", 
                     "Poodle", "Beagle", "Rottweiler", "Boxer", "Dachshund", "Husky"];
  
  const catBreeds = ["Persian", "Siamese", "Maine Coon", "British Shorthair", "Ragdoll", 
                     "Bengal", "Sphynx", "Russian Blue", "American Shorthair", "Abyssinian"];
  
  const descriptions = [
    "Loving and affectionate companion seeking a forever home.",
    "Energetic and playful, great with children and other pets.",
    "Quiet and gentle soul, perfect for a peaceful household.",
    "Smart and trainable, would excel in an active family.",
    "Sweet and caring personality, loves cuddles and attention."
  ];

  const ages = ["6 months", "1 year", "2 years", "3 years", "4 years", "5 years", "7 years", "8 years"];
  const statuses: ("Available" | "Reserved" | "Adopted")[] = ["Available", "Reserved", "Adopted"];

  return Array.from({ length: 95 }, (_, i) => {
    const type = Math.random() > 0.5 ? "Dog" : "Cat";
    const gender: "Male" | "Female" = Math.random() > 0.5 ? "Male" : "Female";
    const breeds = type === "Dog" ? dogBreeds : catBreeds;
    
    return {
      id: (i + 6).toString(),
      name: names[Math.floor(Math.random() * names.length)],
      type,
      breed: breeds[Math.floor(Math.random() * breeds.length)],
      age: ages[Math.floor(Math.random() * ages.length)],
      gender,
      image: `/${type.toLowerCase()}s/${type.toLowerCase()}${Math.floor(Math.random() * 10) + 1}.jpg`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

// Combine existing and generated animals
const allAnimals = [...animals, ...generateMoreAnimals()];

export default function AdoptPage() {
  const [animalType, setAnimalType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredAnimals = allAnimals.filter(animal => {
    const matchesType = animalType === "all" || animal.type.toLowerCase() === animalType;
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  const paginatedAnimals = filteredAnimals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/adopt-hero.jpg')",
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">Adopt a Pet</h1>
          <p className="text-xl">Give them a forever home</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto flex gap-4">
              <div className="w-full md:w-[200px]">
                <Select onValueChange={setAnimalType} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Animal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    <SelectItem value="dog">Dogs</SelectItem>
                    <SelectItem value="cat">Cats</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[300px]">
                <Input
                  placeholder="Search by name or breed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animals Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedAnimals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    fill
                    className="object-cover"
                  />
                  <Badge 
                    className={`absolute top-4 right-4 ${
                      animal.status === "Available" ? "bg-green-500" :
                      animal.status === "Reserved" ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  >
                    {animal.status}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{animal.name}</h3>
                      <p className="text-muted-foreground">{animal.breed}</p>
                    </div>
                    <Badge variant="outline">{animal.gender}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{animal.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{animal.age}</span>
                    <Button asChild>
                      <Link href={`/adopt/${animal.id}`}>Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Button
            variant="outline"
            onClick={() => redirectToLogin("volunteer")}
          >
            Adopter Login
          </Button>
        </div>
      </section>
    </div>
  );
}