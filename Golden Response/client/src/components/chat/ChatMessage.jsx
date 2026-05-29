import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const ChatMessage = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div
        className={`max-w-[85%] lg:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-indigo'}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div
          className={`text-[10px] mt-2 font-medium ${
            isUser ? 'text-indigo-200' : 'text-gray-400'
          }`}
        >
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
