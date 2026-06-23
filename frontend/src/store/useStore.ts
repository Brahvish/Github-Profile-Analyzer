import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FullAnalysis, SavedReport, SearchHistoryItem } from '@/types';

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Current analysis
  currentAnalysis: FullAnalysis | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  setCurrentAnalysis: (analysis: FullAnalysis | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisError: (err: string | null) => void;

  // Saved reports
  savedReports: SavedReport[];
  saveReport: (username: string, analysis: FullAnalysis) => void;
  deleteReport: (username: string) => void;

  // Search history
  searchHistory: SearchHistoryItem[];
  addToHistory: (item: SearchHistoryItem) => void;
  clearHistory: () => void;

  // Bookmarked repos
  bookmarkedRepos: string[];
  toggleBookmark: (repoFullName: string) => void;

  // UI modes
  isResumeMode: boolean;
  isRecruiterMode: boolean;
  toggleResumeMode: () => void;
  toggleRecruiterMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDarkMode: true,
      toggleDarkMode: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        document.documentElement.classList.toggle('dark', next);
        document.documentElement.classList.toggle('light', !next);
      },

      currentAnalysis: null,
      isAnalyzing: false,
      analysisError: null,
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      setAnalysisError: (err) => set({ analysisError: err }),

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

      searchHistory: [],
      addToHistory: (item) => {
        const history = get().searchHistory.filter(h => h.username !== item.username);
        set({ searchHistory: [item, ...history].slice(0, 15) });
      },
      clearHistory: () => set({ searchHistory: [] }),

      bookmarkedRepos: [],
      toggleBookmark: (repoFullName) => {
        const bookmarks = get().bookmarkedRepos;
        if (bookmarks.includes(repoFullName)) {
          set({ bookmarkedRepos: bookmarks.filter(b => b !== repoFullName) });
        } else {
          set({ bookmarkedRepos: [...bookmarks, repoFullName] });
        }
      },

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
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        savedReports: state.savedReports,
        searchHistory: state.searchHistory,
        bookmarkedRepos: state.bookmarkedRepos,
      }),
    }
  )
);
