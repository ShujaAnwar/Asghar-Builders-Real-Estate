
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext.tsx';
import { ArrowLeft, CheckCircle2, Download, MapPin, Building, Calendar, Info, Map as MapIcon, Loader2, ExternalLink, Ruler, Layers, Home, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useData();
  const project = projects.find(p => p.id === id);
  
  const [areaInsights, setAreaInsights] = useState<{ text: string; links: { title: string; uri: string }[] } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const allImages = project
    ? [project.imageUrl, ...(project.gallery || [])].filter(Boolean)
    : [];

  const openLightbox = (index: number) => {
    setCurrentImgIndex(index);
    setDirection(0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImgIndex, allImages]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) {
      document.title = `${project.name} | Asghar Builders`;
      const description = `${project.name} in ${project.location}. ${project.description} Explore investment opportunities.`;
      const keywords = `${project.name}, ${project.location}, real estate, Asghar Builders`;
      
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);

      // Fetch Area Insights automatically
      fetchNeighborhoodInsights();
    }
  }, [id, project]);

  const fetchNeighborhoodInsights = async () => {
    if (!project) return;
    setLoadingInsights(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using googleSearch as it is the most stable grounding tool for neighborhood analysis
      const prompt = `Provide an expert real estate analysis of the neighborhood for ${project.name} at ${project.location}. Mention proximity to top-tier schools, major hospitals like Aga Khan or South City (if nearby), and premium recreational spots. Use Google Search to verify current infrastructure status.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: 'You are an urban planning expert for Karachi real estate. Provide concise, premium neighborhood highlights. Focus on luxury, security, and accessibility.',
        }
      });

      const links: { title: string; uri: string }[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) {
            links.push({ title: chunk.web.title || 'Source', uri: chunk.web.uri });
          }
        });
      }

      setAreaInsights({
        text: response.text || "The surrounding infrastructure offers high-yield potential and premium access to city centers.",
        links: links.slice(0, 5)
      });
    } catch (err) {
      console.error("Failed to fetch neighborhood data:", err);
      setAreaInsights({
        text: "Neighborhood intelligence is currently being synchronized. This prime location is known for its architectural significance and strategic positioning.",
        links: []
      });
    } finally {
      setLoadingInsights(false);
    }
  };

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

  // Helper to extract virtual specs
  const getVirtualVal = (label: string) => project.specs?.find(s => s.label === label)?.value;

  return (
    <div className="pt-24 pb-24">
      {/* Hero Banner */}
      <div 
        onClick={() => openLightbox(0)}
        className="relative h-[60vh] min-h-[500px] overflow-hidden cursor-zoom-in group/hero"
      >
        <img 
          src={project.imageUrl} 
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/hero:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        {/* Subtle magnifying glass hover indicator */}
        <div className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
          <Search size={18} />
        </div>
        <div className="absolute bottom-12 left-0 w-full" onClick={(e) => e.stopPropagation()}>
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
              <h2 className="text-3xl font-bold text-white mb-6">Architectural Vision</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{project.longDescription}</p>
            </section>

            {/* Neighborhood Insights Powered by Gemini & Search Grounding */}
            <section className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <Search size={200} />
               </div>
               <div className="flex items-center space-x-4 mb-8">
                 <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <MapIcon size={24} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold text-white">Neighborhood Intelligence</h2>
                    <p className="text-xs text-amber-500 font-black uppercase tracking-[0.2em]">Grounding Analysis Enabled</p>
                 </div>
               </div>

               {loadingInsights ? (
                 <div className="flex flex-col items-center py-12 space-y-4">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Querying Global Search Infrastructure...</p>
                 </div>
               ) : areaInsights ? (
                 <div className="space-y-8 relative z-10">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {areaInsights.text}
                    </p>
                    {areaInsights.links.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {areaInsights.links.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-lg"
                          >
                            <ExternalLink size={12} />
                            <span>{link.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                 </div>
               ) : (
                 <p className="text-gray-500 italic">Location intelligence is currently offline.</p>
               )}
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
                    <div 
                      key={i} 
                      onClick={() => openLightbox(i + 1)}
                      className="group/item aspect-video rounded-[2rem] overflow-hidden glass p-1 transition-transform hover:scale-[1.02] cursor-zoom-in relative"
                    >
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover rounded-[1.8rem]" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center rounded-[1.8rem]">
                        <div className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white">
                          <Search size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl sticky top-32">
              <h3 className="text-xl font-bold text-white mb-8 pb-4 border-b border-white/5 text-center uppercase tracking-widest">Structural Metrics</h3>
              <div className="space-y-6">
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500 text-xs font-black uppercase tracking-wider">
                    <Building size={14} className="mr-3 text-amber-500" />
                    Category
                  </div>
                  <div className="text-white font-bold text-sm">{project.type}</div>
                </div>

                {getVirtualVal('Land Area') && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-xs font-black uppercase tracking-wider">
                      <Ruler size={14} className="mr-3 text-amber-500" />
                      Land Area
                    </div>
                    <div className="text-white font-bold text-sm">{getVirtualVal('Land Area')}</div>
                  </div>
                )}

                {getVirtualVal('Total Floors') && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-xs font-black uppercase tracking-wider">
                      <Layers size={14} className="mr-3 text-amber-500" />
                      Total Floors
                    </div>
                    <div className="text-white font-bold text-sm">{getVirtualVal('Total Floors')}</div>
                  </div>
                )}

                {getVirtualVal('Total Units') && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-xs font-black uppercase tracking-wider">
                      <Home size={14} className="mr-3 text-amber-500" />
                      Units
                    </div>
                    <div className="text-white font-bold text-sm">{getVirtualVal('Total Units')}</div>
                  </div>
                )}
                
                {project.specs.filter(s => !['Land Area', 'Total Floors', 'Total Units'].includes(s.label)).map((spec, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-xs font-black uppercase tracking-wider">
                      <Info size={14} className="mr-3 text-amber-500" />
                      {spec.label}
                    </div>
                    <div className="text-white font-bold text-sm">{spec.value}</div>
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500 text-xs font-black uppercase tracking-wider">
                    <Calendar size={14} className="mr-3 text-amber-500" />
                    Status
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-black uppercase">
                    {project.status}
                  </span>
                </div>
              </div>

              {(project.priceRange || project.paymentPlan) && (
                <div className="mt-10 pt-8 border-t border-white/5">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest mb-4">Investment Portal</h4>
                  {project.priceRange && (
                    <div className="text-2xl font-black text-amber-500 mb-2">{project.priceRange}</div>
                  )}
                  {project.paymentPlan && (
                    <p className="text-gray-400 text-xs leading-relaxed mb-8">{project.paymentPlan}</p>
                  )}
                  <button className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3 shadow-xl shadow-amber-500/20">
                    <Download size={20} />
                    <span>Get Brochure</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Slider Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-8"
          >
            {/* Top Toolbar */}
            <div className="w-full max-w-7xl flex justify-between items-center z-10">
              <div className="text-gray-400 font-mono text-sm">
                <span className="text-white font-bold">{currentImgIndex + 1}</span> / {allImages.length}
              </div>
              <button
                onClick={closeLightbox}
                className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all hover:scale-105 shadow-lg flex items-center justify-center cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Stage */}
            <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center overflow-hidden my-4">
              {/* Left Button */}
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 z-10 p-4 bg-black/40 border border-white/5 hover:border-amber-500/20 hover:bg-amber-500 text-white rounded-2xl transition-all hover:scale-110 shadow-2xl flex items-center justify-center cursor-pointer group"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Slider Image Container */}
              <div className="relative w-full h-full max-h-[60vh] flex items-center justify-center p-2 sm:p-6" onClick={(e) => e.stopPropagation()}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={currentImgIndex}
                    custom={direction}
                    variants={{
                      enter: (direction: number) => ({
                        x: direction > 0 ? 100 : -100,
                        opacity: 0,
                        scale: 0.95
                      }),
                      center: {
                        zIndex: 1,
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.2 }
                        }
                      },
                      exit: (direction: number) => ({
                        zIndex: 0,
                        x: direction < 0 ? 100 : -100,
                        opacity: 0,
                        scale: 0.95,
                        transition: {
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.2 }
                        }
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    src={allImages[currentImgIndex]}
                    alt={`Slider view ${currentImgIndex}`}
                    className="max-h-[60vh] max-w-full object-contain rounded-[2rem] shadow-[0_0_80px_-10px_rgba(0,0,0,0.8)] select-none border border-white/5 bg-slate-900/50"
                  />
                </AnimatePresence>
              </div>

              {/* Right Button */}
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 z-10 p-4 bg-black/40 border border-white/5 hover:border-amber-500/20 hover:bg-amber-500 text-white rounded-2xl transition-all hover:scale-110 shadow-2xl flex items-center justify-center cursor-pointer group"
              >
                <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="w-full max-w-3xl overflow-x-auto no-scrollbar py-4 px-2 flex justify-start sm:justify-center items-center space-x-3 z-10" onClick={(e) => e.stopPropagation()}>
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentImgIndex ? 1 : -1);
                    setCurrentImgIndex(idx);
                  }}
                  className={`relative h-16 aspect-video shrink-0 rounded-xl overflow-hidden transition-all duration-300 transform select-none cursor-pointer ${
                    idx === currentImgIndex
                      ? 'border-2 border-amber-500 scale-105'
                      : 'border border-white/10 opacity-40 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
