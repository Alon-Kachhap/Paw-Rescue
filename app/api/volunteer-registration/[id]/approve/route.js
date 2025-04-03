import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  
  // Check authentication and authorization
  if (!session || !session.user || session.user.role !== "organization") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Get request body for organization ID
    const body = await request.json();
    const { organizationId } = body;
    
    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }
    
    // Get the volunteer registration
    const volunteerReg = await prisma.volunteerRegistration.findUnique({
      where: { id }
    });
    
    if (!volunteerReg) {
      return NextResponse.json({ error: "Volunteer registration not found" }, { status: 404 });
    }
    
    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // 1. Create user from volunteerRegistration data
      const user = await tx.user.create({
        data: {
          email: volunteerReg.email,
          password: volunteerReg.password, // Password is already hashed
          firstName: volunteerReg.firstName,
          lastName: volunteerReg.lastName,
          phone: volunteerReg.phone,
          about: volunteerReg.aboutYourself,
          referral: volunteerReg.referral,
          street: volunteerReg.street,
          city: volunteerReg.city,
          state: volunteerReg.state,
          zip: volunteerReg.zip,
          role: "VOLUNTEER",
          organizationId: organizationId,
        }
      });
      
      // 2. Mark volunteer registration as verified
      await tx.volunteerRegistration.update({
        where: { id },
        data: { verified: true }
      });
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error approving volunteer:", error);
    return NextResponse.json(
      { error: "Failed to approve volunteer" },
      { status: 500 }
    );
  }
} 