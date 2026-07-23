import Link from "next/link";
import { getDocuments } from "@/lib/api";
import DocumentCard from "@/components/DocumentCard";
import { Document } from "@/types/document";

export default async function DashboardPage() {
    const documents: Document[] = await getDocuments();

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">
            <header className="flex items-center justify-between border-b border-[var(--line)] pb-6">
                <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                        Ledger
                    </p>
                    <h1 className="font-display text-3xl text-[var(--ink)]">
                        Document dashboard
                    </h1>
                </div>

                <Link
                    href="/"
                    className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                    Upload document
                </Link>
            </header>

            {documents.length === 0 ? (
                <div className="space-y-3 rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)] p-12 text-center text-[var(--ink-soft)]">
                    <p>No documents yet. Upload one to get started.</p>
                    <Link
                        href="/"
                        className="inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                        ← Back to upload
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map((document) => (
                        <Link
                            key={document.id}
                            href={`/documents/${document.id}`}
                            className="block transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <DocumentCard document={document} />
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}