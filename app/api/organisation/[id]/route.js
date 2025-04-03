// app/api/organizations/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "ORGANIZATION") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = params;
  
  // Ensure user is updating their own organization
  if (session.user.organizationId !== id) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  
  try {
    const data = await request.json();
    
    // Remove fields that should not be updated
    delete data.id;
    delete data.registrationNumber;
    delete data.verified;
    
    const organization = await prisma.organization.update({
      where: { id },
      data
    });
    
    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error updating organization:", error);
    return new NextResponse("Error updating organization", { status: 500 });
  }
}

// app/api/volunteers/invite/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// In a real application, you would import a function to send emails
// import { sendEmail } from "@/lib/email";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "ORGANIZATION") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  try {
    const { email, organizationId } = await request.json();
    
    // Ensure user is from this organization
    if (session.user.organizationId !== organizationId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      // Update existing user's organization if they don't have one
      if (!existingUser.organizationId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { organizationId }
        });
        
        // In a real application, you would send an email here
        // await sendEmail({
        //   to: email,
        //   subject: "You've been invited to join an organization",
        //   text: `You've been invited to join our organization on the platform.`
        // });
        
        return NextResponse.json({ success: true });
      } else {
        return new NextResponse("User already belongs to an organization", { status: 400 });
      }
    } else {
      // In a real application, you would send an invitation email
      // await sendEmail({
      //   to: email,
      //   subject: "You've been invited to join an organization",
      //   text: `You've been invited to join our organization on the platform. Please register at...`
      // });
      
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error inviting volunteer:", error);
    return new NextResponse("Error inviting volunteer", { status: 500 });
  }
}

// app/api/volunteers/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "ORGANIZATION") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Get the volunteer to check permissions
    const volunteer = await prisma.user.findUnique({
      where: { id },
      select: { organizationId: true }
    });
    
    if (!volunteer) {
      return new NextResponse("Volunteer not found", { status: 404 });
    }
    
    // Ensure organization is removing their own volunteer
    if (volunteer.organizationId !== session.user.organizationId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    // Update the volunteer to remove organization association
    await prisma.user.update({
      where: { id },
      data: { organizationId: null }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing volunteer:", error);
    return new NextResponse("Error removing volunteer", { status: 500 });
  }
}

// app/api/animals/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Ensure the creator belongs to the organization
    const creator = await prisma.user.findUnique({
      where: { id: data.createdById },
      select: { organizationId: true }
    });
    
    if (!creator) {
      return new NextResponse("Creator not found", { status: 404 });
    }
    
    // Organization users can only add animals via their volunteers
    if (session.user.role === "ORGANIZATION" && creator.organizationId !== session.user.organizationId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    // Volunteers can only add animals for themselves
    if (session.user.role === "VOLUNTEER" && data.createdById !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    const animal = await prisma.animal.create({
      data
    });
    
    return NextResponse.json(animal);
  } catch (error) {
    console.error("Error creating animal:", error);
    return new NextResponse("Error creating animal", { status: 500 });
  }
}

// app/api/animals/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Get the animal to check permissions
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: { createdBy: true }
    });
    
    if (!animal) {
      return new NextResponse("Animal not found", { status: 404 });
    }
    
    // Check permissions
    if (
      session.user.role === "VOLUNTEER" && animal.createdById !== session.user.id ||
      session.user.role === "ORGANIZATION" && animal.createdBy.organizationId !== session.user.organizationId
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    const data = await request.json();
    
    // For organization users, ensure the new creator belongs to their org
    if (data.createdById && session.user.role === "ORGANIZATION") {
      const creator = await prisma.user.findUnique({
        where: { id: data.createdById },
        select: { organizationId: true }
      });
      
      if (!creator || creator.organizationId !== session.user.organizationId) {
        return new NextResponse("Invalid creator", { status: 400 });
      }
    }
    
    // Volunteers can't change the creator
    if (session.user.role === "VOLUNTEER") {
      delete data.createdById;
    }
    
    const updatedAnimal = await prisma.animal.update({
      where: { id },
      data
    });
    
    return NextResponse.json(updatedAnimal);
  } catch (error) {
    console.error("Error updating animal:", error);
    return new NextResponse("Error updating animal", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Get the animal to check permissions
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: { createdBy: true }
    });
    
    if (!animal) {
      return new NextResponse("Animal not found", { status: 404 });
    }
    
    // Check permissions
    if (
      session.user.role === "VOLUNTEER" && animal.createdById !== session.user.id ||
      session.user.role === "ORGANIZATION" && animal.createdBy.organizationId !== session.user.organizationId
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    await prisma.animal.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting animal:", error);
    return new NextResponse("Error deleting animal", { status: 500 });
  }
}

// app/api/content-blocks/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "ORGANIZATION") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Ensure user is creating content for their own organization
    if (data.organizationId !== session.user.organizationId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    const contentBlock = await prisma.siteContentBlock.create({
      data
    });
    
    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error("Error creating content block:", error);
    return new NextResponse("Error creating content block", { status: 500 });
  }
}

// app/api/content-blocks/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "ORGANIZATION") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Get the content block to check permissions
    const contentBlock = await prisma.siteContentBlock.findUnique({
      where: { id },
      select: { organizationId: true }
    });
    
    if (!contentBlock) {
      return new NextResponse("Content block not found", { status: 404 });
    }
    
    // Ensure user is updating their own organization's content
    if (contentBlock.organizationId !== session.user.organizationId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    const data = await request.json();
    
    // Remove fields that should not be updated
    delete data.id;
    delete data.organizationId;
    
    const updatedBlock = await prisma.siteContentBlock.update({
      where: { id },
      data
    });
    
    return NextResponse.json(updatedBlock);
  } catch (error) {
    console.error("Error updating content block:", error);
    return new NextResponse("Error updating content block", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "ORGANIZATION") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = params;
  
  try {
    // Get the content block to check permissions
    const contentBlock = await prisma.siteContentBlock.findUnique({
      where: { id },
      select: { organizationId: true }
    });
    
    if (!contentBlock) {
      return new NextResponse("Content block not found", { status: 404 });
    }
    
    // Ensure user is deleting their own organization's content
    if (contentBlock.organizationId !== session.user.organizationId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    await prisma.siteContentBlock.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content block:", error);
    return new NextResponse("Error deleting content block", { status: 500 });
  }
}