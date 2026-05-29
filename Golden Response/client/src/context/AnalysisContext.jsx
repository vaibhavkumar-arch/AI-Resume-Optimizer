import { createContext, useState, useContext, useCallback } from 'react';
import analysisService from '../services/analysisService';
import toast from 'react-hot-toast';

export const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeResume = useCallback(async (resumeId, jobDescription) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analysisService.analyzeResume({ resumeId, jobDescription });
      if (response.success) {
        setCurrentAnalysis(response.data);
        toast.success('Analysis completed successfully!');
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Analysis failed');
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message;
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrentAnalysis]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await analysisService.getAnalysisHistory();
      if (response.success) {
        setHistory(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  }, [setHistory]);

  const getAnalysisById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await analysisService.getAnalysis(id);
      if (response.success) {
        setCurrentAnalysis(response.data);
        return response.data;
      }
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
      toast.error('Failed to load analysis details');
    } finally {
      setLoading(false);
    }
  }, [setCurrentAnalysis]);

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        setCurrentAnalysis,
        history,
        loading,
        error,
        analyzeResume,
        fetchHistory,
        getAnalysisById,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
