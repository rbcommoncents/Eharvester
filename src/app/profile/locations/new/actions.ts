"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createLocation(formData: FormData) {
  const value = String(formData.get("value") ?? "").trim();

  if (!value) {
    throw new Error("Location is required.");
  }

  await prisma.profileLocation.upsert({
    where: { value },
    update: {},
    create: { value },
  });

  redirect("/profile");
}