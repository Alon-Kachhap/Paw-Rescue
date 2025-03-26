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
import { redirectToLogin } from "@/lib/utils/auth";

interface FosterAnimal {
  id: string;
  name: string;
  type: "Dog" | "Cat" | "Other";
  breed: string;
  age: string;
  gender: "Male" | "Female";
  image: string;
  description: string;
  needsType: "Medical" | "Behavioral" | "Temporary" | "Long-term";
  duration: string;
  specialNeeds: string[];
}

const fosterAnimals: FosterAnimal[] = [
  {
    id: "f1",
    name: "Luna",
    type: "Dog",
    breed: "Mixed Breed",
    age: "8 months",
    gender: "Female",
    image: "/animals/foster/dog1.jpg",
    description: "Sweet puppy recovering from surgery, needs gentle care and attention.",
    needsType: "Medical",
    duration: "2-3 months",
    specialNeeds: ["Post-surgery care", "Regular vet visits", "Medication schedule"]
  },
  {
    id: "f2",
    name: "Oliver",
    type: "Cat",
    breed: "Tabby",
    age: "1 year",
    gender: "Male",
    image: "/animals/foster/cat1.jpg",
    description: "Shy cat needing socialization and confidence building.",
    needsType: "Behavioral",
    duration: "3-6 months",
    specialNeeds: ["Quiet environment", "Patience", "Socialization"]
  },
  // ... Add 18 more animals with similar structure
].concat(Array.from({ length: 18 }, (_, i) => ({
  id: `f${i + 3}`,
  name: [
    "Max", "Bella", "Charlie", "Lucy", "Milo", "Daisy", 
    "Rocky", "Sophie", "Jack", "Lily", "Leo", "Molly",
    "Duke", "Ruby", "Bear", "Sadie", "Zeus", "Nova"
  ][i],
  type: Math.random() > 0.5 ? "Dog" : "Cat",
  breed: Math.random() > 0.5 ? 
    ["Mixed Breed", "Retriever Mix", "Shepherd Mix", "Terrier Mix"][Math.floor(Math.random() * 4)] :
    ["Domestic Shorthair", "Tabby", "Mixed Breed", "Siamese Mix"][Math.floor(Math.random() * 4)],
  age: ["3 months", "6 months", "1 year", "2 years", "3 years"][Math.floor(Math.random() * 5)],
  gender: Math.random() > 0.5 ? "Male" : "Female",
  image: `/animals/foster/${Math.random() > 0.5 ? "dog" : "cat"}${Math.floor(Math.random() * 5) + 1}.jpg`,
  description: [
    "Needs temporary housing while recovering from injury.",
    "Looking for a quiet foster home to gain confidence.",
    "Young animal needing socialization and basic training.",
    "Senior pet requiring special care and attention.",
    "Requires fostering during shelter renovation."
  ][Math.floor(Math.random() * 5)],
  needsType: ["Medical", "Behavioral", "Temporary", "Long-term"][Math.floor(Math.random() * 4)] as FosterAnimal["needsType"],
  duration: ["2-4 weeks", "1-2 months", "3-6 months", "6+ months"][Math.floor(Math.random() * 4)],
  specialNeeds: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
    ["Medication", "Special diet", "Training", "Socialization", "Quiet environment", "Regular vet visits"][Math.floor(Math.random() * 6)]
  )
})));

export default function FosterPage() {
  const [animalType, setAnimalType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [needsType, setNeedsType] = useState<string>("all");

  const filteredAnimals = fosterAnimals.filter(animal => {
    const matchesType = animalType === "all" || animal.type.toLowerCase() === animalType.toLowerCase();
    const matchesNeeds = needsType === "all" || animal.needsType.toLowerCase() === needsType.toLowerCase();
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesNeeds && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/foster-hero.jpg')",
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">Foster a Pet</h1>
          <p className="text-xl">Provide temporary care, save a life</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto flex flex-wrap gap-4">
              <div className="w-full md:w-[200px]">
                <Select onValueChange={setAnimalType} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Animal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    <SelectItem value="dog">Dogs</SelectItem>
                    <SelectItem value="cat">Cats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[200px]">
                <Select onValueChange={setNeedsType} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Care Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="medical">Medical Care</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="long-term">Long-term</SelectItem>
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
            {filteredAnimals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 right-4">
                    {animal.needsType}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{animal.name}</h3>
                      <p className="text-muted-foreground">{animal.breed}</p>
                    </div>
                    <Badge variant="outline">{animal.duration}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{animal.description}</p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {animal.specialNeeds.map((need, index) => (
                        <Badge key={index} variant="secondary">
                          {need}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{animal.age}</span>
                      <Button asChild>
                        <Link href={`/foster/${animal.id}`}>Foster Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => redirectToLogin("volunteer")}
          >
            Foster Login
          </Button>
        </div>
      </section>
    </div>
  );
}