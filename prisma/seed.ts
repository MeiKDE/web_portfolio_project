// prisma/seed.ts test data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, delete existing data to avoid duplicates
  await prisma.aISuggestion.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a new user with all associated data
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      title: 'Full Stack Developer',
      location: 'San Francisco, CA',
      bio: 'Passionate developer with 5+ years of experience building web applications with modern technologies.',
      profileImageUrl: '/placeholder.svg?height=128&width=128',
      aiGeneratedTagline: 'Innovative full-stack developer transforming ideas into scalable digital solutions',
      
      // Create skills
      skills: {
        create: [
          { name: 'JavaScript', category: 'Frontend', proficiencyLevel: 5 },
          { name: 'TypeScript', category: 'Frontend', proficiencyLevel: 4 },
          { name: 'React', category: 'Frontend', proficiencyLevel: 5 },
          { name: 'Next.js', category: 'Frontend', proficiencyLevel: 4 },
          { name: 'Node.js', category: 'Backend', proficiencyLevel: 4 },
          { name: 'Express', category: 'Backend', proficiencyLevel: 4 },
          { name: 'PostgreSQL', category: 'Database', proficiencyLevel: 3 },
          { name: 'MongoDB', category: 'Database', proficiencyLevel: 4 },
          { name: 'AWS', category: 'DevOps', proficiencyLevel: 3 },
          { name: 'Docker', category: 'DevOps', proficiencyLevel: 3 },
        ],
      },
      
      // Create experiences
      experiences: {
        create: [
          {
            position: 'Senior Full Stack Developer',
            company: 'TechCorp Inc.',
            companyLogoUrl: '/placeholder.svg?height=48&width=48',
            startDate: new Date('2020-01-01'),
            description: 'Led development of the company\'s flagship SaaS platform, improving performance by 40% and reducing infrastructure costs.',
            isCurrentPosition: true,
          },
          {
            position: 'Full Stack Developer',
            company: 'InnoSoft Solutions',
            companyLogoUrl: '/placeholder.svg?height=48&width=48',
            startDate: new Date('2017-03-01'),
            endDate: new Date('2019-12-31'),
            description: 'Developed and maintained multiple client web applications using React, Node.js, and AWS.',
            isCurrentPosition: false,
          },
        ],
      },
      
      // Create education
      education: {
        create: [
          {
            institution: 'Stanford University',
            institutionLogoUrl: '/placeholder.svg?height=48&width=48',
            degree: 'Master of Science',
            fieldOfStudy: 'Computer Science',
            startYear: 2015,
            endYear: 2017,
            description: 'Specialized in Artificial Intelligence and Machine Learning',
          },
          {
            institution: 'University of California, Berkeley',
            institutionLogoUrl: '/placeholder.svg?height=48&width=48',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Engineering',
            startYear: 2011,
            endYear: 2015,
            description: 'Graduated with honors, GPA 3.8/4.0',
          },
        ],
      },
      
      // Create certifications
      certifications: {
        create: [
          {
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: new Date('2022-01-15'),
            expirationDate: new Date('2025-01-15'),
            credentialUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
          },
          {
            name: 'Google Cloud Professional Developer',
            issuer: 'Google',
            issueDate: new Date('2021-03-10'),
            expirationDate: new Date('2024-03-10'),
            credentialUrl: 'https://cloud.google.com/certification/cloud-developer',
          },
        ],
      },
      
      // Create projects
      projects: {
        create: [
          {
            title: 'E-commerce Platform',
            description: 'A complete e-commerce solution with payment processing and inventory management.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            category: 'Full Stack',
            imageUrl: '/placeholder.svg?height=200&width=300',
            projectUrl: 'https://example-ecommerce.com',
            githubUrl: 'https://github.com/johndoe/ecommerce',
          },
          {
            title: 'Real-time Analytics Dashboard',
            description: 'Interactive dashboard for visualizing real-time data streams.',
            technologies: ['React', 'D3.js', 'WebSockets', 'Node.js'],
            category: 'Frontend',
            imageUrl: '/placeholder.svg?height=200&width=300',
            projectUrl: 'https://example-dashboard.com',
            githubUrl: 'https://github.com/johndoe/dashboard',
          },
          {
            title: 'API Gateway Service',
            description: 'Microservice gateway with rate limiting and caching capabilities.',
            technologies: ['Node.js', 'Express', 'Redis', 'Docker'],
            category: 'Backend',
            imageUrl: '/placeholder.svg?height=200&width=300',
            projectUrl: 'https://example-api-gateway.com',
            githubUrl: 'https://github.com/johndoe/api-gateway',
          },
        ],
      },
      
      // Create social links
      socialLinks: {
        create: [
          {
            platform: 'GitHub',
            url: 'https://github.com/johndoe',
            username: 'johndoe',
          },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/johndoe',
            username: 'johndoe',
          },
          {
            platform: 'Twitter',
            url: 'https://twitter.com/johndoe',
            username: 'johndoe',
          },
          {
            platform: 'Website',
            url: 'https://johndoe.dev',
            username: null,
          },
        ],
      },
      
      // Create AI suggestions
      aiSuggestions: {
        create: [
          {
            targetType: 'experience',
            targetId: null,
            suggestion: 'Replace "Led development" with a stronger action verb like "Spearheaded" or "Architected" to showcase leadership.',
            status: 'pending',
          },
          {
            targetType: 'skill',
            targetId: null,
            suggestion: 'Consider adding "Next.js" to your skills based on your experience. It\'s a popular framework that would complement your React expertise.',
            status: 'pending',
          },
          {
            targetType: 'project',
            targetId: null,
            suggestion: 'Based on your skills, consider adding a GraphQL project to showcase your expertise in this technology.',
            status: 'pending',
          },
        ],
      },
    },
  });
  
  console.log('Created test user with ID:', user.id);
  console.log('User profile created with all associated data.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


