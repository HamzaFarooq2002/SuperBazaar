# SuperBazaar

Full-stack prototype for an open-banking style commerce and SME finance experience which contains marketplace, BNPL, bank-facilitated inventory financing, Pay by Bank (demo), and ML-backed credit scoring via a separate FastAPI service.

## Repository layout

| Path | Role |
|------|------|
| [`src/`](src/) | React (Vite) frontend |
| [`SuperBazaar_backend/superbazaar-backend/`](SuperBazaar_backend/superbazaar-backend/) | Express + MongoDB API |

Detailed API docs, seed users, and curl examples live in [SuperBazaar_backend/superbazaar-backend/README.md](SuperBazaar_backend/superbazaar-backend/README.md).

## Prerequisites

- Node.js 18+ (16+ may work; use 18+ for consistency)
- MongoDB (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for hosted data
- Optional: Python FastAPI service for live credit scoring (see backend `FASTAPI_URL`)

## Local development

### 1. Backend

```bash
cd SuperBazaar_backend/superbazaar-backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, and FASTAPI_URL if you run the scorer
npm install
npm run seed   # optional: sample merchant/supplier/products
npm run dev    # or: npm start
```

API defaults to `http://localhost:5000` (or whatever `PORT` you set).

### 2. Frontend

From the **repository root**:

```bash
cp .env.example .env
# Edit .env: VITE_BACKEND_URL should match your API (e.g. http://localhost:5000)
npm install
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

### 3. Production-style env (summary)

| Where | Variable | Purpose |
|-------|----------|---------|
| Frontend build (e.g. Vercel) | `VITE_BACKEND_URL` | Public URL of the Node API (no `/api` suffix unless your client expects it) |
| Backend (e.g. Render) | `MONGODB_URI` | Atlas or other Mongo connection string; URL-encode special characters in passwords |
| Backend | `JWT_SECRET` | Strong secret; changing it invalidates existing tokens |
| Backend | `FASTAPI_URL` | Base URL of the credit API only, e.g. `https://your-service.onrender.com` — **no trailing slash** |

Frontend env vars must be present **at build time** for Vite (`VITE_*`).

## npm scripts

**Root (frontend)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

**Backend** (`SuperBazaar_backend/superbazaar-backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Nodemon |
| `npm start` | Node `server.js` |
| `npm run seed` | Seed sample data |

## Git and dependencies

Prefer **not** committing local `node_modules` churn. If `node_modules` is tracked historically, reset noise before committing:

```bash
git restore node_modules
```

Long term, add `node_modules/` to `.gitignore` and stop tracking that folder in Git if you want a standard Node layout.

## License

See backend README or your course/project policy for attribution.
