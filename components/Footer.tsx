
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [pressProgress, setPressProgress] = useState(0);
  // Fix: Use any to avoid NodeJS namespace issues in browser environment
  const pressTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const startPress = () => {
    setPressProgress(0);
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    pressTimerRef.current = setTimeout(() => {
      handleLongPressSuccess();
    }, duration);

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPressProgress(progress);
    }, 50);
  };

  const endPress = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setPressProgress(0);
  };

  const handleLongPressSuccess = () => {
    endPress();
    // Vibration feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
    navigate('/admin/login');
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand - The Hidden Trigger */}
          <div className="space-y-6">
            <div 
              className="relative inline-flex items-center space-x-2 cursor-default group"
              onMouseDown={startPress}
              onMouseUp={endPress}
              onMouseLeave={endPress}
              onTouchStart={startPress}
              onTouchEnd={endPress}
            >
              <div className={`w-10 h-10 bg-amber-500 rounded flex items-center justify-center transition-transform duration-300 ${pressProgress > 0 ? 'scale-110' : ''}`}>
                <Building2 className="text-white" size={20} />
              </div>
              <span className="text-xl font-extrabold tracking-tighter text-white">
                ASGHAR <span className="text-amber-500">BUILDERS</span>
              </span>
              
              {/* Secret Progress Indicator */}
              {pressProgress > 0 && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-75" 
                    style={{ width: `${pressProgress}%` }}
                  />
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Pioneers in luxury real estate development and high-end construction. We create landmarks that stand the test of time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 glass rounded-full hover:text-amber-500 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 glass rounded-full hover:text-amber-500 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 glass rounded-full hover:text-amber-500 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 glass rounded-full hover:text-amber-500 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link to="/projects" className="hover:text-amber-500 transition-colors">Our Projects</Link></li>
              <li><Link to="/gallery" className="hover:text-amber-500 transition-colors">Visual Gallery</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">About the Group</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Reach Out</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="text-amber-500 shrink-0" size={18} />
                <span>Suite 502, Platinum Tower, Gulberg III, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-amber-500 shrink-0" size={18} />
                <span>+92 (300) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-amber-500 shrink-0" size={18} />
                <span>info@asgharbuilders.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe for the latest investment opportunities.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-amber-500 text-white"
              />
              <button className="bg-amber-500 text-white px-4 py-2 rounded-r-lg font-bold text-sm">Join</button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2024 Asghar Builders. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
