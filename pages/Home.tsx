
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProjectCard from '../components/ProjectCard.tsx';
import StatsSection from '../components/StatsSection.tsx';
import { useData } from '../context/DataContext.tsx';

const Home: React.FC = () => {
  const { projects, siteContent } = useData();

  useEffect(() => {
    document.title = siteContent.home.seo.title || "Home | Asghar Builders";
    document.querySelector('meta[name="description"]')?.setAttribute('content', siteContent.home.seo.description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', siteContent.home.seo.keywords);
  }, [siteContent]);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteContent.home.heroBgUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"} 
            className="w-full h-full object-cover opacity-40 grayscale" 
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center px-6 py-2 glass rounded-full border border-white/5 text-amber-500 text-xs font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom duration-700">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-ping"></span>
            {siteContent.global.siteName} Group
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom duration-1000 delay-100">
            {siteContent.home.heroTitle.split('.').map((s, i) => (
              <span key={i} className={i === 1 ? "gradient-text block" : ""}>{s.trim()}{i === 0 ? '.' : ''}</span>
            ))}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-400 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            {siteContent.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <Link to="/projects" className="w-full sm:w-auto px-12 py-6 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl shadow-amber-500/20">
              <span>{siteContent.home.ctaPrimary}</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-12 py-6 glass text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 hover:bg-white/5 flex items-center justify-center">
              {siteContent.home.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <StatsSection />

      <section className="py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="text-amber-500 font-black tracking-[0.4em] uppercase text-xs mb-4">Master Portfolio</div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Architectural Landmarks</h2>
            </div>
            <Link to="/projects" className="group px-8 py-4 glass border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-amber-500 hover:text-white transition-all flex items-center space-x-3">
              <span>Explore All</span> <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.filter(p => p.status !== 'Draft').slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
