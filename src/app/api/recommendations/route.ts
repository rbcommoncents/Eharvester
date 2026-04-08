import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const profile = await prisma.profile.findFirst({
    orderBy: { id: "asc" },
  });

  if (!profile) {
    return NextResponse.json([]);
  }

  const recommendations = await prisma.jobRecommendation.findMany({
    where: { profileId: profile.id },
    include: {
      jobPosting: true,
    },
    orderBy: {
      score: "desc",
    },
    take: 25,
  });

  return NextResponse.json(recommendations);
}