
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
  features: string[];
  specs: ProjectSpec[];
  paymentPlan?: string;
}

export interface Highlight {
  label: string;
  value: string;
  suffix: string;
}
