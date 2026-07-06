import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://saarthi-3-4xfs.onrender.com/api";

const QUICK_PROMPTS = [
  'How do I book an appointment?',
  'Which doctor should I see for a fever?',
  'How do I cancel my appointment?',
  'I have a headache, what should I do?',
];

const getToken = () => {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('userToken') ||
    localStorage.getItem('saarthi_token') ||
    localStorage.getItem('authToken')
  );
};

const request = async (url, options = {}) => {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
};

const api = {
  sendMessage: (message, sessionId) =>
    request("/chat/send", {
      method: "POST",
      body: JSON.stringify({ message, sessionId }),
    }),

  getSessions: () => request("/chat/sessions"),

  getSession: (id) => request(`/chat/sessions/${id}`),

  deleteSession: (id) =>
    request(`/chat/sessions/${id}`, {
      method: "DELETE",
    }),
};
const Sidebar = ({ sessions, activeId, onSelect, onNew, onDelete, isMobileOpen, onMobileClose }) => (
  <>
    {isMobileOpen && (
      <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={onMobileClose} />
    )}

    <aside
      className={`
        fixed md:relative top-0 left-0 h-full z-30 md:z-auto
        flex flex-col w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto
        transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>

        <div className="flex items-center gap-1">
          <button onClick={onNew} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <PencilSquareIcon className="h-5 w-5" />
          </button>

          <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 md:hidden">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button
        onClick={onNew}
        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[#7C6A9B] text-white text-sm font-medium hover:bg-[#5c4b7a] transition mb-4"
      >
        <PlusCircleIcon className="h-4 w-4" />
        New Chat
      </button>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {sessions.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-6">No chats yet. Start one!</p>
        )}

        {sessions.map((s) => (
          <div
            key={s._id}
            className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
              s._id === activeId
                ? 'bg-[#ede9f7] text-[#5c4b7a] font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => {
              onSelect(s._id);
              onMobileClose();
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <SparklesIcon className="h-3.5 w-3.5 text-[#7C6A9B] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm truncate">{s.title || 'New Chat'}</p>
                <p className="text-xs text-gray-400">
                  {s.createdAt
                    ? new Date(s.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s._id);
              }}
              className="shrink-0 p-1 rounded hover:bg-red-100 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  </>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-[#7C6A9B] rounded-full block"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

const MessageBubble = ({ msg }) => {
  const isUser = msg.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#ede9f7] flex items-center justify-center shrink-0 mb-1">
          <SparklesIcon className="h-4 w-4 text-[#7C6A9B]" />
        </div>
      )}

      <div
        className={`px-4 py-2.5 rounded-2xl max-w-[90%] sm:max-w-[80%] md:max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#7C6A9B] text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  );
};

const Chatbot = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Saarthi, your healthcare assistant. How can I help you today?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await api.getSessions();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to load sessions:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelectSession = async (id) => {
    try {
      const data = await api.getSession(id);

      const formattedMessages =
        data.session?.messages?.map((m) => ({
          text: m.text || m.content || m.message,
          sender: m.sender,
        })) || [];

      setMessages(formattedMessages);
      setActiveSessionId(id);
    } catch (err) {
      console.error('Failed to load session:', err.message);
    }
  };

  const handleSend = async (textOverride) => {
    const text = (textOverride || input).trim();

    if (!text || isLoading) return;

    const token = getToken();

    if (!token) {
      setMessages((prev) => [
        ...prev,
        { text, sender: 'user' },
        {
          text: '⚠️ Please login again. Your authentication token is missing.',
          sender: 'bot',
        },
      ]);
      setInput('');
      return;
    }

    setMessages((prev) => [...prev, { text, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await api.sendMessage(text, activeSessionId);

      if (!activeSessionId && data.sessionId) {
        setActiveSessionId(data.sessionId);
        fetchSessions();
      }

      setMessages((prev) => [
        ...prev,
        {
          text: data.reply || data.message || 'Sorry, I could not generate a reply.',
          sender: 'bot',
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err.message);

      setMessages((prev) => [
        ...prev,
        {
          text: `⚠️ Error: ${err.message}`,
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await api.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));

      if (activeSessionId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        text: "Hello! I'm Saarthi, your healthcare assistant. How can I help you today?",
        sender: 'bot',
      },
    ]);
    setInput('');
    setActiveSessionId(null);
    setIsSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredSessions = sessions.filter((s) =>
    (s.title || 'New Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isNewChat = !activeSessionId && messages.length === 1 && messages[0]?.sender === 'bot';

  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-800 overflow-hidden">
      <nav className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 md:hidden">
            <Bars3Icon className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={() => navigate('/UserDashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#7C6A9B] transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-[#7C6A9B]" />
          <h1 className="text-base font-semibold text-gray-800">Saarthi AI</h1>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowSearch((v) => !v)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          <button onClick={handleNewChat} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <PencilSquareIcon className="h-5 w-5" />
          </button>

          <UserCircleIcon className="h-6 w-6 text-gray-400" />
        </div>
      </nav>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-100"
          >
            <div className="px-4 py-2">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chat history…"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C6A9B]/40"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sessions={searchQuery ? filteredSessions : sessions}
          activeId={activeSessionId}
          onSelect={handleSelectSession}
          onNew={handleNewChat}
          onDelete={handleDeleteSession}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4">
            {isNewChat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center gap-4 pb-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#ede9f7] flex items-center justify-center">
                  <SparklesIcon className="h-7 w-7 text-[#7C6A9B]" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">How can I help you today?</h2>
                  <p className="text-sm text-gray-500 mt-1">Ask me anything about your health or appointments.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-left px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-[#f3effa] hover:border-[#7C6A9B]/30 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {!isNewChat && (
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
                ))}
              </AnimatePresence>
            )}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message… (Enter to send)"
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C6A9B]/40 text-sm text-gray-800 disabled:opacity-50 overflow-hidden"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-[#7C6A9B] text-white rounded-2xl hover:bg-[#5c4b7a] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
              >
                <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">
              Saarthi AI can make mistakes. Always consult a qualified doctor for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
