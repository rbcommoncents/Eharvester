# Eharvester Seed

Eharvester Seed is an early-stage, open-source job discovery and recommendation engine that ingests publicly accessible ATS job feeds and ranks roles against a user profile using transparent scoring logic.

## Features

- Public job sync from supported ATS sources
- Profile-based recommendation scoring
- Search path dashboard for titles, locations, and skills
- Built with Next.js, Prisma, and SQLite

## Supported Public Sources

- Greenhouse
- Lever
- Ashby

## Customize the Starter Profile

Before running the seed command, you can edit `prisma/seed.ts` to better match your own search path.

You can update fields such as:

- `fullName`
- `headline`
- `remoteOnly`
- `salaryTarget`
- `yearsExperience`
- target titles
- preferred locations
- skills
- public job source keys

Then run:

npx prisma db seed

# local setup

npm install
npx prisma db push --force-reset
npx prisma generate
npx prisma db seed
npm run dev