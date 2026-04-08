import Link from "next/link";
import { createApplication } from "./actions";

export default function NewApplicationPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Add Application</h1>
            <p className="mt-2 text-slate-300">
              Save a new application to your tracker.
            </p>
          </div>

          <Link
            href="/applications"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
          >
            Back
          </Link>
        </div>

        <form
          action={createApplication}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Company *
              </label>
              <input
                name="company"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
                placeholder="IBM"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Job Title *
              </label>
              <input
                name="jobTitle"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
                placeholder="Security Analyst"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Location
              </label>
              <input
                name="location"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
                placeholder="Remote / Wilmington, DE"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Source
              </label>
              <input
                name="source"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
                placeholder="LinkedIn / Company Site / Workday"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Job URL
              </label>
              <input
                name="jobUrl"
                type="url"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Salary
              </label>
              <input
                name="salary"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
                placeholder="$90,000 - $110,000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Status
              </label>
              <select
                name="status"
                defaultValue="Applied"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
              >
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Date Applied
              </label>
              <input
                name="dateApplied"
                type="date"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Notes
              </label>
              <textarea
                name="notes"
                rows={5}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-sky-500"
                placeholder="Referral, recruiter name, timeline notes, resume version used..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-5 py-2.5 font-medium text-white hover:bg-sky-500"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}