import Link from "next/link";
import { getDocument } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 border-b border-[var(--line)] py-4 sm:flex-row sm:items-baseline sm:justify-between">
            <dt className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                {label}
            </dt>
            <dd className="text-[var(--ink)] sm:text-right">{children}</dd>
        </div>
    );
}

export default async function DocumentPage({ params }: Props) {
    const { id } = await params;
    const document = await getDocument(id);

    return (
        <main className="mx-auto max-w-2xl p-8">
            <Link
                href="/dashboard"
                className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)] hover:text-[var(--accent)]"
            >
                ← Back to dashboard
            </Link>

            <div className="mt-4 flex items-start justify-between gap-4 border-b border-[var(--line)] pb-6">
                <h1 className="font-display text-3xl leading-snug text-[var(--ink)]">
                    {document.originalName}
                </h1>
                <StatusBadge status={document.status} />
            </div>

            <dl className="mt-2">
                <Field label="Type">{document.mimeType}</Field>
                <Field label="Summary">
                    {document.summary?.content ?? (
                        <span className="text-[var(--ink-soft)]">Not yet available</span>
                    )}
                </Field>
                <Field label="Category">
                    {document.classification?.category ?? (
                        <span className="text-[var(--ink-soft)]">Not yet available</span>
                    )}
                </Field>
                <Field label="Confidence">
                    {document.classification?.confidence ?? (
                        <span className="text-[var(--ink-soft)]">—</span>
                    )}
                </Field>
                <Field label="Created">
                    {new Date(document.createdAt).toLocaleString()}
                </Field>
            </dl>
        </main>
    );
}