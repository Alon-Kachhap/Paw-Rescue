import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromServerSession } from "@/lib/session";

// GET user profile
export async function GET(request) {
  console.log("GET /api/user/profile request received");
  
  try {
    // Get authenticated user
    const user = await getUserFromServerSession();
    
    if (!user) {
      console.error("GET /api/user/profile - No user found in session");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    console.log(`GET /api/user/profile - Fetching profile for user: ${user.id}`);
    
    // Get user data from database (excluding password)
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        image: true,
        about: true,
        referral: true,
        street: true,
        city: true, 
        state: true,
        zip: true,
        role: true,
        publicProfile: true,
        organizationId: true,
        createdAt: true
      }
    });
    
    if (!userData) {
      console.error(`GET /api/user/profile - User not found: ${user.id}`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Return user data
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in GET /api/user/profile:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user profile" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request) {
  console.log("PATCH /api/user/profile request received");
  
  try {
    // Get authenticated user
    const user = await getUserFromServerSession();
    
    if (!user) {
      console.error("PATCH /api/user/profile - No user found in session");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    console.log("PATCH /api/user/profile - Received data:", JSON.stringify(data));
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'street', 'city', 'state', 'zip', 'about'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Fields that can be updated
    const updateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      about: data.about,
      publicProfile: data.publicProfile === false ? false : true,
    };
    
    console.log(`PATCH /api/user/profile - Updating profile for user: ${user.id}`);
    
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        image: true,
        about: true,
        referral: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        role: true,
        publicProfile: true,
        organizationId: true,
        createdAt: true
      }
    });
    
    console.log(`PATCH /api/user/profile - Successfully updated profile for user: ${user.id}`);
    
    // Return updated user data
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/user/profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
} 