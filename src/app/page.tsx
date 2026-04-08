import Link from "next/link";
import { prisma } from "@/lib/prisma";

type RecommendationReasonView = {
  message?: string;
  points?: number;
  category?: string;
};

function toRecommendationReasons(value: unknown): RecommendationReasonView[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => {
      return typeof item === "object" && item !== null;
    })
    .map((item) => ({
      message: typeof item.message === "string" ? item.message : undefined,
      points: typeof item.points === "number" ? item.points : undefined,
      category: typeof item.category === "string" ? item.category : undefined,
    }));
}

export default async function HomePage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  const titles = await prisma.profileTargetTitle.findMany({
    orderBy: { value: "asc" },
  });

  const locations = await prisma.profileLocation.findMany({
    orderBy: { value: "asc" },
  });

  const skills = await prisma.profileSkill.findMany({
    orderBy: { value: "asc" },
  });

  const recommendationRows = profile
    ? await prisma.jobRecommendation.findMany({
        where: { profileId: profile.id },
        include: {
          jobPosting: true,
        },
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
        take: 10,
      })
    : [];

  const recommendations = recommendationRows.map((item) => ({
    id: item.id,
    score: item.score,
    reasons: toRecommendationReasons(item.reasons),
    jobPosting: {
      title: item.jobPosting.title,
      company: item.jobPosting.company,
      location: item.jobPosting.location,
      isRemote: item.jobPosting.isRemote,
      applyUrl: item.jobPosting.applyUrl,
    },
  }));

  const jobPostingCount = await prisma.jobPosting.count();
  const jobSourceCount = await prisma.jobSource.count({
    where: { enabled: true },
  });

  const total = applications.length;
  const saved = applications.filter((a) => a.status === "Saved").length;
  const applied = applications.filter((a) => a.status === "Applied").length;
  const interviewing = applications.filter((a) => a.status === "Interviewing").length;
  const offers = applications.filter((a) => a.status === "Offer").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  const recentApplications = applications.slice(0, 5);

  const profileReady =
    !!profile &&
    (titles.length > 0 || locations.length > 0 || skills.length > 0);

  const recommendationReadinessScore =
    (profile ? 30 : 0) +
    Math.min(titles.length * 15, 30) +
    Math.min(locations.length * 10, 20) +
    Math.min(skills.length * 4, 20);

  const recommendationCount = recommendations.length;

  return (
    <main className="min-h-screen bg-[#020817] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-400">
                Mission Control
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Job Recommendation Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-slate-300">
                Build your search path, automate public job ingestion, and generate
                more targeted job recommendations from your saved profile signals.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/applications/new"
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
              >
                Add Application
              </Link>
              <Link
                href="/profile"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-900"
              >
                Open Profile
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <DashboardCard title="Total" value={total} subtext="Tracked applications" />
          <DashboardCard title="Saved" value={saved} subtext="Not yet submitted" />
          <DashboardCard title="Applied" value={applied} subtext="Sent applications" />
          <DashboardCard title="Interviewing" value={interviewing} subtext="Active pipeline" />
          <DashboardCard title="Offers" value={offers} subtext="Positive outcomes" />
          <DashboardCard title="Rejected" value={rejected} subtext="Closed outcomes" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Recommendation Engine</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Current readiness for profile-based job recommendations.
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-slate-300">
                  {Math.min(recommendationReadinessScore, 100)}%
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: `${Math.min(recommendationReadinessScore, 100)}%` }}
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <StatusRow
                  label="Core profile"
                  ready={!!profile}
                  hint="Identity and preferences"
                />
                <StatusRow
                  label="Target titles"
                  ready={titles.length > 0}
                  hint={`${titles.length} loaded`}
                />
                <StatusRow
                  label="Preferred locations"
                  ready={locations.length > 0}
                  hint={`${locations.length} loaded`}
                />
                <StatusRow
                  label="Skills"
                  ready={skills.length > 0}
                  hint={`${skills.length} loaded`}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <form action="/api/jobs/sync-and-return" method="POST">
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500"
                  >
                    Sync Public Jobs
                  </button>
                </form>

                <form action="/api/recommendations/run" method="POST">
                  <button
                    type="submit"
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
                  >
                    Run Recommendation Engine
                  </button>
                </form>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                  {jobPostingCount} jobs loaded
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                  {jobSourceCount} public sources enabled
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                  {recommendationCount} recommendation{recommendationCount === 1 ? "" : "s"} ready
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <div>
                  <h2 className="text-xl font-semibold">Upcoming Recommendations</h2>
                  <p className="text-sm text-slate-400">
                    Ranked jobs based on current profile fit.
                  </p>
                </div>
              </div>

              <div className="p-6">
                {!profileReady ? (
                  <div className="rounded-xl border border-amber-700 bg-amber-950/30 p-4 text-amber-200">
                    Recommendations are waiting on profile signal. Add target
                    titles, locations, and skills to improve recommendation quality.
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-slate-300">
                    No recommendation records yet. Sync public jobs first, then run the engine.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((item) => (
                      <RecommendationCard
                        key={item.id}
                        title={item.jobPosting.title}
                        company={item.jobPosting.company}
                        location={item.jobPosting.location}
                        isRemote={item.jobPosting.isRemote}
                        score={item.score}
                        applyUrl={item.jobPosting.applyUrl}
                        reasons={item.reasons}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <div>
                  <h2 className="text-xl font-semibold">Recent Applications</h2>
                  <p className="text-sm text-slate-400">
                    Latest entries in your tracker.
                  </p>
                </div>

                <Link
                  href="/applications"
                  className="text-sm text-sky-400 hover:text-sky-300"
                >
                  View all
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/70 text-sm text-slate-300">
                    <tr>
                      <th className="px-6 py-3">Company</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-slate-400">
                          No applications yet.
                        </td>
                      </tr>
                    ) : (
                      recentApplications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-t border-slate-900 hover:bg-slate-900/40"
                        >
                          <td className="px-6 py-4">{app.company}</td>
                          <td className="px-6 py-4">{app.jobTitle}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ProfilePanel
              profile={profile}
              titles={titles.map((x) => x.value)}
              locations={locations.map((x) => x.value)}
              skills={skills.map((x) => x.value)}
            />

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <p className="mt-2 text-sm text-slate-400">
                Build the recommendation path step by step.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/profile/new"
                  className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-900"
                >
                  Create Core Profile
                </Link>
                <Link
                  href="/profile/titles/new"
                  className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-900"
                >
                  Add Target Title
                </Link>
                <Link
                  href="/profile/locations/new"
                  className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-900"
                >
                  Add Location
                </Link>
                <Link
                  href="/profile/skills/new"
                  className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-900"
                >
                  Add Skill
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
              <h2 className="text-xl font-semibold">Public Source Automation</h2>
              <p className="mt-2 text-sm text-slate-400">
                Enabled sources are synced from public posting APIs and then scored against your profile.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="rounded-lg bg-slate-900/60 px-4 py-3">
                  Greenhouse board token → public published jobs
                </li>
                <li className="rounded-lg bg-slate-900/60 px-4 py-3">
                  Lever company key → public postings feed
                </li>
                <li className="rounded-lg bg-slate-900/60 px-4 py-3">
                  Ashby job board key → public posting feed
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  subtext,
}: {
  title: string;
  value: number;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{subtext}</p>
    </div>
  );
}

function StatusRow({
  label,
  ready,
  hint,
}: {
  label: string;
  ready: boolean;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-200">{label}</span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            ready
              ? "bg-emerald-950 text-emerald-300"
              : "bg-amber-950 text-amber-300"
          }`}
        >
          {ready ? "Ready" : "Missing"}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

function RecommendationCard({
  title,
  company,
  location,
  isRemote,
  score,
  applyUrl,
  reasons,
}: {
  title: string;
  company: string;
  location: string | null;
  isRemote: boolean;
  score: number;
  applyUrl: string;
  reasons: RecommendationReasonView[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-slate-300">{company}</p>
          <p className="mt-1 text-xs text-slate-400">
            {location || "Location unknown"}
            {isRemote ? " • Remote" : ""}
          </p>
        </div>
        <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-xs text-emerald-300">
          Score {score}
        </span>
      </div>

      {reasons.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {reasons.slice(0, 3).map((reason, index) => (
            <li key={index} className="text-sm text-slate-400">
              • {reason.message ?? "Profile alignment detected"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-400">
          Recommendation generated from profile overlap.
        </p>
      )}

      <div className="mt-4">
        <a
          href={applyUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-sky-400 hover:text-sky-300"
        >
          Open job posting
        </a>
      </div>
    </div>
  );
}

function ProfilePanel({
  profile,
  titles,
  locations,
  skills,
}: {
  profile: {
    fullName: string | null;
    headline: string | null;
    remoteOnly: boolean;
    salaryTarget: string | null;
    yearsExperience: string | null;
  } | null;
  titles: string[];
  locations: string[];
  skills: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Search Path Summary</h2>
        <Link
          href="/profile"
          className="text-sm text-sky-400 hover:text-sky-300"
        >
          Open profile
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        <SummaryRow label="Headline" value={profile?.headline ?? "-"} />
        <SummaryRow label="Experience" value={profile?.yearsExperience ?? "-"} />
        <SummaryRow
          label="Remote only"
          value={profile ? (profile.remoteOnly ? "Yes" : "No") : "-"}
        />
        <SummaryRow label="Salary target" value={profile?.salaryTarget ?? "-"} />
        <SummaryRow label="Target titles" value={`${titles.length}`} />
        <SummaryRow label="Locations" value={`${locations.length}`} />
        <SummaryRow label="Skills" value={`${skills.length}`} />
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/60 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Saved: "bg-slate-800 text-slate-200",
    Applied: "bg-sky-950 text-sky-300",
    Interviewing: "bg-amber-950 text-amber-300",
    Offer: "bg-emerald-950 text-emerald-300",
    Rejected: "bg-rose-950 text-rose-300",
    Withdrawn: "bg-slate-900 text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-slate-800 text-slate-200"
      }`}
    >
      {status}
    </span>
  );
}