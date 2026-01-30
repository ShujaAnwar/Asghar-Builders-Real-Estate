
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, SiteContent, ProjectStatus, ProjectType } from '../types.ts';
import { PROJECTS as INITIAL_PROJECTS } from '../constants.ts';

interface DataContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const INITIAL_CONTENT: SiteContent = {
  home: {
    heroTitle: "Building Trust. Creating Landmarks.",
    heroSubtitle: "Asghar Builders brings you visionary architectural designs and premium construction quality tailored for elite living and smart investments.",
    ctaPrimary: "Explore Projects",
    ctaSecondary: "Contact Sales Team",
  },
  about: {
    intro: "Founded in the late 90s, Asghar Builders started with a simple vision: to elevate the standard of living in Pakistan through architectural brilliance and structural integrity.",
    description: "Today, we stand as one of the most trusted names in real estate development, having delivered over 40+ high-profile projects ranging from luxury apartments to corporate skyscrapers.",
    vision: "To be the premier catalyst of urban modernization in Pakistan, setting global benchmarks in luxury real estate.",
    mission: "To deliver high-value real estate solutions that maximize investor returns while providing homeowners with smart masterpieces.",
    chairmanMessage: "We don't just sell plots or apartments; we offer a promise of trust and a secure future for your family.",
  },
  contact: {
    address: "Suite 502, Platinum Tower, Gulberg III, Lahore, Pakistan.",
    phone: "+92 (300) 123-4567",
    phoneSecondary: "+92 (42) 345-6789",
    email: "info@asgharbuilders.com",
    whatsapp: "+923001234567",
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('asghar_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
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
    localStorage.setItem('asghar_content', JSON.stringify(siteContent));
  }, [siteContent]);

  const login = (password: string) => {
    if (password === 'admin123') { // Simple mock authentication
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
    <DataContext.Provider value={{ projects, setProjects, siteContent, setSiteContent, isAdmin, login, logout }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
