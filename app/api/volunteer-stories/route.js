import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { slugify } from "@/lib/utils";

// GET handler - retrieve volunteer stories
export async function GET(request) {
  console.log("GET /api/volunteer-stories request received");
  
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const featured = url.searchParams.get('featured') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '0');
    
    console.log(`Query params: slug=${slug}, featured=${featured}, limit=${limit}`);
    
    // Construct the query
    let where = {};
    
    // If slug is provided, fetch a single story
    if (slug) {
      where.slug = slug;
      
      // Get the specific story
      const story = await prisma.volunteerStory.findUnique({
        where: { slug },
        include: {
          volunteer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              about: true,
              publicProfile: true,
            }
          }
        }
      });
      
      if (!story) {
        console.error(`Story not found with slug: ${slug}`);
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }
      
      // Check if story has a volunteer and if that volunteer's profile is not public
      if (story.volunteerId && story.volunteer && !story.volunteer.publicProfile) {
        console.log(`Story found but volunteer profile is private: ${story.title}`);
        
        // Return the story without volunteer details
        const anonymizedStory = {
          ...story,
          volunteer: {
            name: "Anonymous",
            publicProfile: false,
          }
        };
        
        return NextResponse.json(anonymizedStory);
      }
      
      // Return the story with formatted volunteer data
      const formattedStory = {
        ...story,
        volunteer: story.volunteer ? {
          ...story.volunteer,
          // Only include email if profile is public
          email: story.volunteer.publicProfile ? story.volunteer.email : null,
          // Format name
          name: story.volunteer.publicProfile 
            ? `${story.volunteer.firstName || ''} ${story.volunteer.lastName || ''}`.trim() 
            : 'Anonymous'
        } : null
      };
      
      console.log(`Found story: ${story.title}`);
      return NextResponse.json(formattedStory);
    }
    
    // For list queries, only include featured if requested
    if (featured) {
      where.featured = true;
    }
    
    // Get public stories - only include stories from volunteers with public profiles
    const stories = await prisma.volunteerStory.findMany({
      where,
      include: {
        volunteer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            publicProfile: true,
          }
        }
      },
      orderBy: { date: 'desc' },
      ...(limit > 0 ? { take: limit } : {})
    });
    
    console.log(`Found ${stories.length} volunteer stories`);
    
    // Filter stories to only include those from volunteers with public profiles
    // or stories without a linked volunteer (standalone stories)
    const publicStories = stories.filter(story => 
      !story.volunteerId || story.volunteer?.publicProfile
    );
    
    console.log(`Filtered to ${publicStories.length} public volunteer stories`);
    
    // Format stories for public consumption
    const formattedStories = publicStories.map(story => ({
      ...story,
      volunteer: story.volunteer ? {
        ...story.volunteer,
        // Only include volunteer info if their profile is public
        name: story.volunteer.publicProfile ? `${story.volunteer.firstName || ''} ${story.volunteer.lastName || ''}`.trim() : 'Anonymous',
        // Only show image if profile is public
        image: story.volunteer.publicProfile ? story.volunteer.image : null,
        // Remove sensitive fields
        firstName: undefined,
        lastName: undefined,
      } : null
    }));
    
    return NextResponse.json(formattedStories);
  } catch (error) {
    console.error("Error fetching volunteer stories:", error);
    return NextResponse.json({ error: "Failed to fetch volunteer stories" }, { status: 500 });
  }
}

// POST handler - create a new volunteer story
export async function POST(request) {
  console.log("POST /api/volunteer-stories request received");
  
  try {
    // Get request body
    const data = await request.json();
    console.log("Received story data:", data);
    
    // Validate required fields
    const { title, authorName, date, excerpt, content, slug, volunteerId } = data;
    
    if (!title || !authorName || !date || !excerpt || !content || !slug) {
      return NextResponse.json({ 
        error: "Missing required fields - title, authorName, date, excerpt, content, and slug are required" 
      }, { status: 400 });
    }
    
    // Check if slug already exists
    const existingStory = await prisma.volunteerStory.findUnique({
      where: { slug }
    });
    
    if (existingStory) {
      return NextResponse.json({ 
        error: "A story with this slug already exists" 
      }, { status: 409 });
    }
    
    // Create the story
    const story = await prisma.volunteerStory.create({
      data: {
        title,
        authorName,
        date: new Date(date),
        image: data.image || null,
        excerpt,
        content,
        slug,
        featured: data.featured || false,
        volunteerId: volunteerId || null
      }
    });
    
    console.log(`Created new volunteer story: ${story.title}`);
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteer story:", error);
    return NextResponse.json({ error: "Failed to create volunteer story" }, { status: 500 });
  }
}

// PATCH handler - update an existing volunteer story
export async function PATCH(request) {
  console.log("PATCH /api/volunteer-stories request received");
  
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get request body
    const data = await request.json();
    console.log("Received story update data:", data);
    
    const { id, title, authorName, date, excerpt, content, featured, image } = data;
    
    if (!id) {
      return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
    }
    
    // Find the story to update
    const existingStory = await prisma.volunteerStory.findUnique({
      where: { id },
      include: { volunteer: true }
    });
    
    if (!existingStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    
    // Check if the user is authorized to update this story
    // Only the story creator (volunteer) or an admin can update
    if (
      existingStory.volunteerId !== session.user.id && 
      session.user.role !== "ADMIN" &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Not authorized to update this story" }, { status: 403 });
    }
    
    // Prepare update data - only include fields that are provided
    const updateData = {};
    
    if (title) updateData.title = title;
    if (authorName) updateData.authorName = authorName;
    if (date) updateData.date = new Date(date);
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (featured !== undefined) updateData.featured = featured;
    if (image !== undefined) updateData.image = image;
    
    // If title changed and slug needs to be updated
    if (title && title !== existingStory.title) {
      const slug = data.slug || slugify(title);
      
      // Check if the new slug already exists
      const slugExists = await prisma.volunteerStory.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });
      
      if (slugExists) {
        return NextResponse.json({ 
          error: "A story with this slug already exists" 
        }, { status: 409 });
      }
      
      updateData.slug = slug;
    }
    
    // Update the story
    const updatedStory = await prisma.volunteerStory.update({
      where: { id },
      data: updateData
    });
    
    console.log(`Updated volunteer story: ${updatedStory.title}`);
    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error("Error updating volunteer story:", error);
    return NextResponse.json({ error: "Failed to update volunteer story" }, { status: 500 });
  }
}

// DELETE handler - delete a volunteer story
export async function DELETE(request) {
  console.log("DELETE /api/volunteer-stories request received");
  
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get the story ID from URL parameter
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
    }
    
    // Find the story to delete
    const story = await prisma.volunteerStory.findUnique({
      where: { id }
    });
    
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    
    // Check if the user is authorized to delete this story
    // Only the story creator (volunteer) or an admin can delete
    if (
      story.volunteerId !== session.user.id && 
      session.user.role !== "ADMIN" &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Not authorized to delete this story" }, { status: 403 });
    }
    
    // Delete the story
    await prisma.volunteerStory.delete({
      where: { id }
    });
    
    console.log(`Deleted volunteer story: ${story.title}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting volunteer story:", error);
    return NextResponse.json({ error: "Failed to delete volunteer story" }, { status: 500 });
  }
} 