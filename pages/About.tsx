import React, { useEffect } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Target, Eye, Gem, Users, Scale, Award, Clock } from 'lucide-react';

const About: React.FC = () => {
  const { siteContent } = useData();

  useEffect(() => {
    document.title = "About Us | The Legacy of Asghar Builders";
    const description = siteContent.about.intro;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [siteContent]);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-block text-amber-500 font-bold tracking-widest uppercase text-sm px-4 py-1 glass rounded-full border border-amber-500/20">Our Legacy</div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1]">We Build Future <br />Through Innovation</h1>
            <p className="text-gray-400 text-xl leading-relaxed">
              {siteContent.about.intro}
            </p>
            <p className="text-gray-400 text-lg leading-relaxed opacity-80">
              {siteContent.about.description}
            </p>
          </div>
          <div className="relative">
            <div className="glass p-3 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" alt="Corporate" className="rounded-[2.5rem] w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-amber-500 p-10 rounded-3xl hidden md:block shadow-2xl shadow-amber-500/40">
              <Award className="text-white mx-auto mb-2" size={48} />
              <div className="text-white font-black text-center text-xl">25+ Years<br/>Excellence</div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-10 mb-32">
          <div className="glass p-12 rounded-[3rem] border border-white/5 group hover:border-amber-500/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Eye size={120} />
            </div>
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Eye className="text-amber-500" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              {siteContent.about.vision}
            </p>
          </div>
          <div className="glass p-12 rounded-[3rem] border border-white/5 group hover:border-amber-500/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Target size={120} />
            </div>
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Target className="text-amber-500" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              {siteContent.about.mission}
            </p>
          </div>
        </div>

        {/* Chairman Msg */}
        <div className="mt-32 glass p-12 md:p-20 rounded-[4rem] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Users size={300} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
             <h3 className="text-amber-500 font-bold uppercase text-sm tracking-widest mb-10">Chairman's Message</h3>
             <p className="text-2xl md:text-4xl font-medium text-white italic leading-relaxed mb-12">
              "{siteContent.about.chairmanMessage}"
             </p>
             <div className="flex flex-col items-center">
               <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-amber-500/20 mb-6 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Chairman" />
               </div>
               <div>
                  <div className="text-white font-black text-2xl">M. Asghar Khan</div>
                  <div className="text-amber-500 font-bold tracking-widest uppercase text-xs mt-1">Founder & Chairman</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;