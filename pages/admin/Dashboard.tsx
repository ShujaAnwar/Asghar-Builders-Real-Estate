
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.tsx';
import { 
  Plus, LayoutGrid, FileText, Settings, LogOut, 
  Trash2, Edit3, ExternalLink, Building2, BarChart3, 
  Clock, CheckCircle, Rocket
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { projects, setProjects, logout } = useData();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: <Building2 />, color: 'text-blue-400' },
    { label: 'Ongoing', value: projects.filter(p => p.status === 'Running').length, icon: <Clock />, color: 'text-amber-400' },
    { label: 'Upcoming', value: projects.filter(p => p.status === 'Upcoming').length, icon: <Rocket />, color: 'text-purple-400' },
    { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, icon: <CheckCircle />, color: 'text-green-400' },
  ];

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center">
              <Building2 className="text-white" size={18} />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tighter">ASGHAR <span className="text-amber-500">CMS</span></span>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <Link to="/admin" className="flex items-center space-x-3 p-4 bg-amber-500/10 text-amber-500 rounded-xl font-bold">
            <LayoutGrid size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/content" className="flex items-center space-x-3 p-4 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <FileText size={20} />
            <span>Site Content</span>
          </Link>
          <button onClick={logout} className="w-full flex items-center space-x-3 p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto mb-8">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h1 className="text-4xl font-black text-white">Project Management</h1>
              <p className="text-gray-500 mt-2">Manage your real estate portfolio in real-time.</p>
            </div>
            <div className="flex space-x-4">
               <Link to="/" className="p-3 glass rounded-xl text-gray-400 hover:text-white transition-all">
                 <ExternalLink size={20} />
               </Link>
               <Link to="/admin/projects/new" className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/20">
                 <Plus size={20} />
                 <span>Add Project</span>
               </Link>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-white/10">
                <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Project List */}
          <div className="glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-lg font-bold text-white">All Projects</h3>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Sort by: Date Added</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover border border-white/10" alt={p.name} />
                          <div>
                            <div className="text-white font-bold">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{p.location}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-full border ${
                          p.status === 'Running' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          p.status === 'Upcoming' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => navigate(`/admin/projects/edit/${p.id}`)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {projects.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No projects found. Start by adding one!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
