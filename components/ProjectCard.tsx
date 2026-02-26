
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Building } from 'lucide-react';
import { Project, ProjectStatus } from '../types.ts';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColors = {
    [ProjectStatus.RUNNING]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [ProjectStatus.UPCOMING]: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    [ProjectStatus.COMPLETED]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [ProjectStatus.DRAFT]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-amber-500/10">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white">
             <Building size={16} />
          </div>
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-amber-500 text-xs font-bold mb-2 uppercase tracking-widest">
          {project.type}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <MapPin size={14} className="mr-1 text-amber-500" />
          {project.location}
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-grow">
          {project.description}
        </p>
        
        <Link 
          to={`/projects/${project.id}`}
          className="flex items-center justify-between w-full py-3 px-6 bg-white/5 group-hover:bg-amber-500 text-white rounded-xl font-bold transition-all duration-300"
        >
          <span>View Project</span>
          <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
