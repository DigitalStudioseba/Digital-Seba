# VoteSondhan — Static / Cloudflare / Vercel Ready

This build is a standalone Vanilla JS voter-list parser based on the real PDF extraction evidence supplied in this conversation.

## What was fixed in v9

- PDF.js text is reconstructed using physical **Y rows** and **X columns**.
- The real voter-list layout is treated as a repeating 3-column table.
- Serial + Name rows start each voter block.
- Each voter block is reconstructed from the complete vertical text stream of each X-column, so Father/Mother/Occupation/DOB/Address are no longer lost when multiple labels occur on the same physical PDF row.
- Block parsing continues until the next serial/name row instead of stopping after a fixed nine-row window.
- Label parsing is performed independently for every column; `else-if` field loss is removed.
- Wrapped address/occupation/DOB text is preserved because the whole column stream is parsed together.
- Field extraction is done from the reconstructed row text in column order, with the spatial columns retained as the primary layout model.
- Bengali/legacy PDF text normalization is conservative; the previous broad ই-কার rewrite was narrowed so normal words such as `পিতা`, `ঠিকানা`, and `তারিখ` are not corrupted.
- Duplicate voter IDs are removed using an ASCII-normalized ID key.
- Search, field filter, status filter, pagination, page-size selection, clear-data, and multi-PDF combine are included.
- `?debug=1` exposes a developer diagnostic panel and `window.__voteDebug`.
- PDF bytes stay in the browser; there is no upload API or server parser.

## Validation against supplied real extraction

The supplied extracted voter-list text contains the repeating 3-column structure with serials through **206**. The parser logic was exercised against that extracted structure and produced:

- 206 serial/name records
- 206 voter IDs
- 206 unique normalized voter-ID keys
- 69 three-column blocks

This is validation against the supplied extracted text, not a live browser run against the original PDF file.

## Local test

From this folder:

```powershell
npx http-server . -p 9095 -c-1
```

Open:

```text
http://127.0.0.1:9095/?debug=1
```

Upload the real voter-list PDF.

## Cloudflare Pages

No Vercel account is required.

Use the folder contents as a static site. The entry file is `index.html` and there is no build command.

If this parser is being placed back into the existing Digital Seba site, keep the folder at:

```text
services/pdf-parser-eta/
```

so the existing route remains:

```text
/services/pdf-parser-eta/
```

## Vercel

The project is also static-host compatible. No build command is required. `vercel.json` is included for clean static deployment.

## Important

The app still loads PDF.js from cdnjs at runtime. The PDF itself is never sent to cdnjs; only the JavaScript library is loaded from the CDN. For a completely air-gapped/offline build, PDF.js can be vendored locally later.
