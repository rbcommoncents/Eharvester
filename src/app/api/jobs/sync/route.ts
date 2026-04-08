import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncEnabledJobSources } from "@/lib/jobs/run-sync";
import { generateRecommendations } from "@/lib/recommendations";

export async function POST() {
  try {
    const syncResults = await syncEnabledJobSources();

    const profile = await prisma.profile.findFirst({
      orderBy: { createdAt: "asc" },
    });

    let recommendationCount = 0;

    if (profile) {
      const results = await generateRecommendations(profile.id);
      recommendationCount = results.length;
    }

    return NextResponse.json({
      success: true,
      syncResults,
      recommendationCount,
    });
  } catch (error) {
    console.error("Job sync failed:", error);

    return NextResponse.json(
      { error: "Job sync failed." },
      { status: 500 }
    );
  }
}