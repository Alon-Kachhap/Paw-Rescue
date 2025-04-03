import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    // Check if we're in development environment
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This endpoint is only available in development" },
        { status: 403 }
      );
    }
    
    console.log("Seeding volunteer stories...");
    
    // Sample stories
    const sampleStories = [
      {
        title: "My Journey with Street Dogs in Mumbai",
        authorName: "Sarah Johnson",
        date: new Date("2024-01-15"),
        image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?q=80&w=2069&auto=format&fit=crop",
        excerpt: "Volunteering with Paw Rescue changed my perspective on animal welfare and taught me valuable lessons about compassion.",
        content: `<p>When I first arrived in Mumbai, I was overwhelmed by the number of street dogs I saw everywhere. Some were in desperate need of medical attention, others were simply hungry and looking for affection. I knew I had to do something to help.</p>
        
        <p>I found Paw Rescue through a local community board and signed up immediately. On my first day, we went out with the mobile veterinary unit to treat dogs with mange and other skin conditions. The transformation I witnessed in these animals over the weeks was nothing short of miraculous.</p>
        
        <h3>The Challenges We Faced</h3>
        
        <p>Working with street dogs isn't always easy. Many are fearful of humans due to past mistreatment. Gaining their trust takes patience and consistency. We would visit the same areas regularly, bringing food and gentle words until they began to recognize us as friends.</p>
        
        <p>One particular dog, whom we named Buddy, was extremely skittish when we first met him. He had a severe case of mange and was clearly in pain. It took three weeks of daily visits before he would let us come close enough to apply medication. Today, Buddy has a healthy coat and greets us with a wagging tail whenever we visit his neighborhood.</p>
        
        <h3>The Reward of Compassion</h3>
        
        <p>The most rewarding aspect of volunteering with Paw Rescue has been seeing the direct impact of our work. Each vaccinated dog means one less animal at risk of rabies. Each treated wound means less suffering. And each dog we're able to sterilize means fewer puppies born into harsh street conditions.</p>
        
        <p>I've learned that consistent, small actions add up to significant change over time. Our team has treated over 500 dogs in the past year alone, and the difference in the health of the street dog population is noticeable.</p>
        
        <p>If you're considering volunteering, I can't recommend it enough. The skills you'll learn and the connections you'll make—both human and canine—will stay with you forever.</p>`,
        slug: "my-journey-with-street-dogs-in-mumbai",
        featured: true
      },
      {
        title: "From Corporate Life to Animal Rescue",
        authorName: "David Chen",
        date: new Date("2023-12-05"),
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1886&auto=format&fit=crop",
        excerpt: "I left my corporate job to pursue my passion for animal welfare, and it was the best decision I ever made.",
        content: `<p>After 12 years in corporate finance, I found myself increasingly disconnected from what truly mattered to me. I would donate to animal charities and occasionally volunteer on weekends, but it never felt like enough.</p>
        
        <p>When my company announced layoffs, I saw it as an opportunity rather than a setback. I decided to take a six-month break to volunteer full-time with Paw Rescue, and that temporary break has turned into a new career.</p>
        
        <h3>Finding Purpose in Animal Welfare</h3>
        
        <p>My first month as a volunteer was eye-opening. I assisted the veterinary team with everything from holding animals during examinations to administering medications. I learned about wound care, vaccination protocols, and how to safely handle frightened animals.</p>
        
        <p>What struck me most was how much these animals responded to consistent care and kindness. Dogs who arrived frightened and aggressive would transform within weeks into trusting, affectionate companions.</p>
        
        <h3>A New Career Path</h3>
        
        <p>Three months into my volunteer work, Paw Rescue offered me a position as their Operations Manager. My background in finance and organization was exactly what they needed to scale their impact.</p>
        
        <p>Now I help coordinate rescue missions, manage the volunteer program, and ensure our resources are being used efficiently. My corporate skills have found a new purpose, and I've never been more fulfilled.</p>
        
        <p>If you're feeling stuck in your current career, consider how your skills might translate to the non-profit sector. Animal welfare organizations need more than just veterinary expertise—they need people with backgrounds in management, marketing, finance, and technology.</p>
        
        <p>Your expertise could be the missing piece that helps an organization like Paw Rescue reach its full potential.</p>`,
        slug: "from-corporate-life-to-animal-rescue",
        featured: false
      },
      {
        title: "A Family's Experience Fostering Kittens",
        authorName: "Emma and Tom Wilson",
        date: new Date("2023-11-10"),
        image: "https://images.unsplash.com/photo-1570824104453-508955ab713e?q=80&w=2011&auto=format&fit=crop",
        excerpt: "Our family decided to foster kittens together, and it became an incredible learning experience for our children.",
        content: `<p>When our children, aged 8 and 10, started asking for pets, my husband and I wanted to make sure they understood the responsibility involved. Rather than immediately adopting, we decided to become a foster family for Paw Rescue.</p>
        
        <h3>Our First Foster Litter</h3>
        
        <p>Our first assignment was a litter of four kittens, just 5 weeks old, who had been found without their mother. They needed to be bottle-fed every few hours, which became a family effort that we all took turns with.</p>
        
        <p>The children learned to prepare formula, feed the tiny kittens, and even help with the stimulation needed for the kittens to go to the bathroom. It was a 24/7 commitment that taught them more about responsibility than any lecture could have.</p>
        
        <h3>Growth and Development</h3>
        
        <p>Over the next few weeks, we watched the kittens grow from helpless little creatures to playful, curious felines. Each had a distinct personality that emerged, and the children became expert observers of feline behavior.</p>
        
        <p>Our son, who had been struggling with confidence issues at school, found that he had a special touch with the most shy kitten. Watching him patiently earn the kitten's trust was remarkable—and that confidence has translated to other areas of his life.</p>
        
        <h3>The Bittersweet Farewell</h3>
        
        <p>The hardest part, of course, was saying goodbye when the kittens were ready for adoption. There were tears, but also pride in knowing we had given these animals the best possible start in life.</p>
        
        <p>We've since fostered three more litters, and while it's never easy to say goodbye, the children now understand that this is how we can help the most animals. They've learned about the pet overpopulation problem and have become advocates for spaying and neutering.</p>
        
        <p>Fostering has become a core part of our family identity, and we can't imagine life without a temporary litter of kittens or puppies to care for. If you're considering fostering, know that it will change your life in the most wonderful ways.</p>`,
        slug: "a-familys-experience-fostering-kittens",
        featured: false
      },
      {
        title: "Volunteering as a Vet Student",
        authorName: "Michael Rodriguez",
        date: new Date("2023-10-12"),
        image: "https://images.unsplash.com/photo-1607923432780-7a9c30adcb72?q=80&w=1964&auto=format&fit=crop",
        excerpt: "My experience volunteering with Paw Rescue as a veterinary student has been invaluable for my professional development.",
        content: `<p>As a third-year veterinary student, I was looking for hands-on experience that would complement my academic studies. Joining Paw Rescue as a volunteer has provided that and so much more.</p>
        
        <h3>Practical Application of Classroom Knowledge</h3>
        
        <p>Working alongside experienced veterinarians at Paw Rescue has allowed me to apply concepts from my classes in real-world situations. From basic physical examinations to assisting with surgeries, I've had opportunities that would be difficult to find elsewhere.</p>
        
        <p>One of the most valuable aspects has been learning to work with limited resources. In veterinary school, we often practice in well-equipped labs with all the latest technology. At Paw Rescue, I've learned to be resourceful and make the most of what's available.</p>
        
        <h3>Developing Clinical Judgment</h3>
        
        <p>Perhaps the most important skill I've developed through volunteering is clinical judgment. Working with street animals means dealing with complex cases that don't always present textbook symptoms.</p>
        
        <p>I've learned to observe subtle signs that an animal isn't feeling well, to prioritize issues when multiple problems are present, and to consider the whole animal—not just the immediate complaint—when developing treatment plans.</p>
        
        <h3>The Human Element</h3>
        
        <p>Veterinary school prepares you well for treating animals, but less so for working with their human caregivers. At Paw Rescue, I've improved my communication skills by explaining medical concepts to volunteers and community members with varying levels of animal health knowledge.</p>
        
        <p>I've also witnessed the incredible bond that can form between humans and animals, even in the most challenging circumstances. This has reinforced my belief in the importance of the work we do.</p>
        
        <p>For fellow veterinary students considering volunteer work, I would say it's one of the best decisions you can make for your professional development. The experience you'll gain and the connections you'll form will serve you throughout your career.</p>`,
        slug: "volunteering-as-a-vet-student",
        featured: false
      },
      {
        title: "Senior Volunteers Making a Difference",
        authorName: "Robert and Linda Thompson",
        date: new Date("2023-09-18"),
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop",
        excerpt: "As retirees, we found a new purpose in volunteering with Paw Rescue and have been making a significant impact.",
        content: `<p>When my wife Linda and I retired three years ago, we were looking forward to relaxation and travel. However, we quickly found ourselves missing the sense of purpose that came with our careers. Volunteering with Paw Rescue has filled that void beautifully.</p>
        
        <h3>Finding Our Niche</h3>
        
        <p>At first, we weren't sure how we could contribute. Neither of us had backgrounds in veterinary medicine or animal care. But we soon discovered that Paw Rescue needed help in many areas.</p>
        
        <p>Linda, who had worked in office administration, took over scheduling and coordinating the volunteer roster. I put my carpentry skills to use building and repairing kennels and cat towers. We both help with socialization—spending time with animals who need to build trust with humans.</p>
        
        <h3>The Benefits of Senior Volunteering</h3>
        
        <p>Volunteering in our retirement years has brought us numerous benefits. We've stayed physically active, made new friends across generations, and kept our minds engaged with new challenges.</p>
        
        <p>Research shows that seniors who volunteer regularly tend to have better physical and mental health outcomes, and we can certainly attest to that. On days when my arthritis is acting up, spending time with the animals seems to be the best medicine.</p>
        
        <h3>Sharing Life Experience</h3>
        
        <p>One unexpected joy has been mentoring younger volunteers. Many are just starting their careers or figuring out their life paths, and they often seek our advice. We've had meaningful conversations while cleaning kennels or walking dogs together.</p>
        
        <p>Similarly, we've learned so much from the younger generation—from tech tips to new perspectives on animal welfare issues. It's a wonderful exchange that keeps us connected to the broader community.</p>
        
        <p>If you're a senior considering volunteer work, we highly recommend finding an animal welfare organization in your area. The animals don't care about your age—they only care about your kindness and consistency. And you'll find, as we have, that you have more to offer than you might have realized.</p>`,
        slug: "senior-volunteers-making-a-difference",
        featured: false
      }
    ];
    
    // Check if stories already exist
    const existingStoriesCount = await prisma.volunteerStory.count();
    
    if (existingStoriesCount > 0) {
      return NextResponse.json({
        message: `Seed skipped. ${existingStoriesCount} volunteer stories already exist in the database.`
      });
    }
    
    // Create the stories
    const result = await Promise.all(
      sampleStories.map(story => 
        prisma.volunteerStory.create({
          data: story
        })
      )
    );
    
    console.log(`Created ${result.length} volunteer stories`);
    
    return NextResponse.json({
      message: `Successfully seeded ${result.length} volunteer stories`,
      stories: result
    });
  } catch (error) {
    console.error("Error seeding volunteer stories:", error);
    return NextResponse.json(
      { error: "Failed to seed volunteer stories", details: error.message },
      { status: 500 }
    );
  }
} 