"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Mail, MapPin, Share, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Import alternatives until we install the packages
// Will need to run: npm install marked dompurify @types/marked @types/dompurify
// For now, create simple implementations as placeholders
const sanitizeHtml = (html: string) => html; // Placeholder for DOMPurify.sanitize
const parseMarkdown = (markdown: string) => markdown; // Placeholder for marked.parse

interface VolunteerStory {
  id: string;
  title: string;
  authorName: string;
  date: string;
  image: string | null;
  excerpt: string;
  content: string;
  slug: string;
  featured: boolean;
  volunteer?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
    about?: string;
    publicProfile: boolean;
  } | null;
}

export default function StoryPage() {
  const { slug } = useParams();
  const [story, setStory] = useState<VolunteerStory | null>(null);
  const [relatedStories, setRelatedStories] = useState<VolunteerStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    async function fetchStory() {
      try {
        setIsLoading(true);
        
        // Fetch the main story
        const response = await fetch(`/api/volunteer-stories?slug=${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        
        const storyData = await response.json();
        setStory(storyData);
        
        // Calculate reading time once we have the content
        calculateReadingTime(storyData.content);
        
        // Fetch related stories
        const relatedResponse = await fetch('/api/volunteer-stories?limit=3');
        
        if (relatedResponse.ok) {
          const allStories = await relatedResponse.json();
          // Filter out the current story and limit to 3
          const filtered = allStories
            .filter((s: VolunteerStory) => s.id !== storyData.id)
            .slice(0, 3);
          setRelatedStories(filtered);
        }
      } catch (err) {
        console.error('Error fetching story:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (slug) {
      fetchStory();
    }
  }, [slug]);

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    setReadingTime(time);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(story?.title || 'Volunteer Story')}`, '_blank');
  };
  
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  // Fix the async issue by ensuring we have a string
  const formattedContent = story?.content ? 
    DOMPurify.sanitize(marked.parse(story.content) as string) : '';
  
  const displayAuthorSection = () => {
    if (!story?.volunteer) return null;
    
    return (
      <div className="flex items-center">
        {story.volunteer.image ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
            <Image
              src={story.volunteer.image}
              alt={story.volunteer.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-primary" />
          </div>
        )}
        
        <div>
          <h3 className="font-medium">{story.volunteer.name}</h3>
          
          {story.volunteer.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-1" />
              <a href={`mailto:${story.volunteer.email}`} className="hover:text-primary">
                {story.volunteer.email}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !story) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Link href="/volunteer/stories" className="inline-flex items-center text-primary hover:underline mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Stories
        </Link>
        
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h2 className="text-2xl font-bold mb-3">Story Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find the story you're looking for."}
          </p>
          <Button asChild>
            <Link href="/volunteer/stories">Browse All Stories</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-10 px-4">
        <Link href="/volunteer/stories" className="inline-flex items-center text-primary hover:underline mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Stories
        </Link>
        
        <article>
          {/* Story Header */}
          <header className="mb-8">
            {story.featured && (
              <Badge className="mb-4 bg-yellow-100 text-yellow-800">Featured Story</Badge>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{story.title}</h1>
            
            <div className="flex flex-wrap items-center text-muted-foreground mb-6">
              <div className="flex items-center mr-6 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime={story.date}>
                  {new Date(story.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              <div className="flex items-center mr-6 mb-2">
                <User className="h-4 w-4 mr-2" />
                <span>{story.authorName}</span>
              </div>
              
              <div className="mb-2">
                <span>{readingTime} min read</span>
              </div>
            </div>
            
            {story.image && (
              <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden mb-8">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="text-lg font-medium italic border-l-4 border-primary pl-4 py-2 mb-8">
              {story.excerpt}
            </div>
          </header>
          
          {/* Story Content */}
          <div 
            ref={contentRef}
            className="prose max-w-none prose-img:rounded-lg prose-headings:font-semibold prose-h3:text-xl dark:prose-invert mb-10"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
          
          {/* Social Sharing */}
          <div className="border-t border-b py-6 my-8">
            <h3 className="font-semibold mb-4">Share this story</h3>
            <div className="flex space-x-3">
              {/* Replace complex tooltip structure with simple buttons */}
              <Button variant="outline" size="sm" onClick={handleShareTwitter} title="Share on Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShareFacebook} title="Share on Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShareLinkedIn} title="Share on LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleCopyLink} title={copied ? 'Copied!' : 'Copy link'}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Author Section */}
          {story.volunteer && story.volunteer.publicProfile && (
            <div className="bg-muted/20 rounded-lg p-6 mt-10">
              <h2 className="text-xl font-semibold mb-4">About the Volunteer</h2>
              {displayAuthorSection()}
              
              {story.volunteer.about && (
                <div className="mt-4 text-muted-foreground">
                  <p>{story.volunteer.about}</p>
                </div>
              )}
            </div>
          )}
        </article>
        
        {/* Related Stories Section */}
        {relatedStories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Volunteer Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedStories.map(relStory => (
                <Card key={relStory.id} className="overflow-hidden">
                  {relStory.image && (
                    <div className="relative h-48">
                      <Image
                        src={relStory.image}
                        alt={relStory.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {relStory.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                      {relStory.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <time className="text-xs text-muted-foreground">
                        {new Date(relStory.date).toLocaleDateString()}
                      </time>
                      <Button asChild variant="link" className="p-0">
                        <Link href={`/volunteer/stories/${relStory.slug}`}>
                          Read more
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 