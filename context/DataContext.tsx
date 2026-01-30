
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, SiteContent, ProjectStatus, ProjectType, MediaItem } from '../types.ts';
import { PROJECTS as INITIAL_PROJECTS } from '../constants.ts';

interface DataContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const INITIAL_MEDIA: MediaItem[] = INITIAL_PROJECTS.map(p => ({
  id: `media-${p.id}`,
  url: p.imageUrl,
  name: p.name,
  type: 'image',
  tags: ['project', p.type.toLowerCase()]
}));

const INITIAL_CONTENT: SiteContent = {
  global: {
    siteName: "Asghar Builders",
    logoUrl: "",
    faviconUrl: "",
    footerText: "Pioneers in luxury real estate development and high-end construction. We create landmarks that stand the test of time.",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    }
  },
  home: {
    heroTitle: "Building Trust. Creating Landmarks.",
    heroSubtitle: "Asghar Builders brings you visionary architectural designs and premium construction quality tailored for elite living and smart investments.",
    heroBgUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
    ctaPrimary: "Explore Projects",
    ctaSecondary: "Contact Sales Team",
    seo: {
      title: "Asghar Builders | Premium Real Estate",
      description: "Leading real estate developer in Pakistan.",
      keywords: "real estate, builders, construction"
    }
  },
  about: {
    intro: "Founded in the late 90s, Asghar Builders started with a simple vision: to elevate the standard of living in Pakistan through architectural brilliance and structural integrity.",
    description: "Today, we stand as one of the most trusted names in real estate development, having delivered over 48+ high-profile projects.",
    vision: "To be the premier catalyst of urban modernization in Pakistan.",
    mission: "To deliver high-value real estate solutions that maximize investor returns.",
    chairmanName: "M. Asghar Khan",
    chairmanRole: "Founder & Chairman",
    chairmanMessage: "We don't just sell plots; we offer a promise of trust and a secure future.",
    chairmanImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    seo: {
      title: "About Us | Asghar Builders",
      description: "Our legacy and mission.",
      keywords: "about builders, chairman message"
    }
  },
  contact: {
    address: "Asghar Builders Head Office, G.T. Road, Gujranwala, Punjab, Pakistan.",
    phone: "+92 (300) 741-2400",
    phoneSecondary: "+92 (55) 345-6789",
    email: "info@asgharbuilders.com",
    whatsapp: "+923007412400",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3378.118671404179!2d74.1945!3d32.1877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f2982d6226683%3A0x6b5c398329b3503d!2sAsghar%20Builders!5e0!3m2!1sen!2s!4v1714500000000!5m2!1sen!2s",
    seo: {
      title: "Contact Us | Asghar Builders",
      description: "Get in touch with our team in Gujranwala.",
      keywords: "contact real estate, builder Gujranwala, Asghar Builders office"
    }
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('asghar_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS.map(p => ({ ...p, slug: p.id }));
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('asghar_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('asghar_content');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('asghar_admin_session') === 'active';
  });

  useEffect(() => {
    localStorage.setItem('asghar_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('asghar_media', JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem('asghar_content', JSON.stringify(siteContent));
  }, [siteContent]);

  const login = (password: string) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('asghar_admin_session', 'active');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('asghar_admin_session');
  };

  return (
    <DataContext.Provider value={{ projects, setProjects, media, setMedia, siteContent, setSiteContent, isAdmin, login, logout }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
