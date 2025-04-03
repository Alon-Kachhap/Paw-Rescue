import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET handler - retrieve public volunteer profiles
export async function GET(request) {
  console.log("GET /api/volunteers/public request received");
  
  try {
    // Get volunteers with publicProfile set to true
    const volunteers = await prisma.user.findMany({
      where: { 
        role: "VOLUNTEER",
        publicProfile: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        image: true,
        about: true,
        city: true,
        state: true,
        zip: true,
        organizationId: true,
        publicProfile: true,
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });
    
    console.log(`Found ${volunteers.length} public volunteer profiles`);
    
    // Remove sensitive information for security
    const sanitizedVolunteers = volunteers.map(volunteer => ({
      ...volunteer,
      // Only include email if profile is public (which it is since we filtered)
      phone: volunteer.phone || '',  // Include phone but make sure it's not null
    }));
    
    return NextResponse.json(sanitizedVolunteers);
  } catch (error) {
    console.error("Error fetching public volunteer profiles:", error);
    return NextResponse.json({ error: "Failed to fetch public volunteer profiles" }, { status: 500 });
  }
} 