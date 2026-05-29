import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSend, loading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (message.trim() && !loading) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-200 shadow-sm focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask ResumeAI anything..."
          className="flex-grow bg-transparent border-none focus:ring-0 resize-none py-2 px-3 text-sm text-gray-700 max-h-40"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!message.trim() || loading}
          className={`p-2 rounded-xl transition-colors ${
            !message.trim() || loading
              ? 'text-gray-300'
              : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </motion.button>
      </div>
      <p className="text-[10px] text-center text-gray-400 mt-2">
        ResumeAI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
