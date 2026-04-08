import { prisma } from "@/lib/prisma";
import { upsertJobs } from "./upsert";
import { fetchGreenhouseJobs } from "./sources/greenhouse";
import { fetchLeverJobs } from "./sources/lever";
import { fetchAshbyJobs } from "./sources/ashby";

async function fetchJobsForSource(sourceType: string, companyKey: string) {
  switch (sourceType) {
    case "greenhouse":
      return fetchGreenhouseJobs(companyKey);
    case "lever":
      return fetchLeverJobs(companyKey);
    case "ashby":
      return fetchAshbyJobs(companyKey);
    default:
      throw new Error(`Unsupported source type: ${sourceType}`);
  }
}

export async function syncEnabledJobSources() {
  const sources = await prisma.jobSource.findMany({
    where: { enabled: true },
    orderBy: [{ sourceType: "asc" }, { name: "asc" }],
  });

  console.log("Enabled job sources:", sources.length);

  const results = [];

  for (const source of sources) {
    try {
      console.log(`Running source ${source.sourceType}:${source.companyKey}`);

      const jobs = await fetchJobsForSource(source.sourceType, source.companyKey);

      console.log(`Fetched ${jobs.length} jobs from ${source.companyKey}`);

      await upsertJobs(jobs);

      await prisma.jobSource.update({
        where: { id: source.id },
        data: {
          lastRunAt: new Date(),
          lastStatus: "success",
          lastError: null,
        },
      });

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        imported: jobs.length,
        status: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown sync error";

      console.error(`Source failed ${source.companyKey}:`, message);

      await prisma.jobSource.update({
        where: { id: source.id },
        data: {
          lastRunAt: new Date(),
          lastStatus: "error",
          lastError: message,
        },
      });

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        imported: 0,
        status: "error",
        error: message,
      });
    }
  }

  return results;
}