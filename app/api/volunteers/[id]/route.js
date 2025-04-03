import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  console.log(`PATCH /api/volunteers/${params.id} request received`);
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Only allow users to update their own profile or admins
    if (session.user.id !== params.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to update this profile" }, { status: 403 });
    }
    
    const data = await request.json();
    console.log("Update data:", data);
    
    // Validate the data
    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "street",
      "city",
      "state",
      "zip",
      "about",
      "publicProfile"
    ];
    
    // Filter out fields that shouldn't be updated
    const updateData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
      
    // If toggling publicProfile, log the change
    if ('publicProfile' in updateData) {
      console.log(`Updating publicProfile to: ${updateData.publicProfile}`);
    }
    
    // Update the volunteer data
    const updatedVolunteer = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        about: true,
        publicProfile: true,
        role: true
      }
    });
    
    console.log(`Volunteer ${params.id} updated successfully`);
    return NextResponse.json(updatedVolunteer);
  } catch (error) {
    console.error(`Error updating volunteer ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update volunteer profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "organization") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Get the volunteer to check if they belong to this organization
    const volunteer = await prisma.user.findUnique({
      where: { id },
      select: { organizationId: true }
    });
    
    // If volunteer doesn't exist or isn't from this organization
    if (!volunteer || volunteer.organizationId !== session.user.organizationId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    // Remove organization association rather than deleting the user
    await prisma.user.update({
      where: { id },
      data: { organizationId: null }
    });
    
    return new NextResponse("Volunteer removed from organization", { status: 200 });
  } catch (error) {
    console.error("Error removing volunteer:", error);
    return new NextResponse("Error removing volunteer", { status: 500 });
  }
}

// GET handler - get volunteer profile
export async function GET(request, { params }) {
  console.log(`GET /api/volunteers/${params.id} request received`);
  
  try {
    const volunteer = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        about: true,
        image: true,
        publicProfile: true,
        role: true,
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }
    
    // Get session to check permissions
    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.id === params.id;
    const isAdmin = session?.user?.role === "ADMIN";
    
    // If not own profile or admin, and profile is not public, restrict access
    if (!isOwnProfile && !isAdmin && !volunteer.publicProfile) {
      return NextResponse.json({ error: "This profile is private" }, { status: 403 });
    }
    
    // If not own profile or admin, only return public data
    if (!isOwnProfile && !isAdmin) {
      // For public profiles, filter sensitive information
      return NextResponse.json({
        id: volunteer.id,
        firstName: volunteer.firstName,
        lastName: volunteer.lastName,
        image: volunteer.image,
        about: volunteer.about,
        city: volunteer.city,
        state: volunteer.state,
        organization: volunteer.organization,
        publicProfile: volunteer.publicProfile
      });
    }
    
    return NextResponse.json(volunteer);
  } catch (error) {
    console.error(`Error fetching volunteer ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch volunteer profile" },
      { status: 500 }
    );
  }
} 