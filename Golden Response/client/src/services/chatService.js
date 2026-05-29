import api from './api';

const sendMessage = async (messageData) => {
  const response = await api.post('/chat/send', messageData);
  return response.data;
};

const getChatHistory = async () => {
  const response = await api.get('/chat/history');
  return response.data;
};

const getChatSession = async (sessionId) => {
  const response = await api.get(`/chat/${sessionId}`);
  return response.data;
};

const deleteChatSession = async (sessionId) => {
  const response = await api.delete(`/chat/${sessionId}`);
  return response.data;
};

const chatService = {
  sendMessage,
  getChatHistory,
  getChatSession,
  deleteChatSession,
};

export default chatService;
