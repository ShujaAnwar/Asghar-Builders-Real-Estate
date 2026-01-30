
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData, supabase } from '../../context/DataContext.tsx';
import { Project, ProjectStatus, ProjectType, ProjectSpec } from '../../types.ts';
import { 
  ArrowLeft, Save, Info, Image as ImageIcon, FileText, 
  Globe, Loader2, Upload, Plus, Trash2, CheckCircle2, X, Search, Cloud
} from 'lucide-react';

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects, uploadMedia, media } = useData();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
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
    specs: [{ label: 'Units', value: '' }],
    paymentPlan: '',
    priceRange: '',
    completionDate: '',
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

  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const url = await uploadMedia(file);
      if (url) {
        // If the media picker was open for gallery, add to gallery, otherwise main image
        if (showPicker === 'gallery') {
          setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
          setShowPicker(null);
        } else {
          setFormData(prev => ({ ...prev, imageUrl: url }));
        }
      }
    } catch (err) {
      console.error(err);
      alert("PC File Upload failed. Ensure bucket 'projects' exists and is public.");
    } finally {
      setLoading(false);
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

  const addFeature = () => setFormData(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
  const removeFeature = (i: number) => setFormData(prev => ({ ...prev, features: (prev.features || []).filter((_, idx) => idx !== i) }));
  const updateFeature = (i: number, val: string) => {
    const newFeats = [...(formData.features || [])];
    newFeats[i] = val;
    setFormData({ ...formData, features: newFeats });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const projectData = { ...formData, id: isEditing ? (id as string) : (formData.slug || Date.now().toString()) } as Project;
    const { error } = await supabase.from('projects').upsert(projectData);
    if (!error) {
      setProjects(prev => isEditing ? prev.map(p => p.id === id ? projectData : p) : [projectData, ...prev]);
      navigate('/admin');
    } else {
      alert(`Database Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white">{isEditing ? 'Sync Build' : 'Deploy Landmark'}</h1>
            <p className="text-gray-500 mt-2 font-medium">Node: {formData.slug || 'New Entry'}</p>
          </div>
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl overflow-x-auto max-w-full">
            {(['content', 'media', 'seo'] as const).map(tab => (
              <button 
                key={tab} type="button" onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {activeTab === 'content' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass p-10 rounded-[3rem] border border-black/5 dark:border-white/10 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Project Name</label>
                    <input required value={formData.name} onChange={e => handleNameChange(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-5 px-8 text-slate-900 dark:text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Location Node</label>
                    <input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-5 px-8 text-slate-900 dark:text-white focus:border-amber-500 outline-none" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Category</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as ProjectType })} className="w-full bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl py-5 px-8 text-slate-900 dark:text-white outline-none">
                      {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })} className="w-full bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl py-5 px-8 text-slate-900 dark:text-white outline-none">
                      {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Completion Date</label>
                    <input value={formData.completionDate} onChange={e => setFormData({ ...formData, completionDate: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-5 px-8 text-slate-900 dark:text-white outline-none" placeholder="e.g. Q4 2026" />
                  </div>
                </div>
              </div>

              <div className="glass p-10 rounded-[3rem] border border-black/5 dark:border-white/10 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Specifications</h3>
                  <button type="button" onClick={addSpec} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"><Plus /></button>
                </div>
                {formData.specs?.map((spec, i) => (
                  <div key={i} className="flex gap-4">
                    <input value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} placeholder="Label" className="flex-1 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 px-6 text-slate-900 dark:text-white" />
                    <input value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="Value" className="flex-1 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 px-6 text-slate-900 dark:text-white" />
                    <button type="button" onClick={() => removeSpec(i)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass p-10 rounded-[3rem] border border-black/5 dark:border-white/10 space-y-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Master Billboard</h3>
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="w-full md:w-80 aspect-video glass rounded-3xl overflow-hidden relative group border border-black/5 dark:border-white/10">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-slate-50 dark:bg-slate-900/50">
                        <ImageIcon size={48} className="mb-4 opacity-20" />
                        <span className="text-xs font-bold uppercase tracking-widest">No Selection</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
                      >
                        <Upload className="mb-2 text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Browse Local PC</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowPicker('main')}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
                      >
                        <Cloud className="mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Cloud Library</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Direct Asset URL</label>
                       <input 
                        value={formData.imageUrl} 
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-8 text-slate-900 dark:text-white focus:border-amber-500 outline-none text-sm font-mono" 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-10 rounded-[3rem] border border-black/5 dark:border-white/10 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Image Portfolio (Gallery)</h3>
                  <button 
                    type="button" 
                    onClick={() => setShowPicker('gallery')}
                    className="px-6 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                  >
                    Select from Assets
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {formData.gallery?.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-black/5 dark:border-white/10">
                      <img src={url} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery?.filter((_, idx) => idx !== i) }))}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setShowPicker('gallery')}
                    className="aspect-square glass rounded-2xl border border-dashed border-black/10 dark:border-white/20 flex flex-col items-center justify-center text-gray-400 hover:border-amber-500/50 hover:text-amber-500 transition-all"
                  >
                    <Plus size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">Add Image</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass p-10 rounded-[3rem] border border-black/5 dark:border-white/10 space-y-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Search Indexing</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Metadata Title</label>
                    <input value={formData.seo?.title} onChange={e => setFormData({ ...formData, seo: { ...formData.seo!, title: e.target.value } })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-8 text-slate-900 dark:text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Keywords (comma separated)</label>
                    <input value={formData.seo?.keywords} onChange={e => setFormData({ ...formData, seo: { ...formData.seo!, keywords: e.target.value } })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-8 text-slate-900 dark:text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Public Description</label>
                    <textarea rows={4} value={formData.seo?.description} onChange={e => setFormData({ ...formData, seo: { ...formData.seo!, description: e.target.value } })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-8 text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6 pt-12">
             <button type="submit" disabled={loading} className="flex-grow py-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] text-xl disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                <span>{isEditing ? 'Sync with Supabase' : 'Deploy Landmark'}</span>
             </button>
             <button type="button" onClick={() => navigate('/admin')} className="px-12 py-6 glass text-gray-400 font-black rounded-[2rem] hover:text-red-500 transition-all uppercase tracking-widest text-sm">Abort Operation</button>
          </div>
        </form>
      </div>

      {/* Shared File Input Trigger for Desktop */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleDesktopUpload} 
      />

      {/* Asset Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass w-full max-w-5xl max-h-[90vh] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden">
            <header className="p-8 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-2xl font-black text-white">Infrastructure Assets</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Select source for {showPicker === 'main' ? 'Billboard' : 'Gallery'}</p>
              </div>
              <button onClick={() => setShowPicker(null)} className="p-4 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"><X /></button>
            </header>
            
            <div className="p-6 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Filter repository by name or tag..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {media.filter(m => m.name.toLowerCase().includes(pickerSearch.toLowerCase())).map(item => (
                <button 
                  key={item.id} 
                  type="button"
                  onClick={() => selectFromLibrary(item.url)}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500 transition-all"
                >
                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <CheckCircle2 className="text-white" size={32} />
                  </div>
                </button>
              ))}
              {media.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest">Repository Empty</div>
              )}
            </div>
            
            <footer className="p-8 border-t border-white/10 text-center flex justify-center space-x-4">
               <button onClick={() => fileInputRef.current?.click()} className="px-12 py-4 bg-amber-500 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20">Upload New from Desktop</button>
               <button onClick={() => setShowPicker(null)} className="px-12 py-4 glass text-white font-black rounded-2xl">Close</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
