import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  console.log("PATCH /api/organizations/[id] request received");
  
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Session in PATCH organization:", session?.user);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user has necessary permissions (organization)
    if (session.user.role !== "ORGANIZATION" && session.user.role !== "organization") {
      return NextResponse.json({ error: "Only organizations can update their profile" }, { status: 403 });
    }
    
    const { id } = params;
    console.log("Organization ID to update:", id);
    
    // Check if the organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id }
    });
    
    if (!existingOrg) {
      console.error(`Organization not found with ID: ${id}`);
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    
    // Parse the request body
    const data = await request.json();
    console.log("Update data received:", data);
    
    // Remove protected fields
    delete data.id;
    delete data.registrationNumber;
    delete data.verified;
    
    // Update the organization
    const updatedOrg = await prisma.organization.update({
      where: { id },
      data
    });
    
    console.log("Successfully updated organization:", updatedOrg.name);
    
    // Return the updated organization
    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  console.log("GET /api/organizations/[id] request received");
  
  try {
    const { id } = params;
    console.log("Organization ID to fetch:", id);
    
    // Get organization data
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        volunteers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            createdAt: true
          }
        }
      }
    });
    
    if (!organization) {
      console.error(`Organization not found with ID: ${id}`);
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    
    console.log("Successfully fetched organization:", organization.name);
    
    // Return the organization data
    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
} 