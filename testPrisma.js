// testPrisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrisma() {
    try {
        // Fetch all users
        const users = await prisma.User.findMany();
        console.log('All users:', users);
        console.log("Database URL:", process.env.DATABASE_URL);
        // Fetch user by specific ID
        const userId = 'cm7rqjkb50000mwp1311qx6m9'; // Specify the user ID you want to fetch
        const user = await prisma.User.findUnique({
            where: { id: userId },
        });

        // Log the user data retrieved from the database
        console.log('User data retrieved for ID', userId, ':', user);

        if (!user) {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPrisma();