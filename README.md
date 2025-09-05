````md
# NPM Package Dependency Inspector

A single-page web application that fetches package metadata from the public NPM Registry and displays a quick, visual Package Scorecard for any given NPM package.

### Package Scorecard includes:
- **Current Version** – latest published version  
- **License** – license identifier or custom license field  
- **Weekly Downloads** – total downloads in the last 7 days  
- **Number of Dependencies** – runtime dependencies count  
- **Unpacked Size** – size of the published package when unpacked  
- **Date of Last Publish** – timestamp of the most recent version  

---

## Architecture & Implementation

### Frontend
- **Framework**: React 18 with TypeScript  
- **Bundler/Dev Server**: Vite for fast builds 
- **UI**: Minimal CSS with a simple dark theme  

### Data Fetching
- **NPM Registry API**  
  `https://registry.npmjs.org/<package>` → Full package metadata including versions, dist-tags, license, dependencies.  
- **NPM Downloads API**  
  `https://api.npmjs.org/downloads/point/last-week/<package>` → Weekly download counts.  

**`fetchScorecard()`** in `src/lib/npm.ts`:
1. Normalizes package names (case-insensitive).
2. Fetches both APIs in sequence.
3. Parses responses safely with null/undefined handling.
4. Returns a `Scorecard` object for the UI layer.

### UI Flow
- **App.tsx**  
  - Search input + “Inspect” button  
  - Loading state while fetching  
  - `<ScorecardView />` renders metadata grid  
  - Error handling for missing/invalid packages  

---

## Quick Start (Local Development)

1. Install dependencies:
```bash
npm install
````

2. Start Vite dev server:

```bash
npm run dev
```

3. Visit:
   [http://localhost:5173](http://localhost:5173)

Hot reload is enabled for instant feedback.

---

## Docker Support

Run with Docker Compose:

```bash
docker compose up --build
```

Visit [http://localhost:4173](http://localhost:4173).

Dockerfiles use **Node 20 (Debian Bullseye)** for consistency across environments.

---

## Git Hooks (Husky)

Pre-commit hooks run:

* `npm audit --audit-level=high`
* `npm run lint`

Hooks install automatically with `npm install`.
If missing, run:

```bash
npx husky init
npx husky add .husky/pre-commit "npm run precommit"
```

---

## CI Pipeline (GitHub Actions)

Located at `.github/workflows/ci.yml`:

* Runs on pushes and pull requests to `main`
* Executes lint, build, and future test steps
* Workflow fails on any job failure

---

## Design Decisions

| Choice                 | Reason                                             |
| ---------------------- | -------------------------------------------------- |
| **Vite + React + TS**  | Modern DX, type safety, fast builds                |
| **No backend**         | Simpler architecture; fetch directly from NPM APIs |
| **Dockerized**         | Consistent local/production builds                 |
| **Node 20 (Bullseye)** | Modern LTS version, Debian-based environment       |
| **Husky Hooks**        | Enforce quality & security pre-commit              |

---

## APIs Used

| Purpose          | Endpoint Example                                        |
| ---------------- | ------------------------------------------------------- |
| Package metadata | `https://registry.npmjs.org/react`                      |
| Weekly downloads | `https://api.npmjs.org/downloads/point/last-week/react` |tarball

---

## Future Enhancements

* Multiple package lookups in a single request
* Dependency graph visualization (D3 or similar)
* Offline caching for frequent packages
* Unit tests for data fetching & UI components
* CI/CD deployment via GitHub Pages or cloud platforms

---

```
```
