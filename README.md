# GitInsight — GitHub Profile Analyzer

> Deep developer intelligence from public GitHub data. Analyze any GitHub profile in seconds — scores, visual analytics, recruiter reports, and resume bullet points.

[![GitInsight](https://img.shields.io/badge/GitInsight-1.0.0-6C63FF?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)

---

## Features

- **Profile Score (0–100)** across 7 weighted dimensions
- **Repository analysis** — health, complexity, documentation, and activity for every repo
- **Developer Insights** — career level, coding personality, collaboration score, innovation index
- **Visual Analytics** — contribution heatmap, commit trends, language chart, repo growth graph
- **Resume Mode** — GitHub data formatted as copy-pasteable resume bullet points
- **Recruiter Mode** — strengths, weaknesses, interview focus areas, risk analysis, salary estimate
- **Smart Detectors** — best project, hidden gem repos, dead repos, most active month
- **Authentication** — sign in with GitHub or Google via Firebase (session persists across page reloads)
- **Profile Quick-Launch** — after GitHub login, your profile card appears on the landing page with a one-click "Analyze me" button

---

## Project Structure

```
gitinsight/
├── frontend/                   # React + Vite + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar (with auth), Footer
│   │   │   ├── ui/             # Card, Badge, Button, ScoreRing, Skeleton
│   │   │   ├── charts/         # Language pie, commit trend, heatmap, timeline
│   │   │   └── analysis/       # ProfileScore, RepositoryCard, InsightPanel,
│   │   │                         ResumeMode, RecruiterMode
│   │   ├── pages/              # Landing, Login, Analyzer, Report, Compare, Saved, About
│   │   ├── hooks/              # useAnalysis, useAuth, useLocalStorage
│   │   ├── lib/                # firebase.ts (auth initialisation)
│   │   ├── services/           # API client
│   │   ├── store/              # Zustand global state (auth + analysis + UI)
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Formatting, colors, helpers
│   ├── .env.example            # ← copy to .env.local and fill in your values
│   └── ...
└── backend/                    # Node.js + Express + TypeScript
    ├── src/
    │   ├── routes/             # GET /analyze/:username, /compare/:u1/:u2
    │   ├── services/           # githubService, analysisService, scoringService
    │   ├── middleware/         # rateLimit, errorHandler
    │   ├── utils/              # cache (node-cache), helpers
    │   └── types/              # Shared TypeScript types
    ├── .env.example            # ← copy to .env and fill in your values
    └── ...
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/your-username/gitinsight.git
cd gitinsight

# Install all dependencies (root + backend + frontend)
npm run install:all
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Then edit each file — see the sections below for what values to fill in.

#### `backend/.env`

```env
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173

# Optional but strongly recommended — raises GitHub API rate limit from 60 → 5,000 req/hour
# Generate at: https://github.com/settings/tokens (no scopes required for public data)
GITHUB_TOKEN=your_github_pat_here
```

#### `frontend/.env.local`

```env
VITE_API_URL=http://localhost:3001

# Firebase — required for GitHub / Google login
# Create a project at https://console.firebase.google.com, then:
# Project Settings → Your Apps → Web App → SDK config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Set Up Firebase Authentication (for login)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project
2. **Build → Authentication → Sign-in method → Enable Google**
3. **Enable GitHub** — copy the callback URL Firebase shows you
4. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps → New OAuth App**
   - Homepage URL: `http://localhost:5173`
   - Callback URL: paste the Firebase callback URL
   - Copy the Client ID and Client Secret → paste back into Firebase's GitHub provider settings
5. In Firebase: **Project Settings → Your apps → Add web app** → copy the config values into `frontend/.env.local`

> Analysis works without login — authentication is only needed to unlock the "Analyze my profile" quick-launch card on the landing page.

### 4. Run Development

```bash
# From root — starts both servers concurrently
npm run dev

# Or separately:
npm run dev:backend    # http://localhost:3001
npm run dev:frontend   # http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analyze/:username` | Full profile analysis |
| GET | `/api/compare/:user1/:user2` | Side-by-side comparison |
| GET | `/api/user/:username` | Quick user lookup |
| GET | `/api/health` | Health check |

All responses:
```json
{ "success": true, "data": { ... } }
```

---

## Scoring System

### Profile Score Dimensions

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Code Quality | 25% | Stars, license, description, repo count |
| Community Engagement | 20% | Followers, forks, total stars |
| Consistency | 20% | Active weeks, event volume |
| Profile Completeness | 10% | Bio, location, email, website |
| Open Source Activity | 10% | PR events, issue activity |
| Language Diversity | 10% | Unique languages and topics |
| README Quality | 5% | Description length and presence |

### Career Level Estimation

Derived from: `account_age × 2 + own_repos × 3 + total_stars × 0.5 + events × 0.2`

| Range | Level |
|-------|-------|
| < 30 | Beginner |
| 30–120 | Intermediate |
| 120–400 | Advanced |
| 400+ | Expert |

---

## Security

No secrets are ever hardcoded in source files.

| File | Git status | Contains |
|------|-----------|---------|
| `backend/.env` | 🔒 gitignored | Real tokens (GITHUB_TOKEN) |
| `frontend/.env.local` | 🔒 gitignored | Real Firebase keys |
| `backend/.env.example` | ✅ tracked | Placeholder values only |
| `frontend/.env.example` | ✅ tracked | Placeholder values only |

Firebase keys are loaded exclusively via `import.meta.env.VITE_*` — never hardcoded.
The GitHub PAT is loaded via `process.env.GITHUB_TOKEN` in the backend service — never exposed to the client.

---

## Deployment

### Frontend → Vercel

1. Push to GitHub and import the project in [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variables in the Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
4. Add your Vercel domain to Firebase → Authentication → Authorized domains
5. Deploy

### Backend → Render

1. Create a **Web Service** on [Render](https://render.com), set Root Directory to `backend`
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Add environment variables:
   ```
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   GITHUB_TOKEN=your_github_pat
   ```
5. Deploy

The `render.yaml` in the root automates backend setup via Render's Blueprint feature.

---

## Rate Limiting

| Limit | Value |
|-------|-------|
| GitHub API (with token) | 5,000 req/hour |
| GitHub API (no token) | 60 req/hour |
| Analysis requests (per IP) | 10/minute (enforced by backend) |
| Profile cache TTL | 10 minutes |

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** — component framework
- **Vite** — build tool & dev server
- **TailwindCSS** — utility-first styling
- **Framer Motion** — animations & transitions
- **Recharts** — data visualisation
- **Zustand** — global state with localStorage persistence
- **Firebase Auth** — GitHub & Google OAuth
- **React Router v6** — client-side routing
- **Lucide React** — icons

### Backend
- **Node.js + Express** — API server
- **TypeScript** — type safety
- **Axios** — GitHub REST API v3 client
- **node-cache** — in-memory response caching
- **express-rate-limit** — per-IP rate limiting
- **Helmet** — HTTP security headers
- **Compression** — gzip responses
- **Morgan** — request logging

---

## License

MIT
