import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeUser } from '@/services/api';
import { useStore } from '@/store/useStore';

export function useAnalysis() {
  const navigate = useNavigate();
  const {
    setCurrentAnalysis,
    setIsAnalyzing,
    setAnalysisError,
    addToHistory,
    isAnalyzing,
    analysisError,
    currentAnalysis,
  } = useStore();

  const analyze = useCallback(
    async (username: string, redirect = true) => {
      if (!username.trim()) return;

      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const analysis = await analyzeUser(username.trim());
        setCurrentAnalysis(analysis);
        addToHistory({
          username: analysis.user.login,
          searchedAt: new Date().toISOString(),
          avatarUrl: analysis.user.avatar_url,
          name: analysis.user.name,
        });
        if (redirect) {
          navigate(`/report/${analysis.user.login}`);
        }
        return analysis;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Analysis failed';
        setAnalysisError(message);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [setCurrentAnalysis, setIsAnalyzing, setAnalysisError, addToHistory, navigate]
  );

  return { analyze, isAnalyzing, analysisError, currentAnalysis };
}
