# GitInsight Setup Guide

## Problem: Missing package.json in root

If you get an error about missing `package.json` in the root directory, it's because:

1. The zip file may have extracted with an extra `gitinsight/` folder layer
2. Or the file didn't copy properly during unzip

## Solution 1: Direct Installation (Recommended)

Instead of using `npm run install:all`, install each package separately:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

## Solution 2: Recreate Root package.json

If the root `package.json` is missing, create it manually:

Create a file named `package.json` in your gitinsight root directory with this content:

```json
{
  "name": "gitinsight",
  "version": "1.0.0",
  "private": true,
  "description": "GitInsight — GitHub Profile Analyzer",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install --prefix backend && npm install --prefix frontend",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then run:
```bash
npm install
npm run install:all
```

## Solution 3: Just Start Developing

You don't need the root scripts. Just do this:

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

Backend will start on `http://localhost:3001`

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## Verify Your Folder Structure

You should have:

```
gitinsight/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── package.json          ← This might be missing
├── README.md
└── ...
```

If you **don't see `package.json` in the root**, use **Solution 2** above to create it.

---

## Environment Files

Make sure you have `.env` files set up:

### `backend/.env`
```
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:3001
```

Both `.env.example` files are already in the project — you can just copy them:

```bash
# Windows
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env

# Mac/Linux
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

## If Still Getting Errors

1. **Delete `node_modules` folders** and try installing again:
   ```bash
   cd backend && rm -rf node_modules && npm install
   cd ../frontend && rm -rf node_modules && npm install
   ```

2. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

3. **Check Node version** (must be 18+):
   ```bash
   node --version
   npm --version
   ```

---

## Quick Start Summary

```bash
# 1. Navigate to project root
cd gitinsight

# 2. Install dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Create env files (copy examples)
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env

# 4a. Run both servers together (Windows/Mac/Linux - if you have concurrently installed globally)
npm run dev

# 4b. Or run separately in two terminals:
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# 5. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001/api/health
```

Done! 🚀
