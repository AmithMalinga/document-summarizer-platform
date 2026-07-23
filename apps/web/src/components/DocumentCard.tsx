import StatusBadge from "./StatusBadge";

type Props = {
    document: any;
};

function formatSize(bytes: number) {
    if (bytes === undefined || bytes === null) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

export default function DocumentCard({ document }: Props) {
    return (
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]/40">
            <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg leading-snug text-[var(--ink)] line-clamp-2">
                    {document.originalName}
                </h2>
                <StatusBadge status={document.status} />
            </div>

            <dl className="mt-4 space-y-1.5 font-mono text-[12px] text-[var(--ink-soft)]">
                <div className="flex justify-between gap-4">
                    <dt>Type</dt>
                    <dd className="truncate text-[var(--ink)]">{document.mimeType}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt>Size</dt>
                    <dd className="text-[var(--ink)]">{formatSize(document.size)}</dd>
                </div>
            </dl>
        </div>
    );
}