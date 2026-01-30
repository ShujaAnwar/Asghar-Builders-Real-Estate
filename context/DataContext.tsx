
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, SiteContent, MediaItem } from '../types.ts';

// Fix: Access environment variables via process.env directly instead of window.process.env
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gjvgczueyvhifiollnsg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5H5Dcfo3wOwowyQkgDABRw_eBqkf6dk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  deleteMedia: (id: string, url: string) => Promise<boolean>;
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
        const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projectsData) _setProjects(projectsData);

        const { data: mediaData } = await supabase.from('media').select('*').order('created_at', { ascending: false });
        if (mediaData) _setMedia(mediaData);

        const { data: contentData } = await supabase.from('site_content').select('*').single();
        if (contentData) _setSiteContent(contentData.content);

        const { data: { session } } = await supabase.auth.getSession();
        setIsAdmin(!!session);
      } catch (err) {
        console.error('Supabase initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();

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
  };

  const setMedia = async (newMedia: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => {
    const updated = typeof newMedia === 'function' ? newMedia(media) : newMedia;
    _setMedia(updated);
  };

  const setSiteContent = async (content: SiteContent) => {
    _setSiteContent(content);
    const { error } = await supabase.from('site_content').upsert({ id: 1, content }).select();
    if (error) console.error('Error saving content:', error);
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
    // 1. Validation for desktop/PC users
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert(`Unsupported file type: ${file.type}. Please use JPG, PNG, or WEBP.`);
      return null;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File is too large. Max size allowed is 10MB.");
      return null;
    }

    // 2. Secure and Clean File Naming
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const path = `uploads/${Date.now()}-${cleanFileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('project-media')
        .upload(path, file, { 
          cacheControl: '3600', 
          upsert: true,
          contentType: file.type // Ensure correct MIME type is sent
        });

      if (error) {
        console.error('Supabase Storage Upload Error:', error);
        alert(`Storage Error: ${error.message}`);
        return null;
      }

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-media')
        .getPublicUrl(path);

      // 4. Record in Database
      const newItem: MediaItem = {
        id: path,
        url: publicUrl,
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image',
        tags: ['uploaded', 'pc-sync']
      };

      const { error: dbError } = await supabase.from('media').insert(newItem);
      if (dbError) {
        console.error('Database Sync Error:', dbError);
        // We still have the storage URL, so we can return it, but notify the admin
      }

      _setMedia(prev => [newItem, ...prev]);
      return publicUrl;
    } catch (err) {
      console.error('Unexpected Upload Failure:', err);
      alert('An unexpected error occurred during desktop upload.');
      return null;
    }
  };

  const deleteMedia = async (id: string, url: string) => {
    const { error: storageError } = await supabase.storage
      .from('project-media')
      .remove([id]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      return false;
    }

    const { error: dbError } = await supabase.from('media').delete().eq('id', id);
    if (dbError) {
      console.error('DB deletion error:', dbError);
      return false;
    }

    _setMedia(prev => prev.filter(m => m.id !== id));
    return true;
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
      uploadMedia,
      deleteMedia
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
