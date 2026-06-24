import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';

// ─── Runtime guard ────────────────────────────────────────────────────────────
// If the env vars aren't set, warn clearly in dev instead of a cryptic Firebase error.
if (import.meta.env.DEV) {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ];
  const missing = required.filter(
    key => !import.meta.env[key] || import.meta.env[key].includes('your_')
  );
  if (missing.length > 0) {
    console.warn(
      `[GitInsight] Firebase is not configured.\n` +
      `Missing/placeholder vars in frontend/.env.local:\n` +
      missing.map(k => `  • ${k}`).join('\n') +
      `\n\nCopy frontend/.env.example → frontend/.env.local and fill in your Firebase project values.`
    );
  }
}

// ─── Config (values come from .env.local — never hardcoded) ──────────────────
const firebaseConfig = {
  apiKey:     import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:      import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ─── Providers ────────────────────────────────────────────────────────────────

// GitHub — request read access to public profile + email
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

// Google — request basic profile info
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
