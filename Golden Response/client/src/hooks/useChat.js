import { useState, useCallback } from 'react';
import chatService from '../services/chatService';
import toast from 'react-hot-toast';

const useChat = (analysisId = null) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await chatService.getChatHistory();
      if (response.success) {
        setSessions(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessionMessages = useCallback(async (sessionId) => {
    setLoading(true);
    try {
      const response = await chatService.getChatSession(sessionId);
      if (response.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      toast.error('Failed to load chat messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (content, sessionId = null) => {
    setLoading(true);
    try {
      const response = await chatService.sendMessage({
        content,
        analysisId,
        sessionId,
      });

      if (response.success) {
        // Update messages with the new user message and the assistant response
        setMessages((prev) => [
          ...prev,
          { role: 'user', content, timestamp: new Date() },
          response.data.message,
        ]);
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const response = await chatService.deleteChatSession(sessionId);
      if (response.success) {
        setSessions((prev) => prev.filter((s) => s._id !== sessionId));
        toast.success('Chat session deleted');
      }
    } catch (err) {
      toast.error('Failed to delete chat session');
    }
  };

  return {
    messages,
    setMessages,
    loading,
    sessions,
    fetchSessions,
    fetchSessionMessages,
    sendMessage,
    deleteSession,
  };
};

export default useChat;
