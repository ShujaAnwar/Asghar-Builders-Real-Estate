
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Project, SiteContent, MediaItem } from '../types.ts';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gjvgczueyvhifiollnsg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5H5Dcfo3wOwowyQkgDABRw_eBqkf6dk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface DataContextType {
  projects: Project[];
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => Promise<void>;
  media: MediaItem[];
  setMedia: (media: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => Promise<void>;
  siteContent: SiteContent;
  setSiteContent: (content: SiteContent) => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  uploadMedia: (file: File) => Promise<string | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, _setProjects] = useState<Project[]>([]);
  const [media, _setMedia] = useState<MediaItem[]>([]);
  const [siteContent, _setSiteContent] = useState<SiteContent | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Fetch Projects
        const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projectsData) _setProjects(projectsData);

        // Fetch Media
        const { data: mediaData } = await supabase.from('media').select('*');
        if (mediaData) _setMedia(mediaData);

        // Fetch Site Content
        const { data: contentData } = await supabase.from('site_content').select('*').single();
        if (contentData) _setSiteContent(contentData.content);

        // Check Auth Session
        const { data: { session } } = await supabase.auth.getSession();
        setIsAdmin(!!session);
      } catch (err) {
        console.error('Supabase initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();

    // Listen for Auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const setProjects = async (newProjects: Project[] | ((prev: Project[]) => Project[])) => {
    const updated = typeof newProjects === 'function' ? newProjects(projects) : newProjects;
    _setProjects(updated);
    
    // Sync to Supabase
    // Note: In a production app, we would perform granular updates. 
    // Here we handle the active changes (upsert/delete)
    // For simplicity of this hook, we assume the individual page calls (like ProjectForm) handle the DB sync.
  };

  const setMedia = async (newMedia: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => {
    const updated = typeof newMedia === 'function' ? newMedia(media) : newMedia;
    _setMedia(updated);
  };

  const setSiteContent = async (content: SiteContent) => {
    _setSiteContent(content);
    await supabase.from('site_content').upsert({ id: 1, content }).select();
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    setIsAdmin(true);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const uploadMedia = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('project-media')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-media')
      .getPublicUrl(fileName);

    // Save metadata to media table
    const newItem: MediaItem = {
      id: fileName,
      url: publicUrl,
      name: file.name,
      type: file.type.startsWith('video') ? 'video' : 'image',
      tags: ['uploaded']
    };

    await supabase.from('media').insert(newItem);
    _setMedia(prev => [newItem, ...prev]);

    return publicUrl;
  };

  if (loading || !siteContent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Asghar Portal Syncing...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ 
      projects, setProjects, 
      media, setMedia, 
      siteContent, setSiteContent, 
      isAdmin, loading, 
      login, logout, 
      uploadMedia 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
