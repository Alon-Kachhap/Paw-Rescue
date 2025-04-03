"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

type AnimalFiltersProps = {
  query: string;
  speciesFilter: string;
  statusFilter: string;
  dogs: number;
  cats: number;
  others: number;
};

export function AnimalFilters({ 
  query, 
  speciesFilter, 
  statusFilter,
  dogs,
  cats,
  others 
}: AnimalFiltersProps) {
  const router = useRouter();

  const handleSpeciesChange = useCallback((value: string) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (value !== "all") params.set("species", value);
    if (statusFilter) params.set("status", statusFilter);
    
    router.push(`/animals?${params.toString()}`);
  }, [query, statusFilter, router]);

  const handleStatusChange = useCallback((value: string) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (speciesFilter) params.set("species", speciesFilter);
    if (value !== "all") params.set("status", value);
    
    router.push(`/animals?${params.toString()}`);
  }, [query, speciesFilter, router]);

  const handleQueryChange = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("query") as string;
    
    const params = new URLSearchParams();
    if (newQuery) params.set("query", newQuery);
    if (speciesFilter) params.set("species", speciesFilter);
    if (statusFilter) params.set("status", statusFilter);
    
    router.push(`/animals?${params.toString()}`);
  }, [speciesFilter, statusFilter, router]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <form onSubmit={handleQueryChange}>
          <input 
            type="text" 
            name="query" 
            placeholder="Search animals..."
            defaultValue={query}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
      </div>
      <div className="w-full md:w-48">
        <select 
          defaultValue={speciesFilter || "all"}
          onChange={(e) => handleSpeciesChange(e.target.value)}
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
          defaultValue={statusFilter || "all"}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Animals</option>
          <option value="ADOPTION">For Adoption</option>
          <option value="FOSTER">For Foster</option>
        </select>
      </div>
    </div>
  );
} 