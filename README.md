# Eharvester Seed

Eharvester Seed is an early-stage job discovery and recommendation engine that ingests publicly accessible ATS job feeds and ranks jobs against a user profile.

## Features

- Public job sync from supported ATS sources
- Profile-based recommendation scoring
- Search path dashboard
- Next.js + Prisma + SQLite MVP

## Supported public sources

- Greenhouse
- Lever
- Ashby

## Local setup

```bash
npm install
npx prisma db push --force-reset
npx prisma generate
npx prisma db seed
npm run dev