import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Eye, EyeOff, AlertCircle } from 'lucide-react';
import {
  signInWithPopup,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { auth, githubProvider, googleProvider } from '@/lib/firebase';
import { useStore } from '@/store/useStore';

// ─── Icons ────────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Error messages ───────────────────────────────────────────────────────────

function friendlyError(err: AuthError): string {
  switch (err.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Only one popup can be open at a time.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different provider.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return '⚙️ Firebase is not configured yet. Please add your credentials to .env.local';
    case 'auth/configuration-not-found':
      return '⚙️ Firebase auth is not set up. Check your .env.local file.';
    default:
      return err.message || 'Something went wrong. Please try again.';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginPage() {
  const navigate = useNavigate();
  const { setFirebaseUser, enrichGithubUser } = useStore();

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<null | 'github' | 'google' | 'email'>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => navigate('/');

  // ── GitHub OAuth ────────────────────────────────────────────────────────────
  const handleGithubLogin = async () => {
    setError(null);
    setIsLoading('github');
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // Sync basic Firebase user immediately
      setFirebaseUser(result.user);

      // Enrich with GitHub API data (repos, followers, bio) using the OAuth token
      if (token) {
        try {
          const res = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const ghData = await res.json();
            enrichGithubUser({
              githubUsername: ghData.login,
              githubBio: ghData.bio || '',
              githubPublicRepos: ghData.public_repos,
              githubFollowers: ghData.followers,
              // Override display name/photo with GitHub data if richer
              displayName: ghData.name || result.user.displayName,
              photoURL: ghData.avatar_url || result.user.photoURL,
            });
          }
        } catch {
          // Non-fatal: GitHub API enrichment failed, basic auth still works
        }
      }

      handleSuccess();
    } catch (err) {
      setError(friendlyError(err as AuthError));
    } finally {
      setIsLoading(null);
    }
  };

  // ── Google OAuth ────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading('google');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setFirebaseUser(result.user);
      handleSuccess();
    } catch (err) {
      setError(friendlyError(err as AuthError));
    } finally {
      setIsLoading(null);
    }
  };

  // ── Email / Password ────────────────────────────────────────────────────────
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading('email');
    try {
      if (tab === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setFirebaseUser(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setFirebaseUser(result.user);
      }
      handleSuccess();
    } catch (err) {
      setError(friendlyError(err as AuthError));
    } finally {
      setIsLoading(null);
    }
  };

  const Spinner = ({ color = 'border-t-white' }: { color?: string }) => (
    <span className={`w-4 h-4 border-2 border-white/25 ${color} rounded-full animate-spin`} />
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080A0F] flex flex-col items-center justify-center p-6">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#634FFF]/10 blur-[140px] pointer-events-none animate-orb-1 z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#38BDF8]/8 blur-[120px] pointer-events-none animate-orb-2 z-0" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="self-center"
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <GitBranch className="w-4 h-4 text-accent" />
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">
              Git<span className="text-accent">Insight</span>
            </span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-5 text-center border-b border-white/[0.06]">
            <h1 className="text-2xl font-bold text-white tracking-tight font-heading mb-1.5">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Login with your GitHub or Google account
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6 flex flex-col gap-4">

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-xs leading-relaxed"
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* OAuth buttons */}
            <div className="flex flex-col gap-3">
              {/* GitHub */}
              <button
                id="github-login-btn"
                type="button"
                onClick={handleGithubLogin}
                disabled={isLoading !== null}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.10] text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-white/[0.20] hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading === 'github' ? <Spinner /> : <GitHubIcon />}
                Continue with GitHub
              </button>

              {/* Google */}
              <button
                id="google-login-btn"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading !== null}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.10] text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-white/[0.20] hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading === 'google' ? <Spinner color="border-t-blue-400" /> : <GoogleIcon />}
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-slate-500 font-medium shrink-0">Or continue with email</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Login / Sign up tabs */}
            <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 gap-1">
              {(['login', 'signup'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setError(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === t
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'login' ? 'Log in' : 'Sign up'}
                </button>
              ))}
            </div>

            {/* Email / Password form */}
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-white/[0.06] transition-all"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  {tab === 'login' && (
                    <a href="#" className="text-xs text-accent hover:text-accent-hover underline-offset-2 hover:underline transition-colors">
                      Forgot your password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-white/[0.06] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="email-login-btn"
                type="submit"
                disabled={isLoading !== null}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6D5FFA] to-[#4F46E5] text-white text-sm font-semibold hover:-translate-y-[1px] hover:shadow-[0_4px_24px_rgba(109,95,250,0.45)] active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isLoading === 'email' ? <Spinner /> : (tab === 'login' ? 'Log in' : 'Create account')}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Legal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center text-xs text-slate-600 leading-relaxed px-4"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-slate-400 hover:text-slate-300 underline underline-offset-2 transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-slate-400 hover:text-slate-300 underline underline-offset-2 transition-colors">Privacy Policy</a>.
        </motion.p>
      </div>
    </div>
  );
}
