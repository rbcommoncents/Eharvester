import type { NormalizedJob } from "../types";
import { buildExternalId, inferRemote, safeDate, stripHtml } from "../utils";

type AshbyPosting = {
  id?: string;
  title?: string;
  location?: string | null;
  employmentType?: string | null;
  workplaceType?: string | null;
  descriptionHtml?: string | null;
  descriptionPlain?: string | null;
  applyUrl?: string;
  publishedDate?: string | null;
};

type AshbyResponse = {
  jobPostings?: AshbyPosting[];
};

export async function fetchAshbyJobs(companyKey: string): Promise<NormalizedJob[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(
    companyKey
  )}`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Ashby fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as AshbyResponse;
  const jobs = data.jobPostings ?? [];

  return jobs
    .filter((job) => job.id && job.title && job.applyUrl)
    .map((job) => {
      const description =
        job.descriptionPlain ?? stripHtml(job.descriptionHtml) ?? null;
      const location = job.location ?? job.workplaceType ?? null;

      return {
        externalId: buildExternalId([
          "ashby",
          companyKey,
          String(job.id),
          String(job.applyUrl),
        ]),
        title: String(job.title),
        company: companyKey,
        location,
        description,
        applyUrl: String(job.applyUrl),
        source: "Ashby",
        sourceType: "ashby",
        sourceKey: companyKey,
        sourceJobId: String(job.id),
        isRemote: inferRemote(String(job.title), location, description),
        postedAt: safeDate(job.publishedDate),
      };
    });
}