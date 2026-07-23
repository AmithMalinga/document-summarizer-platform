import { Document } from "../types/document";
import StatusBadge from "./StatusBadge";

interface Props {
    document: Document;
}

export default function DocumentCard({ document }: Props) {
    return (
        <div className="border rounded-lg p-4 shadow-sm space-y-3 bg-white">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {document.filename}
                </h3>
                <StatusBadge status={document.status} />
            </div>

            {document.summary && (
                <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-700">Summary</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {document.summary.content}
                    </p>
                </div>
            )}

            {document.classification && (
                <div className="pt-2 border-t flex items-center justify-between text-xs text-gray-500">
                    <span>
                        <strong className="font-medium text-gray-700">Category:</strong>{" "}
                        {document.classification.category}
                    </span>
                    <span>
                        <strong className="font-medium text-gray-700">Confidence:</strong>{" "}
                        {(document.classification.confidence * 100).toFixed(2)}%
                    </span>
                </div>
            )}
        </div>
    );
}