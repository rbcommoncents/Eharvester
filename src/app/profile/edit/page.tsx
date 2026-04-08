import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "./actions";

export default async function EditProfilePage() {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!profile) {
    redirect("/profile/new");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Edit Profile</h1>
          <p className="mt-2 text-slate-300">
            Update the core settings that shape your path.
          </p>
        </div>

        <form
          action={updateProfile}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name">
              <input
                name="fullName"
                defaultValue={profile.fullName ?? ""}
                className="input"
              />
            </Field>

            <Field label="Headline">
              <input
                name="headline"
                defaultValue={profile.headline ?? ""}
                className="input"
              />
            </Field>

            <Field label="Salary Target">
              <input
                name="salaryTarget"
                defaultValue={profile.salaryTarget ?? ""}
                className="input"
              />
            </Field>

            <Field label="Years Experience">
              <input
                name="yearsExperience"
                defaultValue={profile.yearsExperience ?? ""}
                className="input"
              />
            </Field>

            <div className="md:col-span-2">
              <label className="mb-2 flex items-center gap-3 text-sm font-medium text-slate-200">
                <input
                  type="checkbox"
                  name="remoteOnly"
                  defaultChecked={profile.remoteOnly}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                />
                Remote only
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Notes
              </label>
              <textarea
                name="notes"
                rows={4}
                defaultValue={profile.notes ?? ""}
                className="input min-h-[110px]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-5 py-2.5 font-medium text-white hover:bg-sky-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      {children}
    </div>
  );
}