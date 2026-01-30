
import React, { useEffect } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Target, Eye, Users, Award } from 'lucide-react';

const About: React.FC = () => {
  const { siteContent } = useData();

  useEffect(() => {
    document.title = siteContent.about.seo.title || "About Us | Asghar Builders";
    document.querySelector('meta[name="description"]')?.setAttribute('content', siteContent.about.seo.description);
  }, [siteContent]);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-10">
            <div className="inline-block text-amber-500 font-black tracking-[0.4em] uppercase text-xs px-6 py-2 glass rounded-full border border-amber-500/20">Our Legacy</div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">Pioneering Architectural <span className="gradient-text">Excellence</span></h1>
            <p className="text-gray-400 text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-amber-500 pl-8">
              {siteContent.about.intro}
            </p>
            <p className="text-gray-400 text-lg leading-relaxed opacity-80">
              {siteContent.about.description}
            </p>
          </div>
          <div className="relative">
            <div className="glass p-4 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" alt="Corporate" className="rounded-[3.5rem] w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-amber-500 p-12 rounded-[3rem] hidden md:block shadow-2xl shadow-amber-500/40 transform hover:scale-110 transition-transform">
              <Award className="text-white mx-auto mb-3" size={56} />
              <div className="text-white font-black text-center text-2xl tracking-tighter leading-none">25+ Years<br/>Excellence</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-40">
          <div className="glass p-16 rounded-[4rem] border border-white/5 group hover:border-amber-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
               <Eye size={180} />
            </div>
            <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <Eye className="text-amber-500" size={40} />
            </div>
            <h3 className="text-4xl font-black text-white mb-8 tracking-tighter">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed text-xl font-medium">
              {siteContent.about.vision}
            </p>
          </div>
          <div className="glass p-16 rounded-[4rem] border border-white/5 group hover:border-amber-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
               <Target size={180} />
            </div>
            <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <Target className="text-amber-500" size={40} />
            </div>
            <h3 className="text-4xl font-black text-white mb-8 tracking-tighter">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed text-xl font-medium">
              {siteContent.about.mission}
            </p>
          </div>
        </div>

        <div className="glass p-12 md:p-32 rounded-[5rem] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent text-center">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Users size={400} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto">
             <div className="text-amber-500 font-black uppercase text-xs tracking-[0.5em] mb-12">Executive Strategy</div>
             <p className="text-3xl md:text-5xl font-bold text-white italic leading-tight mb-16 tracking-tighter">
              "{siteContent.about.chairmanMessage}"
             </p>
             <div className="flex flex-col items-center">
               <div className="w-32 h-32 rounded-full bg-slate-800 border-8 border-amber-500/10 mb-8 overflow-hidden shadow-2xl">
                 <img src={siteContent.about.chairmanImg || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"} className="w-full h-full object-cover grayscale" alt="Chairman" />
               </div>
               <div>
                  <div className="text-white font-black text-3xl tracking-tighter">{siteContent.about.chairmanName}</div>
                  <div className="text-amber-500 font-black tracking-[0.3em] uppercase text-xs mt-2">{siteContent.about.chairmanRole}</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
