import { prisma } from "@/lib/prisma";
import { getUserFromServerSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const userData = await getUserFromServerSession();
    if (!userData) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = userData;
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: "Animal ID is required" },
        { status: 400 }
      );
    }

    // Check if the animal exists
    const existingAnimal = await prisma.animal.findUnique({
      where: { id },
    });

    if (!existingAnimal) {
      return Response.json({ error: "Animal not found" }, { status: 404 });
    }

    // Allow delete if user is creator, admin, or organization
    if (
      existingAnimal.createdById !== userId &&
      role !== "ADMIN" &&
      role !== "ORGANIZATION"
    ) {
      return Response.json(
        { error: "You do not have permission to delete this animal" },
        { status: 403 }
      );
    }

    // Delete the animal
    await prisma.animal.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting animal:", error);
    return Response.json(
      { error: "Failed to delete animal" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const userData = await getUserFromServerSession();
    if (!userData) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = userData;
    const { id } = params;
    const { name, species, breed, neutered, vaccinated, status, image } = await req.json();

    // Validate required fields
    if (!name || !species) {
      return Response.json(
        { error: "Name and species are required fields" },
        { status: 400 }
      );
    }

    // Check if the animal exists
    const existingAnimal = await prisma.animal.findUnique({
      where: { id },
    });

    if (!existingAnimal) {
      return Response.json({ error: "Animal not found" }, { status: 404 });
    }

    // Only allow the creator or an admin or organization to update the animal
    if (
      existingAnimal.createdById !== userId &&
      role !== "ADMIN" &&
      role !== "ORGANIZATION"
    ) {
      return Response.json(
        { error: "You do not have permission to update this animal" },
        { status: 403 }
      );
    }

    // Update the animal
    const updatedAnimal = await prisma.animal.update({
      where: { id },
      data: {
        name,
        species,
        breed,
        neutered: neutered || false,
        vaccinated: vaccinated || false,
        status: status || "ADOPTION",
        image,
      },
    });

    return Response.json({ animal: updatedAnimal });
  } catch (error) {
    console.error("Error updating animal:", error);
    return Response.json(
      { error: "Failed to update animal" },
      { status: 500 }
    );
  }
}

// GET handler - retrieve a specific animal by ID
export async function GET(request, { params }) {
  console.log("GET /api/animals/[id] request received");
  
  try {
    const { id } = params;
    console.log("Fetching animal with ID:", id);
    
    // Get the animal with creator information
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            organizationId: true
          }
        }
      }
    });
    
    if (!animal) {
      console.error(`Animal not found with ID: ${id}`);
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }
    
    // Format the creator's name
    const formattedAnimal = {
      ...animal,
      createdBy: animal.createdBy ? {
        ...animal.createdBy,
        name: `${animal.createdBy.firstName || ''} ${animal.createdBy.lastName || ''}`.trim() || 'Unknown'
      } : null
    };
    
    console.log(`Successfully fetched animal: ${animal.name}`);
    
    // Return the animal data
    return NextResponse.json(formattedAnimal);
  } catch (error) {
    console.error("Error fetching animal:", error);
    return NextResponse.json({ error: "Failed to fetch animal" }, { status: 500 });
  }
} 