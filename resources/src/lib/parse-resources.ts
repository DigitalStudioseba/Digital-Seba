// Utility to parse Google Drive resource links

export interface ResourceFile {
  name: string;
  url: string;
  type: string;
}

export interface ResourceFolder {
  name: string;
  nameBn?: string;
  files: ResourceFile[];
}

export interface ParsedResources {
  folders: ResourceFolder[];
  additionalFiles: ResourceFile[];
  duplicates: string[];
  invalid: string[];
  stats: {
    totalLinks: number;
    uniqueLinks: number;
    duplicateCount: number;
    invalidCount: number;
  };
}

// Extract file type from URL or filename
function getFileType(name: string, url: string): string {
  // Try to get from filename first
  const nameMatch = name.match(/\.([a-zA-Z0-9]+)$/);
  if (nameMatch) {
    return nameMatch[1].toUpperCase();
  }

  // Common Google Drive file type indicators
  if (url.includes("/document/")) return "DOC";
  if (url.includes("/spreadsheets/")) return "SHEET";
  if (url.includes("/presentation/")) return "SLIDES";
  if (url.includes("/file/")) {
    // Try to infer from MIME type patterns
    if (url.includes("pdf")) return "PDF";
    if (url.includes("zip")) return "ZIP";
    if (url.includes("image") || url.includes("jpg") || url.includes("png"))
      return "IMAGE";
  }

  return "FILE";
}

// Validate Google Drive URL
function isValidGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const drivePatterns = [
    /^https?:\/\/drive\.google\.com\/file\//,
    /^https?:\/\/drive\.google\.com\/open\?id=/,
    /^https?:\/\/drive\.google\.com\/folders\//,
    /^https?:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\//,
  ];
  return drivePatterns.some((pattern) => pattern.test(url));
}

// Clean and normalize file name
function cleanFileName(name: string): string {
  return name
    .replace(/^[•\-\s]+/, "") // Remove leading bullets or dashes
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

// Parse raw text data into structured resources
export function parseResourceData(rawData: string): ParsedResources {
  const lines = rawData
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const folders: ResourceFolder[] = [];
  const additionalFiles: ResourceFile[] = [];
  const seenUrls = new Set<string>();
  const duplicates: string[] = [];
  const invalid: string[] = [];
  let totalLinks = 0;

  let currentFolder: ResourceFolder | null = null;
  let folderPattern = /^#+\s*(.+)/; // Markdown headers for folders
  let urlPattern = /(https?:\/\/[^\s]+)/g;

  for (const line of lines) {
    // Check if line is a folder header
    const folderMatch = line.match(folderPattern);
    if (folderMatch) {
      const folderName = cleanFileName(folderMatch[1]);
      if (currentFolder && currentFolder.files.length > 0) {
        folders.push(currentFolder);
      }
      currentFolder = {
        name: folderName,
        files: [],
      };
      continue;
    }

    // Extract URLs from line
    const urls = line.match(urlPattern);
    if (urls) {
      urls.forEach((url) => {
        totalLinks++;

        // Check for duplicates
        if (seenUrls.has(url)) {
          duplicates.push(url);
          return;
        }

        // Validate URL
        if (!isValidGoogleDriveUrl(url)) {
          invalid.push(url);
          return;
        }

        seenUrls.add(url);

        // Extract file name from line (remove URL)
        let fileName = line.replace(urlPattern, "").trim();
        fileName = cleanFileName(fileName) || "Untitled Document";

        const fileType = getFileType(fileName, url);
        const file: ResourceFile = {
          name: fileName,
          url: url,
          type: fileType,
        };

        if (currentFolder) {
          currentFolder.files.push(file);
        } else {
          additionalFiles.push(file);
        }
      });
    }
  }

  // Add last folder if exists
  if (currentFolder && currentFolder.files.length > 0) {
    folders.push(currentFolder);
  }

  return {
    folders,
    additionalFiles,
    duplicates,
    invalid,
    stats: {
      totalLinks,
      uniqueLinks: seenUrls.size,
      duplicateCount: duplicates.length,
      invalidCount: invalid.length,
    },
  };
}

// Example expected format:
// ## Folder Name
// - File Name 1 https://drive.google.com/file/d/ID1/view
// - File Name 2 https://drive.google.com/file/d/ID2/view
//
// ## Another Folder
// - File Name 3 https://drive.google.com/file/d/ID3/view
