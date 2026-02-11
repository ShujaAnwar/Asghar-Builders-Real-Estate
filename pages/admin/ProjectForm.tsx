
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData, supabase } from '../../context/DataContext.tsx';
import { Project, ProjectStatus, ProjectType, ProjectSpec } from '../../types.ts';
import { 
  ArrowLeft, Save, Info, Image as ImageIcon, FileText, 
  Globe, Loader2, Upload, Plus, Trash2, CheckCircle2, X, Search, Cloud,
  DollarSign, ClipboardList, Zap, Ruler, Layers, Home
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
    specs: [{ label: 'Structure', value: 'RCC Frame' }],
    paymentPlan: '',
    priceRange: '',
    completionDate: '',
    landArea: '',
    totalFloors: '',
    totalUnits: '',
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
        if (showPicker === 'gallery') {
          setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
          setShowPicker(null);
        } else {
          setFormData(prev => ({ ...prev, imageUrl: url }));
        }
      }
    } catch (err) {
      console.error(err);
      alert("PC File Upload failed.");
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
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Abort Mission
        </Link>

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
              {/* Primary Node Settings */}
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
                </div>
              </div>

              {/* PROJECT DETAILS BOX (Narrative & Structural Metrics) */}
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
                    <input value={formData.landArea} onChange={e => setFormData({ ...formData, landArea: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" placeholder="e.g. 500 Sq Yds" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Layers size={12} className="text-amber-500" /> Total Floors
                    </label>
                    <input value={formData.totalFloors} onChange={e => setFormData({ ...formData, totalFloors: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" placeholder="e.g. G + 12" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Home size={12} className="text-amber-500" /> Total Units
                    </label>
                    <input value={formData.totalUnits} onChange={e => setFormData({ ...formData, totalUnits: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none" placeholder="e.g. 150 Apartments" />
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

              {/* Financial Box */}
              <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
                <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                   <DollarSign className="text-amber-500" size={24} />
                   <span>Financial Node</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Valuation Range</label>
                    <input value={formData.priceRange} onChange={e => setFormData({ ...formData, priceRange: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-amber-500 outline-none" placeholder="e.g. 5 Cr - 15 Cr" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Payment Protocol</label>
                    <textarea rows={3} value={formData.paymentPlan} onChange={e => setFormData({ ...formData, paymentPlan: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-amber-500 outline-none resize-none" placeholder="Installment details..."></textarea>
                  </div>
                </div>
              </div>

              {/* Project Specifications List */}
              <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Project Specifications</h3>
                  <button type="button" onClick={addSpec} className="p-2 bg-amber-500 text-white rounded-lg hover:scale-110 transition-transform"><Plus size={18} /></button>
                </div>
                <div className="space-y-4">
                  {formData.specs?.map((spec, i) => (
                    <div key={i} className="flex gap-4">
                      <input value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} placeholder="Units" className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none" />
                      <input value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="Value" className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white outline-none" />
                      <button type="button" onClick={() => removeSpec(i)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Save Trigger */}
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
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="glass p-12 rounded-[3rem] border border-white/5 text-center py-20">
                  <ImageIcon className="mx-auto text-amber-500 mb-6" size={64} />
                  <h3 className="text-2xl font-black text-white mb-2">Visual Node Management</h3>
                  <p className="text-gray-500 mb-10">Configure billboard imagery and infrastructure gallery.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <button type="button" onClick={() => setShowPicker('main')} className="p-12 glass border border-white/10 rounded-3xl flex flex-col items-center hover:border-amber-500 transition-all">
                       <Cloud className="text-amber-500 mb-4" size={40} />
                       <span className="font-black uppercase tracking-widest text-xs text-white">Billboard Asset</span>
                    </button>
                    <button type="button" onClick={() => setShowPicker('gallery')} className="p-12 glass border border-white/10 rounded-3xl flex flex-col items-center hover:border-blue-500 transition-all">
                       <Plus className="text-blue-500 mb-4" size={40} />
                       <span className="font-black uppercase tracking-widest text-xs text-white">Gallery Frame</span>
                    </button>
                  </div>
               </div>
            </div>
          )}
        </form>
      </div>

      {/* Asset Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4">
          <div className="glass w-full max-w-5xl h-[80vh] rounded-[3.5rem] border border-white/10 flex flex-col overflow-hidden">
            <header className="p-10 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Media Repository</h3>
              <button onClick={() => setShowPicker(null)} className="p-2 hover:bg-white/10 rounded-full text-white"><X /></button>
            </header>
            <div className="flex-grow overflow-y-auto p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {media.map(item => (
                <button 
                  key={item.id} 
                  type="button"
                  onClick={() => selectFromLibrary(item.url)}
                  className="aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500 transition-all"
                >
                  <img src={item.url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
