
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { Project, ProjectStatus, ProjectType } from '../../types.ts';
// Fix: Added missing FileText import from lucide-react
import { ArrowLeft, Save, X, Plus, Info, Image as ImageIcon, FileText } from 'lucide-react';

const AMENITIES_LIST = [
  'Smart Home Automation', 'Infinity Pool', '24/7 Security', 'Private Elevator Access',
  'Gymnasium', 'Roof Garden', 'CCTV Monitoring', 'Gas & Electricity', 'Car Parking'
];

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects } = useData();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    location: '',
    type: ProjectType.RESIDENTIAL,
    status: ProjectStatus.RUNNING,
    description: '',
    longDescription: '',
    imageUrl: 'https://picsum.photos/seed/new-project/1200/800',
    gallery: [],
    features: [],
    specs: [{ label: 'Plot Size', value: '' }, { label: 'Completion', value: '' }],
    paymentPlan: ''
  });

  useEffect(() => {
    if (isEditing) {
      const existing = projects.find(p => p.id === id);
      if (existing) setFormData(existing);
    }
  }, [id, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      id: isEditing ? (id as string) : formData.name?.toLowerCase().replace(/\s+/g, '-'),
    } as Project;

    if (isEditing) {
      setProjects(prev => prev.map(p => p.id === id ? projectData : p));
    } else {
      setProjects(prev => [...prev, projectData]);
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

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-white">{isEditing ? 'Edit Project' : 'Add New Project'}</h1>
          <p className="text-gray-500 mt-2">Provide detailed information for the investors.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* General Info */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="flex items-center space-x-3 text-amber-500 mb-4">
              <Info size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">General Information</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Project Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                  placeholder="e.g. Asghar Royal Residency"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Location</label>
                <input 
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                  placeholder="e.g. Gulberg, Lahore"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as ProjectType })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                >
                  {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                >
                  {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Thumbnail URL</label>
              <input 
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Details */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="flex items-center space-x-3 text-amber-500 mb-4">
              <FileText size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Detailed Description</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Short Summary (For Card)</label>
              <textarea 
                rows={2}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Full Story</label>
              <textarea 
                rows={6}
                value={formData.longDescription}
                onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {AMENITIES_LIST.map(a => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`p-3 rounded-xl border text-sm transition-all text-left ${
                      formData.features?.includes(a) 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                      : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
             <button 
               type="submit" 
               className="flex-grow py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01]"
             >
                <Save size={20} />
                <span>{isEditing ? 'Update Project' : 'Publish Project'}</span>
             </button>
             <button 
               type="button" 
               onClick={() => navigate('/admin')}
               className="px-8 py-5 glass text-gray-400 font-bold rounded-2xl border border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all"
             >
                Discard
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
