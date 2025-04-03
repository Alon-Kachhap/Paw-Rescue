"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Grid } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimalCard } from "@/components/AnimalCard";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Loading component to show while fetching data
function AnimalsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Animals</h1>
        <p className="text-muted-foreground mt-2">Loading our animal friends...</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

export default function AnimalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams?.get('query') || '';
  const speciesFilter = searchParams?.get('species') || '';
  const statusFilter = searchParams?.get('status') || '';
  
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch animals when search params change
  useEffect(() => {
    async function fetchAnimals() {
      setLoading(true);
      try {
        // Build query string from current params
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (speciesFilter) params.append('species', speciesFilter);
        if (statusFilter) params.append('status', statusFilter);
        
        const response = await fetch(`/api/animals?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch animals');
        
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnimals();
  }, [query, speciesFilter, statusFilter]);
  
  // Handle form submissions
  const handleSearchChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('query', e.target.value);
    router.push(`/animals?${params.toString()}`);
  };
  
  const handleSpeciesChange = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value === 'all') {
      params.delete('species');
    } else {
      params.set('species', e.target.value);
    }
    router.push(`/animals?${params.toString()}`);
  };
  
  const handleStatusChange = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value === 'all') {
      params.delete('status');
    } else {
      params.set('status', e.target.value);
    }
    router.push(`/animals?${params.toString()}`);
  };

  // Count by species
  const dogs = animals.filter(a => a.species.toLowerCase() === 'dog').length;
  const cats = animals.filter(a => a.species.toLowerCase() === 'cat').length;
  const others = animals.filter(a => !['dog', 'cat'].includes(a.species.toLowerCase())).length;

  // Separate by status
  const adoptionAnimals = animals.filter(a => a.status === 'ADOPTION');
  const fosterAnimals = animals.filter(a => a.status === 'FOSTER');
  const streetAnimals = animals.filter(a => a.status === 'STREET');
  const otherAnimals = animals.filter(a => a.status === 'OTHER');

  if (loading) {
    return <AnimalsLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Find Your Perfect Companion</h1>
        <p className="text-muted-foreground mt-2">Browse our available animals and find your match</p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search animals..."
            value={query}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={speciesFilter || "all"}
            onChange={handleSpeciesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Species</option>
            <option value="dog">Dogs ({dogs})</option>
            <option value="cat">Cats ({cats})</option>
            <option value="other">Others ({others})</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <select 
            value={statusFilter || "all"}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Animals</option>
            <option value="ADOPTION">For Adoption</option>
            <option value="FOSTER">For Foster</option>
            <option value="STREET">Street Dogs</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">{animals.length}</div>
          <div className="text-sm text-muted-foreground">Total Animals</div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">{dogs}</div>
          <div className="text-sm text-muted-foreground">Dogs</div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">{cats}</div>
          <div className="text-sm text-muted-foreground">Cats</div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">{others}</div>
          <div className="text-sm text-muted-foreground">Other Animals</div>
        </div>
      </div>

      {/* Animals for Adoption */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Available for Adoption</h2>
        {adoptionAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptionAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p>No animals currently available for adoption.</p>
          </div>
        )}
      </section>

      {/* Animals for Foster */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Needing Foster Care</h2>
        {fosterAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fosterAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p>No animals currently needing foster care.</p>
          </div>
        )}
      </section>

      {/* Street Dogs Section */}
      {streetAnimals.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Street Dogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {streetAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </section>
      )}

      {/* Other Animals Section */}
      {otherAnimals.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Other Animals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Contact us to let us know what kind of animal you're interested in, and we'll notify you when a match becomes available.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </section>
    </div>
  );
}
