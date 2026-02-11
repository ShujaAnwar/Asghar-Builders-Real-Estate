
import React, { useEffect } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Target, Eye, Users, Award, Quote } from 'lucide-react';

const About: React.FC = () => {
  const { siteContent } = useData();

  useEffect(() => {
    document.title = siteContent.about.seo.title || "About Us | Asghar Builders";
    document.querySelector('meta[name="description"]')?.setAttribute('content', siteContent.about.seo.description);
  }, [siteContent]);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legacy Section */}
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

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-40">
          <div className="glass p-16 rounded-[4rem] border border-white/5 group hover:border-amber-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
               <Eye size={180} />
            </div>
            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
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
            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <Target className="text-amber-500" size={40} />
            </div>
            <h3 className="text-4xl font-black text-white mb-8 tracking-tighter">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed text-xl font-medium">
              {siteContent.about.mission}
            </p>
          </div>
        </div>

        {/* Founder Section - High Accuracy Matching UI Screenshot */}
        <section className="relative py-20 px-4">
           <div className="glass rounded-[4rem] border border-white/10 overflow-hidden bg-slate-950/80 relative shadow-2xl">
             <div className="grid lg:grid-cols-2 items-stretch min-h-[600px]">
               {/* Founder Image Side */}
               <div className="relative overflow-hidden bg-slate-900">
                 <img 
                   src={siteContent.about.chairmanImg} 
                   className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000" 
                   alt="Founder Portrait" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent"></div>
                 
                 {/* Signature Rounded Corner from Screenshot */}
                 <div className="absolute top-0 left-0 w-32 h-32 bg-slate-950 rounded-br-[4rem] border-b border-r border-white/5"></div>
                 
                 <div className="absolute bottom-10 left-10">
                   <div className="glass px-6 py-2 rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl">
                      Asghar Builders Leadership
                   </div>
                 </div>
               </div>

               {/* Content Side (Matched to dark navy/black split) */}
               <div className="bg-[#050a18] p-12 md:p-24 flex flex-col justify-center space-y-12 relative border-l border-white/5">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                   <Users size={400} />
                 </div>
                 
                 <div className="relative space-y-6">
                   <Quote className="text-amber-500 mb-8 opacity-80" size={48} />
                   <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tighter italic">
                    "{siteContent.about.chairmanMessage}"
                   </h2>
                 </div>

                 <div className="pt-12 border-t border-white/10">
                    <div className="flex flex-col">
                       <span className="text-white font-black text-5xl tracking-tighter uppercase mb-2">{siteContent.about.chairmanName}</span>
                       <div className="flex items-center space-x-4">
                          <div className="h-0.5 w-12 bg-amber-500"></div>
                          <span className="text-amber-500 font-black tracking-[0.4em] uppercase text-xs">{siteContent.about.chairmanRole}</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-10">
                    <div className="opacity-20 grayscale invert">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Signature_of_Mahatma_Gandhi.png" alt="Verified Signature" className="h-14" />
                    </div>
                 </div>
               </div>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default About;
