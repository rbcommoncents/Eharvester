import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.jobRecommendation.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.jobSource.deleteMany();
  await prisma.profileSkill.deleteMany();
  await prisma.profileLocation.deleteMany();
  await prisma.profileTargetTitle.deleteMany();
  await prisma.profileCertification.deleteMany();
  await prisma.profilePreferredSource.deleteMany();
  await prisma.profileExcludedSource.deleteMany();
  await prisma.application.deleteMany();
  await prisma.profile.deleteMany();

  await prisma.profile.create({
    data: {
      fullName: "Sample User",
      headline: "Cloud Security Analyst",
      remoteOnly: true,
      salaryTarget: "100000+",
      yearsExperience: "3+",
      notes: "Seeded profile for recommendation testing",
    },
  });

  await prisma.profileTargetTitle.createMany({
    data: [
      { value: "Cloud Security Analyst" },
      { value: "Security Analyst" },
      { value: "Vulnerability Manager" },
    ],
  });

  await prisma.profileLocation.createMany({
    data: [
      { value: "Remote" },
      { value: "Philadelphia, PA" },
      { value: "Wilmington, DE" },
    ],
  });

  await prisma.profileSkill.createMany({
    data: [
      { value: "Python" },
      { value: "SIEM" },
      { value: "AWS" },
      { value: "Incident Response" },
      { value: "Detection Engineering" },
    ],
  });

  await prisma.jobSource.createMany({
    data: [
      {
        name: "Greenhouse Demo",
        sourceType: "greenhouse",
        companyKey: "stripe",
        baseUrl: "https://boards.greenhouse.io/stripe",
        enabled: true,
      },
      {
        name: "Lever Demo",
        sourceType: "lever",
        companyKey: "netlify",
        baseUrl: "https://jobs.lever.co/netlify",
        enabled: true,
      },
      {
        name: "Ashby Demo",
        sourceType: "ashby",
        companyKey: "notion",
        baseUrl: "https://jobs.ashbyhq.com/notion",
        enabled: true,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });