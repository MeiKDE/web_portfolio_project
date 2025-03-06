## problem setting up prisma

1. Need to ensure $DATABASE_URL is set correctly in the .env file.
2. echo $DATABASE_URL path should match to .env file, ex: postgresql://mei:mei@localhost:5432/profile_db?schema=public
3. prisma.user user needs to be lowercase in the route.ts file

### To run the seed file, run the following command:

npx tsc prisma/seed.ts
mv prisma/seed.js prisma/seed.cjs
node prisma/seed.cjs

### To run the prisma studio, run the following command:

npx prisma studio

### To override the remote branch, run the following command:

git push --force-with-lease
