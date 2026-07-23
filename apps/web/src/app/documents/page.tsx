"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocuments } from "@/lib/api";
import { Document } from "@/types/document";
import DocumentCard from "@/components/DocumentCard";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadDocuments() {
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Failed to load documents:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
        const interval = setInterval(loadDocuments, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[300px] max-w-4xl items-center justify-center p-6 mx-auto">
                <div className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                    Loading documents…
                </div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="mx-auto max-w-4xl space-y-4 p-6 text-center">
                <h1 className="font-display text-2xl text-[var(--ink)]">Documents</h1>
                <div className="space-y-3 rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-[var(--ink-soft)]">
                    <p>No documents uploaded yet.</p>
                    <Link
                        href="/"
                        className="inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                        ← Back to upload
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <div>
                    <h1 className="font-display text-2xl text-[var(--ink)]">Documents</h1>
                    <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                        Auto-refreshing every 5s
                    </p>
                </div>
                <Link
                    href="/"
                    className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                    Upload new document
                </Link>
            </div>

            <div className="grid gap-4">
                {documents.map((doc) => (
                    <Link key={doc.id} href={`/documents/${doc.id}`}>
                        <DocumentCard document={doc} />
                    </Link>
                ))}
            </div>
        </div>
    );
}