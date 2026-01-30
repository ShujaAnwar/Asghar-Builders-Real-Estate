
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { createClient } from '@supabase/supabase-js';
import { Project, ProjectStatus, ProjectType, SEOData } from '../../types.ts';
import { ArrowLeft, Save, Info, Image as ImageIcon, FileText, Globe, Loader2, Upload } from 'lucide-react';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gjvgczueyvhifiollnsg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5H5Dcfo3wOwowyQkgDABRw_eBqkf6dk';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects, uploadMedia } = useData();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
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
    specs: [{ label: 'Plot Size', value: '' }, { label: 'Completion', value: '' }],
    paymentPlan: '',
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const url = await uploadMedia(file);
    if (url) {
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      ...formData,
      id: isEditing ? (id as string) : (formData.slug || Date.now().toString()),
    } as Project;

    const { error } = await supabase.from('projects').upsert(projectData);

    if (error) {
      alert('Error syncing to Supabase: ' + error.message);
    } else {
      if (isEditing) {
        setProjects(prev => prev.map(p => p.id === id ? projectData : p));
      } else {
        setProjects(prev => [projectData, ...prev]);
      }
      navigate('/admin');
    }
    setLoading(false);
  };

  const handleSEOChange = (field: keyof SEOData, val: string) => {
    setFormData({
      ...formData,
      seo: { ...formData.seo, [field]: val } as SEOData
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Cancel & Return
        </Link>

        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black text-white">{isEditing ? 'Sync Project' : 'Deploy Landmark'}</h1>
            <p className="text-gray-500 mt-2">Update Supabase infrastructure in real-time.</p>
          </div>
          <div className="hidden md:flex bg-white/5 border border-white/10 p-1 rounded-2xl">
            {(['content', 'media', 'seo'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {activeTab === 'content' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Info size={24} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">PostgreSQL Record Identity</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Project Title</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => handleNameChange(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-amber-500 text-white transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Primary Key (Slug)</label>
                    <input 
                      required
                      disabled={isEditing}
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-5 px-8 text-gray-500 transition-all font-mono text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Category</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as ProjectType })}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-5 px-8 text-white appearance-none"
                    >
                      {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Lifecycle Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-5 px-8 text-white appearance-none"
                    >
                      {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Location Node</label>
                    <input 
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <FileText size={24} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">Database Text Nodes</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Summary (Short)</label>
                  <textarea 
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Detailed Long Description</label>
                  <textarea 
                    rows={8}
                    value={formData.longDescription}
                    onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <ImageIcon size={24} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">Supabase Storage</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Master Image (CDN URL)</label>
                    <div className="flex flex-col gap-6">
                      <div className="flex gap-4">
                        <input 
                          value={formData.imageUrl}
                          onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                          placeholder="https://..."
                        />
                        {formData.imageUrl && <img src={formData.imageUrl} className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500/50" />}
                      </div>
                      
                      <label className="flex items-center justify-center gap-3 p-10 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer transition-all">
                        <Upload size={24} className="text-amber-500" />
                        <span className="text-gray-400 font-bold">Upload to Storage Bucket</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        {loading && <Loader2 className="animate-spin ml-2" size={18} />}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Gallery Stack (JSON-like text[])</label>
                    <textarea 
                      rows={6}
                      value={formData.gallery?.join('\n')}
                      onChange={e => setFormData({ ...formData, gallery: e.target.value.split('\n').filter(l => l.trim()) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-mono text-xs"
                      placeholder="Paste Supabase public URLs, one per line..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Globe size={24} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">Search Optimization Nodes</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Meta Title</label>
                    <input 
                      value={formData.seo?.title}
                      onChange={e => handleSEOChange('title', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Meta Description</label>
                    <textarea 
                      rows={3}
                      value={formData.seo?.description}
                      onChange={e => handleSEOChange('description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6">
             <button 
               type="submit" 
               disabled={loading}
               className="flex-grow py-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-[2rem] shadow-2xl shadow-amber-500/20 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-xl disabled:opacity-50"
             >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                <span>{loading ? 'Committing to PostgreSQL...' : 'Save & Sync to Supabase'}</span>
             </button>
             <button 
               type="button" 
               onClick={() => navigate('/admin')}
               className="px-12 py-6 glass text-gray-400 font-black rounded-[2rem] border border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all uppercase tracking-widest text-sm"
             >
                Abort
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
