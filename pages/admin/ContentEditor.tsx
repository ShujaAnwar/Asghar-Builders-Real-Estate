
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { 
  ArrowLeft, Save, Home, Info, Phone, Settings, 
  Plus, Trash2, Layout, Globe, Loader2, Navigation
} from 'lucide-react';

const ContentEditor: React.FC = () => {
  const { siteContent, setSiteContent } = useData();
  const [activeSection, setActiveSection] = useState<'global' | 'home' | 'about' | 'contact'>('global');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeepChange = (section: keyof typeof siteContent, field: string, value: any) => {
    setSiteContent({ ...siteContent, [section]: { ...(siteContent[section] as any), [field]: value } });
  };

  const handleSave = async () => {
    setLoading(true);
    await setSiteContent(siteContent);
    setLoading(false);
    alert('Site content updated. Changes are now live across all nodes.');
  };

  // Nav Management
  const addNav = () => {
    const updated = { ...siteContent.global, navigation: [...(siteContent.global.navigation || []), { label: '', path: '' }] };
    handleDeepChange('global', 'navigation', updated.navigation);
  };
  const removeNav = (i: number) => {
    const updated = { ...siteContent.global, navigation: (siteContent.global.navigation || []).filter((_, idx) => idx !== i) };
    handleDeepChange('global', 'navigation', updated.navigation);
  };
  const updateNav = (i: number, field: 'label' | 'path', val: string) => {
    const newNav = [...(siteContent.global.navigation || [])];
    newNav[i] = { ...newNav[i], [field]: val };
    handleDeepChange('global', 'navigation', newNav);
  };

  // Highlights Management
  const addHighlight = () => {
    const updated = { ...siteContent.home, highlights: [...(siteContent.home.highlights || []), { label: '', value: '', suffix: '' }] };
    handleDeepChange('home', 'highlights', updated.highlights);
  };
  const removeHighlight = (i: number) => {
    const updated = { ...siteContent.home, highlights: (siteContent.home.highlights || []).filter((_, idx) => idx !== i) };
    handleDeepChange('home', 'highlights', updated.highlights);
  };
  const updateHighlight = (i: number, field: string, val: string) => {
    const newH = [...(siteContent.home.highlights || [])];
    newH[i] = { ...newH[i], [field]: val };
    handleDeepChange('home', 'highlights', newH);
  };

  const menu = [
    { id: 'global', label: 'Branding', icon: <Settings /> },
    { id: 'home', label: 'Home Page', icon: <Home /> },
    { id: 'about', label: 'About Page', icon: <Info /> },
    { id: 'contact', label: 'Contact Page', icon: <Phone /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-80 border-r border-white/5 bg-slate-900/50 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back
        </Link>
        <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">CMS CORE</h2>
        <nav className="space-y-3 flex-grow">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id as any)} className={`w-full flex items-center space-x-3 p-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeSection === item.id ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/10' : 'text-gray-500 hover:text-white'}`}>
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleSave} disabled={loading} className="py-5 bg-amber-500 text-white font-black rounded-2xl flex items-center justify-center space-x-3 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : <Save />} <span>Push Changes</span>
        </button>
      </aside>

      <main className="flex-grow p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
          <header className="mb-16">
            <h1 className="text-5xl font-black text-white capitalize tracking-tighter">{activeSection} Architecture</h1>
            <p className="text-gray-500 mt-2 font-medium">Control text nodes and digital assets for the {activeSection} environment.</p>
          </header>

          {activeSection === 'global' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Settings className="text-amber-500" /> Identity</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Site Title</label>
                    <input value={siteContent.global.siteName} onChange={e => handleDeepChange('global', 'siteName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Footer Legal</label>
                    <input value={siteContent.global.footerText} onChange={e => handleDeepChange('global', 'footerText', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                </div>
              </div>

              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3"><Navigation className="text-amber-500" /> Navigation Links</h3>
                  <button onClick={addNav} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"><Plus /></button>
                </div>
                {siteContent.global.navigation?.map((nav, i) => (
                  <div key={i} className="flex gap-4">
                    <input value={nav.label} onChange={e => updateNav(i, 'label', e.target.value)} placeholder="Label" className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white" />
                    <input value={nav.path} onChange={e => updateNav(i, 'path', e.target.value)} placeholder="/path" className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white" />
                    <button onClick={() => removeNav(i)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'home' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white">Billboard Controller</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Main Heading</label>
                    <input value={siteContent.home.heroTitle} onChange={e => handleDeepChange('home', 'heroTitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                    <textarea rows={4} value={siteContent.home.heroSubtitle} onChange={e => handleDeepChange('home', 'heroSubtitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Background Image URL</label>
                    <input value={siteContent.home.heroBgUrl} onChange={e => handleDeepChange('home', 'heroBgUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                </div>
              </div>

              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Trust Indicators (Highlights)</h3>
                  <button onClick={addHighlight} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"><Plus /></button>
                </div>
                {siteContent.home.highlights?.map((h, i) => (
                  <div key={i} className="flex gap-4">
                    <input value={h.label} onChange={e => updateHighlight(i, 'label', e.target.value)} placeholder="Label" className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white" />
                    <input value={h.value} onChange={e => updateHighlight(i, 'value', e.target.value)} placeholder="Value" className="w-24 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white text-center" />
                    <input value={h.suffix} onChange={e => updateHighlight(i, 'suffix', e.target.value)} placeholder="+" className="w-16 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white text-center" />
                    <button onClick={() => removeHighlight(i)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* SEO Block */}
          <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-3"><Globe className="text-amber-500" /> Search Optimization</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Meta Title</label>
                <input value={(siteContent[activeSection] as any).seo?.title} onChange={e => {
                  const updated = { ...siteContent[activeSection] as any, seo: { ...(siteContent[activeSection] as any).seo, title: e.target.value } };
                  setSiteContent({ ...siteContent, [activeSection]: updated });
                }} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Meta Description</label>
                <textarea rows={3} value={(siteContent[activeSection] as any).seo?.description} onChange={e => {
                  const updated = { ...siteContent[activeSection] as any, seo: { ...(siteContent[activeSection] as any).seo, description: e.target.value } };
                  setSiteContent({ ...siteContent, [activeSection]: updated });
                }} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
