# GitInsight — Windows Quick Start

## What You Need
- Node.js 18+ ([download](https://nodejs.org/))
- Git (optional)
- PowerShell or Command Prompt

## Step 1: Extract the Zip

Extract `gitinsight.zip` to your Desktop or desired location.

You should see a folder structure like:
```
gitinsight/
├── backend/
├── frontend/
├── package.json
├── README.md
├── SETUP.md
└── ...
```

## Step 2: Open PowerShell in the gitinsight Folder

1. Open the `gitinsight` folder in Windows Explorer
2. Click the address bar and type `powershell`
3. Press Enter (this opens PowerShell in that folder)

**Or manually:**
- Open PowerShell
- Type: `cd C:\Users\YourUsername\Desktop\gitinsight` (adjust path)
- Press Enter

## Step 3: Install Dependencies

Copy and paste this into PowerShell:

```powershell
cd backend
npm install
cd ../frontend
npm install
cd ..
```

This takes 2-3 minutes. Don't close PowerShell while it's installing.

## Step 4: Set Up Environment Files

Copy the `.env.example` files to `.env`:

```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

## Step 5: Start Both Servers

Open **TWO PowerShell windows** in the `gitinsight` folder.

### PowerShell Window 1 - Backend:
```powershell
cd backend
npm run dev
```

You should see:
```
🚀 GitInsight API running on port 3001
```

### PowerShell Window 2 - Frontend:
```powershell
cd frontend
npm run dev
```

You should see:
```
VITE v5.1.0 ready in 245 ms
➜ Local: http://localhost:5173/
```

## Step 6: Open in Browser

Click the link or go to: **http://localhost:5173**

You should see the GitInsight landing page.

---

## Troubleshooting

### Error: "npm is not recognized"

Node.js isn't installed or not in your PATH. 
- Download and install from https://nodejs.org/
- Restart PowerShell after installing

### Error: "npm ERR! code ENOENT"

The folder structure might be wrong. Check:
```powershell
ls backend/
ls frontend/
ls package.json
```

Should show files in each folder.

### Port 3001 or 5173 Already in Use

Change the port in the `.env` file:
- `backend/.env`: Change `PORT=3001` to `PORT=3002`
- `frontend/.env`: Change `VITE_API_URL=http://localhost:3001` to `http://localhost:3002`

### "Cannot find module" errors

Delete and reinstall:
```powershell
cd backend
rm -recurse node_modules
npm install
cd ../frontend
rm -recurse node_modules
npm install
```

---

## Commands Cheat Sheet

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start frontend (from `frontend/` folder) |
| `npm run build` | Build for production |
| `npm run dev` | Start backend (from `backend/` folder) |
| `npm install` | Install dependencies |
| `node --version` | Check Node version |
| `npm --version` | Check npm version |

---

## Next Steps

Once both servers are running:

1. **Try analyzing a profile**: Enter `torvalds` (Linus Torvalds) and click Analyze
2. **Compare two devs**: Go to Compare tab and try `gaearon` vs `sindresorhus`
3. **Save reports**: Click "Save" to store analyses locally
4. **Check Resume mode**: Toggle in the report header

---

## Questions?

See `README.md` and `SETUP.md` in the project root for full documentation.

Enjoy! 🚀
