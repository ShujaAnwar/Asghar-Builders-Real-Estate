
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Facebook, Twitter, Instagram, Linkedin, 
  Mail, Phone, MapPin, Youtube, Music2, MessageCircle 
} from 'lucide-react';
import { useData } from '../context/DataContext.tsx';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { siteContent } = useData();
  const [pressProgress, setPressProgress] = useState(0);
  const pressTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const startPress = () => {
    setPressProgress(0);
    const startTime = Date.now();
    const duration = 3000;
    pressTimerRef.current = setTimeout(() => handleLongPressSuccess(), duration);
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setPressProgress(Math.min((elapsed / duration) * 100, 100));
    }, 50);
  };

  const endPress = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setPressProgress(0);
  };

  const handleLongPressSuccess = () => {
    endPress();
    if ('vibrate' in navigator) navigator.vibrate(200);
    navigate('/admin/login');
  };

  const { socialLinks } = siteContent.global;
  const { contact } = siteContent;

  const socialIconsMap = [
    { key: 'facebook', icon: <Facebook size={18} />, url: socialLinks.facebook },
    { key: 'twitter', icon: <Twitter size={18} />, url: socialLinks.twitter },
    { key: 'instagram', icon: <Instagram size={18} />, url: socialLinks.instagram },
    { key: 'linkedin', icon: <Linkedin size={18} />, url: socialLinks.linkedin },
    { key: 'youtube', icon: <Youtube size={18} />, url: socialLinks.youtube },
    { key: 'tiktok', icon: <Music2 size={18} />, url: socialLinks.tiktok },
    { key: 'whatsapp', icon: <MessageCircle size={18} />, url: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` },
  ];

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div 
              className="relative inline-flex items-center space-x-2 cursor-default group"
              onMouseDown={startPress}
              onMouseUp={endPress}
              onMouseLeave={endPress}
              onTouchStart={startPress}
              onTouchEnd={endPress}
            >
              <div className={`w-10 h-10 bg-amber-500 rounded flex items-center justify-center transition-transform duration-300 overflow-hidden ${pressProgress > 0 ? 'scale-110' : ''}`}>
                {siteContent.global.logoUrl ? (
                  <img src={siteContent.global.logoUrl} className="w-full h-full object-contain p-1.5" alt="Logo" />
                ) : (
                  <Building2 className="text-white" size={20} />
                )}
              </div>
              <span className="text-xl font-extrabold tracking-tighter text-white uppercase">
                {siteContent.global.siteName.split(' ')[0]} <span className="text-amber-500">{siteContent.global.siteName.split(' ').slice(1).join(' ')}</span>
              </span>
              
              {pressProgress > 0 && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-75" style={{ width: `${pressProgress}%` }} />
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              {siteContent.global.footerText}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialIconsMap.filter(s => s.url).map((social) => (
                <a 
                  key={social.key} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-full hover:text-amber-500 transition-all border border-white/5 hover:border-amber-500/30"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black text-white mb-8 uppercase tracking-[0.3em] opacity-50">Infrastructure</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              {siteContent.global.navigation.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="hover:text-amber-500 transition-colors uppercase tracking-widest">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-black text-white mb-8 uppercase tracking-[0.3em] opacity-50">Communication</h4>
            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="text-amber-500 shrink-0 mt-1" size={18} />
                <span className="leading-relaxed">{contact.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-amber-500 shrink-0" size={18} />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-amber-500 shrink-0" size={18} />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-black text-white mb-8 uppercase tracking-[0.3em] opacity-50">Investor Feed</h4>
            <p className="text-sm text-gray-400 mb-6">Subscribe for early-access to upcoming construction landmarks.</p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full focus:outline-none focus:border-amber-500 text-white transition-all shadow-inner"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-amber-500/20">Join Network</button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <p>© 2024 {siteContent.global.siteName}. Strategic Real Estate Operations.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocols</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Engagement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
