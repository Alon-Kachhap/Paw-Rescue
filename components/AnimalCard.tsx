"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Rabbit } from 'lucide-react';
import { useState, useEffect } from 'react';

type AnimalProps = {
  animal: {
    id: string;
    name: string;
    species: string;
    breed?: string | null;
    vaccinated: boolean;
    neutered: boolean;
    status: string;
    image?: string | null;
  };
};

export function AnimalCard({ animal }: AnimalProps) {
  const [imageError, setImageError] = useState(false);
  
  // Use effect to reset image error state when animal changes
  useEffect(() => {
    setImageError(false);
  }, [animal.id, animal.image]);
  
  // Get animal icon based on species
  const getAnimalIcon = (species: string) => {
    const lowerSpecies = species.toLowerCase();
    if (lowerSpecies.includes('dog')) return <Dog className="h-5 w-5" />;
    if (lowerSpecies.includes('cat')) return <Cat className="h-5 w-5" />;
    return <Rabbit className="h-5 w-5" />;
  };

  // Default image if none provided
  const defaultImage = `/images/placeholder-animal.jpg`;

  // Determine badge variant and text based on status
  const getBadgeProps = () => {
    switch(animal.status) {
      case "FOSTER":
        return {
          variant: "outline" as const,
          className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
          text: "Foster"
        };
      case "STREET":
        return {
          variant: "outline" as const,
          className: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
          text: "Street Dog"
        };
      case "OTHER":
        return {
          variant: "secondary" as const,
          className: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
          text: "Other"
        };
      default: // ADOPTION
        return {
          variant: "default" as const,
          className: "",
          text: "Adoption"
        };
    }
  };

  const badgeProps = getBadgeProps();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        {animal.image && !imageError ? (
          <div className="relative w-full h-full">
            <Image
              src={animal.image}
              alt={animal.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <div className="text-4xl text-slate-400">
              {getAnimalIcon(animal.species)}
            </div>
          </div>
        )}
        <Badge 
          className={`absolute top-2 right-2 ${badgeProps.className}`} 
          variant={badgeProps.variant}
        >
          {badgeProps.text}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{animal.name}</h3>
            <p className="text-sm text-muted-foreground">
              {animal.species} {animal.breed ? `· ${animal.breed}` : ''}
            </p>
          </div>
          <div className="flex items-center">
            {getAnimalIcon(animal.species)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {animal.vaccinated && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              Vaccinated
            </Badge>
          )}
          {animal.neutered && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
              Neutered
            </Badge>
          )}
        </div>
        <Button asChild size="sm" className="w-full mt-2">
          <Link href={`/animals/${animal.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
} 