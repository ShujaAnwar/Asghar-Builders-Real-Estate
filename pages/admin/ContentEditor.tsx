
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData, supabase } from '../../context/DataContext.tsx';
import { 
  ArrowLeft, Save, Home, Info, Phone, Settings, 
  Plus, Trash2, Layout, Globe, Loader2, Navigation,
  Share2, Image as ImageIcon, ArrowUp, ArrowDown, Building2,
  Mail, MapPin
} from 'lucide-react';

const ContentEditor: React.FC = () => {
  const { siteContent, setSiteContent, projects, setProjects } = useData();
  const [activeSection, setActiveSection] = useState<'global' | 'home' | 'about' | 'contact' | 'social' | 'ordering'>('global');
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

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    // Swap
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];

    // Re-assign displayOrder
    newProjects.forEach((p, idx) => {
      p.displayOrder = idx;
    });

    setProjects(newProjects);
    
    // Persist all orders to Supabase
    setLoading(true);
    for (const p of newProjects) {
      await supabase.from('projects').update({ displayOrder: p.displayOrder }).eq('id', p.id);
    }
    setLoading(false);
  };

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

  const menu = [
    { id: 'global', label: 'Branding & Logo', icon: <Settings /> },
    { id: 'contact', label: 'Global Contact', icon: <Phone /> },
    { id: 'social', label: 'Social Media', icon: <Share2 /> },
    { id: 'ordering', label: 'Project Order', icon: <Layout /> },
    { id: 'home', label: 'Home Content', icon: <Home /> },
    { id: 'about', label: 'About Page', icon: <Info /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-80 border-r border-white/5 bg-slate-900/50 hidden lg:flex flex-col p-8 sticky top-0 h-screen overflow-y-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back
        </Link>
        <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">CMS CORE</h2>
        <nav className="space-y-3 flex-grow mb-10">
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
            <h1 className="text-5xl font-black text-white capitalize tracking-tighter">
              {activeSection === 'ordering' ? 'Sort Infrastructure' : activeSection + ' Management'}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Control the central nodes for {activeSection} logic.</p>
          </header>

          {activeSection === 'global' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><ImageIcon className="text-amber-500" /> Site Logo</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-8">
                    <div className="w-24 h-24 glass rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                      {siteContent.global.logoUrl ? (
                        <img src={siteContent.global.logoUrl} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="text-gray-600" size={32} />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Logo URL (from Media Library)</label>
                      <input 
                        value={siteContent.global.logoUrl} 
                        onChange={e => handleDeepChange('global', 'logoUrl', e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none font-mono text-sm" 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Settings className="text-amber-500" /> Branding</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Site Title</label>
                    <input value={siteContent.global.siteName} onChange={e => handleDeepChange('global', 'siteName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Footer Legal Text</label>
                    <input value={siteContent.global.footerText} onChange={e => handleDeepChange('global', 'footerText', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Phone className="text-amber-500" /> Communication Hub</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Primary Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input value={siteContent.contact.phone} onChange={e => handleDeepChange('contact', 'phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Secondary Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input value={siteContent.contact.phoneSecondary} onChange={e => handleDeepChange('contact', 'phoneSecondary', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input value={siteContent.contact.email} onChange={e => handleDeepChange('contact', 'email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">WhatsApp ID</label>
                    <div className="relative">
                      <Share2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input value={siteContent.contact.whatsapp} onChange={e => handleDeepChange('contact', 'whatsapp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white outline-none" placeholder="+92..." />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Office Headquarters Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-6 text-gray-500" size={18} />
                    <textarea rows={3} value={siteContent.contact.address} onChange={e => handleDeepChange('contact', 'address', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Share2 className="text-amber-500" /> Digital Reach</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {Object.keys(siteContent.global.socialLinks).map((key) => (
                    <div key={key} className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{key} Link</label>
                      <input 
                        value={(siteContent.global.socialLinks as any)[key]} 
                        onChange={e => {
                          const updated = { ...siteContent.global.socialLinks, [key]: e.target.value };
                          handleDeepChange('global', 'socialLinks', updated);
                        }} 
                        placeholder={`https://${key}.com/...`}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none text-sm" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ordering' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white">Arrangement Control</h3>
                  <p className="text-gray-500 text-sm mt-1">Determine which projects take priority in visual listings.</p>
                </div>
                <div className="space-y-4">
                  {projects.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl group">
                      <div className="flex items-center space-x-6">
                        <span className="text-xs font-black text-amber-500/50 w-6">0{i + 1}</span>
                        <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div>
                          <h4 className="text-white font-bold">{p.name}</h4>
                          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{p.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => moveProject(i, 'up')}
                          disabled={i === 0 || loading}
                          className="p-3 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl transition-all disabled:opacity-20"
                        >
                          <ArrowUp size={20} />
                        </button>
                        <button 
                          onClick={() => moveProject(i, 'down')}
                          disabled={i === projects.length - 1 || loading}
                          className="p-3 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl transition-all disabled:opacity-20"
                        >
                          <ArrowDown size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ... existing home and about sections would follow here if selected ... */}
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
