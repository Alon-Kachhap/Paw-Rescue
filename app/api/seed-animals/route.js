import { prisma } from "@/lib/prisma";
import { getUserFromServerSession } from "@/lib/session";

export async function POST(req) {
  try {
    const userData = await getUserFromServerSession();
    if (!userData) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Create sample animals for the current user
    const animalTypes = [
      { species: "Dog", name: "Max", breed: "Labrador", status: "ADOPTION" },
      { species: "Dog", name: "Bella", breed: "Golden Retriever", status: "ADOPTION" },
      { species: "Cat", name: "Luna", breed: "Siamese", status: "FOSTER" },
      { species: "Cat", name: "Oliver", breed: "Maine Coon", status: "FOSTER" },
      { species: "Rabbit", name: "Thumper", breed: "Holland Lop", status: "OTHER" }
    ];
    
    const createdAnimals = [];
    
    for (const animal of animalTypes) {
      const createdAnimal = await prisma.animal.create({
        data: {
          name: animal.name,
          species: animal.species,
          breed: animal.breed,
          neutered: Math.random() > 0.5,
          vaccinated: Math.random() > 0.5,
          status: animal.status,
          createdById: userData.userId
        }
      });
      
      createdAnimals.push(createdAnimal);
    }
    
    return Response.json({
      message: `Created ${createdAnimals.length} sample animals successfully`,
      animals: createdAnimals
    }, { status: 200 });
  } catch (error) {
    console.error("Error creating sample animals:", error);
    return Response.json({ error: "Failed to create sample animals" }, { status: 500 });
  }
} 