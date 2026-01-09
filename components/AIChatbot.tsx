import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
import { getLibraryAdvice } from '../services/gemini';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: "Hi! I'm Smarty. Ask me about books, racks, or fines!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    const botResponse = await getLibraryAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999] isolate">
      {isOpen ? (
        <div className="w-[280px] h-[380px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-300">
          {/* Header */}
          <div className="p-2 bg-[#003366] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Smarty Assistant</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[8px] text-emerald-200 uppercase font-bold">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-2 space-y-2 overflow-y-auto bg-slate-50 text-xs">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-2 rounded-xl shadow-sm ${
                  msg.role === 'user'
                  ? 'bg-[#003366] text-white rounded-tr-none'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-2 rounded-xl flex items-center gap-1 text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-[10px]">Smarty is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about books or racks..."
                className="w-full pl-3 pr-8 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-[#003366]"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-1 p-1 bg-[#003366] text-white rounded-md disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
            <div className="mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF9933]" />
              <span className="text-[8px] font-medium text-slate-400 uppercase tracking-widest">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      ) : (
        // Mini Button
        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-[#003366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <MessageSquare className="w-5 h-5 relative z-10" />
        </button>
      )}
    </div>
  );
};

export default AIChatbot;
