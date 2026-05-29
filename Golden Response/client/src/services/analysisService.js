import api from './api';

const analyzeResume = async (analysisData) => {
  const response = await api.post('/analysis/analyze', analysisData);
  return response.data;
};

const uploadJDFile = async (formData) => {
  const response = await api.post('/analysis/upload-jd', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const getAnalysis = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

const getAnalysisHistory = async () => {
  const response = await api.get('/analysis/history');
  return response.data;
};

const deleteAnalysis = async (id) => {
  const response = await api.delete(`/analysis/${id}`);
  return response.data;
};

const analysisService = {
  analyzeResume,
  uploadJDFile,
  getAnalysis,
  getAnalysisHistory,
  deleteAnalysis,
};

export default analysisService;
