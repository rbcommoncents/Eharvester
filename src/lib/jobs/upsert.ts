import { prisma } from "@/lib/prisma";

export type NormalizedJob = {
  externalId: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  applyUrl: string;
  source: string;
  sourceType: string;
  sourceKey: string;
  sourceJobId: string;
  isRemote: boolean;
  postedAt: Date | null;
};

export async function upsertJobs(jobs: NormalizedJob[]) {
  for (const job of jobs) {
    await prisma.jobPosting.upsert({
      where: { externalId: job.externalId },
      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        applyUrl: job.applyUrl,
        source: job.source,
        sourceType: job.sourceType,
        sourceKey: job.sourceKey,
        sourceJobId: job.sourceJobId,
        isRemote: job.isRemote,
        postedAt: job.postedAt,
        importedAt: new Date(),
      },
      create: {
        externalId: job.externalId,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        applyUrl: job.applyUrl,
        source: job.source,
        sourceType: job.sourceType,
        sourceKey: job.sourceKey,
        sourceJobId: job.sourceJobId,
        isRemote: job.isRemote,
        postedAt: job.postedAt,
        importedAt: new Date(),
      },
    });
  }
}