
import React, { useState, useEffect } from 'react';
import { ProjectStatus } from '../types.ts';
import ProjectCard from '../components/ProjectCard.tsx';
import { Search, Filter } from 'lucide-react';
import { useData } from '../context/DataContext.tsx';

const Projects: React.FC = () => {
  const { projects } = useData();
  const [filter, setFilter] = useState<ProjectStatus | 'All'>('All');
  
  useEffect(() => {
    document.title = "Our Projects | Asghar Builders Portfolio";
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const filterOptions = ['All', ...Object.values(ProjectStatus)];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Our <span className="text-amber-500">Projects</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover a diverse portfolio of residential and commercial landmarks designed to define the future of urban living in Pakistan.
          </p>
        </div>

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
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
