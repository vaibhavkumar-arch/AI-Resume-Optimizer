import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useChat from '../hooks/useChat';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import Loader from '../components/common/Loader';

const ChatPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const analysisId = queryParams.get('analysisId');

  const {
    messages,
    loading,
    sessions,
    fetchSessions,
    fetchSessionMessages,
    sendMessage,
    deleteSession,
  } = useChat(analysisId);

  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSessionSelect = (sessionId) => {
    setActiveSessionId(sessionId);
    if (sessionId) {
      fetchSessionMessages(sessionId);
    } else {
      // Clear messages for a new chat
      // In a real app, you might want to reset the useChat state
      window.location.href = '/chat';
    }
  };

  const handleSendMessage = async (content) => {
    const response = await sendMessage(content, activeSessionId);
    if (response && response.success && !activeSessionId) {
      // If it was a new chat, a session was created
      setActiveSessionId(response.data.sessionId);
      fetchSessions();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="hidden lg:block overflow-hidden"
      >
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onDeleteSession={deleteSession}
          loading={loading && sessions.length === 0}
        />
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hidden lg:block"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Career Coach AI</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500 font-medium">Online</span>
              </div>
            </div>
          </div>
          
          {analysisId && (
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
              Context: Analysis #{analysisId.slice(-4)}
            </div>
          )}
        </header>

        <ChatWindow messages={messages} loading={loading} />
        
        <ChatInput onSend={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
};

export default ChatPage;
