"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function saveProfile(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const targetJobTitles = String(formData.get("targetJobTitles") ?? "").trim();
  const preferredLocations = String(formData.get("preferredLocations") ?? "").trim();
  const remoteOnly = formData.get("remoteOnly") === "on";
  const employmentTypes = String(formData.get("employmentTypes") ?? "").trim();
  const preferredIndustries = String(formData.get("preferredIndustries") ?? "").trim();
  const salaryTarget = String(formData.get("salaryTarget") ?? "").trim();
  const yearsExperience = String(formData.get("yearsExperience") ?? "").trim();
  const keySkills = String(formData.get("keySkills") ?? "").trim();
  const certifications = String(formData.get("certifications") ?? "").trim();
  const preferredSources = String(formData.get("preferredSources") ?? "").trim();
  const excludedSources = String(formData.get("excludedSources") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const existing = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (existing) {
    await prisma.profile.update({
      where: { id: existing.id },
      data: {
        fullName: fullName || null,
        headline: headline || null,
        targetJobTitles: targetJobTitles || null,
        preferredLocations: preferredLocations || null,
        remoteOnly,
        employmentTypes: employmentTypes || null,
        preferredIndustries: preferredIndustries || null,
        salaryTarget: salaryTarget || null,
        yearsExperience: yearsExperience || null,
        keySkills: keySkills || null,
        certifications: certifications || null,
        preferredSources: preferredSources || null,
        excludedSources: excludedSources || null,
        notes: notes || null,
      },
    });
  } else {
    await prisma.profile.create({
      data: {
        fullName: fullName || null,
        headline: headline || null,
        targetJobTitles: targetJobTitles || null,
        preferredLocations: preferredLocations || null,
        remoteOnly,
        employmentTypes: employmentTypes || null,
        preferredIndustries: preferredIndustries || null,
        salaryTarget: salaryTarget || null,
        yearsExperience: yearsExperience || null,
        keySkills: keySkills || null,
        certifications: certifications || null,
        preferredSources: preferredSources || null,
        excludedSources: excludedSources || null,
        notes: notes || null,
      },
    });
  }

  redirect("/profile");
}