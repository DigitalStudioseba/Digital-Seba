"use client";

import { useState } from "react";
import { parseResourceData } from "@/lib/parse-resources";
import { autoConvert } from "@/lib/format-converter";

export default function AdminPage() {
  const [rawData, setRawData] = useState("");
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [showConverter, setShowConverter] = useState(false);

  const handleParse = () => {
    const result = parseResourceData(rawData);
    setParsedResult(result);
  };

  const handleCopyCode = () => {
    const code = `export const RAW_RESOURCES_DATA = \`
${rawData}
\`;`;
    navigator.clipboard.writeText(code);
    alert("Code copied! Paste it into src/data/resources-data.ts");
  };

  const handleAutoConvert = () => {
    try {
      const converted = autoConvert(rawData);
      setRawData(converted);
      alert("Format converted! Review the result and click Parse & Validate.");
    } catch (error) {
      alert("Conversion failed. Please check your input format.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Panel - Resource Parser
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Paste your Google Drive links here to parse and validate
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Paste Your Data
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                Format:
                <br />
                ## Folder Name / Bengali Name
                <br />
                File Name URL
              </p>
              <textarea
                className="w-full h-96 rounded-md border border-slate-300 p-4 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="## Academic Materials / একাডেমিক ম্যাটেরিয়াল&#10;Introduction to Programming https://drive.google.com/file/d/1ABC123/view&#10;Database Guide https://drive.google.com/file/d/1DEF456/view&#10;&#10;## Training Materials / প্রশিক্ষণ সামগ্রী&#10;Video Tutorial https://drive.google.com/file/d/1GHI789/view"
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleAutoConvert}
                  className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white hover:bg-purple-700"
                >
                  Auto Convert Format
                </button>
                <button
                  onClick={handleParse}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Parse & Validate
                </button>
                {parsedResult && (
                  <button
                    onClick={handleCopyCode}
                    className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700"
                  >
                    Copy Code
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {parsedResult ? (
              <div className="space-y-6">
                {/* Stats */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    Summary
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600">Total Links</div>
                      <div className="text-2xl font-bold text-slate-900">
                        {parsedResult.stats.totalLinks}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Unique</div>
                      <div className="text-2xl font-bold text-green-600">
                        {parsedResult.stats.uniqueLinks}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Duplicates</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {parsedResult.stats.duplicateCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Invalid</div>
                      <div className="text-2xl font-bold text-red-600">
                        {parsedResult.stats.invalidCount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Folders */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    Folders ({parsedResult.folders.length})
                  </h2>
                  <div className="space-y-2">
                    {parsedResult.folders.map((folder: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b border-slate-100 pb-2"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {folder.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {folder.files.length} files
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duplicates */}
                {parsedResult.duplicates.length > 0 && (
                  <div className="rounded-lg bg-yellow-50 p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold text-yellow-800">
                      ⚠️ Duplicates
                    </h2>
                    <ul className="space-y-1">
                      {parsedResult.duplicates.map((url: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-xs font-mono text-yellow-700"
                        >
                          {url.substring(0, 60)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Invalid */}
                {parsedResult.invalid.length > 0 && (
                  <div className="rounded-lg bg-red-50 p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold text-red-800">
                      ❌ Invalid URLs
                    </h2>
                    <ul className="space-y-1">
                      {parsedResult.invalid.map((url: string, idx: number) => (
                        <li key={idx} className="text-xs font-mono text-red-700">
                          {url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Message */}
                {parsedResult.stats.invalidCount === 0 &&
                  parsedResult.stats.duplicateCount === 0 && (
                    <div className="rounded-lg bg-green-50 p-6 shadow">
                      <h2 className="text-xl font-semibold text-green-800">
                        ✅ All Good!
                      </h2>
                      <p className="mt-2 text-sm text-green-700">
                        No errors found. Click "Copy Code" and paste into
                        src/data/resources-data.ts
                      </p>
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg bg-white p-12 shadow">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-slate-600">
                    Paste your data and click "Parse & Validate"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">
            📖 Instructions
          </h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-blue-800">
            <li>Paste your Google Drive links in the left textarea</li>
            <li>Use ## to mark folder names (e.g., ## My Folder / আমার ফোল্ডার)</li>
            <li>Each file should be: File Name URL</li>
            <li>Click "Parse & Validate" to check for errors</li>
            <li>If no errors, click "Copy Code"</li>
            <li>Paste the code into src/data/resources-data.ts</li>
            <li>Save and refresh /resources to see your changes</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
