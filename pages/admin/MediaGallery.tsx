
import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, Search, 
  Image as ImageIcon, Check, X, Upload, Loader2, Copy
} from 'lucide-react';

const MediaGallery: React.FC = () => {
  const { media, uploadMedia, deleteMedia } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      await uploadMedia(files[i]);
    }
    setUploading(false);
    setShowAdd(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string, url: string) => {
    if (window.confirm('Erase this asset from the infrastructure? This cannot be undone.')) {
      const success = await deleteMedia(id, url);
      if (!success) alert('Failed to delete asset. Ensure storage permissions are correct.');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Asset URL copied to clipboard.');
  };

  const filteredMedia = media.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.tags.some(t => t.includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-12">
      <div className="max-w-7xl mx-auto pb-24">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Dashboard Overview
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white">Infrastructure Assets</h1>
            <p className="text-gray-500 mt-2">Manage all high-resolution architectural imagery.</p>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search repository..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-amber-500/20 flex items-center space-x-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              <span>{uploading ? 'Uploading...' : 'Deploy Asset'}</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept="image/*,video/*"
              onChange={handleFileUpload} 
            />
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMedia.map(item => (
            <div key={item.id} className="group glass rounded-3xl border border-white/10 overflow-hidden relative aspect-square">
              <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6 z-10">
                <div className="flex justify-between items-start">
                  <button 
                    onClick={() => copyToClipboard(item.url)}
                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 text-white transition-all"
                    title="Copy Public URL"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDelete(item.id, item.url)}
                    className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all transform active:scale-90"
                    title="Delete Permanently"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs truncate mb-2">{item.name}</h4>
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
            <h3 className="text-xl font-bold">Node Empty</h3>
            <p className="mt-2">Upload assets to populate the architectural library.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
