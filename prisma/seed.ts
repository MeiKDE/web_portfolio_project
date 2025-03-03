// prisma/seed.ts test data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      title: 'Full Stack Developer',
      location: 'San Francisco, CA',
      bio: 'Passionate developer with 5+ years of experience building web applications.',
      skills: {
        create: [
          { name: 'JavaScript', category: 'Frontend', proficiencyLevel: 5 },
          { name: 'React', category: 'Frontend', proficiencyLevel: 4 },
          { name: 'Node.js', category: 'Backend', proficiencyLevel: 4 },
        ],
      },
      experiences: {
        create: [
          {
            position: 'Senior Developer',
            company: 'Tech Company',
            startDate: new Date('2020-01-01'),
            description: 'Led development of the company flagship product.',
            isCurrentPosition: true,
          },
        ],
      },
    },
  });
  console.log('Created test user:', user.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


