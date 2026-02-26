
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData, supabase } from '../../context/DataContext.tsx';
import { 
  ArrowLeft, Save, Home, Info, Phone, Settings, 
  Plus, Trash2, Layout, Globe, Loader2, Navigation,
  Share2, Image as ImageIcon, ArrowUp, ArrowDown, Building2,
  Mail, MapPin, Search, CheckCircle2, X, Cloud, Users
} from 'lucide-react';

const ContentEditor: React.FC = () => {
  const { siteContent, setSiteContent, projects, setProjects, media } = useData();
  const [activeSection, setActiveSection] = useState<'global' | 'home' | 'about' | 'contact' | 'social' | 'ordering'>('global');
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerSearch, setPickerSearch] = useState('');
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

    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];

    newProjects.forEach((p, idx) => {
      p.displayOrder = idx;
    });

    setProjects(newProjects);
    
    setLoading(true);
    for (const p of newProjects) {
      await supabase.from('projects').update({ displayOrder: p.displayOrder }).eq('id', p.id);
    }
    setLoading(false);
  };

  const selectFounderImg = (url: string) => {
    handleDeepChange('about', 'chairmanImg', url);
    setShowPicker(false);
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

          {activeSection === 'home' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Home className="text-amber-500" /> Hero Section</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Hero Title</label>
                    <input value={siteContent.home?.heroTitle || ''} onChange={e => handleDeepChange('home', 'heroTitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Hero Subtitle</label>
                    <textarea rows={3} value={siteContent.home?.heroSubtitle || ''} onChange={e => handleDeepChange('home', 'heroSubtitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                </div>
              </div>

              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Layout className="text-amber-500" /> Performance Metrics (Stats)</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {(siteContent.home?.highlights || []).map((stat, idx) => (
                    <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Metric 0{idx + 1}</span>
                        <button 
                          onClick={() => {
                            const updated = (siteContent.home?.highlights || []).filter((_, i) => i !== idx);
                            handleDeepChange('home', 'highlights', updated);
                          }}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">Label</label>
                          <input 
                            value={stat.label} 
                            onChange={e => {
                              const updated = [...(siteContent.home?.highlights || [])];
                              updated[idx] = { ...stat, label: e.target.value };
                              handleDeepChange('home', 'highlights', updated);
                            }}
                            className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-5 text-white outline-none text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">Value (Number)</label>
                            <input 
                              type="text"
                              value={stat.value} 
                              onChange={e => {
                                const updated = [...(siteContent.home?.highlights || [])];
                                updated[idx] = { ...stat, value: e.target.value };
                                handleDeepChange('home', 'highlights', updated);
                              }}
                              className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-5 text-white outline-none text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">Suffix</label>
                            <input 
                              value={stat.suffix} 
                              onChange={e => {
                                const updated = [...(siteContent.home?.highlights || [])];
                                updated[idx] = { ...stat, suffix: e.target.value };
                                handleDeepChange('home', 'highlights', updated);
                              }}
                              className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-5 text-white outline-none text-sm"
                              placeholder="e.g. +"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    const updated = [...(siteContent.home?.highlights || []), { label: 'New Metric', value: '0', suffix: '' }];
                    handleDeepChange('home', 'highlights', updated);
                  }}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-white hover:border-amber-500/50 transition-all flex items-center justify-center space-x-2 font-bold uppercase tracking-widest text-xs"
                >
                  <Plus size={16} />
                  <span>Add Performance Metric</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Info className="text-amber-500" /> Mission & Vision</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Corporate Intro</label>
                    <textarea rows={3} value={siteContent.about.intro} onChange={e => handleDeepChange('about', 'intro', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Vision Statement</label>
                      <textarea rows={3} value={siteContent.about.vision} onChange={e => handleDeepChange('about', 'vision', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Mission Statement</label>
                      <textarea rows={3} value={siteContent.about.mission} onChange={e => handleDeepChange('about', 'mission', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Section Management */}
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3"><Users className="text-amber-500" /> Founder Management</h3>
                <div className="flex flex-col md:flex-row gap-10">
                   <div className="w-full md:w-64 aspect-[4/5] glass rounded-3xl overflow-hidden relative group border border-white/10 shadow-inner">
                      <img src={siteContent.about.chairmanImg} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="Founder" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                        <button onClick={() => setShowPicker(true)} className="px-6 py-2 bg-amber-500 text-white font-black text-[10px] uppercase rounded-full shadow-lg hover:scale-105 transition-all">Change Image</button>
                      </div>
                   </div>
                   <div className="flex-1 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Founder Name</label>
                          <input value={siteContent.about.chairmanName} onChange={e => handleDeepChange('about', 'chairmanName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Role Title</label>
                          <input value={siteContent.about.chairmanRole} onChange={e => handleDeepChange('about', 'chairmanRole', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Signature Quote</label>
                        <textarea rows={3} value={siteContent.about.chairmanMessage} onChange={e => handleDeepChange('about', 'chairmanMessage', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" placeholder="Quality is our signature." />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Direct Image URL Override</label>
                        <input value={siteContent.about.chairmanImg} onChange={e => handleDeepChange('about', 'chairmanImg', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none text-[10px] font-mono" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Shared Asset Picker Modal for Founder Image */}
      {showPicker && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="glass w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            <header className="p-10 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter">Asset Repository</h3>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Target: Founder Identity Node</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="p-4 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"><X /></button>
            </header>
            
            <div className="p-8 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Filter repository for the perfect portrait..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white focus:outline-none focus:border-amber-500 shadow-inner" 
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-10 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8 bg-slate-900/20">
              {media.filter(m => m.name.toLowerCase().includes(pickerSearch.toLowerCase())).map(item => (
                <button 
                  key={item.id} 
                  type="button"
                  onClick={() => selectFounderImg(item.url)}
                  className="group relative aspect-square rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/50 transition-all shadow-lg"
                >
                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Asset" />
                  <div className="absolute inset-0 bg-amber-500/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white text-amber-500 p-3 rounded-full shadow-2xl transform scale-50 group-hover:scale-100 transition-transform">
                      <CheckCircle2 size={32} />
                    </div>
                  </div>
                </button>
              ))}
              {media.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <ImageIcon className="mx-auto text-gray-700 mb-6 opacity-20" size={64} />
                  <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Repository Empty. Upload images in Media Gallery first.</p>
                </div>
              )}
            </div>
            
            <footer className="p-10 border-t border-white/10 flex justify-center">
               <button onClick={() => setShowPicker(false)} className="px-12 py-5 glass text-white font-black rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-sm uppercase tracking-widest">Close Browser</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
