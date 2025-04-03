import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  console.log("GET /api/volunteer-stories/by-volunteer request received");
  
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const volunteerId = url.searchParams.get('volunteerId') || session.user.id;
    
    // Only allow viewing other volunteer's non-public stories if admin
    if (volunteerId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to view these stories" }, { status: 403 });
    }
    
    // Find all stories by this volunteer
    const stories = await prisma.volunteerStory.findMany({
      where: { volunteerId },
      orderBy: { date: 'desc' }
    });
    
    console.log(`Found ${stories.length} stories for volunteer ${volunteerId}`);
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching volunteer stories:", error);
    return NextResponse.json({ error: "Failed to fetch volunteer stories" }, { status: 500 });
  }
} 