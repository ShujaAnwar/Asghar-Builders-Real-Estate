import React, { useEffect } from 'react';
// Fix: Added missing Clock import from lucide-react
import { Target, Eye, Gem, Users, Scale, Award, Clock } from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    document.title = "About Us | The Legacy of Asghar Builders";
    const description = "Learn about the 25-year legacy of Asghar Builders, our mission to modernize urban living, and our core values of integrity and excellence.";
    const keywords = "about asghar builders, construction philosophy, real estate vision, company legacy, builder history Pakistan";
    
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <div className="inline-block text-amber-500 font-bold tracking-widest uppercase text-sm">Our Legacy</div>
            <h1 className="text-5xl font-black text-white leading-tight">We Build Future <br />Through Innovation</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded in the late 90s, Asghar Builders started with a simple vision: to elevate the standard of living in Pakistan through architectural brilliance and structural integrity. 
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Today, we stand as one of the most trusted names in real estate development, having delivered over 40+ high-profile projects ranging from luxury apartments to corporate skyscrapers. Our philosophy is rooted in legal transparency, sustainable practices, and investor protection.
            </p>
          </div>
          <div className="relative">
            <div className="glass p-2 rounded-[2rem] border border-white/10">
              <img src="https://picsum.photos/seed/corporate/800/600" alt="Corporate" className="rounded-[1.5rem] w-full h-auto" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-amber-500 p-10 rounded-3xl hidden md:block">
              <Award className="text-white mx-auto mb-2" size={40} />
              <div className="text-white font-bold text-center">Excellence Award<br/>2023</div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="glass p-12 rounded-[2.5rem] border border-white/5 group hover:border-amber-500/20 transition-all">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Eye className="text-amber-500" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              To be the premier catalyst of urban modernization in Pakistan, setting global benchmarks in luxury real estate and innovative construction that empowers generations.
            </p>
          </div>
          <div className="glass p-12 rounded-[2.5rem] border border-white/5 group hover:border-amber-500/20 transition-all">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Target className="text-amber-500" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              To deliver high-value real estate solutions that maximize investor returns while providing homeowners with safe, sustainable, and smart architectural masterpieces.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
          <div className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2">Our Values</div>
          <h2 className="text-4xl font-extrabold text-white">The Pillars of Asghar Builders</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Scale size={32} />, title: 'Integrity', text: '100% legal compliance and clear NOCs for all projects.' },
            { icon: <Gem size={32} />, title: 'Excellence', text: 'Meticulous attention to detail in design and finishes.' },
            { icon: <Clock size={32} />, title: 'Punctuality', text: 'Consistent track record of delivering projects before time.' },
            { icon: <Users size={32} />, title: 'Community', text: 'Focused on creating spaces that foster social well-being.' },
          ].map((val, i) => (
            <div key={i} className="text-center p-8 glass rounded-3xl border border-white/5 hover:translate-y-[-5px] transition-all">
              <div className="text-amber-500 flex justify-center mb-6">{val.icon}</div>
              <h4 className="text-white font-bold mb-3">{val.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{val.text}</p>
            </div>
          ))}
        </div>

        {/* Chairman Msg */}
        <div className="mt-32 glass p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Users size={200} />
          </div>
          <div className="relative z-10 max-w-3xl">
             <h3 className="text-amber-500 font-bold uppercase text-sm tracking-widest mb-6">Chairman's Message</h3>
             <p className="text-2xl md:text-3xl font-medium text-white italic leading-relaxed mb-8">
              "We don't just sell plots or apartments; we offer a promise of trust and a secure future for your family. At Asghar Builders, your investment is our responsibility."
             </p>
             <div className="flex items-center space-x-4">
               <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
               <div>
                  <div className="text-white font-black text-lg">M. Asghar Khan</div>
                  <div className="text-gray-500 text-sm">Founder & Chairman</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;