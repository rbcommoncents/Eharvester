"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createSkill(formData: FormData) {
  const value = String(formData.get("value") ?? "").trim();

  if (!value) {
    throw new Error("Skill is required.");
  }

  await prisma.profileSkill.upsert({
    where: { value },
    update: {},
    create: { value },
  });

  redirect("/profile");
}