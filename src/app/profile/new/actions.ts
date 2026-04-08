"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProfile(formData: FormData) {
  const existing = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (existing) {
    redirect("/profile/edit");
  }

  await prisma.profile.create({
    data: {
      fullName: String(formData.get("fullName") ?? "").trim() || null,
      headline: String(formData.get("headline") ?? "").trim() || null,
      remoteOnly: formData.get("remoteOnly") === "on",
      salaryTarget: String(formData.get("salaryTarget") ?? "").trim() || null,
      yearsExperience:
        String(formData.get("yearsExperience") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  });

  redirect("/profile");
}