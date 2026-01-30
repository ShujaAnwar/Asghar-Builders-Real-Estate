
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, LayoutGrid, LogOut, 
  Trash2, Edit3, ExternalLink, Building2, 
  ShieldCheck, Image as ImageIcon, 
  Globe, Clock
} from 'lucide-react';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gjvgczueyvhifiollnsg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5H5Dcfo3wOwowyQkgDABRw_eBqkf6dk';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Dashboard: React.FC = () => {
  const { projects, setProjects, logout, media } = useData();
  const navigate = useNavigate();

  const stats = [
    { label: 'Portfolio Items', value: projects.length, icon: <Building2 />, color: 'text-blue-400' },
    { label: 'Media Assets', value: media.length, icon: <ImageIcon />, color: 'text-amber-400' },
    { label: 'Active Builds', value: projects.filter(p => p.status === 'Running').length, icon: <Clock />, color: 'text-green-400' },
    { label: 'Site Health', value: '100%', icon: <ShieldCheck />, color: 'text-purple-400' },
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action will remove it permanently from Supabase.')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        alert('Error deleting project: ' + error.message);
      } else {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-slate-900/50 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="text-white" size={20} />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tighter uppercase">Asghar <span className="text-amber-500">Panel</span></span>
          </div>
        </div>

        <nav className="flex-grow px-6 space-y-2 mt-4">
          <Link to="/admin" className="flex items-center space-x-3 p-4 bg-amber-500/10 text-amber-500 rounded-2xl font-bold">
            <LayoutGrid size={20} />
            <span>Overview</span>
          </Link>
          <Link to="/admin/projects/new" className="flex items-center space-x-3 p-4 text-gray-400 hover:bg-white/5 rounded-2xl transition-all">
            <Plus size={20} />
            <span>Add Project</span>
          </Link>
          <Link to="/admin/media" className="flex items-center space-x-3 p-4 text-gray-400 hover:bg-white/5 rounded-2xl transition-all">
            <ImageIcon size={20} />
            <span>Media Library</span>
          </Link>
          <Link to="/admin/content" className="flex items-center space-x-3 p-4 text-gray-400 hover:bg-white/5 rounded-2xl transition-all">
            <Globe size={20} />
            <span>Site Editor</span>
          </Link>
          
          <div className="pt-10 pb-4 px-4">
            <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Account</span>
          </div>
          <button onClick={logout} className="w-full flex items-center space-x-3 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-2">Supabase Linked</div>
          <div className="text-gray-500 text-xs">gjvgczueyvhifiollnsg</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-white">Live Infrastructure</h1>
              <p className="text-gray-500 mt-2">Connected to PostgreSQL via Supabase Real-time.</p>
            </div>
            <div className="flex space-x-4">
               <Link to="/" target="_blank" className="p-4 glass rounded-2xl text-gray-400 hover:text-white transition-all flex items-center space-x-2">
                 <ExternalLink size={20} />
                 <span className="font-bold text-sm">Live Site</span>
               </Link>
               <Link to="/admin/projects/new" className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-amber-500/20 transition-all transform hover:scale-[1.02]">
                 <Plus size={20} />
                 <span>New Project</span>
               </Link>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 100 })}
                </div>
                <div className={`${stat.color} mb-6`}>{stat.icon}</div>
                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Projects Table */}
          <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-xl font-bold text-white">Project Portfolio</h3>
                <p className="text-gray-500 text-sm mt-1">Direct from Supabase PostgreSQL database.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-8 py-6">Identity</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Current Status</th>
                    <th className="px-8 py-6 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-5">
                          <img src={p.imageUrl} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-amber-500/50 transition-all" alt={p.name} />
                          <div>
                            <div className="text-white font-bold text-lg">{p.name}</div>
                            <div className="text-xs text-gray-500 font-medium">{p.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-xs font-bold text-gray-400">{p.type}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${
                          p.status === 'Running' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          p.status === 'Upcoming' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-3">
                          <button onClick={() => navigate(`/admin/projects/edit/${p.id}`)} className="p-3 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all">
                            <Edit3 size={20} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
