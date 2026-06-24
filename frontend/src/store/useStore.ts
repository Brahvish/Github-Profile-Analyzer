import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User as FirebaseUser } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FullAnalysis, SavedReport, SearchHistoryItem } from '@/types';

// Serialisable snapshot of the logged-in user stored in Zustand / localStorage.
// Firebase User objects are NOT serialisable, so we extract what we need.
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Provider-specific fields populated after sign-in
  provider: 'github' | 'google' | 'email';
  // GitHub-specific (only populated for GitHub sign-in)
  githubUsername?: string;
  githubBio?: string;
  githubPublicRepos?: number;
  githubFollowers?: number;
}

interface AppState {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  authUser: AuthUser | null;
  /** Called by useAuth hook when Firebase reports a signed-in user */
  setFirebaseUser: (user: FirebaseUser) => void;
  /** Called by useAuth hook after sign-in to enrich with GitHub API data */
  enrichGithubUser: (data: Partial<AuthUser>) => void;
  /** Signs out from Firebase and clears local state */
  logout: () => Promise<void>;
  /** Clears auth state (called when Firebase reports no user) */
  clearAuth: () => void;

  // ─── Theme ─────────────────────────────────────────────────────────────────
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // ─── Analysis ──────────────────────────────────────────────────────────────
  currentAnalysis: FullAnalysis | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  setCurrentAnalysis: (analysis: FullAnalysis | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisError: (err: string | null) => void;

  // ─── Saved reports ─────────────────────────────────────────────────────────
  savedReports: SavedReport[];
  saveReport: (username: string, analysis: FullAnalysis) => void;
  deleteReport: (username: string) => void;

  // ─── Search history ────────────────────────────────────────────────────────
  searchHistory: SearchHistoryItem[];
  addToHistory: (item: SearchHistoryItem) => void;
  clearHistory: () => void;

  // ─── Bookmarks ─────────────────────────────────────────────────────────────
  bookmarkedRepos: string[];
  toggleBookmark: (repoFullName: string) => void;

  // ─── UI modes ──────────────────────────────────────────────────────────────
  isResumeMode: boolean;
  isRecruiterMode: boolean;
  toggleResumeMode: () => void;
  toggleRecruiterMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────────────────────
      authUser: null,

      setFirebaseUser: (user: FirebaseUser) => {
        const provider = user.providerData[0]?.providerId?.includes('github')
          ? 'github'
          : user.providerData[0]?.providerId?.includes('google')
          ? 'google'
          : 'email';

        set({
          authUser: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider,
          },
        });
      },

      enrichGithubUser: (data) => {
        const current = get().authUser;
        if (!current) return;
        set({ authUser: { ...current, ...data } });
      },

      logout: async () => {
        await signOut(auth);
        set({ authUser: null });
      },

      clearAuth: () => set({ authUser: null }),

      // ── Theme ─────────────────────────────────────────────────────────────
      isDarkMode: true,
      toggleDarkMode: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        document.documentElement.classList.toggle('dark', next);
        document.documentElement.classList.toggle('light', !next);
      },

      // ── Analysis ──────────────────────────────────────────────────────────
      currentAnalysis: null,
      isAnalyzing: false,
      analysisError: null,
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      setAnalysisError: (err) => set({ analysisError: err }),

      // ── Saved reports ─────────────────────────────────────────────────────
      savedReports: [],
      saveReport: (username, analysis) => {
        const reports = get().savedReports.filter(r => r.username !== username);
        set({
          savedReports: [
            { username, savedAt: new Date().toISOString(), analysis },
            ...reports,
          ].slice(0, 20),
        });
      },
      deleteReport: (username) => {
        set({ savedReports: get().savedReports.filter(r => r.username !== username) });
      },

      // ── Search history ────────────────────────────────────────────────────
      searchHistory: [],
      addToHistory: (item) => {
        const history = get().searchHistory.filter(h => h.username !== item.username);
        set({ searchHistory: [item, ...history].slice(0, 15) });
      },
      clearHistory: () => set({ searchHistory: [] }),

      // ── Bookmarks ─────────────────────────────────────────────────────────
      bookmarkedRepos: [],
      toggleBookmark: (repoFullName) => {
        const bookmarks = get().bookmarkedRepos;
        if (bookmarks.includes(repoFullName)) {
          set({ bookmarkedRepos: bookmarks.filter(b => b !== repoFullName) });
        } else {
          set({ bookmarkedRepos: [...bookmarks, repoFullName] });
        }
      },

      // ── UI modes ──────────────────────────────────────────────────────────
      isResumeMode: false,
      isRecruiterMode: false,
      toggleResumeMode: () => {
        set({ isResumeMode: !get().isResumeMode, isRecruiterMode: false });
      },
      toggleRecruiterMode: () => {
        set({ isRecruiterMode: !get().isRecruiterMode, isResumeMode: false });
      },
    }),
    {
      name: 'gitinsight-store',
      // Note: authUser is NOT persisted — Firebase's onAuthStateChanged restores
      // the session from its own storage on every page load via useAuth.
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        savedReports: state.savedReports,
        searchHistory: state.searchHistory,
        bookmarkedRepos: state.bookmarkedRepos,
      }),
    }
  )
);
