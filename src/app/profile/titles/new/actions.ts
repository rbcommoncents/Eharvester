"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createTargetTitle(formData: FormData) {
  const value = String(formData.get("value") ?? "").trim();

  if (!value) {
    throw new Error("Title is required.");
  }

  await prisma.profileTargetTitle.upsert({
    where: { value },
    update: {},
    create: { value },
  });

  redirect("/profile");
}