import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
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

  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8 shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-400">
                Profile
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Search Profile
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Define your path so future recommendations and automation can
                follow your goals.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!profile ? (
                <Link
                  href="/profile/new"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
                >
                  Create Profile
                </Link>
              ) : (
                <Link
                  href="/profile/edit"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Core Profile</h2>
            {!profile && (
              <span className="text-sm text-slate-400">No core profile yet.</span>
            )}
          </div>

          {profile ? (
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField label="Full Name" value={profile.fullName} />
              <ProfileField label="Headline" value={profile.headline} />
              <ProfileField
                label="Remote Only"
                value={profile.remoteOnly ? "Yes" : "No"}
              />
              <ProfileField label="Salary Target" value={profile.salaryTarget} />
              <ProfileField
                label="Years Experience"
                value={profile.yearsExperience}
              />
              <ProfileField label="Notes" value={profile.notes} wide />
            </div>
          ) : (
            <p className="text-slate-400">Create your core profile to begin.</p>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <EntryCard
            title="Target Titles"
            href="/profile/titles/new"
            items={titles.map((x) => x.value)}
            emptyText="No target titles yet."
            buttonText="Add Title"
          />

          <EntryCard
            title="Preferred Locations"
            href="/profile/locations/new"
            items={locations.map((x) => x.value)}
            emptyText="No preferred locations yet."
            buttonText="Add Location"
          />

          <EntryCard
            title="Skills"
            href="/profile/skills/new"
            items={skills.map((x) => x.value)}
            emptyText="No skills yet."
            buttonText="Add Skill"
          />
        </section>
      </div>
    </main>
  );
}

function ProfileField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string | null;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
        {value?.trim() ? value : "-"}
      </div>
    </div>
  );
}

function EntryCard({
  title,
  href,
  items,
  emptyText,
  buttonText,
}: {
  title: string;
  href: string;
  items: string[];
  emptyText: string;
  buttonText: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link
          href={href}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-900"
        >
          {buttonText}
        </Link>
      </div>

      <div className="mt-5">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">{emptyText}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}