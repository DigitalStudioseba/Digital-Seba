"use client";

import { useState } from "react";
import { parseResourceData } from "@/lib/parse-resources";
import { RAW_RESOURCES_DATA } from "@/data/resources-data";

const parsedData = parseResourceData(RAW_RESOURCES_DATA);

// COMPLETE STRUCTURE - NOTHING EXCLUDED - ALL ISO FILES INCLUDED
const COMPLETE_CATEGORY_STRUCTURE = {
  "🎨 Design & Graphics Collection / ডিজাইন ও গ্রাফিক্স": [
    "Bangla Logo",
    "Baground",
    "Bag Design",
    "Alpona Design",
    "All Resources",
    "5000+ All Bengali typography",
    "12. Crest",
    "11. CV",
    "10. Certificate",
    "09. Card",
    "08. All in One",
    "07. Dokan",
    "05. Calender",
    "04. Eid Banner",
    "03. Banner",
    "02. Festival",
    "01. Cash Memo",
    "রাজনৈতিক পোস্টার ব্যানার",
    "হালখাতার ডিজাইন",
    "হাল খাতা",
    "সার্টিফিকেট ডিজাইন",
    "লোগো ডিজাইন",
    "মিষ্টি বক্স",
    "মাহফিল পোস্টার ব্যানার",
    "ভিজিটিং কার্ড ডিজাইন",
    "ভর্তি ও বিভিন্ন পোস্টার ব্যানার ডিজাইন",
    "বৈশাখী ডিজাইন",
    "বিভিন্ন সব স্কুল কলেজ মাদরসার লোগো",
    "বিবাহ সরনিকা",
    "বাংলাদেশের বিভিন্ন সব কম্পানির লোগো",
    "বক্স ডিজাইন",
    "ফ্রন্ট কালেকশন",
    "প্রফেশনাল সিভি ডিজাইন",
    "পূজা কালেকশন ডিজাইন",
    "নতুন বছরের ডিজাইন",
    "টাইপোগ্রাফি ডিজাইন",
    "জন্ম স্মরণিকা",
    "ক্রেস ডিজাইন",
    "ক্যাশ মেমো ডিজাইন",
    "ক্যালেন্ডার ডিজাইন",
    "ঈদ মোবারক ব্যানার",
    "আলপনা ডিজাইন",
    "আইডি কার্ড ডিজাইন",
    "Nirbaconi poster design",
    "Flower and Background",
    "All Bangla Logo file",
    "All Bangla Frame",
    "VECTOR",
  ],
  "📄 Document & Office Templates / ডকুমেন্ট টেমপ্লেট": [
    "বয়নামা",
    "সিভি ডিজাইন",
    "পদত্যাগ পত্র",
    "মামলা ফরমেট",
    "Money Receipt",
    "বন্ধক চুক্তি",
    "বিভিন্ন ফর্ম",
    "প্রশ্ন পত্র",
    "দোকান ভাড়ার চুক্তি",
    "যোগদান পত্র",
    "চুক্তি",
    "হলফনামা",
    "আবেদনপত্র",
    "অভিজ্ঞতা সনদ পত্র",
    "মুখতার নামা",
    "বিভিন্ন সকল চুক্তি পত্র",
    "Leave Application",
    "নোটিশ",
    "সার্কুলার",
    "Word File Collection-2.zip",
  ],
  "💻 PC Software Collection / পিসি সফটওয়্যার": [
    "Portable Softwares",
    "Microsoft Office Setup Lifetime Active",
    "All Collection",
    "PC Driver Setup",
    "Antivirus & Security",
    "অ্যাকাউন্টিং সফটওয়্যার",
    "Download Manager",
    "Browsers",
    "Media Player Collection",
    "Data Recovery",
    "Partition Manager",
    "PC Cleaner",
    "Password Recovery",
    "Screen Recorder",
    "Video Downloader",
    "PDF Tools",
    "Winrar & 7zip",
    "Burning Software",
    "Adobe Collection",
    "CorelDRAW Setup",
    "Photoshop Portable",
    "Illustrator Portable",
    "InDesign Setup",
    "Premiere Pro",
    "After Effects",
    "Lightroom",
  ],
  "🛠 Windows & System Tools / উইন্ডোজ টুলস (ISO INCLUDED)": [
    "Windows 7 ISO",
    "Windows 10 ISO",
    "Windows 11 ISO Genuine",
    "Windows 11 Preactivated",
    "Windows XP ISO",
    "Rufus Bootable",
    "Windows Activator",
    "Windows Fix Tools",
    "System Runtime",
    "DirectX Collection",
    ".NET Framework",
    "Visual C++ Redistributable",
  ],
  "🎬 Media & Multimedia / মিডিয়া": [
    "Video Tutorial",
    "Graphic Design Tutorial",
    "MS Office Tutorial",
    "Windows Installation Tutorial",
  ],
  "📦 File Tools & Utilities / ফাইল টুলস": [
    "Font",
    "Bangla Font Collection",
    "English Font Collection",
    "Unicode Fonts",
  ],
  "📊 Office & Productivity / অফিস ও প্রোডাক্টিভিটি": [],
  "🎓 Education & Kids / শিক্ষা": [
    "Vocabulary Worksheet Factory",
    "Medical Dictionary",
    "14 Grammarly",
    "13 Dns Angel v1.7",
    "12 Universe Explor Sandbox",
    "11 Tux Type",
    "10 Tux Paint",
    "09 Tux Math Command",
    "08 Scratch by MIT",
    "07 Oxford English Dictionary",
    "06 Oxford Advanced Learner's Dictionary 8th Edition",
    "05 Open Toonz",
    "04 Magic Desktop",
    "03 Kids Animation Maker",
    "02 Bangla Dictionary",
    "01 Algodoo",
  ],
  "🌐 Online & Cloud Tools / অনলাইন টুলস": [],
};

export default function CompleteResourcesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(COMPLETE_CATEGORY_STRUCTURE))
  );

  const folderData = new Map(
    parsedData.folders.map((folder) => [folder.name, folder])
  );

  const getFileTypes = (folderName: string) => {
    const folder = folderData.get(folderName);
    if (!folder) return [];
    const types = new Set(folder.files.map((f) => f.type));
    return Array.from(types).sort();
  };

  const getFileCount = (folderName: string) => {
    const folder = folderData.get(folderName);
    return folder ? folder.files.length : 0;
  };

  const filterFolders = (categoryFolders: string[]) => {
    return categoryFolders.filter((folderName) => {
      const folder = folderData.get(folderName);
      if (!folder || folder.files.length === 0) return false;
      if (searchQuery) {
        return folderName.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const selectedFolderData = selectedFolder
    ? folderData.get(selectedFolder)
    : null;

  const categories = Object.keys(COMPLETE_CATEGORY_STRUCTURE);
  const filteredCategories =
    selectedCategory === "all"
      ? categories
      : categories.filter((cat) => cat === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* File Browser Modal */}
      {selectedFolder && selectedFolderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedFolder}
                </h2>
                <p className="text-sm text-blue-100">
                  {selectedFolderData.files.length} files
                </p>
              </div>
              <button
                onClick={() => setSelectedFolder(null)}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedFolderData.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {file.type}
                      </span>
                    </div>
                    <h3 className="mb-4 flex-1 text-sm font-medium text-slate-900 line-clamp-2">
                      {file.name}
                    </h3>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <svg
                        className="mr-1 h-3 w-3"
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
                      Open / খুলুন
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Resources <span className="text-slate-600">/ রিসোর্স</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Complete collection with ALL files including ISO images
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-slate-700"
              >
                Search Folders / ফোল্ডার খুঁজুন
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700"
              >
                Filter by Category / ক্যাটাগরি
              </label>
              <select
                id="category"
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.split(" / ")[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredCategories.map((categoryName) => {
          const categoryFolders = COMPLETE_CATEGORY_STRUCTURE[categoryName as keyof typeof COMPLETE_CATEGORY_STRUCTURE];
          const visibleFolders = filterFolders(categoryFolders);

          if (visibleFolders.length === 0) return null;

          const isExpanded = expandedCategories.has(categoryName);
          const categoryIcon = categoryName.split(" ")[0];
          const categoryTitle = categoryName.split(" / ");

          return (
            <section key={categoryName} className="mb-12">
              <div className="mb-6">
                <button
                  onClick={() => toggleCategory(categoryName)}
                  className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-left shadow-md transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryIcon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {categoryTitle[0].replace(categoryIcon, "").trim()}
                      </h2>
                      <p className="mt-1 text-sm text-blue-100">
                        {categoryTitle[1]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white">
                      {visibleFolders.length} folders
                    </span>
                    <svg
                      className={`h-6 w-6 text-white transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {isExpanded && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleFolders.map((folderName) => {
                    const fileCount = getFileCount(folderName);
                    const fileTypes = getFileTypes(folderName);
                    const folder = folderData.get(folderName);

                    if (!folder) return null;

                    const hasISO = fileTypes.includes("ISO");

                    return (
                      <div
                        key={folderName}
                        className={`group relative flex flex-col rounded-lg border p-5 shadow-sm transition-all hover:shadow-md ${
                          hasISO
                            ? "border-orange-300 bg-orange-50/30"
                            : "border-slate-200 bg-white"
                        } hover:border-blue-300`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div
                            className={`rounded-lg p-2 ${
                              hasISO ? "bg-orange-100" : "bg-blue-50"
                            }`}
                          >
                            <svg
                              className={`h-6 w-6 ${
                                hasISO ? "text-orange-600" : "text-blue-600"
                              }`}
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
                          <span
                            className={`text-sm font-semibold ${
                              hasISO ? "text-orange-600" : "text-blue-600"
                            }`}
                          >
                            {fileCount} files
                          </span>
                        </div>

                        <h3 className="mb-3 text-base font-semibold text-slate-900 line-clamp-2">
                          {folderName}
                        </h3>

                        <div className="mb-4 flex flex-wrap gap-1">
                          {fileTypes.slice(0, 4).map((type) => (
                            <span
                              key={type}
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                type === "ISO"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {type}
                            </span>
                          ))}
                          {fileTypes.length > 4 && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                              +{fileTypes.length - 4}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedFolder(folderName)}
                          className={`mt-auto inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            hasISO
                              ? "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
                              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                          }`}
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
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                          Browse Files / ফাইল দেখুন
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* Stats Footer */}
      <div className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {parsedData.folders.length}
              </div>
              <div className="text-sm text-slate-600">Total Folders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {parsedData.stats.uniqueLinks}
              </div>
              <div className="text-sm text-slate-600">Total Files</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {categories.length}
              </div>
              <div className="text-sm text-slate-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {parsedData.folders.filter(f => 
                  f.files.some(file => file.type === 'ISO')
                ).length}
              </div>
              <div className="text-sm text-slate-600">ISO Folders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
