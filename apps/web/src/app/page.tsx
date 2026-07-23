"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { uploadDocuments } from "@/lib/api";

type FileStatus = "pending" | "uploading" | "done" | "error";

type QueuedFile = {
  key: string;
  file: File;
  status: FileStatus;
  error?: string;
  invalid?: boolean; // failed client-side validation — not retryable
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported file type";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File exceeds 10MB limit";
  }
  return null;
}

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const totalSize = useMemo(
    () => queue.reduce((a, b) => a + b.file.size, 0),
    [queue]
  );

  function addFiles(files: File[]) {
    setQueue((previous) => {
      const existing = new Set(previous.map((x) => x.key));

      const newFiles: QueuedFile[] = files
        .filter((file) => !existing.has(fileKey(file)))
        .slice(0, MAX_FILES - previous.length)
        .map((file) => {
          const error = validateFile(file);
          return {
            key: fileKey(file),
            file,
            status: error ? "error" : "pending",
            error: error ?? undefined,
            invalid: Boolean(error),
          };
        });

      return [...previous, ...newFiles];
    });
  }

  function removeFile(key: string) {
    setQueue((previous) => previous.filter((x) => x.key !== key));
  }

  function updateStatus(keys: string[], status: FileStatus, error?: string) {
    setQueue((previous) =>
      previous.map((item) =>
        keys.includes(item.key) ? { ...item, status, error } : item
      )
    );
  }

  async function handleUpload() {
    // retryable: never-tried files, plus files that failed on the server
    // (network/500s) — but not files that failed client-side validation
    const valid = queue.filter(
      (x) => !x.invalid && (x.status === "pending" || x.status === "error")
    );

    if (!valid.length) return;

    setUploading(true);

    const keys = valid.map((x) => x.key);
    updateStatus(keys, "uploading");

    try {
      const response = await uploadDocuments(valid.map((x) => x.file));

      // TEMP: confirm the shape your backend actually returns.
      // Expecting something like: [{ documentId, status }, ...]
      console.log(response);

      updateStatus(keys, "done");

      if (Array.isArray(response) && response.length === 1 && response[0]?.documentId) {
        // single file — go straight to its detail page
        router.push(`/documents/${response[0].documentId}`);
      } else {
        // multiple files — go to the list so all statuses are visible
        router.push("/documents");
      }
    } catch (error: any) {
      updateStatus(keys, "error", error?.message || "Upload failed");
    }

    setUploading(false);
  }

  const pendingCount = queue.filter(
    (x) => !x.invalid && (x.status === "pending" || x.status === "error")
  ).length;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
            Ledger
          </p>
          <h1 className="font-display text-3xl text-[var(--ink)]">
            Upload documents
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            PDF, TXT, PNG, JPG, WEBP · Max 10MB each · Up to {MAX_FILES} files
          </p>
        </div>

        <Link
          href="/dashboard"
          className="shrink-0 rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
        >
          View dashboard →
        </Link>
      </header>

      <div
        onDrop={(e) => {
          e.preventDefault();
          addFiles(Array.from(e.dataTransfer.files));
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className="cursor-pointer rounded-xl border-2 border-dashed border-[var(--line)] bg-[var(--surface)] p-12 text-center transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <input
          ref={inputRef}
          hidden
          multiple
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
          Drag files here or click to browse
        </p>
      </div>

      {queue.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">
            {queue.length} file{queue.length > 1 ? "s" : ""} · {formatSize(totalSize)}
          </p>

          <div className="space-y-2">
            {queue.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-md border border-[var(--line)] bg-[var(--surface)] p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-[var(--ink)]">
                    {item.file.name}
                  </p>
                  <p className="font-mono text-[11px] text-[var(--ink-soft)]">
                    {formatSize(item.file.size)}
                  </p>
                  {item.error && (
                    <p className="mt-0.5 text-[12px] text-[var(--red)]">
                      {item.error}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <StatusLabel status={item.status} />
                  {item.status !== "uploading" && (
                    <button
                      onClick={() => removeFile(item.key)}
                      aria-label={`Remove ${item.file.name}`}
                      className="text-[var(--ink-soft)] hover:text-[var(--red)]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={uploading || pendingCount === 0}
        onClick={handleUpload}
        className="w-full rounded-md bg-[var(--accent)] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {uploading
          ? "Uploading…"
          : pendingCount > 0
            ? `Upload ${pendingCount} file${pendingCount > 1 ? "s" : ""}`
            : "Upload files"}
      </button>
    </main>
  );
}

function StatusLabel({ status }: { status: FileStatus }) {
  const map: Record<FileStatus, { text: string; color: string }> = {
    pending: { text: "Pending", color: "var(--ink-soft)" },
    uploading: { text: "Uploading…", color: "var(--blue)" },
    done: { text: "Done", color: "var(--accent)" },
    error: { text: "Failed", color: "var(--red)" },
  };
  const s = map[status];
  return (
    <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: s.color }}>
      {s.text}
    </span>
  );
}