# GitInsight — GitHub Profile Analyzer

> Deep developer intelligence from public GitHub data. No API keys, no OAuth, no login required.

![GitInsight](https://img.shields.io/badge/GitInsight-1.0.0-6C63FF?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)

## What It Does

GitInsight analyzes any public GitHub profile and generates a complete developer intelligence report:

- **Profile Score (0–100)** across 7 weighted dimensions
- **Repository analysis** — health, complexity, documentation, activity for every repo
- **Developer Insights** — career level, coding personality, collaboration score, innovation index
- **Visual Analytics** — contribution heatmap, commit trends, language pie chart, repo growth graph
- **Resume Mode** — GitHub data formatted as copy-pasteable resume bullet points
- **Recruiter Mode** — strengths, weaknesses, interview focus areas, risk analysis, salary estimate
- **Smart Detectors** — best project, hidden gem repo, dead repos, most active month

---

## Project Structure

```
gitinsight/
├── frontend/          # React + Vite + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/    # Navbar, Footer
│   │   │   ├── ui/        # Card, Badge, Button, ScoreRing, Skeleton
│   │   │   ├── charts/    # Language pie, commit trend, heatmap, timeline
│   │   │   └── analysis/  # ProfileScore, RepositoryCard, InsightPanel,
│   │   │                    ResumeMode, RecruiterMode
│   │   ├── pages/         # Landing, Analyzer, Report, Compare, Saved, About
│   │   ├── hooks/         # useAnalysis, useLocalStorage, useDebounce
│   │   ├── services/      # API client
│   │   ├── store/         # Zustand global state
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Formatting, colors, helpers
│   └── ...
└── backend/           # Node.js + Express + TypeScript
    ├── src/
    │   ├── routes/        # GET /analyze/:username, /compare/:u1/:u2
    │   ├── services/      # githubService, analysisService, scoringService
    │   ├── middleware/     # rateLimit, errorHandler
    │   ├── utils/         # cache (node-cache), helpers
    │   └── types/         # Shared TypeScript types
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

# Install everything
npm run install:all
# or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

No API keys needed. The only variable to set is `ALLOWED_ORIGINS` in the backend.

### 3. Run Development

```bash
# From root — starts both servers
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:5173
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
{
  "success": true,
  "data": { ... }
}
```

---

## Scoring System

### Profile Score

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

Derived deterministically from: `account_age × 2 + own_repos × 3 + total_stars × 0.5 + events × 0.2`

| Range | Level |
|-------|-------|
| < 30 | Beginner |
| 30–120 | Intermediate |
| 120–400 | Advanced |
| 400+ | Expert |

---

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Deploy

### Backend → Render

1. Push to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Root Directory** to `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm run start`
6. Set environment variable:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   NODE_ENV=production
   ```
7. Deploy

The `render.yaml` file in the root automates this if you use Render's Blueprint feature.

---

## Rate Limiting

GitHub's public API allows **60 unauthenticated requests per hour per IP**. GitInsight:

- Caches profile analyses for **10 minutes** (node-cache in backend)
- Caches individual GitHub API responses at the HTTP layer
- Enforces its own rate limit: **10 analysis requests per minute** per IP
- Fetches repos, events, and user data in parallel where possible

If you hit the GitHub rate limit, the error message will tell you when it resets.

---

## Features Breakdown

### Report Page Tabs

| Tab | Contents |
|-----|----------|
| Overview | Language chart, heatmap, commit trend, activity timeline, top repos |
| Repositories | All repos with filters (own / forked / all), health scores, bookmarks |
| Analytics | Bar charts, area charts, contribution heatmap |
| Insights | Score rings, personality, career level, special detectors |

### Modes (toggleable in report header)

- **Resume Mode** — structured, copy-pasteable resume sections
- **Recruiter Mode** — hiring verdict, strengths, gaps, interview focus, salary range

### Persistent Features

All saved to `localStorage` via Zustand's persist middleware:
- Dark/light mode preference
- Search history (last 15 searches)
- Saved reports (up to 20, with full analysis data)
- Bookmarked repositories

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** — component framework
- **Vite** — build tool
- **TailwindCSS** — styling
- **Framer Motion** — animations
- **Recharts** — data visualization
- **Zustand** — global state with persistence
- **React Router v6** — routing
- **date-fns** — date utilities
- **Lucide React** — icons

### Backend
- **Node.js + Express** — API server
- **TypeScript** — type safety
- **Axios** — GitHub API client
- **node-cache** — in-memory caching
- **express-rate-limit** — rate limiting
- **Helmet** — security headers
- **Compression** — gzip responses
- **Morgan** — request logging

---

## License

MIT
