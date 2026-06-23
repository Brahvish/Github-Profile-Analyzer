import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function PageLoader() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <ProfileSkeleton />
    </div>
  );
}

export default function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#080A0F]">
        <Navbar />

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyze" element={<AnalyzerPage />} />
              <Route path="/report/:username" element={<ReportPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/saved" element={<SavedReportsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
