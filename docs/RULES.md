# Digital Seba — AI Development Rulebook & Engineering Guidelines

**Project:** Digital Seba (`digitalseba.pages.dev`)
**Scope:** AI Pair Programming, Automated Engineering & Repository Maintenance
**Last Verified Baseline:** October 19, 2026 (`main` branch)
**Document Status:** MANDATORY ENFORCEMENT

---

## 1. Core Engineering Principles

Every engineer, AI agent, or collaborator modifying this repository must strictly adhere to the following fifteen rules:

1. **Read Relevant Documentation First:** Before beginning any modification or audit, read the relevant documentation in `docs/` (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `SECURITY.md`, `TEST_PLAN.md`).
2. **Investigate Before Implementation:** Perform a read-only investigation of the existing code, file structure, and Git state before proposing or writing changes. Never guess the layout.
3. **Make the Smallest Safe Change:** Apply surgical, narrowly scoped edits. Do not reformat entire files or perform mass find-and-replace operations.
4. **Reuse Existing Components & Functions:** Never rewrite existing utility functions, navigation components, or styling rules if an established pattern exists in `assets/`.
5. **Do Not Duplicate Routes or Functionality:** Respect the consolidated tool suite inside `tools/index.html`. Do not create separate `.html` pages for features that already exist as modals or search-filtered categories.
6. **Do Not Edit Unrelated Files:** Keep modifications strictly limited to files directly authorized by the current task scope.
7. **Preserve Working Features & Existing User Changes:** Never overwrite, delete, reset, stash, or discard existing changes in the working tree.
8. **Never Claim a Test Passed Without Running It:** Every verification claim must be backed by an executed command, exit code, and recorded output.
9. **Never Treat Static Analysis as Browser Proof:** Static file existence or syntax checks do not prove that an interactive UI behavior succeeded in a browser. Mark interactive browser behaviors as `UNVERIFIED` unless proven in an active browser session.
10. **Do Not Expose Credentials or Secrets:** Never commit, log, or document real API keys, OAuth client secrets, private database tokens, or credentials.
11. **Enforce Authorization Checks for Protected Data:** All privileged read/write operations must be enforced by server-side declarative security rules (`firestore.rules`, `storage.rules`), not merely client-side UI visibility toggles.
12. **Run Appropriate Tests After Changes:** Execute relevant syntax checks (`node -c`), tracked route tests (when available), and formatting checks (`git diff --check`) after every modification.
13. **Record Evidence and Limitations:** Explicitly disclose testing limitations, environmental differences (e.g. Live Server vs Cloudflare Pages), and unverified edge cases.
14. **Request Approval Before Risky or Broad Changes:** Obtain explicit user confirmation before refactoring core architectures, creating new top-level directories, or altering production routing.
15. **Zero Git Staging or Deployment Without Explicit Approval:** Under no circumstances should an agent stage (`git add`), commit (`git commit`), push (`git push`), merge, or deploy to Cloudflare Pages without explicit user authorization.

---

## 2. Required Response Structure for Engineering Tasks

For all future engineering, debugging, and implementation tasks, responses must follow this structured lifecycle:

```text
### 1. UNDERSTANDING
Clarify the task objectives, constraints, relevant files, and explicit user requirements.

### 2. INVESTIGATION
Execute read-only checks, inspect the current Git status, review recent diffs, and inspect existing code.

### 3. ROOT CAUSE
Diagnose the exact technical mechanism causing the defect or necessitating the change.

### 4. PLAN
Outline the exact list of files to modify or create, detailing the proposed before/after changes.

### 5. IMPLEMENTATION
Apply the approved surgical edits using precise tool calls.

### 6. VERIFICATION
Execute automated tests, route checks, and syntax verifications. Record exact commands and evidence.

### 7. RESULT
Deliver a concise summary of changes, test outcomes, remaining risks, and next recommended actions.
```

---

## 3. Standard Verification Status Vocabulary

When reporting test results, audits, or feature verifications, use only these standardized statuses:

| Status | Exact Definition |
| :--- | :--- |
| **PASS** | The check or test was executed directly; returned exit code 0 or matched all expected assertions with verifiable output. |
| **WARNING** | The check executed but revealed a non-fatal defect, performance bottleneck, or potential architectural risk that should be monitored. |
| **FAIL** | The test or assertion failed; an error code was returned or expected behavior did not occur. |
| **UNVERIFIED** | The condition could not be tested directly due to missing environment tooling (e.g. physical mobile device, live production edge deployment). |

---

## 4. Local Development vs Production Rules

1. **Local Development (VS Code Live Server):**
   - Must maintain physical redirect stubs in `tools/` (`ai/`, `photo/`, `pdf/`, etc.) so that requesting `http://127.0.0.1:5500/tools/ai/index.html` resolves immediately with HTTP 200 and forwards to `../index.html?search=...`.
2. **Production Hosting (Cloudflare Pages):**
   - Must maintain canonical rules in [`_redirects`](../_redirects) and security headers in [`_headers`](../_headers).
   - Must preserve custom [`404.html`](../404.html) without catch-all wildcard rules (`/* /index.html 200`) to guarantee genuine HTTP 404 responses for missing routes.
