import { prisma } from "@/lib/prisma";

type RecommendationReason = {
  category: "title" | "skills" | "location" | "remote";
  message: string;
  points: number;
};

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function tokenize(value: string | null | undefined): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

function titleMatchScore(jobTitle: string, targetTitles: string[]) {
  const normalizedJobTitle = normalize(jobTitle);

  for (const target of targetTitles) {
    const normalizedTarget = normalize(target);

    if (normalizedJobTitle === normalizedTarget) {
      return { score: 40, reason: `Exact title match with "${target}"` };
    }

    if (
      normalizedJobTitle.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedJobTitle)
    ) {
      return { score: 32, reason: `Strong title match with "${target}"` };
    }

    const jobTokens = new Set(tokenize(jobTitle));
    const targetTokens = tokenize(target);
    const overlap = targetTokens.filter((token) => jobTokens.has(token)).length;

    if (targetTokens.length > 0) {
      const ratio = overlap / targetTokens.length;
      if (ratio >= 0.6) {
        return { score: 24, reason: `Partial title overlap with "${target}"` };
      }
    }
  }

  return { score: 0, reason: null as string | null };
}

function skillsMatchScore(jobText: string, skills: string[]) {
  const haystack = normalize(jobText);

  const matchedSkills = skills.filter((skill) =>
    haystack.includes(normalize(skill))
  );

  if (skills.length === 0) {
    return {
      score: 0,
      reason: null as string | null,
      matchedSkills: [] as string[],
    };
  }

  const ratio = matchedSkills.length / skills.length;
  const score = Math.min(35, Math.round(ratio * 35));

  return {
    score,
    reason:
      matchedSkills.length > 0
        ? `${matchedSkills.length} matching skill${matchedSkills.length === 1 ? "" : "s"}`
        : null,
    matchedSkills,
  };
}

function locationMatchScore(
  jobLocation: string | null,
  preferredLocations: string[],
  isRemote: boolean,
  wantsRemote: boolean
) {
  const normalizedLocation = normalize(jobLocation);

  if (isRemote && wantsRemote) {
    return { score: 15, reason: "Matches remote-friendly search preference" };
  }

  for (const location of preferredLocations) {
    const normalizedPreferred = normalize(location);

    if (
      normalizedLocation &&
      (normalizedLocation.includes(normalizedPreferred) ||
        normalizedPreferred.includes(normalizedLocation))
    ) {
      return { score: 15, reason: `Location aligns with "${location}"` };
    }
  }

  return { score: 0, reason: null as string | null };
}

function remotePreferenceScore(isRemote: boolean, wantsRemote: boolean) {
  if (isRemote && wantsRemote) {
    return { score: 10, reason: "Remote preference matched" };
  }

  return { score: 0, reason: null as string | null };
}

export async function generateRecommendations(profileId: number) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const [titleRows, locationRows, skillRows, jobs] = await Promise.all([
    prisma.profileTargetTitle.findMany({ orderBy: { value: "asc" } }),
    prisma.profileLocation.findMany({ orderBy: { value: "asc" } }),
    prisma.profileSkill.findMany({ orderBy: { value: "asc" } }),
    prisma.jobPosting.findMany({
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      take: 500,
    }),
  ]);

  const targetTitles = titleRows.map((t) => t.value);
  const preferredLocations = locationRows.map((l) => l.value);
  const skills = skillRows.map((s) => s.value);
  const wantsRemote = profile.remoteOnly;

  const recommendations = jobs
    .map((job) => {
      const reasons: RecommendationReason[] = [];

      const title = titleMatchScore(job.title, targetTitles);
      if (title.reason) {
        reasons.push({
          category: "title",
          message: title.reason,
          points: title.score,
        });
      }

      const skillsResult = skillsMatchScore(
        `${job.title} ${job.description ?? ""}`,
        skills
      );
      if (skillsResult.reason) {
        reasons.push({
          category: "skills",
          message: `${skillsResult.reason}: ${skillsResult.matchedSkills.join(", ")}`,
          points: skillsResult.score,
        });
      }

      const location = locationMatchScore(
        job.location,
        preferredLocations,
        job.isRemote,
        wantsRemote
      );
      if (location.reason) {
        reasons.push({
          category: "location",
          message: location.reason,
          points: location.score,
        });
      }

      const remote = remotePreferenceScore(job.isRemote, wantsRemote);
      if (remote.reason) {
        reasons.push({
          category: "remote",
          message: remote.reason,
          points: remote.score,
        });
      }

      const totalScore = reasons.reduce((sum, r) => sum + r.points, 0);

      return {
        job,
        score: totalScore,
        reasons,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);

  await prisma.$transaction(async (tx) => {
    await tx.jobRecommendation.deleteMany({
      where: { profileId },
    });

    for (const entry of recommendations) {
      await tx.jobRecommendation.create({
        data: {
          profileId,
          jobPostingId: entry.job.id,
          score: entry.score,
          reasons: entry.reasons,
        },
      });
    }
  });

  return recommendations;
}