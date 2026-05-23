import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Bot, Send, X, User, Loader2 } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import siteConfig from '@/config/siteConfig';

marked.setOptions({
  breaks: true,
  gfm: true
});

const AIChatBox = ({ isOpen, onClose }) => {
  // Initialize messages synchronously to prevent flash
  const [messages, setMessages] = useState(() => {
    try {
      const savedChat = sessionStorage.getItem('ai_chat_history');
      if (savedChat) return JSON.parse(savedChat);
    } catch {}
    
    const initialMessage = {
      id: Date.now(),
      role: 'ai',
      content: 'Xin chào! Tôi là trợ lý ảo của website. Tôi có thể giúp gì cho bạn hôm nay?'
    };
    return [initialMessage];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Handle scrolling when messages change
  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      // Use raw scrollTop for instant and reliable scrolling
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages.length, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Chuẩn bị lịch sử để gửi lên server (bỏ id)
      const historyToSend = messages.map(msg => ({
        role: msg.role,
        content: msg.content || ''
      }));

      const response = await fetch(`${siteConfig.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: historyToSend
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'ai',
          content: data.data || ''
        }]);
      } else {
        throw new Error(data.message || 'Lỗi phản hồi từ server');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-16 md:bottom-6 md:right-24 w-[350px] max-w-[calc(100vw-80px)] h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100 transition-all transform origin-bottom-right duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Trợ lý AI</h3>
            <p className="text-[11px] text-blue-100 opacity-90">Luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto overscroll-contain bg-gray-50 flex flex-col gap-4">
        {messages.map((msg) => {
          const safeContent = msg.content || '';
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex gap-2 max-w-[90%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isUser ? 'bg-blue-100 text-blue-600' : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'}`}>
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${isUser ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'}`}>
                {isUser ? (
                  // Parse newline characters for user
                  safeContent.split('\n').map((text, i) => (
                    <React.Fragment key={i}>
                      {text}
                      {i !== safeContent.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                ) : (
                  // Render Markdown for AI
                  <div
                    className="prose-sm max-w-none space-y-2 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>strong]:font-bold [&>h3]:font-semibold [&>h3]:text-base [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:rounded [&>pre]:bg-gray-800 [&>pre]:text-gray-100 [&>pre]:p-2 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>a]:text-blue-600 [&>a]:underline"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(marked.parse(safeContent))
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-2 max-w-[85%] self-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="p-3 rounded-2xl text-sm bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2 text-sm outline-none transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
        </button>
      </form>
    </div>
  );
};

export default AIChatBox;
