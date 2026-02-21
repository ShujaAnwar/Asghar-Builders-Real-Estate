
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData, supabase } from '../../context/DataContext.tsx';
import { Project, ProjectStatus, ProjectType, ProjectSpec } from '../../types.ts';
import { 
  ArrowLeft, Save, Info, Image as ImageIcon, FileText, 
  Globe, Loader2, Upload, Plus, Trash2, CheckCircle2, X, Search, Cloud,
  DollarSign, ClipboardList, Zap, Ruler, Layers, Home, Monitor
} from 'lucide-react';

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects, uploadMedia, media } = useData();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingPC, setUploadingPC] = useState(false);
  const [showPicker, setShowPicker] = useState<'main' | 'gallery' | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    slug: '',
    location: '',
    type: ProjectType.RESIDENTIAL,
    status: ProjectStatus.RUNNING,
    description: '',
    longDescription: '',
    imageUrl: '',
    gallery: [],
    features: [],
    specs: [],
    paymentPlan: '',
    priceRange: '',
    completionDate: '',
    displayOrder: 0,
    seo: { title: '', description: '', keywords: '' }
  });

  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'seo'>('content');

  useEffect(() => {
    if (isEditing) {
      const existing = projects.find(p => p.id === id);
      if (existing) setFormData(existing);
    }
  }, [id, projects]);

  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData({ ...formData, name: val, slug: isEditing ? formData.slug : slug });
  };

  const getVirtualSpec = (label: string) => {
    return formData.specs?.find(s => s.label === label)?.value || '';
  };

  const setVirtualSpec = (label: string, value: string) => {
    const newSpecs = [...(formData.specs || [])];
    const index = newSpecs.findIndex(s => s.label === label);
    if (index > -1) {
      newSpecs[index] = { ...newSpecs[index], value };
    } else {
      newSpecs.push({ label, value });
    }
    setFormData({ ...formData, specs: newSpecs });
  };

  const triggerPCUpload = (target: 'main' | 'gallery') => {
    setShowPicker(target); // Use this to track target during PC upload flow
    fileInputRef.current?.click();
  };

  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingPC(true);
    try {
      const url = await uploadMedia(file);
      if (url) {
        if (showPicker === 'gallery') {
          setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
        } else {
          setFormData(prev => ({ ...prev, imageUrl: url }));
        }
      }
    } catch (err) {
      console.error(err);
      alert("PC File Upload failed.");
    } finally {
      setUploadingPC(false);
      setShowPicker(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectFromLibrary = (url: string) => {
    if (showPicker === 'main') {
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } else if (showPicker === 'gallery') {
      setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
    }
    setShowPicker(null);
  };

  const addSpec = () => setFormData(prev => ({ ...prev, specs: [...(prev.specs || []), { label: '', value: '' }] }));
  const removeSpec = (i: number) => setFormData(prev => ({ ...prev, specs: (prev.specs || []).filter((_, idx) => idx !== i) }));
  const updateSpec = (i: number, field: keyof ProjectSpec, val: string) => {
    const newSpecs = [...(formData.specs || [])];
    newSpecs[i] = { ...newSpecs[i], [field]: val };
    setFormData({ ...formData, specs: newSpecs });
  };

  const removeGalleryItem = (url: string) => {
    setFormData(prev => ({ ...prev, gallery: (prev.gallery || []).filter(item => item !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const finalProjectData = { ...formData };
    finalProjectData.id = isEditing ? (id as string) : (formData.slug || Date.now().toString());

    const { error } = await supabase.from('projects').upsert(finalProjectData);
    if (!error) {
      setProjects(prev => isEditing ? prev.map(p => p.id === id ? (finalProjectData as Project) : p) : [finalProjectData as Project, ...prev]);
      navigate('/admin');
    } else {
      alert(`Database Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Abort Mission
        </Link>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleDesktopUpload} 
          accept="image/*"
        />

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h1 className="text-6xl font-black text-white leading-none tracking-tighter">
              {isEditing ? 'Sync Landmark' : 'Deploy Landmark'}
            </h1>
            <p className="text-amber-500 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Node: {formData.slug || 'New Entry'}</p>
          </div>
          <div className="flex glass border border-white/10 p-1.5 rounded-2xl overflow-x-auto max-w-full">
            {(['content', 'media', 'seo'] as const).map(tab => (
              <button 
                key={tab} type="button" onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {activeTab === 'content' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Project Name</label>
                    <input required value={formData.name} onChange={e => handleNameChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-amber-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Location Node</label>
                    <input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-amber-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Category</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as ProjectType })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none cursor-pointer">
                      {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none cursor-pointer">
                      {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Completion Date</label>
                    <input value={formData.completionDate} onChange={e => setFormData({ ...formData, completionDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" placeholder="e.g. Q4 2026" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Display Order</label>
                    <input type="number" value={formData.displayOrder} onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl bg-gradient-to-br from-white/5 to-transparent">
                <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                   <FileText className="text-amber-500" size={24} />
                   <span>Project Architectural Details</span>
                </h3>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Ruler size={12} className="text-amber-500" /> Land Area
                    </label>
                    <input 
                      value={getVirtualSpec('Land Area')} 
                      onChange={e => setVirtualSpec('Land Area', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" 
                      placeholder="e.g. 500 Sq Yds" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Layers size={12} className="text-amber-500" /> Total Floors
                    </label>
                    <input 
                      value={getVirtualSpec('Total Floors')} 
                      onChange={e => setVirtualSpec('Total Floors', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" 
                      placeholder="e.g. G + 12" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Home size={12} className="text-amber-500" /> Total Units
                    </label>
                    <input 
                      value={getVirtualSpec('Total Units')} 
                      onChange={e => setVirtualSpec('Total Units', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" 
                      placeholder="e.g. 150 Apartments" 
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Executive Summary (Short)</label>
                    <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-amber-500 outline-none resize-none" placeholder="One sentence teaser..."></textarea>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Architectural Narrative (Full Description)</label>
                    <textarea rows={6} value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-amber-500 outline-none" placeholder="Tell the story of this landmark..."></textarea>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-12">
                 <button type="submit" disabled={loading} className="flex-grow py-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-amber-500/30 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] text-xl disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                    <span>Deploy Landmark</span>
                 </button>
                 <button type="button" onClick={() => navigate('/admin')} className="px-12 py-6 glass text-gray-400 font-black rounded-[2.5rem] hover:text-white transition-all uppercase tracking-widest text-xs">Abort Operation</button>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Billboard Management */}
               <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">Project Billboard</h3>
                      <p className="text-gray-500 text-sm mt-1">The main high-resolution image for project landing pages.</p>
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => triggerPCUpload('main')} disabled={uploadingPC} className="px-6 py-3 glass border border-white/10 text-amber-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/5 flex items-center gap-2">
                        {uploadingPC ? <Loader2 className="animate-spin" size={14} /> : <Monitor size={14} />}
                        Upload from PC
                      </button>
                      <button type="button" onClick={() => setShowPicker('main')} className="px-6 py-3 bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-amber-600 flex items-center gap-2">
                        <Cloud size={14} />
                        From Library
                      </button>
                    </div>
                  </div>
                  
                  <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden glass border border-white/5 flex items-center justify-center relative group">
                    {formData.imageUrl ? (
                      <>
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Billboard Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="p-4 bg-red-500 text-white rounded-full shadow-2xl transform scale-50 group-hover:scale-100 transition-all">
                              <Trash2 size={24} />
                           </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-600 font-black uppercase text-xs tracking-widest">No Billboard Assigned</p>
                      </div>
                    )}
                  </div>
               </div>

               {/* Gallery Management */}
               <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">Infrastructure Gallery</h3>
                      <p className="text-gray-500 text-sm mt-1">Supplementary frames showing architectural details.</p>
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => triggerPCUpload('gallery')} disabled={uploadingPC} className="px-6 py-3 glass border border-white/10 text-amber-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/5 flex items-center gap-2">
                        {uploadingPC ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                        Add Frame from PC
                      </button>
                      <button type="button" onClick={() => setShowPicker('gallery')} className="px-6 py-3 bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-amber-600 flex items-center gap-2">
                        <Cloud size={14} />
                        Add from Library
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {formData.gallery?.map((url, i) => (
                      <div key={i} className="aspect-square glass rounded-3xl overflow-hidden relative group border border-white/5">
                        <img src={url} className="w-full h-full object-cover" alt="Gallery Item" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button type="button" onClick={() => removeGalleryItem(url)} className="p-3 bg-red-500 text-white rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                              <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    ))}
                    {(formData.gallery?.length || 0) === 0 && (
                      <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                        <ImageIcon size={32} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">Repository empty for this landmark.</p>
                      </div>
                    )}
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6 pt-12">
                 <button type="submit" disabled={loading} className="flex-grow py-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-amber-500/30 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] text-xl disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                    <span>Deploy Landmark</span>
                 </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Shared Asset Library Picker Modal */}
      {showPicker && !uploadingPC && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="glass w-full max-w-5xl h-[85vh] rounded-[3.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            <header className="p-10 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Infrastructure Assets</h3>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Targeting: {showPicker === 'main' ? 'Project Billboard' : 'Gallery Frame'}</p>
              </div>
              <button onClick={() => setShowPicker(null)} className="p-4 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"><X /></button>
            </header>

            <div className="p-8 border-b border-white/5 bg-slate-900/20">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Scan repository for assets..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {media.filter(m => m.name.toLowerCase().includes(pickerSearch.toLowerCase())).map(item => (
                <button 
                  key={item.id} 
                  type="button"
                  onClick={() => selectFromLibrary(item.url)}
                  className="group relative aspect-square rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500 transition-all shadow-lg"
                >
                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Media Asset" />
                  <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                </button>
              ))}
              {media.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <ImageIcon className="mx-auto text-gray-700 mb-6 opacity-20" size={64} />
                  <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Repository Empty.</p>
                </div>
              )}
            </div>
            
            <footer className="p-10 border-t border-white/10 flex justify-center bg-slate-900/50">
               <button onClick={() => setShowPicker(null)} className="px-12 py-5 glass text-white font-black rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest">Close Browser</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
