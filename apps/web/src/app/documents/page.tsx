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

        // Poll every 5 seconds for background worker updates
        const interval = setInterval(loadDocuments, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-gray-500 text-sm animate-pulse">
                    Loading documents...
                </div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <div className="p-8 border border-dashed rounded-lg bg-gray-50 text-gray-500 space-y-3">
                    <p>No documents uploaded yet.</p>
                    <Link
                        href="/"
                        className="inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Upload
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                    <p className="text-sm text-gray-500">
                        Live auto-refreshing list of processed uploads
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                >
                    Upload New Document
                </Link>
            </div>

            <div className="grid gap-4">
                {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
        </div>
    );
}