"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function resetApplications() {
  await prisma.application.deleteMany({});
  redirect("/applications");
}