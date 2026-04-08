"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createApplication(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const jobUrl = String(formData.get("jobUrl") ?? "").trim();
  const salary = String(formData.get("salary") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const status = String(formData.get("status") ?? "Applied").trim();
  const dateAppliedRaw = String(formData.get("dateApplied") ?? "").trim();

  if (!company || !jobTitle) {
    throw new Error("Company and job title are required.");
  }

  await prisma.application.create({
    data: {
      company,
      jobTitle,
      location: location || null,
      source: source || null,
      jobUrl: jobUrl || null,
      salary: salary || null,
      notes: notes || null,
      status,
      dateApplied: dateAppliedRaw ? new Date(dateAppliedRaw) : null,
    },
  });

  redirect("/applications");
}