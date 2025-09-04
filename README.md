# NPM Package Dependency Inspector

Single-page app that fetches package metadata from the public NPM Registry and shows a quick **Package Scorecard**:

- Current Version
- License
- Weekly Downloads
- Number of Dependencies
- Unpacked Size
- Date of Last Publish

## Quick Start (Local)
```bash
npm i
npm run dev
```
Visit http://localhost:5173.

## Docker
Build and run with Docker:
```bash
docker compose up --build
```
App will be available on http://localhost:4173.

## Git Hook (Pre-commit)
This project uses **Husky** to install a pre-commit hook that runs:
- `npm audit --audit-level=high`
- `npm run lint`

Install hooks automatically via `npm install` (script `prepare`). If hooks are not present, run:
```bash
npx husky init
npx husky add .husky/pre-commit "npm run precommit"
```

## CI Pipeline (GitHub Actions)
Workflow at `.github/workflows/ci.yml` runs **lint**, **test**, and **build** on pushes/PRs to `main`. The workflow fails if any job fails.

## Design Choices
- **Vite + React + TS** for fast DX and type safety.
- **Node 20 (Debian bullseye)** base images to align with Debian-based environments.
- **No backend**: all data fetched directly from public endpoints.

## APIs
- Registry metadata: `https://registry.npmjs.org/<package>`
- Weekly downloads: `https://api.npmjs.org/downloads/point/last-week/<package>`
