import crypto from "node:crypto";

export function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildExternalId(parts: string[]): string {
  const raw = parts.join("::");
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function inferRemote(
  title: string | null | undefined,
  location: string | null | undefined,
  description: string | null | undefined
): boolean {
  const haystack = [title, location, description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    haystack.includes("remote") ||
    haystack.includes("work from home") ||
    haystack.includes("distributed")
  );
}

export function safeDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function joinLocation(parts: Array<string | null | undefined>): string | null {
  const joined = parts
    .map((x) => (x ?? "").trim())
    .filter(Boolean)
    .join(", ");
  return joined || null;
}