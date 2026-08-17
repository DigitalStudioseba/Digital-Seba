"use client";

import { useState } from "react";
import { parseResourceData } from "@/lib/parse-resources";
import { RAW_RESOURCES_DATA } from "@/data/resources-data";

// Resource type definitions
interface ResourceFile {
  name: string;
  url: string;
  type: string;
}

interface ResourceFolder {
  name: string;
  nameBn?: string;
  files: ResourceFile[];
}

// Parse the data once
const parsedData = parseResourceData(RAW_RESOURCES_DATA);
const RESOURCES = parsedData.folders;
const ADDITIONAL_FILES = parsedData.additionalFiles;

export default function ResourcesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Get all file types
  const getAllFileTypes = () => {
    const types = new Set<string>();
    RESOURCES.forEach((folder) => {
      folder.files.forEach((file) => types.add(file.type));
    });
    ADDITIONAL_FILES.forEach((file) => types.add(file.type));
    return Array.from(types).sort();
  };

  // Filter resources
  const filterResources = (folder: ResourceFolder) => {
    return folder.files.filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || file.type === selectedType;
      return matchesSearch && matchesType;
    });
  };

  const fileTypes = getAllFileTypes();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Resources <span className="text-slate-600">/ রিসোর্স</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Access all Digital Seba resources and materials
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-slate-700"
            >
              Search / অনুসন্ধান করুন
            </label>
            <input
              type="text"
              id="search"
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search for files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* File Type Filter */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-slate-700"
            >
              File Type / ফাইল টাইপ
            </label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              {fileTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources */}
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {RESOURCES.map((folder, folderIdx) => {
          const filteredFiles = filterResources(folder);
          if (filteredFiles.length === 0) return null;

          return (
            <section key={folderIdx} className="mb-12">
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">
                {folder.name}
                {folder.nameBn && (
                  <span className="ml-2 text-slate-600">/ {folder.nameBn}</span>
                )}
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFiles.map((file, fileIdx) => (
                  <div
                    key={fileIdx}
                    className="group relative flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* File Type Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {file.type}
                      </span>
                    </div>

                    {/* File Name */}
                    <h3 className="mb-4 flex-1 text-base font-medium text-slate-900">
                      {file.name}
                    </h3>

                    {/* Open Button */}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Open File / ফাইল খুলুন
                    </a>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Additional Resources */}
        {ADDITIONAL_FILES.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              Additional Resources
              <span className="ml-2 text-slate-600">
                / অতিরিক্ত রিসোর্স
              </span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ADDITIONAL_FILES.filter((file) => {
                const matchesSearch = file.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
                const matchesType =
                  selectedType === "all" || file.type === selectedType;
                return matchesSearch && matchesType;
              }).map((file, fileIdx) => (
                <div
                  key={fileIdx}
                  className="group relative flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {file.type}
                    </span>
                  </div>

                  <h3 className="mb-4 flex-1 text-base font-medium text-slate-900">
                    {file.name}
                  </h3>

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open File / ফাইল খুলুন
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {RESOURCES.every(
          (folder) => filterResources(folder).length === 0
        ) &&
          ADDITIONAL_FILES.filter((file) => {
            const matchesSearch = file.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
            const matchesType =
              selectedType === "all" || file.type === selectedType;
            return matchesSearch && matchesType;
          }).length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
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
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                No resources found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
      </main>
    </div>
  );
}
