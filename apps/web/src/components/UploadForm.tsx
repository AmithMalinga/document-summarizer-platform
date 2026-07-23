"use client";

import { useRef, useState } from "react";
import { uploadDocuments } from "@/lib/api";

export default function UploadForm() {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function upload() {
        try {
            setLoading(true);
            const data = await uploadDocuments(files);
            setResult(data);
            setFiles([]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragActive(false);
        setFiles(Array.from(e.dataTransfer.files || []));
    }

    return (
        <div className="mx-auto max-w-xl">
            <h2 className="font-display text-2xl text-[var(--ink)]">Upload documents</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
                Drop files here or choose them from your device. Processing starts automatically.
            </p>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${dragActive
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--line)] bg-[var(--surface)]"
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                    {files.length > 0
                        ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                        : "Drag files or click to browse"}
                </p>
                {files.length > 0 && (
                    <ul className="mt-4 space-y-1 font-mono text-[12px] text-[var(--ink)]">
                        {files.map((f) => (
                            <li key={f.name}>{f.name}</li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                disabled={loading || files.length === 0}
                onClick={upload}
                className="mt-4 w-full rounded-md bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {loading ? "Uploading…" : "Upload"}
            </button>

            {result.length > 0 && (
                <div className="mt-8 space-y-2 border-t border-[var(--line)] pt-6">
                    <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                        Queued
                    </p>
                    {result.map((item) => (
                        <div
                            key={item.documentId}
                            className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
                        >
                            <span className="font-mono text-[12px] text-[var(--ink)]">
                                {item.documentId}
                            </span>
                            <span className="font-mono text-[11px] uppercase text-[var(--ink-soft)]">
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}