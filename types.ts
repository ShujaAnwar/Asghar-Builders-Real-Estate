
export enum ProjectStatus {
  RUNNING = 'Running',
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed',
  DRAFT = 'Draft'
}

export enum ProjectType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  MIXED = 'Mixed-Use'
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  status: ProjectStatus;
  type: ProjectType;
  description: string;
  longDescription: string;
  imageUrl: string;
  gallery: string[];
  features: string[];
  specs: ProjectSpec[];
  paymentPlan?: string;
  priceRange?: string;
  completionDate?: string;
  displayOrder?: number;
  seo?: SEOData;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  tags: string[];
}

export interface NavItem {
  label: string;
  path: string;
}

export interface HighlightItem {
  label: string;
  value: string;
  suffix: string;
}

export interface SiteContent {
  global: {
    siteName: string;
    logoUrl: string;
    footerText: string;
    navigation: NavItem[];
    socialLinks: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      youtube: string;
      tiktok: string;
      whatsapp: string;
    };
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgUrl: string;
    ctaPrimary: string;
    ctaSecondary: string;
    highlights: HighlightItem[];
    whyUs: {
      title: string;
      items: { title: string; description: string }[];
    };
    seo: SEOData;
  };
  about: {
    intro: string;
    description: string;
    vision: string;
    mission: string;
    chairmanName: string;
    chairmanRole: string;
    chairmanMessage: string;
    chairmanImg: string;
    seo: SEOData;
  };
  contact: {
    address: string;
    phone: string;
    phoneSecondary: string;
    email: string;
    whatsapp: string;
    mapEmbedUrl: string;
    seo: SEOData;
  };
}
