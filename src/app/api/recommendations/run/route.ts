import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateRecommendations } from "@/lib/recommendations";

export async function POST() {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!profile) {
    redirect("/");
  }

  await generateRecommendations(profile.id);

  redirect("/");
}