import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../constants.ts';
import { ProjectStatus } from '../types.ts';
import ProjectCard from '../components/ProjectCard.tsx';
import { Search, Filter } from 'lucide-react';

const Projects: React.FC = () => {
  useEffect(() => {
    document.title = "Our Projects | Asghar Builders Portfolio";
    const description = "Explore the diverse portfolio of Asghar Builders including Asghar Skyline Heights, Emerald Business Plaza, and more luxury real estate developments in Pakistan.";
    const keywords = "real estate portfolio, upcoming projects, luxury development Islamabad, business plaza Lahore, Asghar Builders projects";
    
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
  }, []);

  const [filter, setFilter] = useState<ProjectStatus | 'All'>('All');
  
  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.status === filter);

  const filterOptions = ['All', ...Object.values(ProjectStatus)];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Our <span className="text-amber-500">Projects</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover a diverse portfolio of residential and commercial landmarks designed to define the future of urban living in Pakistan.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto max-w-full">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt as any)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  filter === opt 
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or city..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 text-white transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-3xl border border-dashed border-white/10">
            <Filter className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white">No projects found in this category</h3>
            <p className="text-gray-500 mt-2">Try selecting another category or check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;