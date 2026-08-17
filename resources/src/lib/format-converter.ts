// Helper to convert various formats to our required format

export function convertToResourceFormat(input: string): string {
  const lines = input.split("\n");
  let output: string[] = [];
  let currentFolder = "";

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Detect folder lines (usually have no URL and might have special characters)
    const hasUrl = /https?:\/\//.test(line);

    if (!hasUrl && line.length > 0) {
      // This might be a folder name
      // Clean it up and format as folder
      const cleaned = line
        .replace(/^[•\-\*\+#\s]+/, "") // Remove bullets, dashes, hashtags
        .replace(/^folder:/i, "") // Remove "Folder:" prefix
        .replace(/^category:/i, "") // Remove "Category:" prefix
        .trim();

      if (cleaned) {
        currentFolder = cleaned;
        output.push(`\n## ${cleaned}`);
      }
    } else if (hasUrl) {
      // Extract URL
      const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const url = urlMatch[1];
        // Extract file name (everything before the URL)
        let fileName = line.replace(url, "").trim();
        fileName = fileName
          .replace(/^[•\-\*\+#\s]+/, "") // Remove bullets
          .replace(/^file:/i, "") // Remove "File:" prefix
          .trim();

        if (!fileName) {
          fileName = "Untitled Document";
        }

        output.push(`${fileName} ${url}`);
      }
    }
  }

  return output.join("\n");
}

// Handle markdown format
export function convertMarkdownToResourceFormat(markdown: string): string {
  const lines = markdown.split("\n");
  let output: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Check if it's a header (##, ###, etc.)
    const headerMatch = line.match(/^#+\s+(.+)/);
    if (headerMatch) {
      output.push(`\n## ${headerMatch[1]}`);
      continue;
    }

    // Check for markdown links [text](url)
    const mdLinkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (mdLinkMatch) {
      const [, text, url] = mdLinkMatch;
      output.push(`${text} ${url}`);
      continue;
    }

    // Check for plain URL
    if (/https?:\/\//.test(line)) {
      const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const url = urlMatch[1];
        let fileName = line.replace(url, "").trim();
        fileName = fileName.replace(/^[•\-\*\+#\s]+/, "").trim();
        if (!fileName) fileName = "Untitled Document";
        output.push(`${fileName} ${url}`);
      }
    }
  }

  return output.join("\n");
}

// Handle CSV format (File Name, URL)
export function convertCsvToResourceFormat(csv: string): string {
  const lines = csv.split("\n");
  let output: string[] = [];
  let currentFolder = "";

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));

    if (parts.length >= 2) {
      const [name, url] = parts;

      // Check if URL is valid
      if (url && /https?:\/\//.test(url)) {
        output.push(`${name} ${url}`);
      } else if (name && !url) {
        // Might be a folder
        currentFolder = name;
        output.push(`\n## ${name}`);
      }
    } else if (parts.length === 1 && parts[0]) {
      // Single column - might be folder name
      if (!/https?:\/\//.test(parts[0])) {
        output.push(`\n## ${parts[0]}`);
      }
    }
  }

  return output.join("\n");
}

// Handle JSON format
export function convertJsonToResourceFormat(json: string): string {
  try {
    const data = JSON.parse(json);
    let output: string[] = [];

    if (Array.isArray(data)) {
      // Array of objects
      for (const item of data) {
        if (item.folder) {
          output.push(`\n## ${item.folder}`);
        }
        if (item.files && Array.isArray(item.files)) {
          for (const file of item.files) {
            if (file.name && file.url) {
              output.push(`${file.name} ${file.url}`);
            }
          }
        } else if (item.name && item.url) {
          output.push(`${item.name} ${item.url}`);
        }
      }
    } else if (typeof data === "object") {
      // Object with folders as keys
      for (const [folderName, files] of Object.entries(data)) {
        output.push(`\n## ${folderName}`);
        if (Array.isArray(files)) {
          for (const file of files as any[]) {
            if (typeof file === "object" && file.name && file.url) {
              output.push(`${file.name} ${file.url}`);
            } else if (typeof file === "string" && /https?:\/\//.test(file)) {
              output.push(`Untitled Document ${file}`);
            }
          }
        }
      }
    }

    return output.join("\n");
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}

// Auto-detect format and convert
export function autoConvert(input: string): string {
  // Try to detect format
  const trimmed = input.trim();

  // Check if JSON
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return convertJsonToResourceFormat(input);
    } catch {
      // Not valid JSON, continue
    }
  }

  // Check if CSV (has commas)
  if (input.includes(",") && !input.includes("##")) {
    return convertCsvToResourceFormat(input);
  }

  // Check if Markdown (has ## headers)
  if (input.includes("##") || /\[.+\]\(.+\)/.test(input)) {
    return convertMarkdownToResourceFormat(input);
  }

  // Default to basic conversion
  return convertToResourceFormat(input);
}
