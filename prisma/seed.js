const { PrismaClient, AnimalStatus, Role, ReferralSource } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'volunteer@example.com' },
    update: {},
    create: {
      email: 'volunteer@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Test',
      lastName: 'Volunteer',
      phone: '1234567890',
      about: 'I am a test volunteer',
      referral: ReferralSource.social_media,
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      role: Role.VOLUNTEER,
    },
  });

  console.log('Created test user:', testUser.email);

  // Add some test animals
  const animals = [
    {
      name: 'Max',
      species: 'Dog',
      breed: 'Labrador',
      vaccinated: true,
      neutered: true,
      status: AnimalStatus.ADOPTION,
      image: 'https://images.unsplash.com/photo-1583511655826-05700442b0b3?q=80&w=1000',
      createdById: testUser.id,
    },
    {
      name: 'Bella',
      species: 'Dog',
      breed: 'German Shepherd',
      vaccinated: true,
      neutered: false,
      status: AnimalStatus.FOSTER,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000',
      createdById: testUser.id,
    },
    {
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Maine Coon',
      vaccinated: true,
      neutered: true,
      status: AnimalStatus.ADOPTION,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000',
      createdById: testUser.id,
    },
    {
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      vaccinated: false,
      neutered: false,
      status: AnimalStatus.FOSTER,
      image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000',
      createdById: testUser.id,
    },
    {
      name: 'Bunny',
      species: 'Rabbit',
      breed: 'Holland Lop',
      vaccinated: true,
      neutered: false,
      status: AnimalStatus.ADOPTION,
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1000',
      createdById: testUser.id,
    },
  ];

  for (const animal of animals) {
    await prisma.animal.upsert({
      where: { 
        // Create a composite key for upsert
        id: animal.name.toLowerCase().replace(/\s+/g, '-') + '-' + animal.species.toLowerCase(),
      },
      update: animal,
      create: {
        ...animal,
        id: animal.name.toLowerCase().replace(/\s+/g, '-') + '-' + animal.species.toLowerCase(),
      },
    }).catch(e => {
      // If the id-based upsert fails, create a new record
      return prisma.animal.create({
        data: animal,
      });
    });
  }

  console.log(`Created ${animals.length} test animals`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 