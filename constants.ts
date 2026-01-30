
import { Project, ProjectStatus, ProjectType } from './types';

export const HIGHLIGHTS = [
  { label: 'Years of Experience', value: '25', suffix: '+' },
  { label: 'Delivered Projects', value: '48', suffix: '' },
  { label: 'Ongoing Projects', value: '12', suffix: '' },
  { label: 'Trusted Clients', value: '5000', suffix: '+' },
];

export const PROJECTS: Project[] = [
  {
    id: 'ali-arcade-1',
    name: 'Ali Arcade 1',
    slug: 'ali-arcade-1',
    location: 'Karachi, Sindh',
    status: ProjectStatus.COMPLETED,
    type: ProjectType.MIXED,
    description: 'A premium mixed-use development featuring luxury retail spaces and modern apartments.',
    longDescription: 'Ali Arcade 1 stands as a testament to quality construction in Karachi. This flagship project combines high-traffic commercial units with sophisticated residential living, offering a perfect blend of business opportunity and domestic comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Prime Location', '24/7 Power Backup', 'Dedicated Parking', 'High-Speed Elevators'],
    specs: [
      { label: 'Units', value: 'Retail & Residential' },
      { label: 'Floors', value: 'G+5' },
      { label: 'Completion', value: '2019' }
    ],
    paymentPlan: 'Sold Out. Resale units available through verified agents.'
  },
  {
    id: 'ali-arcade-2',
    name: 'Ali Arcade 2',
    slug: 'ali-arcade-2',
    location: 'Karachi, Sindh',
    status: ProjectStatus.COMPLETED,
    type: ProjectType.COMMERCIAL,
    description: 'The second evolution of the Ali Arcade series, focusing on corporate excellence.',
    longDescription: 'Building on the success of its predecessor, Ali Arcade 2 offers enhanced commercial facilities designed for established brands and growing businesses in the heart of Karachi.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Corporate Lounges', 'Fire Safety Systems', 'CCTV Monitoring', 'Fiber Optic Ready'],
    specs: [
      { label: 'Type', value: 'Pure Commercial' },
      { label: 'Parking', value: 'Basement Level' },
      { label: 'Status', value: 'Delivered' }
    ],
    paymentPlan: 'Available for immediate possession and lease.'
  },
  {
    id: 'ali-arcade-3',
    name: 'Ali Arcade 3',
    slug: 'ali-arcade-3',
    location: 'Karachi, Sindh',
    status: ProjectStatus.RUNNING,
    type: ProjectType.MIXED,
    description: 'Our most ambitious project yet, setting new standards for luxury and convenience.',
    longDescription: 'Ali Arcade 3 represents the pinnacle of the Ali series. Currently under construction in Karachi, this high-rise landmark will feature smart automation, a rooftop recreational area, and premium finishings.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Rooftop Infinity Pool', 'Smart Home Integration', 'Imported Kitchens', 'Earthquake Resistant'],
    specs: [
      { label: 'Plot Area', value: '2 Kanals' },
      { label: 'Structure', value: 'RCC Frame' },
      { label: 'Expected Delivery', value: '2025' }
    ],
    paymentPlan: '20% Booking, Easy 3-Year Installment Plan.'
  },
  {
    id: 'al-kauser-residency',
    name: 'Al Kauser Residency',
    slug: 'al-kauser-residency',
    location: 'Karachi, Sindh',
    status: ProjectStatus.UPCOMING,
    type: ProjectType.RESIDENTIAL,
    description: 'Dedicated luxury residential living for elite families in Karachi.',
    longDescription: 'Al Kauser Residency is designed exclusively for those who seek tranquility and privacy. This upcoming project in Karachi offers spacious apartments with high ceilings and panoramic city views.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Gated Entrance', 'Private Lobby', 'Guest Suites', 'Solar Water Heating'],
    specs: [
      { label: 'Apartment Types', value: '3 & 4 BHK' },
      { label: 'Total Units', value: '48' },
      { label: 'Status', value: 'Registration Open' }
    ],
    paymentPlan: 'Special Pre-launch discounts available. Contact sales for priority booking.'
  }
];
