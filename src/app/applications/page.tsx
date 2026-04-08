import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resetApplications } from "./reset-actions";
import ResetApplicationsButton from "@/components/reset-applications-button";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Applications</h1>
            <p className="mt-2 text-slate-300">
              Track your saved and submitted roles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ResetApplicationsButton action={resetApplications} />

            <Link
              href="/applications/new"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
            >
              Add Application
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-sm text-slate-300">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-slate-400">
                    No applications yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-slate-900 last:border-0"
                  >
                    <td className="px-4 py-3">{app.company}</td>
                    <td className="px-4 py-3">{app.jobTitle}</td>
                    <td className="px-4 py-3">{app.status}</td>
                    <td className="px-4 py-3">{app.location ?? "-"}</td>
                    <td className="px-4 py-3">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}