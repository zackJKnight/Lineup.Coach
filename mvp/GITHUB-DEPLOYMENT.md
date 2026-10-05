# React MVP deployment

Vercel project: `lineup-coach-mvp` in `zacks-projects-d0c08d39`.
Set the project's Git repository to `zackJKnight/Lineup.Coach` and Root Directory to `mvp`.
Use the existing Vite build settings in `vercel.json`.
Keep production branch `master`; this change branch can be reviewed as a preview before merging.

Local verification: `npm ci` then `npm run verify`.

The root route starts with team creation. `/demo` uses a separate local database. Cloud backups go to the existing `lineup-coach-api` Vercel project; the frontend needs no database credentials.

The latest changes show matchup/date/time in the heading, inline compact statistics, and direct record upserts to avoid expected PUT/404 requests. Game time is optional for older saved games. Cloud recovery and account-based multi-device sync are not implemented.

The original .NET/Angular application remains in its existing directories. The Vercel backend source is prepared separately in `zackJKnight/lineup-coach-api`, under `vercel/`.
