# Production Safety Checklist

Rules for any agent/dev working on this repo, distilled from real incidents in production. Read before touching anything that writes to the database, sends real email, or deploys to `main`.

## 1. Branch discipline

- Run `git branch --show-current` as the **first command** of every slice. Never code directly on `main`.
- Feature/fix work happens on `staging` (or a feature branch), gets pushed there, QA'd there, and only merges to `main` after explicit user approval for that specific slice.
- Before merging: `git fetch origin && git log origin/main..staging --oneline` and `git diff origin/main..staging --stat` — confirm the diff matches exactly what was described to the user. No surprise files.

## 2. Shared database — staging, local, and production are the same data

This app's `staging` and `local` environments point at the **same Supabase project** as `production`. There is no separate sandbox database.

- Any `DELETE`/destructive `UPDATE` a QA script triggers through the real UI — even during "just testing the feature" — executes against the **real, shared** database. It is not sandboxed by environment.
- **Real incident (2026-08-13):** a QA test for a new "delete QA_TEST_ courses" admin feature clicked the real confirm button to verify the feature worked. Because the delete matches by a broad title prefix (`QA_TEST_%`), not by "records this test run created," it deleted 30 *other* legacy test records that existed before the test started — not just the 1 record the test itself had created.
- **Rule:** before writing a QA script that exercises a real destructive action against shared data:
  1. Default to dry-run. Never click a real "confirm delete" / "confirm send" button unless an explicit env flag (e.g. `ALLOW_REAL_DELETE=true`, `ALLOW_REAL_EMAIL_SEND=true`) is set for that specific run.
  2. Before the destructive action, assert that whatever the UI is about to affect is *exclusively* records this specific test run created (compare titles/IDs by exact match, not just prefix). If anything else is caught in scope, abort — don't proceed even with the flag set.
  3. Prove the dry-run path with an actual DB check (`the record was NOT deleted`), not just "the button exists."

## 3. QA data safety

- All synthetic data must be `QA_TEST_`-prefixed (titles) or `qa-test-`-prefixed (slugs) — and prefer a **run-unique** sub-namespace (e.g. `QA_TEST_CleanupSafe_<timestamp>`) over a shared generic prefix, so a script can reliably tell "records I made this run" apart from "any other QA_TEST_ record that happens to exist."
- Never edit a real/seed record to test an edit flow (e.g. a live, publicly-sold course). Create a dedicated `QA_TEST_` record and edit that instead.
- If touching a real record is genuinely unavoidable, snapshot every field first, restore all of them after, and report this explicitly in the same turn — never defer or bury it in a routine pass/fail report.
- QA scripts that can trigger a real external side-effect — sending email/SMS, calling a paid third-party API — must default to **not doing so**, even when the real credential is genuinely configured. Gate the unsafe action behind an explicit opt-in flag, defaulting to false, and assert the safe-default behavior actually holds (e.g. the record stays in its pre-send state) rather than assuming it.
- **Real incident (2026-08-13):** a campaign-send QA test was written while `RESEND_API_KEY` was still a placeholder, so it safely exercised the "not configured" path. After the key became real (a separate, earlier task), re-running the same script as routine regression sent real marketing email to real leads, because the script's only safety net had been "Resend isn't configured yet" — which was no longer true.

## 4. Secrets vs. plain config

- `NEXT_PUBLIC_*` environment variables are **not secrets** — they're baked into the client-side JS bundle and visible to anyone via view-source. Don't imply they need masking; say explicitly that it's safe to type the value in plaintext (a real incident happened where a non-technical operator typed `***` into a `NEXT_PUBLIC_*` field out of habit from handling real secrets).
- Real secrets (API keys, webhook signing secrets, service-role keys) are entered directly into the hosting dashboard (Vercel) by the account owner — an agent should never see or transmit the raw value.
- To verify a secret is actually set (without seeing its value), use a **temporary diagnostic API route** that returns only redacted metadata (`present: true/false`, `length`, a prefix check like `startsWith('re_')`). Delete the route immediately after use, in its own commit.
- Vercel bakes environment variables into each deployment at build time — changing a value in the dashboard does **not** affect an already-running deployment. A fresh deploy (even an empty commit) is required to pick up a changed value.

## 5. Diagnostic routes

- It's fine to add a short-lived `/api/debug-*` route to inspect otherwise-invisible server state (an env var, a webhook payload, a send history) — as long as it: (a) exposes no raw secrets or full PII, only redacted/masked summaries; (b) has no side effects unless explicitly and narrowly scoped (e.g. sending exactly one email to a fixed, hardcoded, safe address — never an address derived from user input); (c) is deleted in its own follow-up commit right after use, not left lying around.
- Expect stricter scrutiny (possible auto-mode classifier blocks) for diagnostic routes with real side-effect capability (e.g. "can send a real email") versus pure read-only ones — if blocked, don't try to route around it; explain to the user what you were attempting and why.

## 6. Deploy timing

- After pushing to `staging` or `main`, wait for the Vercel deploy before running QA against it — a fresh push typically needs 45–90 seconds to build and propagate. If a check that "should" pass comes back showing stale behavior, don't assume the code is wrong — check whether the deploy actually finished first, then retry.
- Vercel Preview deployments (the `staging` branch URL) sit behind an SSO/auth wall by default. For QA scripts, use the `x-vercel-protection-bypass` header (or `?x-vercel-protection-bypass=<token>` as a query param, needed for external callers like a real webhook provider that can't set custom headers) plus `x-vercel-set-bypass-cookie: true`. Production has no such wall.

## 7. Before merging to `main`

1. `npm run lint` — compare against the known baseline (currently: 2 pre-existing errors in `AnimateIn.js`, unrelated to any slice); a new error means something broke.
2. `rm -rf .next && npm run build` — must be clean.
3. Full regression QA suite passes on `staging` (not just the new feature's own test).
4. Report to the user: what changed, pass/fail numbers, the exact `git diff --stat` against `main` (so scope creep is visible), and explicitly ask for merge approval — never push to `main` without it, even if every other step succeeded.
5. After deploy, run a **safe** production smoke test — read-only where possible; if the feature is inherently destructive (e.g. a delete action), verify the preview/dry-run path only, and never click a real confirm button on production without the user having separately authorized that specific action.
