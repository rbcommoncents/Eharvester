import type { NormalizedJob } from "../types";
import { buildExternalId, inferRemote, safeDate, stripHtml } from "../utils";

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  location?: { name?: string | null };
  content?: string | null;
};

type GreenhouseResponse = {
  jobs?: GreenhouseJob[];
};

export async function fetchGreenhouseJobs(companyKey: string): Promise<NormalizedJob[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(
    companyKey
  )}/jobs?content=true`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Greenhouse fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as GreenhouseResponse;
  const jobs = data.jobs ?? [];

  return jobs.map((job) => {
    const description = stripHtml(job.content);
    const location = job.location?.name ?? null;

    return {
      externalId: buildExternalId([
        "greenhouse",
        companyKey,
        String(job.id),
        job.absolute_url,
      ]),
      title: job.title,
      company: companyKey,
      location,
      description,
      applyUrl: job.absolute_url,
      source: "Greenhouse",
      sourceType: "greenhouse",
      sourceKey: companyKey,
      sourceJobId: String(job.id),
      isRemote: inferRemote(job.title, location, description),
      postedAt: safeDate(job.updated_at),
    };
  });
}