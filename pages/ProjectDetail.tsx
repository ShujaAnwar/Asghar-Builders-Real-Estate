import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext.tsx';
import { ArrowLeft, CheckCircle2, Download, MapPin, Building, Calendar, Info } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useData();
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) {
      document.title = `${project.name} | Asghar Builders`;
      const description = `${project.name} in ${project.location}. ${project.description} Explore investment opportunities.`;
      const keywords = `${project.name}, ${project.location}, real estate, Asghar Builders`;
      
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
    }
  }, [id, project]);

  if (!project) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h2 className="text-2xl text-white font-bold">Project Not Found</h2>
        <p className="text-gray-400 mt-2">The requested project listing may have been moved or removed.</p>
        <Link to="/projects" className="text-amber-500 mt-6 inline-flex items-center hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
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
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">{project.name}</h1>
            <div className="flex items-center text-gray-300 mt-4 text-lg">
              <MapPin size={20} className="mr-2 text-amber-500" />
              {project.location}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">Project Overview</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{project.longDescription}</p>
            </section>

            {project.features && project.features.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-8">World-Class Amenities</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {project.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-4 glass p-5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-gray-200 font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.gallery && project.gallery.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-8">Visual Journey</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="aspect-video rounded-[2rem] overflow-hidden glass p-1 transition-transform hover:scale-[1.02] cursor-pointer">
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover rounded-[1.8rem]" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl sticky top-32">
              <h3 className="text-xl font-bold text-white mb-8 pb-4 border-b border-white/5">Project Specifications</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500 text-sm font-bold uppercase tracking-wider">
                    <Building size={16} className="mr-3 text-amber-500" />
                    Category
                  </div>
                  <div className="text-white font-bold">{project.type}</div>
                </div>
                
                {project.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-sm font-bold uppercase tracking-wider">
                      <Info size={16} className="mr-3 text-amber-500" />
                      {spec.label}
                    </div>
                    <div className="text-white font-bold">{spec.value}</div>
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500 text-sm font-bold uppercase tracking-wider">
                    <Calendar size={16} className="mr-3 text-amber-500" />
                    Status
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-black uppercase">
                    {project.status}
                  </span>
                </div>
              </div>

              {project.paymentPlan && (
                <div className="mt-10 pt-8 border-t border-white/5">
                  <h4 className="text-white font-bold mb-4">Investment Plan</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">{project.paymentPlan}</p>
                  <button className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3 shadow-xl shadow-amber-500/20">
                    <Download size={20} />
                    <span>Download Brochure</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;