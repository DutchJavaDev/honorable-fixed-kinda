# Holotable // Tournament Control

Holotable is a local, browser-based tournament control panel for a free-for-all game night. Add participants, generate balanced tables, record round scores, and follow the live standings through to the final podium.

The interface is styled as a sci-fi tournament console set on a fixed, cinematic blue-sky panorama with a desert horizon and two slightly elevated suns: one bright and pale, the other darker and golden.

## Features

- Add, remove, and validate participant names before the first round.
- Load a ready-made 12-player demo roster.
- Choose between 1 and 12 rounds.
- Generate tables that favor groups of four, then three or five when needed.
- Re-pair players by their current score after each completed round.
- Enter scores from 0 to 3 for each player at every table.
- Track total points, completed rounds, rankings, and the top three players live.
- Show a final tournament summary, podium, rankings, and booster-prize allocation.
- Persist the active session in the browser with `localStorage`.
- Keep a shared player-name database in Postgres, with add, pick, and delete controls.
- Reset the current session and start a fresh tournament.
- Responsive layout for desktop and mobile screens.

## Run locally

No build step or package installation is required.

From the project directory, start any static web server. For example, with Python:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

Opening `index.html` directly may work in many browsers, but using a local server is the more reliable option.

## Deploy on Vercel

1. Import this repository into Vercel.
2. In Vercel, open **Marketplace / Storage**, select the Neon database `neon-charcoal-castle`, and connect it to this project. If it is not connected yet, install Neon and select that existing database.
3. In **Settings → Environment Variables**, confirm that the connection string is available as `DATABASE_URL` for **Production**, **Preview**, and **Development**. `POSTGRES_URL`, `POSTGRES_DATABASE_URL`, and `POSTGRESS_DATABASE_URL` are also supported.
4. Push to Git. Vercel installs `@neondatabase/serverless` and deploys `api/players.js` as a serverless function automatically.
5. Open the deployed app and add a player. The function creates its `players` table automatically on first use.

Do not commit the real connection string. For local development, copy `.env.example` to `.env.local` and fill in the pooled Neon connection string. Vercel environment-variable changes apply to new deployments, so redeploy after changing them.

The player database is intentionally public: anyone who can open the app can add or delete names. The active tournament session remains in each browser’s `localStorage`; use **Add** beside a saved name to put it into the current roster after a refresh.

## How to use

1. Add at least three players, or load the 12-player demo.
2. Set the number of rounds.
3. Select **Generate round one**.
4. Enter a score from 0–3 for every player at each table.
5. Select **Lock scores & continue** to record the round and unlock the next pairing.
6. Repeat until the configured number of rounds is complete.
7. Review the final rankings and prize summary.

The roster becomes locked once round one has been generated. Scores and the current session are saved automatically in the browser. Use **Reset session** to clear them.

## Scoring and pairing

Each player receives the score entered for their table position, with the intended scale being 3 points for first, 2 for second, and 1 for third. The controls accept 0–3 points, so a fourth-place player can receive 0.

Tables are built around the ideal pod size of four players. The pairing logic also supports groups of three and five, and later rounds sort players by their current score before assigning tables.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Application markup, typography imports, and theme overrides. |
| `styles.css` | Main layout, responsive styling, and visual design system. |
| `app.js` | Session state, table generation, scoring, standings, persistence, and UI behavior. |
| `README.md` | Product overview and local development guide. |

## Technical notes

- Plain HTML, CSS, and JavaScript; there are no runtime dependencies.
- Google Fonts are loaded from the network for the intended typography. The app remains functional if they are unavailable.
- Session data is stored under the `holotable-session-v1` key in `localStorage`.
- Tournament session data is still browser-local, while saved player names are shared through the Vercel Postgres API.
- There is no authentication; database add/delete access is intentionally open as requested.

## Keeping this document current

`README.md` is part of the application documentation. Update it whenever a feature, workflow, scoring rule, file structure, or setup requirement changes.

## Current status

The core tournament workflow is implemented: roster setup, table generation, multi-round scoring, live standings, local persistence, reset, and final results are available.
