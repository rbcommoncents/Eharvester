import Link from "next/link";
import { createSkill } from "./actions";

export default function NewSkillPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Add Skill</h1>
            <p className="mt-2 text-slate-300">Add one skill at a time.</p>
          </div>

          <Link
            href="/profile"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
          >
            Back
          </Link>
        </div>

        <form
          action={createSkill}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Skill
            </label>
            <input
              name="value"
              className="input"
              placeholder="Python"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-5 py-2.5 font-medium text-white hover:bg-sky-500"
            >
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}