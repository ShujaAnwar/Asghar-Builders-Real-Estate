
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, MapPin, ExternalLink, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; links?: { title: string; uri: string }[]; isThinking?: boolean }[]>([
    { role: 'bot', text: 'Welcome to the Asghar Builders Executive Suite. I am your AI Property Advisor. How may I assist you with our landmarks or market insights today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getCoordinates = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const locationKeywords = ['near', 'location', 'where', 'nearby', 'map', 'place', 'restaurant', 'school', 'hospital'];
      const isLocationQuery = locationKeywords.some(k => userMsg.toLowerCase().includes(k));

      let responseText = "";
      let groundingLinks: { title: string; uri: string }[] = [];

      if (isLocationQuery) {
        // Use Gemini 2.5 Flash for Maps Grounding
        const coords = await getCoordinates();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userMsg,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: coords ? { latitude: coords.lat, longitude: coords.lng } : undefined
              }
            },
            systemInstruction: 'You are a real estate location expert. Use Google Maps to find accurate information about nearby landmarks, amenities, and project locations for Asghar Builders in Karachi. Always provide helpful context.',
          }
        });
        
        responseText = response.text || "I found some relevant locations for you.";
        
        // Extract Maps grounding links
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((chunk: any) => {
            if (chunk.maps) {
              groundingLinks.push({ title: chunk.maps.title || 'View on Maps', uri: chunk.maps.uri });
            }
          });
        }
      } else {
        // Use Gemini 3 Pro for Complex Reasoning / Thinking Mode
        setMessages(prev => [...prev, { role: 'bot', text: 'Analyzing architectural data and investment metrics...', isThinking: true }]);
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: userMsg,
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: 'You are an elite, highly intelligent real estate strategist for Asghar Builders. Use your advanced reasoning (Thinking Mode) to provide detailed investment advice, architectural insights, and transparency reports. Maintain a tone of premium luxury and absolute reliability. Asghar Builders projects: Ali Arcade 1, 2, 3 and Al Kauser Residency.',
          }
        });
        
        // Remove the "Thinking..." temporary message
        setMessages(prev => prev.filter(m => !m.isThinking));
        responseText = response.text || "Our strategic analysis is currently being updated. Please consult our head office.";
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: responseText, 
        links: groundingLinks.length > 0 ? groundingLinks : undefined 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => !m.isThinking));
      setMessages(prev => [...prev, { role: 'bot', text: "The network node is experiencing high traffic. Please reach us via WhatsApp for immediate priority support." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-[350px] sm:w-[450px] h-[600px] glass rounded-[2.5rem] flex flex-col shadow-2xl border border-white/10 animate-in zoom-in duration-300 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-amber-500 to-amber-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Bot className="text-white" size={22} />
              </div>
              <div>
                <span className="font-black text-white text-sm uppercase tracking-widest block">Asghar Intel</span>
                <span className="text-[10px] text-white/70 font-bold uppercase flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Gemini 3 Pro Active
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-950/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center space-x-2 mb-1 opacity-40 uppercase text-[9px] font-black tracking-widest ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                  <span>{m.role === 'user' ? 'Client' : 'System'}</span>
                </div>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-amber-500 text-white rounded-tr-none shadow-lg shadow-amber-500/10' 
                    : m.isThinking 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 italic rounded-tl-none flex items-center space-x-3'
                      : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
                }`}>
                  {m.isThinking && <BrainCircuit className="animate-spin shrink-0" size={18} />}
                  <span>{m.text}</span>
                </div>
                
                {m.links && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.links.map((link, li) => (
                      <a 
                        key={li} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
                      >
                        <MapPin size={12} />
                        <span>{link.title}</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && !messages.some(m => m.isThinking) && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/10">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/10 bg-white/5">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Query architectural specs or nearby areas..."
                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-amber-500 transition-all text-white placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white hover:bg-amber-600 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-4 flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Quantum Secured</span>
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                 <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Thinking Mode Enabled</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all group"
        >
          <div className="relative">
            <MessageSquare size={28} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center animate-ping">
              <div className="w-full h-full bg-white rounded-full opacity-75"></div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
