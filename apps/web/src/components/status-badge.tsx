type Status = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | string;

type Props = {
    status: Status;
};

const STYLES: Record<string, { color: string; bg: string; label: string }> = {
    COMPLETED: { color: "var(--accent)", bg: "var(--accent-soft)", label: "Completed" },
    PROCESSING: { color: "var(--blue)", bg: "var(--blue-soft)", label: "Processing" },
    QUEUED: { color: "var(--amber)", bg: "var(--amber-soft)", label: "Queued" },
    FAILED: { color: "var(--red)", bg: "var(--red-soft)", label: "Failed" },
};

export default function StatusBadge({ status }: Props) {
    const key = typeof status === "string" ? status.toUpperCase() : "";
    const style = STYLES[key] ?? { color: "var(--ink-soft)", bg: "#efede8", label: status };

    return (
        <span
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider"
            style={{ color: style.color, backgroundColor: style.bg, borderColor: "transparent" }}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${key === "PROCESSING" ? "animate-pulse" : ""}`}
                style={{ backgroundColor: style.color }}
            />
            {style.label}
        </span>
    );
}