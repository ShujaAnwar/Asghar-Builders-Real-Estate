
export enum ProjectStatus {
  RUNNING = 'Running',
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed'
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

export interface Project {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  type: ProjectType;
  description: string;
  longDescription: string;
  imageUrl: string;
  gallery: string[];
  features: string[]; // Amenities
  specs: ProjectSpec[];
  paymentPlan?: string;
  priceRange?: string;
  completionDate?: string;
}

export interface Highlight {
  label: string;
  value: string;
  suffix: string;
}

export interface SiteContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    intro: string;
    description: string;
    vision: string;
    mission: string;
    chairmanMessage: string;
  };
  contact: {
    address: string;
    phone: string;
    phoneSecondary: string;
    email: string;
    whatsapp: string;
  };
}
