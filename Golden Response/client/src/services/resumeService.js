import api from './api';

const uploadResume = async (formData) => {
  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getAllResumes = async () => {
  const response = await api.get('/resume');
  return response.data;
};

const getResume = async (id) => {
  const response = await api.get(`/resume/${id}`);
  return response.data;
};

const deleteResume = async (id) => {
  const response = await api.delete(`/resume/${id}`);
  return response.data;
};

const resumeService = {
  uploadResume,
  getAllResumes,
  getResume,
  deleteResume,
};

export default resumeService;
