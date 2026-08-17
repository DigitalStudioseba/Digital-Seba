import { parseResourceData } from "@/lib/parse-resources";
import { RAW_RESOURCES_DATA } from "@/data/resources-data";
import Link from "next/link";

export const metadata = {
  title: "Resource Report | Digital Seba",
  description: "Summary report of parsed resources",
};

export default function ResourceReportPage() {
  const parsed = parseResourceData(RAW_RESOURCES_DATA);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Resource Parsing Report
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Summary of all parsed Google Drive resources
              </p>
            </div>
            <Link
              href="/resources"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to Resources
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Summary Statistics
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="text-sm font-medium text-slate-600">
                Total Links
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">
                {parsed.stats.totalLinks}
              </div>
            </div>

            <div className="rounded-lg bg-green-50 p-6 shadow">
              <div className="text-sm font-medium text-green-600">
                Unique Links
              </div>
              <div className="mt-2 text-3xl font-bold text-green-700">
                {parsed.stats.uniqueLinks}
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 p-6 shadow">
              <div className="text-sm font-medium text-yellow-600">
                Duplicates
              </div>
              <div className="mt-2 text-3xl font-bold text-yellow-700">
                {parsed.stats.duplicateCount}
              </div>
            </div>

            <div className="rounded-lg bg-red-50 p-6 shadow">
              <div className="text-sm font-medium text-red-600">Invalid</div>
              <div className="mt-2 text-3xl font-bold text-red-700">
                {parsed.stats.invalidCount}
              </div>
            </div>
          </div>
        </section>

        {/* Folder Breakdown */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Folder Breakdown
          </h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Folder Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Files Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    File Types
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {parsed.folders.map((folder, idx) => {
                  const types = Array.from(
                    new Set(folder.files.map((f) => f.type))
                  );
                  return (
                    <tr key={idx}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                        {folder.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {folder.files.length}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div className="flex flex-wrap gap-1">
                          {types.map((type) => (
                            <span
                              key={type}
                              className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Additional Files */}
        {parsed.additionalFiles.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              Additional Files (Not in Folders)
            </h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <p className="text-sm text-slate-600">
                {parsed.additionalFiles.length} file(s) found outside of
                folders
              </p>
            </div>
          </section>
        )}

        {/* Duplicates */}
        {parsed.duplicates.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-yellow-700">
              ⚠️ Duplicate URLs
            </h2>
            <div className="rounded-lg bg-yellow-50 p-6 shadow">
              <p className="mb-4 text-sm text-yellow-800">
                The following {parsed.duplicates.length} URL(s) appear multiple
                times:
              </p>
              <ul className="space-y-2">
                {parsed.duplicates.map((url, idx) => (
                  <li
                    key={idx}
                    className="break-all text-xs font-mono text-yellow-700"
                  >
                    {url}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Invalid URLs */}
        {parsed.invalid.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-red-700">
              ❌ Invalid URLs
            </h2>
            <div className="rounded-lg bg-red-50 p-6 shadow">
              <p className="mb-4 text-sm text-red-800">
                The following {parsed.invalid.length} URL(s) are not valid
                Google Drive links:
              </p>
              <ul className="space-y-2">
                {parsed.invalid.map((url, idx) => (
                  <li
                    key={idx}
                    className="break-all text-xs font-mono text-red-700"
                  >
                    {url}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Resource Hierarchy */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Complete Resource Hierarchy
          </h2>
          <div className="space-y-6">
            {parsed.folders.map((folder, folderIdx) => (
              <div key={folderIdx} className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                  {folder.name}
                </h3>
                <ul className="space-y-2">
                  {folder.files.map((file, fileIdx) => (
                    <li
                      key={fileIdx}
                      className="flex items-center justify-between border-b border-slate-100 pb-2"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          {file.type}
                        </span>
                        <span className="text-sm text-slate-700">
                          {file.name}
                        </span>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Open ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
