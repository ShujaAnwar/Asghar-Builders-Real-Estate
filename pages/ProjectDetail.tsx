import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS } from '../constants.ts';
import { ArrowLeft, CheckCircle2, Download, MapPin, Building, Calendar, Info } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = PROJECTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) {
      document.title = `${project.name} | Asghar Builders`;
      const description = `${project.name} in ${project.location}. ${project.description} Explore investment opportunities and architectural details.`;
      const keywords = `${project.name}, ${project.location}, real estate ${project.location}, luxury ${project.type}, Asghar Builders project`;
      
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
    }
  }, [id, project]);

  if (!project) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h2 className="text-2xl text-white">Project not found</h2>
        <Link to="/projects" className="text-amber-500 mt-4 inline-block">Back to projects</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/projects" className="inline-flex items-center text-amber-500 font-bold mb-6 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={20} className="mr-2" />
              Back to Portfolio
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white">{project.name}</h1>
            <div className="flex items-center text-gray-300 mt-4">
              <MapPin size={18} className="mr-2 text-amber-500" />
              {project.location}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Project Overview</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{project.longDescription}</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.features.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-3 glass p-4 rounded-xl border border-white/5">
                    <CheckCircle2 className="text-amber-500" size={20} />
                    <span className="text-gray-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <div key={i} className="aspect-video rounded-2xl overflow-hidden glass p-1">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Specs */}
            <div className="glass p-8 rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/5">Project Specifications</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Building size={16} className="mr-2 text-amber-500" />
                    Project Type
                  </div>
                  <div className="text-white font-bold text-right">{project.type}</div>
                </div>
                {project.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Info size={16} className="mr-2 text-amber-500" />
                      {spec.label}
                    </div>
                    <div className="text-white font-bold text-right">{spec.value}</div>
                  </div>
                ))}
                <div className="flex justify-between items-start">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar size={16} className="mr-2 text-amber-500" />
                    Status
                  </div>
                  <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded text-xs font-bold uppercase">
                    {project.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Plan */}
            {project.paymentPlan && (
              <div className="glass p-8 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Payment Plan</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{project.paymentPlan}</p>
                <button className="w-full py-4 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center space-x-2">
                  <Download size={18} />
                  <span>Download Brochure</span>
                </button>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="glass h-64 rounded-3xl overflow-hidden relative border border-white/10">
               <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-50 grayscale" alt="Map" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-500 p-3 rounded-full text-white">
                    <MapPin size={24} />
                  </div>
               </div>
               <div className="absolute bottom-4 left-0 w-full px-4">
                  <button className="w-full bg-slate-900/80 backdrop-blur-md py-2 rounded-lg text-xs font-bold text-white border border-white/10">
                    Open in Google Maps
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;