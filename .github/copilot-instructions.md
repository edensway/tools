Purpose
-------
These instructions give an AI coding agent the project-specific facts needed to get productive quickly in this Vite + React repo.

Quick facts
-----------
- Project type: React app bootstrapped for Vite (see `vite.config.js`).
- Dev server: `npm run dev` (runs `vite`). Build: `npm run build`. Preview: `npm run preview`.
- Lint: `npm run lint` (ESLint via `eslint.config.js`).
- Deploy: `npm run deploy` (uses `gh-pages -d dist`) and `npm run deploy-all` which runs `./scripts/deploy.sh`.
- Router basename: `BrowserRouter` uses `basename="/tools/"` in `src/main.jsx` — do not change without updating `homepage` in `package.json` and the GH Pages settings.
- PWA: `virtual:pwa-register` is used in `src/main.jsx` and `vite-plugin-pwa` is listed in `package.json`.

Where to look first
-------------------
- Routes & entry: `src/main.jsx`, `src/App.jsx` (pages are registered here). Add new tool pages under `src/pages` and register a route in `App.jsx` and a NavLink in `src/components/Navigation.jsx`.
- Pages: `src/pages/*` — each tool is self-contained (example: `BMI.jsx`, `BMR.jsx`, `BodyComposition.jsx`). Inspect these for state, storage, and data dependencies.
- Shared UI: `src/components` (header/navigation and `Engine` form components like `CaliperEngine.jsx`, `TapeEngine.jsx`). These components contain computation logic — prefer minimal breaking changes.
- Styles: `src/styles` (SCSS partials under `Utility`, page-level under `Pages`, components under `Components`). Follow existing SCSS partial pattern when adding styles.
- Static assets & PWA: `public/manifest.json`, `sw.js`, and images under `src/assets`.
- Data: `src/data/cdc_bmi_lms.json` is used by the BMI page; treat JSON shape as authoritative for CDC percentile calculations.

Project patterns & conventions
-----------------------------
- Computations: heavy use of `useMemo` for derived values (see `src/pages/BMI.jsx`) and small local computation modules inside components (see `CaliperEngine.jsx`). Keep expensive calculations inside `useMemo` or callbacks.
- Storage: `BMI.jsx` uses localStorage key `userForm` (object with `unit`, `age`, `gender`, `height`) and sessionStorage key `userWeight`. Preserve these keys if maintaining cross-page UX.
- Units & UI: Unit toggles (Metrics/Imperial) are handled via `unit` state; many numeric inputs accept `step="0.1"`. Keep labels consistent with unit strings (`Metrics` / `Imperial`) to avoid state mismatches.
- Routing & links: Navigation uses `NavLink` and the app root route is `/` mapped to `BMI`. Changing routes should preserve `basename` in `main.jsx`.
- No TypeScript enforcement: repo includes `@types/*` in dev deps but source is JS — do not convert files to TS unless requested.

Editing & adding features
-------------------------
- Add a page: create `src/pages/NewTool.jsx`, export default a React component, add a route in `src/App.jsx`, and a `NavLink` in `src/components/Navigation.jsx`.
- Add shared logic: place reusable helpers near `src/components/Engine` or create `src/lib` for utilities. Follow existing pattern of inline helper functions for small math utilities.
- Styling: add SCSS partial under `src/styles/Utility` or `Components` and import from `src/styles/App.scss` if global, or the page-level SCSS under `src/styles/Pages`.

Testing & verification
----------------------
- Run `npm run dev` and open the dev server URL. Use `npm run build` then `npm run preview` to validate production build.
- Lint with `npm run lint`; fix lint errors conforming to `eslint.config.js` rules.
- For PWA/Service Worker changes, note `registerSW` in `src/main.jsx` uses `virtual:pwa-register` and will be bundled by Vite.

Files that often matter when editing
----------------------------------
- `src/pages/BMI.jsx` — example of data-driven UI (CDC JSON, localStorage/sessionStorage, `useMemo` math). Reference when adding similar calculators.
- `src/components/Engine/*.jsx` — examples of measurement calculation components with immediate state-driven computation.
- `src/App.jsx` and `src/components/Navigation.jsx` — routing and nav patterns.
- `package.json` — scripts and deploy configuration (homepage and `gh-pages` usage).
- `src/main.jsx` — router basename and PWA registration.

Don'ts / gotchas
----------------
- Don't change `basename` in `src/main.jsx` without updating `homepage` in `package.json` and deployment config.
- Avoid converting JS files to TypeScript automatically — this repo is JS-first.
- Do not rename or remove the `userForm` localStorage or `userWeight` sessionStorage keys unless you update all consumers.

If something is unclear
-----------------------
If a required behavior or data shape isn't discoverable in the files above, ask for clarification. Provide a one-line summary of the intended change and where you'd apply it (file path + brief code snippet) before implementing.

---
If you'd like, I can refine this with examples for adding a new page, or merge content from any existing instructions you prefer preserved.
