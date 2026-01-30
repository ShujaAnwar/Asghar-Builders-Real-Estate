
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Building2 } from 'lucide-react';
import { useData } from '../context/DataContext.tsx';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { siteContent } = useData();

  // Long press logic for hidden admin access
  const [pressProgress, setPressProgress] = useState(0);
  // Fix: Use any to avoid NodeJS namespace issues in browser environment
  const pressTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent normal navigation on long press
    setPressProgress(0);
    const startTime = Date.now();
    const duration = 3000;

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
    if ('vibrate' in navigator) navigator.vibrate(200);
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 group cursor-pointer relative select-none"
          onMouseDown={startPress}
          onMouseUp={endPress}
          onMouseLeave={endPress}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          onClick={(e) => {
             // Only navigate if it wasn't a long press attempt
             if (pressProgress === 0) navigate('/');
          }}
        >
          <div className={`w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center transition-transform ${pressProgress > 0 ? 'scale-110 shadow-lg shadow-amber-500/50' : 'group-hover:scale-110'}`}>
            <Building2 className="text-white" size={24} />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-white">
            {siteContent.global.siteName.split(' ')[0]} <span className="text-amber-500">{siteContent.global.siteName.split(' ')[1] || 'BUILDERS'}</span>
          </span>
          
          {/* Subtle Progress ring or bar could go here, but keeping it invisible for "security through obscurity" as requested */}
          {pressProgress > 0 && (
             <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 transition-all duration-75" style={{ width: `${pressProgress}%` }} />
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-amber-500 ${isActive(link.path) ? 'text-amber-500' : 'text-gray-300'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20">
            Invest Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute top-full left-0 w-full animate-in slide-in-from-top duration-300 border-t border-white/10">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold ${isActive(link.path) ? 'text-amber-500' : 'text-gray-300'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="bg-amber-500 text-white px-6 py-3 rounded-lg font-bold text-center"
            >
              Invest Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
