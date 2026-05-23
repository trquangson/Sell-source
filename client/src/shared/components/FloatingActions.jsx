import React, { useEffect, useState } from 'react';
import { ArrowUp, Bot } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import AIChatBox from './AIChatBox';

const FloatingActions = () => {
  const [visible, setVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* CSS animation riêng cho Zalo và Bot */}
      <style>{`
        @keyframes zalo-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(0, 104, 255, 0); }
        }
        @keyframes bot-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); }
        }
        @keyframes zalo-ring {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10% { transform: rotate(-8deg) scale(1.05); }
          20% { transform: rotate(8deg) scale(1.05); }
          30% { transform: rotate(-6deg); }
          40% { transform: rotate(6deg); }
          50% { transform: rotate(0deg) scale(1); }
        }
        .zalo-btn {
          animation: zalo-pulse 2s ease-in-out infinite, zalo-ring 4s ease-in-out infinite;
        }
        .zalo-btn:hover {
          animation: none;
          transform: scale(1.1) translateY(-2px);
        }
        .bot-btn {
          animation: bot-pulse 2s ease-in-out infinite;
        }
        .bot-btn:hover {
          animation: none;
          transform: scale(1.1) translateY(-2px);
        }
      `}</style>

      {/* Cửa sổ Chat AI */}
      <AIChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-center gap-2 md:gap-3">
        {/* Nút Bot AI Chat */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Chat với AI"
          className="bot-btn w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg transition-all duration-200"
        >
          <Bot className="w-6 h-6" />
        </button>

        {/* Nút Zalo — luôn hiển thị, có animation pulse + ring */}
        <a
          href={siteConfig.socials.zalo}
          target="_blank"
          rel="noreferrer"
          title="Liên hệ Zalo"
          className="zalo-btn w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-lg transition-all duration-200"
        >
          <span className="font-extrabold text-xs md:text-sm tracking-wide select-none">Zalo</span>
        </a>

        {/* Nút Scroll to Top — xuất hiện/mất khi cuộn */}
        <button
          onClick={scrollToTop}
          title="Lên đầu trang"
          className={`w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          style={{ transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s, box-shadow 0.2s' }}
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </>
  );
};

export default FloatingActions;
