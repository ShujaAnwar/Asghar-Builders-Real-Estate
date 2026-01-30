
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
    footerText: "Pioneers in luxury real estate development and high-end construction in Karachi. We create landmarks that stand the test of time.",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    }
  },
  home: {
    heroTitle: "Building Trust. Creating Landmarks.",
    heroSubtitle: "Asghar Builders brings you visionary architectural designs and premium construction quality tailored for elite living and smart investments in Karachi.",
    heroBgUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
    ctaPrimary: "Explore Projects",
    ctaSecondary: "Contact Sales Team",
    seo: {
      title: "Asghar Builders | Premium Real Estate Karachi",
      description: "Leading real estate developer in Karachi, Pakistan.",
      keywords: "real estate, builders, construction, Karachi properties"
    }
  },
  about: {
    intro: "Founded in the late 90s, Asghar Builders started with a simple vision: to elevate the standard of living in Karachi through architectural brilliance and structural integrity.",
    description: "Today, we stand as one of the most trusted names in real estate development, having delivered numerous high-profile projects across Karachi.",
    vision: "To be the premier catalyst of urban modernization in Karachi.",
    mission: "To deliver high-value real estate solutions that maximize investor returns.",
    chairmanName: "M. Asghar Khan",
    chairmanRole: "Founder & Chairman",
    chairmanMessage: "We don't just sell plots; we offer a promise of trust and a secure future.",
    chairmanImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    seo: {
      title: "About Us | Asghar Builders Karachi",
      description: "Our legacy and mission in Karachi.",
      keywords: "about builders, chairman message, Karachi development"
    }
  },
  contact: {
    address: "Asghar Builders Head Office, Shahrah-e-Faisal, Karachi, Sindh, Pakistan.",
    phone: "+92 (300) 741-2400",
    phoneSecondary: "+92 (21) 3456-7890",
    email: "info@asgharbuilders.com",
    whatsapp: "+923007412400",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14476.438515061448!2d67.0681!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33eeb6d2994d5%3A0x6a26778403d59e3!2sShahrah-e-Faisal%2C%20Karachi!5e0!3m2!1sen!2s!4v1714500000000!5m2!1sen!2s",
    seo: {
      title: "Contact Us | Asghar Builders Karachi",
      description: "Get in touch with our team in Karachi.",
      keywords: "contact real estate, builder Karachi, Asghar Builders office"
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
