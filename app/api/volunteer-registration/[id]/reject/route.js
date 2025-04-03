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
    // Simply delete the registration record
    await prisma.volunteerRegistration.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error rejecting volunteer:", error);
    return NextResponse.json(
      { error: "Failed to reject volunteer" },
      { status: 500 }
    );
  }
} 