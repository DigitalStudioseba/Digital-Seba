import { db } from "@/db";
import { sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await db.execute(sql`select 1`);

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight">
            Digital Seba
          </h1>
          <p className="mt-2 text-[clamp(1.5rem,4vw,2.5rem)] font-semibold text-blue-100">
            ডিজিটাল সেবা
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-50">
            Access all your resources, documents, and materials in one centralized location
          </p>
          <div className="mt-10">
            <Link
              href="/resources"
              className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
            >
              <svg
                className="mr-2 h-6 w-6"
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
              Browse Resources / রিসোর্স দেখুন
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Organized Folders
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              All resources organized in clear, easy-to-navigate categories
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Quick Search
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Find any document instantly with powerful search functionality
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Bilingual Support
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Full support for both English and Bengali languages
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-4xl px-6 py-12 text-center">
        <div className="rounded-2xl bg-white p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900">
            Ready to Access Your Resources?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Browse through our comprehensive collection of documents and materials
          </p>
          <Link
            href="/resources"
            className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get Started / শুরু করুন
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
