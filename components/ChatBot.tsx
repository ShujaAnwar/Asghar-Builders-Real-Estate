
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I am the Asghar Builders assistant. How can I help you with our projects or investment opportunities today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Fix: Strictly use process.env.API_KEY directly as per GenAI coding guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are an elite real estate sales assistant for Asghar Builders. Be professional, sophisticated, and helpful. Mention that Asghar Builders focuses on transparency, on-time delivery, and luxury construction. If asked about prices, say "Pricing depends on specific unit sizes and floor levels; I can connect you with a dedicated consultant for a personalized quote."',
        }
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't process that. Please try again or contact us directly." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having some connection issues. Please call us for immediate assistance!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-[350px] sm:w-[400px] h-[500px] glass rounded-2xl flex flex-col shadow-2xl border border-white/10 animate-in zoom-in duration-200">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-amber-500 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <Bot className="text-white" size={20} />
              <span className="font-bold text-white">AI Property Advisor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full p-1">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-amber-500 text-white rounded-br-none' 
                    : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none border border-white/5">
                  <Loader2 className="animate-spin text-amber-500" size={18} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about projects..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-12 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/40 hover:scale-110 transition-transform"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
