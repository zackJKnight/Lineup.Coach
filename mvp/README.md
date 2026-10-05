# Lineup Coach MVP

React + TypeScript + Vite + Material UI + Dexie. The original two-screen team/attendance → lineup workflow, completed as a device-first game-day app.

## Run

Node 22.13+ (verified with Node 24.19). `npm ci`, then `npm run dev`.

`npm run build` creates a static `dist/` containing a service worker and all local assets. Serve over HTTPS (or localhost) to enable offline reopening. `npm test` runs focused engine and persistence checks. `npm run test:offline` (after building) checks the emitted service worker against an in-memory Cache API. `npm run verify` runs the build and all 16 checks. `npm run benchmark` compares the replacement generator to the saved improved GA.

The first visit creates a clearly named fictional demo team. Create a new team for actual use. Teams, players, ranked preferences, exclusions, games, attendance, equal-length periods, field positions, assignments and locks persist in IndexedDB. The app opens on attendance, then shows one table per period. Editing an assignment swaps the two players; locked or forbidden swaps are rejected. Print produces period tables and playing-time summaries. Settings exports a JSON device backup.

Attendance and roster/position changes invalidate affected lineups. Regenerate to use the new input. Locks on unavailable players are removed when attendance changes. A fixed seed makes repeated generation reproducible. No model service or network connection is required for generation.

## Generator

Each of 24 deterministic starts solves a minimum-cost perfect matching per period, then compares complete schedules lexicographically by bench-count spread, sum of squared bench counts, consecutive bench periods, preference score and position variety. Hard exclusions and locks are forbidden matching edges, never score penalties. Results pass an independent structural validator before return. Insufficient attendance and impossible constraints fail with a useful error instead of returning a partially invalid lineup. A Web Worker keeps generation off the UI thread and can be cancelled.

Supported bound: 1–40 present players, 1–22 field positions, 1–12 equal-length periods. This is a bounded heuristic for whole-game fairness and preferences, not a claim of globally optimal scheduling. It does not model season-level fairness or different period durations.

## API integration

Set the deployed `zackJKnight/lineup-coach-api` base URL in Settings. Leave it empty for local-only operation. No deployed API URL was available for live integration verification.

Changes commit to local data and a coalescing outbox in one transaction. Sync uses PUT and falls back to POST on 404, retaining client IDs; deletes accept 404. Failure preserves pending changes. Acknowledgments clear only the uploaded revision, so edits made during an upload remain pending. Startup, online events and a 30-second retry trigger synchronization. Changing destinations queues a fresh snapshot. A stale second tab is prevented from overwriting newer local state.

The API's current main.ts stores arbitrary properties while its OpenAPI schema omits team membership and game-specific attendance. The adapter sends additive `playerIds`, `positionIds`, `teamId`, `attendance`, `periodCount`, `minutes`, `locks` and `seed` properties. These work with the inspected permissive implementation, but a schema-enforcing server would need those fields added. Each period has a separate lineup record. Generated bench position records use game-scoped IDs. No automatic server download replaces local data; initial importing of server-only rosters is not implemented.

The current API has no CORS middleware. For a separately hosted app, configure the API or a same-origin proxy to allow the exact frontend origin, GET/PUT/POST/DELETE/OPTIONS and Content-Type. Do not point the demo at a service whose writes you do not intend to update.

## Verification

- TypeScript and production bundle pass.
- Focused tests verify player uniqueness, hard exclusions, conflicting locks, insufficient attendance, deterministic output, safe swaps, a 40-player/12-period boundary, persisted attendance/lineups after closing and reopening the database, simultaneous initialization, upload failure/retry, concurrent edits, stale tabs, and destination switching.
- IndexedDB tests use fake-indexeddb; HTTP tests use injected responses matching the inspected API contract. They are not live-server tests.
- `benchmark.json` contains measured Node medians and methodology. Baseline: the previously saved lineup-agent1-improved.zip, using its default settings, not a timed manual planning session or a phone measurement.
- The emitted service worker passes 3 additional checks: cached shell fallback on failed navigation, cached scripts/styles/generation worker with the network unavailable, and cache-version cleanup. These use an in-memory Cache API, not a browser.
- Browser QA was attempted: the supervised app server was healthy, but the cloud browser could not open the preview (ERR_BLOCKED_BY_CLIENT). Visual/touch QA, real installed-PWA restart behavior, and live API/CORS validation therefore remain unverified in this environment. The app includes a feature-detected read_current_lineup WebMCP tool; a supported live WebMCP context was unavailable for verification.

## Demo sequence

1. Open the fictional U10 Eagles team; adjust attendance.
2. Generate and review the period tables and playing-time summary.
3. Swap two players; lock a position; regenerate.
4. Mark too few players present to see explicit input rejection.
5. After the initial online visit and service-worker installation, try offline reload on the target demo device before presenting.

Source reference repositories were read only. The original Angular app and API were not modified.
