import type { NormalizedJob } from "../types";
import {
  buildExternalId,
  inferRemote,
  joinLocation,
  safeDate,
  stripHtml,
} from "../utils";

type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  descriptionPlain?: string | null;
  description?: string | null;
  categories?: {
    team?: string | null;
    location?: string | null;
    commitment?: string | null;
    allLocations?: string[] | null;
  };
  createdAt?: number;
};

export async function fetchLeverJobs(companyKey: string): Promise<NormalizedJob[]> {
  const url = `https://api.lever.co/v0/postings/${encodeURIComponent(
    companyKey
  )}?mode=json`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Lever fetch failed: ${res.status}`);
  }

  const jobs = (await res.json()) as LeverPosting[];

  return jobs.map((job) => {
    const description = job.descriptionPlain ?? stripHtml(job.description) ?? null;
    const location = joinLocation([
      job.categories?.location ?? null,
      ...(job.categories?.allLocations ?? []),
    ]);

    return {
      externalId: buildExternalId([
        "lever",
        companyKey,
        job.id,
        job.hostedUrl,
      ]),
      title: job.text,
      company: companyKey,
      location,
      description,
      applyUrl: job.hostedUrl,
      source: "Lever",
      sourceType: "lever",
      sourceKey: companyKey,
      sourceJobId: job.id,
      isRemote: inferRemote(job.text, location, description),
      postedAt: job.createdAt ? safeDate(job.createdAt) : null,
    };
  });
}