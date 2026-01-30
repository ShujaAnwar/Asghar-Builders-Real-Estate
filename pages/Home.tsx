
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { HIGHLIGHTS } from '../constants.ts';
import ProjectCard from '../components/ProjectCard.tsx';
import { useData } from '../context/DataContext.tsx';

const Home: React.FC = () => {
  const { projects, siteContent } = useData();

  useEffect(() => {
    document.title = "Asghar Builders | Building Trust. Creating Landmarks.";
    const description = siteContent.home.heroSubtitle;
    const keywords = "Asghar Builders, real estate Pakistan, luxury apartments Islamabad, construction company Lahore, property investment Pakistan";
    
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
  }, [siteContent]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-40" 
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center px-4 py-2 glass rounded-full border border-white/10 text-amber-500 text-sm font-semibold tracking-wider uppercase mb-4 animate-in fade-in slide-in-from-bottom duration-700">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-ping"></span>
            Leading Real Estate Developer in Pakistan
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom duration-1000 delay-100">
            {siteContent.home.heroTitle.split('.').map((s, i) => i === 1 ? <span key={i} className="gradient-text"><br/>{s}</span> : s)}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            {siteContent.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <Link to="/projects" className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20">
              <span>{siteContent.home.ctaPrimary}</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 glass text-white font-bold rounded-xl transition-all border border-white/10 hover:bg-white/5 flex items-center justify-center">
              {siteContent.home.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {HIGHLIGHTS.map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-4xl md:text-6xl font-black text-white mb-2 group-hover:text-amber-500 transition-colors">
                  {item.value}{item.suffix}
                </div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4">
            <div>
              <div className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2">Portfolio</div>
              <h2 className="text-4xl font-extrabold text-white">Our Masterpieces</h2>
            </div>
            <Link to="/projects" className="text-amber-500 font-bold hover:underline inline-flex items-center">
              View All Projects <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Asghar Builders etc (Omitted for brevity, using existing content) */}
    </div>
  );
};

export default Home;
