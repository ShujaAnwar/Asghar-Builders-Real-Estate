
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Project, SiteContent, MediaItem } from '../types.ts';

const getEnv = (key: string) => {
  return (window as any).process?.env?.[key] || (process.env as any)?.[key] || '';
};

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const INITIAL_CONTENT: SiteContent = {
  global: {
    siteName: 'Asghar Builders',
    logoUrl: '',
    footerText: 'Building Trust. Creating Landmarks. Premium Real Estate Excellence.',
    navigation: [
      { label: 'Home', path: '/' },
      { label: 'Projects', path: '/projects' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ],
    socialLinks: { 
      facebook: '', 
      twitter: '', 
      instagram: '', 
      linkedin: '',
      youtube: '',
      tiktok: '',
      whatsapp: ''
    }
  },
  home: {
    heroTitle: 'Building Trust. Creating Landmarks.',
    heroSubtitle: 'Karachi\'s premier luxury real estate and construction group, dedicated to architectural excellence and on-time delivery.',
    heroBgUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
    ctaPrimary: 'Explore Projects',
    ctaSecondary: 'Contact Us',
    highlights: [
      { label: 'Years Experience', value: '25', suffix: '+' },
      { label: 'Projects Delivered', value: '50', suffix: '' },
      { label: 'Satisfied Families', value: '1000', suffix: '+' }
    ],
    whyUs: { title: 'Why Asghar Builders', items: [] },
    seo: { title: 'Home | Asghar Builders', description: 'Premium Real Estate in Karachi', keywords: 'Karachi, Construction' }
  },
  about: {
    intro: 'Asghar Builders has been at the forefront of Karachi\'s real estate transformation for over two decades.',
    description: 'We specialize in high-end residential and commercial projects that define the city\'s skyline.',
    vision: 'To be the most trusted name in luxury construction in Pakistan.',
    mission: 'Delivering excellence through quality, transparency, and architectural innovation.',
    chairmanName: 'M. ASGHAR KHAN',
    chairmanRole: 'FOUNDER',
    chairmanMessage: 'Quality is our signature.',
    chairmanImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    seo: { title: 'About Us | Asghar Builders', description: 'Our Legacy', keywords: 'History, Team' }
  },
  contact: {
    address: 'Suite 502, Platinum Tower, Gulberg III, Lahore / Karachi',
    phone: '+92 300 1234567',
    phoneSecondary: '+92 21 34567890',
    email: 'info@asgharbuilders.com',
    whatsapp: '+923001234567',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.0617658925526!2d67.0658422!3d24.8144412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33c8b41743f5f%3A0xb353381622f6d0a7!2sPlatinum%20Tower!5e0!3m2!1sen!2s!4v1711234567890!5m2!1sen!2s',
    seo: { title: 'Contact | Invest with Us', description: 'Get in touch', keywords: 'Inquiry' }
  }
};

interface DataContextType {
  projects: Project[];
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => Promise<void>;
  media: MediaItem[];
  setMedia: (media: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => Promise<void>;
  siteContent: SiteContent;
  setSiteContent: (content: SiteContent) => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  uploadMedia: (file: File) => Promise<string | null>;
  deleteMedia: (id: string, url: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const STORAGE_BUCKET = 'projects';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, _setProjects] = useState<Project[]>([]);
  const [media, _setMedia] = useState<MediaItem[]>([]);
  const [siteContent, _setSiteContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const { data: projectsData } = await supabase.from('projects').select('*');
        if (projectsData) {
          const sorted = [...projectsData].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          _setProjects(sorted);
        }

        const { data: mediaData } = await supabase.from('media').select('*').order('created_at', { ascending: false });
        if (mediaData) _setMedia(mediaData);

        const { data: contentData } = await supabase.from('site_content').select('*').single();
        if (contentData && contentData.content) {
          _setSiteContent({
            ...INITIAL_CONTENT,
            ...contentData.content,
            global: { ...INITIAL_CONTENT.global, ...contentData.content.global },
            contact: { ...INITIAL_CONTENT.contact, ...contentData.content.contact },
            about: { ...INITIAL_CONTENT.about, ...contentData.content.about }
          });
        }

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
    const sorted = [...updated].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    _setProjects(sorted);
  };

  const setMedia = async (newMedia: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => {
    const updated = typeof newMedia === 'function' ? newMedia(media) : newMedia;
    _setMedia(updated);
  };

  const setSiteContent = async (content: SiteContent) => {
    _setSiteContent(content);
    await supabase.from('site_content').upsert({ id: 1, content });
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    setIsAdmin(true);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const uploadMedia = async (file: File) => {
    if (!isAdmin) return null;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const fileId = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const isVideo = file.type.startsWith('video/') || ['mp4', 'webm'].includes(ext);

    try {
      const { data, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileId, file, { cacheControl: '3600', upsert: true, contentType: file.type || 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileId);

      const newItem: MediaItem = { id: fileId, url: publicUrl, name: file.name, type: isVideo ? 'video' : 'image', tags: ['uploaded', ext] };
      await supabase.from('media').insert(newItem);
      _setMedia(prev => [newItem, ...prev]);
      return publicUrl;
    } catch (err: any) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const deleteMedia = async (id: string, url: string) => {
    try {
      await supabase.storage.from(STORAGE_BUCKET).remove([id]);
      await supabase.from('media').delete().eq('id', id);
      _setMedia(prev => prev.filter(m => m.id !== id));
      return true;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  };

  if (loading) {
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
    <DataContext.Provider value={{ projects, setProjects, media, setMedia, siteContent, setSiteContent, isAdmin, loading, login, logout, uploadMedia, deleteMedia }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
