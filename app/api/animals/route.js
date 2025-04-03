import { prisma } from "@/lib/prisma";
import { getUserFromServerSession } from "@/lib/session";
import { NextResponse } from "next/server";

// GET handler - retrieve all animals associated with user
export async function GET(req) {
  console.log("GET /api/animals request received");
  
  try {
    const user = await getUserFromServerSession();
    
    if (!user) {
      console.error("GET /api/animals - No user found in session");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get query parameters for filtering
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '';
    const species = url.searchParams.get('species') || '';
    const status = url.searchParams.get('status') || '';
    const exclude = url.searchParams.get('exclude') || '';
    const limit = parseInt(url.searchParams.get('limit') || '0');
    
    let animals = [];
    
    // Build where clause for filtering
    const where = {};
    
    // Add text search filters if query provided
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { species: { contains: query, mode: 'insensitive' } },
        { breed: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    // Add other filters
    if (species) {
      where.species = { contains: species, mode: 'insensitive' };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (exclude) {
      where.id = { not: exclude };
    }
    
    // Handle different roles
    const userRole = (user.role || '').toUpperCase();
    
    if (userRole === 'ORGANIZATION' || userRole === 'ADMIN') {
      // For organization users, get all animals related to the organization
      if (userRole === 'ORGANIZATION') {
        // First, find the organization ID for this user
        const organization = await prisma.organization.findUnique({
          where: { email: user.email },
          select: { id: true }
        });
        
        if (organization) {
          where.OR = [
            // Animals created by organization volunteers
            {
              createdBy: {
                organizationId: organization.id
              }
            },
            // Animals created by the organization account directly
            {
              createdById: user.id
            }
          ];
        } else {
          // Only show animals created by this user if no organization found
          where.createdById = user.id;
        }
      }
    } else if (userRole === 'VOLUNTEER') {
      // For volunteer users, get animals they created or from their organization
      const volunteer = await prisma.user.findUnique({
        where: { id: user.id },
        select: { organizationId: true }
      });
      
      if (volunteer?.organizationId) {
        where.OR = [
          // Their own animals
          { createdById: user.id },
          // Animals from their organization
          { createdBy: { organizationId: volunteer.organizationId } }
        ];
      } else {
        // Only their own animals if not part of an organization
        where.createdById = user.id;
      }
    } else {
      // Default case - only show animals created by this user
      where.createdById = user.id;
    }
    
    console.log(`Executing query with where clause:`, JSON.stringify(where));
    
    animals = await prisma.animal.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            organizationId: true
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      ...(limit > 0 ? { take: limit } : {})
    });
    
    console.log(`GET /api/animals - Found ${animals.length} animals`);
    
    // Transform the data to match the expected format in the frontend
    const formattedAnimals = animals.map(animal => ({
      ...animal,
      createdBy: {
        ...animal.createdBy,
        name: `${animal.createdBy.firstName || ''} ${animal.createdBy.lastName || ''}`.trim() || 'Unknown'
      }
    }));
    
    return NextResponse.json(formattedAnimals);
  } catch (error) {
    console.error("Error in GET /api/animals:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler - create a new animal
export async function POST(request) {
  try {
    // Get authenticated user
    const user = await getUserFromServerSession();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if user has necessary permissions (organization or volunteer)
    if (
      user.role !== "ORGANIZATION" && 
      user.role !== "organization" && 
      user.role !== "VOLUNTEER" && 
      user.role !== "volunteer" &&
      user.role !== "ADMIN" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    console.log("Creating animal with data:", data);
    
    // Validate status field if it exists
    if (data.status && !["ADOPTION", "FOSTER", "STREET", "OTHER"].includes(data.status)) {
      data.status = "OTHER"; // Default to OTHER for invalid status values
    }
    
    // Create the animal in the database
    const animal = await prisma.animal.create({
      data: {
        ...data,
        createdById: user.id
      }
    });
    
    // Return the created animal
    return NextResponse.json(animal);
  } catch (error) {
    console.error("Error creating animal:", error);
    return NextResponse.json(
      { error: "Failed to create animal" },
      { status: 500 }
    );
  }
}

// PATCH handler - update an existing animal
export async function PATCH(request) {
  try {
    // Get authenticated user
    const user = await getUserFromServerSession();
    
    if (!user) {
      console.error("PATCH /api/animals - No user found in session");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    console.log("PATCH /api/animals - Received data:", JSON.stringify(data));
    
    const { id, ...updateData } = data;
    
    if (!id) {
      console.error("PATCH /api/animals - No ID provided in request");
      return NextResponse.json(
        { error: "Animal ID is required" },
        { status: 400 }
      );
    }
    
    // Ensure we only update fields that exist in the schema
    const validFields = [
      'name', 'species', 'breed', 'vaccinated', 
      'neutered', 'image', 'status', 'description', 
      'contactPhone'
    ];
    
    // Validate status field if it exists
    if (updateData.status && !["ADOPTION", "FOSTER", "STREET", "OTHER"].includes(updateData.status)) {
      updateData.status = "OTHER"; // Default to OTHER for invalid status values
    }
    
    // Clean update data to only include valid fields
    const cleanedUpdateData = {};
    Object.keys(updateData).forEach(key => {
      if (validFields.includes(key)) {
        cleanedUpdateData[key] = updateData[key];
      } else {
        console.warn(`PATCH /api/animals - Ignoring non-schema field: ${key}`);
      }
    });
    
    console.log("PATCH /api/animals - Cleaned update data:", JSON.stringify(cleanedUpdateData));
    
    // Check if the animal exists
    try {
      const existingAnimal = await prisma.animal.findUnique({
        where: { id },
      });
      
      if (!existingAnimal) {
        console.error(`PATCH /api/animals - Animal not found with ID: ${id}`);
        return NextResponse.json(
          { error: "Animal not found" },
          { status: 404 }
        );
      }
      
      console.log(`PATCH /api/animals - Found animal with ID: ${id}`);
      console.log(`User ${user.id} is updating animal ${id}`);
      
      // Update the animal
      try {
        const updatedAnimal = await prisma.animal.update({
          where: { id },
          data: cleanedUpdateData
        });
        
        console.log(`PATCH /api/animals - Successfully updated animal ${id}`);
        
        // Return the updated animal
        return NextResponse.json(updatedAnimal);
      } catch (updateError) {
        console.error("Error during animal update:", updateError);
        return NextResponse.json(
          { error: `Database update failed: ${updateError.message}` },
          { status: 500 }
        );
      }
    } catch (findError) {
      console.error("Error finding animal:", findError);
      return NextResponse.json(
        { error: `Database query failed: ${findError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PATCH /api/animals:", error);
    return NextResponse.json(
      { error: "Failed to update animal" },
      { status: 500 }
    );
  }
}

// DELETE handler - delete an animal
export async function DELETE(request) {
  try {
    // Get authenticated user
    const user = await getUserFromServerSession();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the animal ID from the request URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Animal ID is required" },
        { status: 400 }
      );
    }
    
    // Check if the animal exists
    const existingAnimal = await prisma.animal.findUnique({
      where: { id }
    });
    
    if (!existingAnimal) {
      return NextResponse.json(
        { error: "Animal not found" },
        { status: 404 }
      );
    }
    
    // Allow any authenticated user to delete any animal
    console.log(`User ${user.id} is deleting animal ${id}`);
    
    // Delete the animal
    await prisma.animal.delete({
      where: { id }
    });
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting animal:", error);
    return NextResponse.json(
      { error: "Failed to delete animal" },
      { status: 500 }
    );
  }
} 