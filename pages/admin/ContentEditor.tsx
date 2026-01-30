
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { 
  ArrowLeft, Save, Home, Info, Phone, Settings, 
  MessageSquare, Layout, Globe, Image as ImageIcon
} from 'lucide-react';

const ContentEditor: React.FC = () => {
  const { siteContent, setSiteContent } = useData();
  const [activeSection, setActiveSection] = useState<'global' | 'home' | 'about' | 'contact'>('global');
  const navigate = useNavigate();

  const handleDeepChange = (section: keyof typeof siteContent, field: string, value: any) => {
    setSiteContent({
      ...siteContent,
      [section]: {
        ...(siteContent[section] as any),
        [field]: value
      }
    });
  };

  const handleSEOChange = (section: keyof typeof siteContent, field: string, value: string) => {
    setSiteContent({
      ...siteContent,
      [section]: {
        ...(siteContent[section] as any),
        seo: {
          ...(siteContent[section] as any).seo,
          [field]: value
        }
      }
    });
  };

  const handleSave = () => {
    alert('Site content architecture updated across all nodes.');
    navigate('/admin');
  };

  const sidebarLinks = [
    { id: 'global', label: 'Global Settings', icon: <Settings size={20} /> },
    { id: 'home', label: 'Home Page', icon: <Home size={20} /> },
    { id: 'about', label: 'About Page', icon: <Info size={20} /> },
    { id: 'contact', label: 'Contact Page', icon: <Phone size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-white/5 bg-slate-900/50 hidden lg:flex flex-col p-8">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Admin Overview
        </Link>
        
        <h2 className="text-2xl font-black text-white mb-8">Site Editor</h2>
        
        <nav className="space-y-2">
          {sidebarLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id as any)}
              className={`w-full flex items-center space-x-3 p-5 rounded-2xl font-bold transition-all ${
                activeSection === link.id ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/10' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleSave}
          className="mt-auto py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-2xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all"
        >
          <Save size={20} />
          <span>Save All Syncs</span>
        </button>
      </aside>

      {/* Main Editing Area */}
      <main className="flex-grow p-8 md:p-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeSection === 'global' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Settings size={24} />
                  <h3 className="font-black uppercase tracking-widest text-sm">Branding & Core</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Organization Name</label>
                    <input 
                      value={siteContent.global.siteName}
                      onChange={e => handleDeepChange('global', 'siteName', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Logo Asset URL</label>
                    <input 
                      value={siteContent.global.logoUrl}
                      onChange={e => handleDeepChange('global', 'logoUrl', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Footer Catchphrase</label>
                  <textarea 
                    rows={3}
                    value={siteContent.global.footerText}
                    onChange={e => handleDeepChange('global', 'footerText', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                  />
                </div>
              </div>

              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Layout size={24} />
                  <h3 className="font-black uppercase tracking-widest text-sm">Social Connections</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {Object.entries(siteContent.global.socialLinks).map(([key, val]) => (
                    <div key={key} className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 capitalize">{key} Profile</label>
                      <input 
                        value={val}
                        onChange={e => {
                          const newSocials = { ...siteContent.global.socialLinks, [key]: e.target.value };
                          handleDeepChange('global', 'socialLinks', newSocials);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'home' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
               <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Home size={24} />
                  <h3 className="font-black uppercase tracking-widest text-sm">Hero Presentation</h3>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Main Heading</label>
                  <input 
                    value={siteContent.home.heroTitle}
                    onChange={e => handleDeepChange('home', 'heroTitle', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Vision Statement (Subtitle)</label>
                  <textarea 
                    rows={4}
                    value={siteContent.home.heroSubtitle}
                    onChange={e => handleDeepChange('home', 'heroSubtitle', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Hero Background URL</label>
                  <input 
                    value={siteContent.home.heroBgUrl}
                    onChange={e => handleDeepChange('home', 'heroBgUrl', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <MessageSquare size={24} />
                  <h3 className="font-black uppercase tracking-widest text-sm">Leadership Section</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Leader Name</label>
                    <input 
                      value={siteContent.about.chairmanName}
                      onChange={e => handleDeepChange('about', 'chairmanName', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Leader Designation</label>
                    <input 
                      value={siteContent.about.chairmanRole}
                      onChange={e => handleDeepChange('about', 'chairmanRole', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Visionary Quote</label>
                  <textarea 
                    rows={4}
                    value={siteContent.about.chairmanMessage}
                    onChange={e => handleDeepChange('about', 'chairmanMessage', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white italic"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Leader Portrait URL</label>
                  <input 
                    value={siteContent.about.chairmanImg}
                    onChange={e => handleDeepChange('about', 'chairmanImg', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
               <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Phone size={24} />
                  <h3 className="font-black uppercase tracking-widest text-sm">Touchpoints</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Headquarters Phone</label>
                    <input 
                      value={siteContent.contact.phone}
                      onChange={e => handleDeepChange('contact', 'phone', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">WhatsApp Broadcast</label>
                    <input 
                      value={siteContent.contact.whatsapp}
                      onChange={e => handleDeepChange('contact', 'whatsapp', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">HQ Address</label>
                  <input 
                    value={siteContent.contact.address}
                    onChange={e => handleDeepChange('contact', 'address', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Google Maps Embed URL</label>
                  <input 
                    value={siteContent.contact.mapEmbedUrl}
                    onChange={e => handleDeepChange('contact', 'mapEmbedUrl', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
