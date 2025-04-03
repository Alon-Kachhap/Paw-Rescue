"use client";

import React, { useState, useEffect } from "react";
import AnimalsList from "./AnimalsList";
import { useSession } from "next-auth/react";

export default function AnimalsTabContent({ animals, volunteers }) {
  const { data: session } = useSession();
  const [processedAnimals, setProcessedAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Process animals data
  useEffect(() => {
    let animalArray = [];
    
    if (Array.isArray(animals) && animals.length > 0) {
      animalArray = animals;
    } else if (animals && typeof animals === 'object') {
      if (Array.isArray(animals.animals)) {
        animalArray = animals.animals;
      } else {
        // Look for any arrays in the object
        for (const key in animals) {
          if (Array.isArray(animals[key]) && animals[key].length > 0) {
            animalArray = animals[key];
            break;
          }
        }
        
        // If still nothing, try to convert the object to array
        if (animalArray.length === 0) {
          try {
            animalArray = Object.values(animals);
          } catch (e) {
            animalArray = [];
          }
        }
      }
    }
    
    // Final processing
    if (animalArray.length > 0) {
      // Make sure it's a properly formatted array of animal objects
      if (typeof animalArray[0] === 'object' && (animalArray[0].name || animalArray[0].species)) {
        setProcessedAnimals(animalArray);
        setIsLoading(false);
      } else {
        fetchAnimalsFromApi();
      }
    } else {
      // If no animals, try direct API fetch
      fetchAnimalsFromApi();
    }
  }, [animals]);
  
  // Auto-refresh animals every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAnimalsFromApi();
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to fetch animals directly from API
  const fetchAnimalsFromApi = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/animals', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch animals: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setProcessedAnimals(data);
      }
    } catch (error) {
      console.error("Error fetching animals:", error);
      setProcessedAnimals([]); // Empty array instead of sample data
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading animals...
        </div>
      )}
      
      {/* Pass the processed animals to the AnimalsList component */}
      <AnimalsList 
        animals={processedAnimals} 
        volunteers={volunteers || []} 
      />
    </>
  );
} 