import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resetApplications } from "./reset-actions";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#020817] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Applications</h1>
          <div className="flex gap-3">
            <Link
              href="/applications/new"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500"
            >
              Add Application
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold">Tracked Applications</h2>
              <p className="text-sm text-slate-400">
                Review and manage your saved job applications.
              </p>
            </div>

            <form action={resetApplications}>
              <button
                type="submit"
                className="rounded-lg border border-rose-800 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-950/40"
              >
                Reset All
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/70 text-sm text-slate-300">
                <tr>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-slate-400">
                      No applications yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t border-slate-900 hover:bg-slate-900/40"
                    >
                      <td className="px-6 py-4">{app.company}</td>
                      <td className="px-6 py-4">{app.jobTitle}</td>
                      <td className="px-6 py-4">{app.status}</td>
                      <td className="px-6 py-4">{app.location ?? "-"}</td>
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
    </main>
  );
}