
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { Project, ProjectStatus, ProjectType, SEOData } from '../../types.ts';
import { ArrowLeft, Save, X, Plus, Info, Image as ImageIcon, FileText, Globe, Eye } from 'lucide-react';

const AMENITIES_LIST = [
  'Smart Home Automation', 'Infinity Pool', '24/7 Security', 'Private Elevator Access',
  'Gymnasium', 'Roof Garden', 'CCTV Monitoring', 'Gas & Electricity', 'Car Parking',
  'Power Backup', 'Guest Lounge', 'Kids Play Area', 'High-Speed Internet'
];

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects, media } = useData();
  const isEditing = !!id;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      id: isEditing ? (id as string) : (formData.slug || Date.now().toString()),
    } as Project;

    if (isEditing) {
      setProjects(prev => prev.map(p => p.id === id ? projectData : p));
    } else {
      setProjects(prev => [projectData, ...prev]);
    }
    navigate('/admin');
  };

  const toggleAmenity = (amenity: string) => {
    const current = formData.features || [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, features: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, features: [...current, amenity] });
    }
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
          Dashboard Overview
        </Link>

        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black text-white">{isEditing ? 'Modify Project' : 'New Landmark'}</h1>
            <p className="text-gray-500 mt-2">Craft the perfect presentation for your elite development.</p>
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
              {/* Identity */}
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Info size={24} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">Identity & Vision</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Project Title</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => handleNameChange(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-amber-500 text-white transition-all shadow-inner"
                      placeholder="e.g. Asghar Royal Heights"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">URL Slug</label>
                    <input 
                      required
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-5 px-8 text-gray-500 transition-all font-mono text-sm"
                      placeholder="asghar-royal-heights"
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
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Location</label>
                    <input 
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                      placeholder="DHA Phase 6, Lahore"
                    />
                  </div>
                </div>
              </div>

              {/* Narratives */}
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <FileText size={24} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">Strategic Narratives</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Executive Summary</label>
                  <textarea 
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white resize-none"
                    placeholder="Brief 1-2 sentence hook for project cards."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Detailed Presentation</label>
                  <textarea 
                    rows={8}
                    value={formData.longDescription}
                    onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white leading-relaxed"
                    placeholder="Full story, structural highlights, and value proposition."
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
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">Visual Assets</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Master Thumbnail URL</label>
                    <div className="flex gap-4">
                      <input 
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                        placeholder="https://..."
                      />
                      {formData.imageUrl && <img src={formData.imageUrl} className="w-20 h-20 rounded-xl object-cover" />}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Gallery Stack (New lines for multiple URLs)</label>
                    <textarea 
                      rows={6}
                      value={formData.gallery?.join('\n')}
                      onChange={e => setFormData({ ...formData, gallery: e.target.value.split('\n').filter(l => l.trim()) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-mono text-xs"
                      placeholder="Paste one image URL per line..."
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5">
                   <div className="text-sm text-gray-500">Need to upload new images?</div>
                   <Link to="/admin/media" className="text-amber-500 font-bold hover:underline">Open Media Library &rarr;</Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass p-12 rounded-[3rem] border border-white/10 space-y-10">
                <div className="flex items-center space-x-3 text-amber-500">
                  <Globe size={24} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm">Search Optimization (SEO)</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Meta Title</label>
                    <input 
                      value={formData.seo?.title}
                      onChange={e => handleSEOChange('title', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                      placeholder="Best Luxury Apartments in Lahore | Asghar Builders"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Meta Description</label>
                    <textarea 
                      rows={3}
                      value={formData.seo?.description}
                      onChange={e => handleSEOChange('description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                      placeholder="Discover our latest residential project featuring..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Meta Keywords</label>
                    <input 
                      value={formData.seo?.keywords}
                      onChange={e => handleSEOChange('keywords', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white"
                      placeholder="real estate, apartments, investment"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6">
             <button 
               type="submit" 
               className="flex-grow py-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-[2rem] shadow-2xl shadow-amber-500/20 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-xl"
             >
                <Save size={24} />
                <span>{isEditing ? 'Commit Changes' : 'Publish Landmark'}</span>
             </button>
             <button 
               type="button" 
               onClick={() => navigate('/admin')}
               className="px-12 py-6 glass text-gray-400 font-black rounded-[2rem] border border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all uppercase tracking-widest text-sm"
             >
                Cancel
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
