import Link from "next/link";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 p-8">
      <header className="flex items-center justify-between border-b border-[var(--line)] pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
            Ledger
          </p>
          <h1 className="font-display text-3xl text-[var(--ink)]">
            Document Summarizer
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Upload documents to generate automated AI summaries and classifications
          </p>
        </div>

        <Link
          href="/dashboard"
          className="rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
        >
          View documents →
        </Link>
      </header>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
        <UploadForm />
      </section>
    </main>
  );
}