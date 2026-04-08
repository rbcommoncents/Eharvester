"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function saveProfile(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const remoteOnly = formData.get("remoteOnly") === "on";
  const salaryTarget = String(formData.get("salaryTarget") ?? "").trim();
  const yearsExperience = String(formData.get("yearsExperience") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const existing = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  const data = {
    fullName: fullName || null,
    headline: headline || null,
    remoteOnly,
    salaryTarget: salaryTarget || null,
    yearsExperience: yearsExperience || null,
    notes: notes || null,
  };

  if (existing) {
    await prisma.profile.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.profile.create({
      data,
    });
  }

  redirect("/profile");
}