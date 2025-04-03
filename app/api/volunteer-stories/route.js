import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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