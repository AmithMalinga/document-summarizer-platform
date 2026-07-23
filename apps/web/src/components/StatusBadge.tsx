interface Props {
    status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
}

export default function StatusBadge({ status }: Props) {
    const getStatusStyles = (status: string) => {
        switch (status.toUpperCase()) {
            case "COMPLETED":
                return "bg-green-100 text-green-800 border-green-200";
            case "PROCESSING":
                return "bg-blue-100 text-blue-800 border-blue-200 animate-pulse";
            case "QUEUED":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "FAILED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                status
            )}`}
        >
            {status}
        </span>
    );
}