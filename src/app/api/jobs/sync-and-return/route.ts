import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { syncEnabledJobSources } from "@/lib/jobs/run-sync";
import { generateRecommendations } from "@/lib/recommendations";

export async function POST() {
  const syncResults = await syncEnabledJobSources();
  console.log("syncResults:", syncResults);

  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (profile) {
    await generateRecommendations(profile.id);
  }

  redirect("/");
}