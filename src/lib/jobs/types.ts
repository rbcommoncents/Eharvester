export type JobSourceType = "greenhouse" | "lever" | "ashby";

export type NormalizedJob = {
  externalId: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  applyUrl: string;
  source: string;
  sourceType: JobSourceType;
  sourceKey: string;
  sourceJobId: string;
  isRemote: boolean;
  postedAt: Date | null;
};

export type SyncRunResult = {
  sourceId: number;
  sourceName: string;
  sourceType: string;
  companyKey: string;
  imported: number;
  status: "success" | "error";
  error?: string;
};