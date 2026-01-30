
import React, { useState } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, Search, 
  Image as ImageIcon, Check, X
} from 'lucide-react';

const MediaGallery: React.FC = () => {
  const { media, setMedia } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [newMedia, setNewMedia] = useState({ url: '', name: '', tags: '' });
  const [search, setSearch] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.url || !newMedia.name) return;

    const item = {
      id: `media-${Date.now()}`,
      url: newMedia.url,
      name: newMedia.name,
      type: 'image' as const,
      tags: newMedia.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '')
    };

    setMedia(prev => [item, ...prev]);
    setNewMedia({ url: '', name: '', tags: '' });
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media asset? This will remove it from the library.');
    if (confirmDelete) {
      setMedia(prev => {
        const updated = prev.filter(m => m.id !== id);
        console.log(`Deleted media item ${id}. New count: ${updated.length}`);
        return updated;
      });
    }
  };

  const filteredMedia = media.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.tags.some(t => t.includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Overview
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white">Media Library</h1>
            <p className="text-gray-500 mt-2">Centralized asset management for your entire website.</p>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button 
              type="button"
              onClick={() => setShowAdd(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Media</span>
            </button>
          </div>
        </header>

        {showAdd && (
          <div className="glass p-8 rounded-[2.5rem] border border-amber-500/30 mb-12 animate-in zoom-in duration-300">
            <form onSubmit={handleAdd} className="grid md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Asset URL</label>
                <input 
                  required
                  value={newMedia.url}
                  onChange={e => setNewMedia({...newMedia, url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Display Name</label>
                <input 
                  required
                  value={newMedia.name}
                  onChange={e => setNewMedia({...newMedia, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                  placeholder="Hero Banner 1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Tags (Comma separated)</label>
                <div className="flex gap-4">
                  <input 
                    value={newMedia.tags}
                    onChange={e => setNewMedia({...newMedia, tags: e.target.value})}
                    className="flex-grow bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white"
                    placeholder="home, banner, exterior"
                  />
                  <button type="submit" className="p-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600">
                    <Check size={24} />
                  </button>
                  <button type="button" onClick={() => setShowAdd(false)} className="p-4 glass text-gray-400 rounded-xl hover:text-white">
                    <X size={24} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMedia.map(item => (
            <div key={item.id} className="group glass rounded-3xl border border-white/10 overflow-hidden relative aspect-square">
              <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                    <ImageIcon className="text-amber-500" size={18} />
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all transform active:scale-90 z-20"
                    title="Delete Asset"
                  >
                    <Trash2 size={20} className="pointer-events-none" />
                  </button>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm truncate mb-2">{item.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(t => (
                      <span key={t} className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-white/5 text-gray-400 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-32 text-gray-600">
            <ImageIcon className="mx-auto mb-6 opacity-20" size={64} />
            <h3 className="text-xl font-bold">No assets found</h3>
            <p className="mt-2">Try uploading new media or adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
