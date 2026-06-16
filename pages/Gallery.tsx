
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Maximize2, X, Building2, MapPin, LayoutGrid, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Gallery: React.FC = () => {
  const { media, projects } = useData();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    document.title = "Visual Gallery | Asghar Builders";
  }, []);

  const groupedGalleries = useMemo(() => {
    const galleries = projects
      .filter(p => p.gallery && p.gallery.length > 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        location: p.location,
        images: p.gallery.map((url, i) => ({
          id: `${p.id}-gal-${i}`,
          url,
          name: `${p.name} - View ${i + 1}`,
          project: p.name
        }))
      }));

    if (media.length > 0) {
      galleries.push({
        id: 'general',
        name: 'General Media',
        type: 'Other' as any,
        location: 'Company Wide',
        images: media.map(m => ({
          id: m.id,
          url: m.url,
          name: m.name,
          project: 'General Media'
        }))
      });
    }

    return galleries;
  }, [projects, media]);

  const projectNames = useMemo(() => ['All', ...groupedGalleries.map(g => g.name)], [groupedGalleries]);

  const displayedGalleries = activeFilter === 'All' 
    ? groupedGalleries 
    : groupedGalleries.filter(g => g.name === activeFilter);

  const allVisibleImages = useMemo(() => {
    return displayedGalleries.flatMap(g => g.images);
  }, [displayedGalleries]);

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
    setCurrentImgIndex((prev) => (prev + 1) % allVisibleImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentImgIndex((prev) => (prev - 1 + allVisibleImages.length) % allVisibleImages.length);
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
  }, [lightboxOpen, currentImgIndex, allVisibleImages]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
            <LayoutGrid size={14} />
            Visual Portfolio
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Architectural <span className="text-amber-500 italic">Excellence</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our journey through landmarks. From conceptual sketches to completed masterpieces, 
            witness the quality that defines Asghar Builders.
          </p>
        </div>

        {/* Project Filter */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
            <Filter size={18} className="text-amber-500" />
            <span className="font-bold uppercase tracking-wider text-sm">Filter by Project</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {projectNames.map(name => (
              <button
                key={name}
                onClick={() => setActiveFilter(name)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  activeFilter === name 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20 scale-105' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-amber-500/50 hover:text-amber-500'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Sections */}
        <div className="space-y-24">
          {displayedGalleries.map((gallery) => (
            <section key={gallery.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Building2 className="text-amber-500" size={28} />
                    {gallery.name}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-amber-500" />
                      {gallery.location}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="uppercase tracking-widest text-xs">{gallery.type}</span>
                  </div>
                </div>
                <div className="text-slate-400 dark:text-slate-500 text-sm font-mono">
                  {gallery.images.length} {gallery.images.length === 1 ? 'Image' : 'Images'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.images.map((img, i) => (
                  <div 
                    key={img.id} 
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 p-1 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10"
                    onClick={() => {
                      const idx = allVisibleImages.findIndex(item => item.id === img.id);
                      if (idx !== -1) {
                        openLightbox(idx);
                      }
                    }}
                  >
                    <img 
                      src={img.url} 
                      alt={img.name} 
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-lg">
                          <Maximize2 className="text-white" size={20} />
                        </div>
                        <p className="text-white font-bold text-lg leading-tight">{img.name}</p>
                        <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mt-1">{gallery.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {displayedGalleries.length === 0 && (
          <div className="text-center py-32">
            <div className="bg-slate-100 dark:bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutGrid className="text-slate-300 dark:text-slate-700" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Images Found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try selecting a different project filter.</p>
          </div>
        )}
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
              <div className="flex flex-col text-left">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
                  {allVisibleImages[currentImgIndex]?.project}
                </span>
                <span className="text-white font-bold text-sm hidden sm:inline-block">
                  {allVisibleImages[currentImgIndex]?.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-gray-400 font-mono text-sm">
                  <span className="text-white font-bold">{currentImgIndex + 1}</span> / {allVisibleImages.length}
                </div>
                <button
                  onClick={closeLightbox}
                  className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all hover:scale-105 shadow-lg flex items-center justify-center cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
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
                    src={allVisibleImages[currentImgIndex]?.url}
                    alt={allVisibleImages[currentImgIndex]?.name}
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
              {allVisibleImages.map((img, idx) => (
                <button
                  key={img.id}
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
                  <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

