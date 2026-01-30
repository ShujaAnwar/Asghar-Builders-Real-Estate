
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { ArrowLeft, Save, Home, Info, Phone } from 'lucide-react';

const ContentEditor: React.FC = () => {
  const { siteContent, setSiteContent } = useData();
  const navigate = useNavigate();

  const handleChange = (section: keyof typeof siteContent, field: string, value: string) => {
    setSiteContent({
      ...siteContent,
      [section]: {
        ...(siteContent[section] as any),
        [field]: value
      }
    });
  };

  const handleSave = () => {
    alert('Site content updated successfully!');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-white">Site Content Editor</h1>
          <p className="text-gray-500 mt-2">Modify the text seen by visitors across the website.</p>
        </header>

        <div className="space-y-12">
          {/* Home Section */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="flex items-center space-x-3 text-amber-500 mb-4">
              <Home size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Home Page Hero</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Hero Title</label>
                <input 
                  value={siteContent.home.heroTitle}
                  onChange={e => handleChange('home', 'heroTitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Hero Subtitle</label>
                <textarea 
                  rows={3}
                  value={siteContent.home.heroSubtitle}
                  onChange={e => handleChange('home', 'heroSubtitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="flex items-center space-x-3 text-amber-500 mb-4">
              <Info size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">About Us Information</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Vision Statement</label>
                <input 
                  value={siteContent.about.vision}
                  onChange={e => handleChange('about', 'vision', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Mission Statement</label>
                <input 
                  value={siteContent.about.mission}
                  onChange={e => handleChange('about', 'mission', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Chairman Message</label>
                <textarea 
                  rows={4}
                  value={siteContent.about.chairmanMessage}
                  onChange={e => handleChange('about', 'chairmanMessage', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="flex items-center space-x-3 text-amber-500 mb-4">
              <Phone size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Contact Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Primary Phone</label>
                <input 
                  value={siteContent.contact.phone}
                  onChange={e => handleChange('contact', 'phone', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">WhatsApp Number</label>
                <input 
                  value={siteContent.contact.whatsapp}
                  onChange={e => handleChange('contact', 'whatsapp', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            <Save size={20} />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
