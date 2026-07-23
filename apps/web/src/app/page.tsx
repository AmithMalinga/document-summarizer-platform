import Link from "next/link";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Document Summarizer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload documents to generate automated AI summaries and classifications
          </p>
        </div>

        <Link
          href="/documents"
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          View Documents →
        </Link>
      </header>

      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <UploadForm />
      </section>
    </main>
  );
}