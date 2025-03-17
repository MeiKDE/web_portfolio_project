## problem setting up prisma

1. Need to ensure $DATABASE_URL is set correctly in the .env file.
2. echo $DATABASE_URL path should match to .env file, ex: postgresql://mei:mei@localhost:5432/profile_db?schema=public
3. prisma.user user needs to be lowercase in the route.ts file

### 1 how to apply schema changes

npx prisma migrate reset --force --skip-seed

### 2 run the Prisma migrations to create the tables

npx prisma migrate dev
or
npx prisma migrate dev --name add_profile_email

### Apply the migration:

npx prisma generate

### 3. To run the seed file, run the following command:

npx tsc prisma/seed.ts
mv prisma/seed.js prisma/seed.cjs
node prisma/seed.cjs

note: avoid importing modules from seed.ts to avoid errors

### To run the prisma studio, run the following command:

npx prisma studio

### To override the remote branch, run the following command:

git push --force-with-lease

## PostgreSQL

### start postgresql service

brew services start postgresql

### create a new database

createdb profile_db

### connect to the database

psql -d profile_db

### 1. Run Prisma Validation Commands

### The most direct way to validate your schema is to run Prisma's validation commands:

npx prisma validate

### 2. Generate Prisma Client

### When you generate the Prisma client, it will also validate your schema:

npx prisma generate
