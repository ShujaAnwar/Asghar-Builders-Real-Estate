
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Maximize2, X } from 'lucide-react';

const Gallery: React.FC = () => {
  const { media, projects } = useData();
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Visual Gallery | Asghar Builders";
  }, []);

  // Combine media and project galleries
  const allImages = [
    ...media,
    ...projects.flatMap(p => p.gallery.map((url, i) => ({
      id: `${p.id}-gal-${i}`,
      url,
      name: `${p.name} Detail`,
      tags: ['project', p.type.toLowerCase()]
    })))
  ];

  const uniqueTags = ['All', ...Array.from(new Set(allImages.flatMap(img => img.tags)))];

  const filteredImages = filter === 'All' 
    ? allImages 
    : allImages.filter(img => img.tags.includes(filter.toLowerCase()));

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">Visual <span className="text-amber-500">Excellence</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A curated showcase of our architectural achievements and interior masterpieces.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {uniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                filter === tag 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((img, i) => (
            <div 
              key={i} 
              className="group relative aspect-square rounded-2xl overflow-hidden glass p-1 cursor-pointer"
              onClick={() => setSelectedImage(img.url)}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Maximize2 className="text-white" size={24} />
                  </div>
                  <p className="text-white font-bold text-sm">{img.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No images found in this category.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white hover:text-amber-500 transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={48} />
          </button>
          <img 
            src={selectedImage} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            alt="Preview" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
