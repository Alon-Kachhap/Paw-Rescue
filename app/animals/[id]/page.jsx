"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimalCard } from '@/components/AnimalCard';
import { 
  Calendar, 
  Phone, 
  MapPin, 
  Heart, 
  Share2, 
  Dog, 
  Cat, 
  Rabbit, 
  PawPrint,
  User
} from 'lucide-react';

export default function AnimalDetailPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [relatedAnimals, setRelatedAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setIsLoading(true);
        // Fetch the animal details
        const response = await fetch(`/api/animals/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch animal details');
        }
        
        const animalData = await response.json();
        setAnimal(animalData);
        
        // Fetch related animals (same species)
        const relatedResponse = await fetch(`/api/animals?species=${animalData.species}&limit=4&exclude=${id}`);
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedAnimals(relatedData.filter(a => a.id !== id).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching animal:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchAnimal();
    }
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading animal details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !animal) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <PawPrint className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold mt-4">Animal Not Found</h1>
          <p className="text-muted-foreground mt-2">
            {error || "The animal you're looking for could not be found."}
          </p>
          <Button asChild className="mt-6">
            <Link href="/animals">Back to Animals</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get animal icon based on species
  const getAnimalIcon = (species) => {
    const lowerSpecies = species.toLowerCase();
    if (lowerSpecies.includes('dog')) return <Dog className="h-6 w-6" />;
    if (lowerSpecies.includes('cat')) return <Cat className="h-6 w-6" />;
    return <Rabbit className="h-6 w-6" />;
  };

  // Format status badge
  const getBadgeClass = (status) => {
    switch(status) {
      case "FOSTER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "STREET":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "OTHER":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default: // ADOPTION
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "FOSTER": return "Foster";
      case "STREET": return "Street Dog";
      case "OTHER": return "Other";
      default: return "For Adoption";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/animals" className="text-primary hover:underline inline-flex items-center">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Animals
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Animal image */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-200 dark:bg-slate-800">
            {animal.image ? (
              <Image
                src={animal.image}
                alt={animal.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl text-slate-400">
                  {getAnimalIcon(animal.species)}
                </div>
              </div>
            )}
            <Badge className={`absolute top-4 right-4 ${getBadgeClass(animal.status)}`}>
              {getStatusText(animal.status)}
            </Badge>
          </div>

          <div className="mt-8">
            <h1 className="text-3xl font-bold">{animal.name}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              {getAnimalIcon(animal.species)}
              <span className="ml-2">
                {animal.species} • {animal.breed || 'Mixed breed'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {animal.vaccinated && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  Vaccinated
                </Badge>
              )}
              {animal.neutered && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  Neutered
                </Badge>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About {animal.name}</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {animal.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Contact info */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              {animal.contactPhone && (
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <a href={`tel:${animal.contactPhone}`} className="text-primary hover:underline">
                    {animal.contactPhone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-muted-foreground">
                  Posted on {new Date(animal.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {animal.createdBy && (
                <div className="flex items-center mb-6">
                  <User className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">
                    Posted by {animal.createdBy?.name || animal.createdBy?.firstName + ' ' + animal.createdBy?.lastName || 'Unknown'}
                  </span>
                </div>
              )}
              
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <a href={`mailto:${animal.createdBy?.email || 'info@pawrescue.org'}?subject=Inquiry about ${animal.name}&body=I'm interested in ${animal.name} and would like more information.`}>
                    Ask about {animal.name}
                  </a>
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorite
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigator.share({
                      title: `${animal.name} - Paw Rescue`,
                      text: `Check out ${animal.name}, a ${animal.breed || ''} ${animal.species} on Paw Rescue!`,
                      url: window.location.href,
                    }).catch(err => console.log('Error sharing', err));
                  }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related animals */}
      {relatedAnimals.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar {animal.species}s</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedAnimals.map((related) => (
              <AnimalCard key={related.id} animal={related} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href={`/animals?species=${animal.species.toLowerCase()}`}>
                View All {animal.species}s
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 