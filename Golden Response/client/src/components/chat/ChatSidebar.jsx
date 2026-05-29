import { motion } from 'framer-motion';

const ChatSidebar = ({ sessions, activeSessionId, onSessionSelect, onDeleteSession, loading }) => {
  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-white">
        <button
          onClick={() => onSessionSelect(null)}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {loading && sessions.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                activeSessionId === session._id
                  ? 'bg-indigo-50 border border-indigo-100'
                  : 'bg-white border border-transparent hover:border-gray-200'
              }`}
              onClick={() => onSessionSelect(session._id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <svg
                  className={`w-4 h-4 flex-shrink-0 ${
                    activeSessionId === session._id ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span
                  className={`text-sm font-medium truncate ${
                    activeSessionId === session._id ? 'text-indigo-900' : 'text-gray-700'
                  }`}
                >
                  {session.title || 'New Chat'}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-gray-500 mt-8 italic">No chat history yet.</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
