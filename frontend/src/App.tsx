import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/store/useStore';
import { ProfileSkeleton } from '@/components/ui/Skeleton';

// Lazy-loaded pages for optimal bundle splitting
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const AnalyzerPage = lazy(() => import('@/pages/AnalyzerPage').then(m => ({ default: m.AnalyzerPage })));
const ReportPage = lazy(() => import('@/pages/ReportPage').then(m => ({ default: m.ReportPage })));
const ComparePage = lazy(() => import('@/pages/ComparePage').then(m => ({ default: m.ComparePage })));
const SavedReportsPage = lazy(() => import('@/pages/SavedReportsPage').then(m => ({ default: m.SavedReportsPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));

function PageLoader() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <ProfileSkeleton />
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#080A0F]">
      {!isLoginPage && <Navbar />}

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/analyze" element={<AnalyzerPage />} />
            <Route path="/report/:username" element={<ReportPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/saved" element={<SavedReportsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isLoginPage && <Footer />}
    </div>
  );
}

/**
 * Listens to Firebase auth state and syncs to Zustand.
 * Placed inside BrowserRouter so it can use router hooks if needed.
 * Lazy-imports Firebase so the app doesn't crash when env vars aren't set.
 */
function AuthProvider() {
  const { setFirebaseUser, clearAuth } = useStore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    Promise.all([
      import('@/lib/firebase'),
      import('firebase/auth'),
    ]).then(([{ auth }, { onAuthStateChanged }]) => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setFirebaseUser(user);
        } else {
          clearAuth();
        }
      });
    }).catch(() => {
      // Firebase not yet configured — silent fail, login page shows friendly message
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, [setFirebaseUser, clearAuth]);

  return null;
}

export default function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <AuthProvider />
      <AppShell />
    </BrowserRouter>
  );
}
