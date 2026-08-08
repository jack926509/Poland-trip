### Task 6: 文件與真實瀏覽器驗收

**Files:**
- Modify: `docs/research/2026-08-08-free-travel-gaps.md` only if implementation facts require correction
- Create: `docs/verification/2026-08-08-free-travel-database-results.md`

**Interfaces:**
- Produces a handoff recording exact commands, results, reviewed pages and dynamic pending items.

- [ ] **Step 1: Run static hygiene checks**

Run: `git diff --check`
Expected: no output.

- [ ] **Step 2: Start local preview and inspect desktop pages**

Open `index.html`, `practical/database.html`, `day-02.html`, `day-07.html`, `practical/essentials.html`, and `practical/booking.html`. Confirm headings, status labels, source links, `tel:` links, no page-level horizontal overflow, and no console errors.

- [ ] **Step 3: Inspect 390 px viewport**

Open homepage, database, and one day page at 390×844. Confirm no page-level horizontal overflow and SOS content is readable without interacting with a map.

- [ ] **Step 4: Save verification evidence**

Record build count, test count, browser pages, viewport results, console results and remaining `pending/private-required` items in the verification document.

- [ ] **Step 5: Final diff review**

Run: `git status --short` and `git diff --stat`. Confirm `.agents/`, `.claude/`, and `skills-lock.json` remain untouched and unstaged.
