
import { Project, ProjectStatus, ProjectType } from './types';

export const HIGHLIGHTS = [
  { label: 'Years of Experience', value: '25', suffix: '+' },
  { label: 'Delivered Projects', value: '48', suffix: '' },
  { label: 'Ongoing Projects', value: '12', suffix: '' },
  { label: 'Trusted Clients', value: '5000', suffix: '+' },
];

export const PROJECTS: Project[] = [
  {
    id: 'asghar-skyline',
    name: 'Asghar Skyline Heights',
    location: 'Gulberg Greens, Islamabad',
    status: ProjectStatus.RUNNING,
    type: ProjectType.RESIDENTIAL,
    description: 'Ultra-luxury sky villas with panoramic views of the Margalla Hills.',
    longDescription: 'Asghar Skyline Heights redefined vertical living in the heart of Islamabad. Featuring 40 floors of architectural excellence, this project offers smart apartments with integrated AI automation, rooftop infinity pools, and a dedicated concierge service.',
    imageUrl: 'https://picsum.photos/seed/skyline/1200/800',
    gallery: [
      'https://picsum.photos/seed/p1/800/600',
      'https://picsum.photos/seed/p2/800/600',
      'https://picsum.photos/seed/p3/800/600'
    ],
    features: ['Smart Home Automation', 'Infinity Pool', '24/7 Security', 'Private Elevator Access'],
    specs: [
      { label: 'Plot Size', value: '4 Kanals' },
      { label: 'Apartment Types', value: '2, 3 & 4 BR' },
      { label: 'Completion Date', value: 'Dec 2026' }
    ],
    paymentPlan: '30% Downpayment, 3-Year Quarterly Installments.'
  },
  {
    id: 'emerald-plaza',
    name: 'Emerald Business Plaza',
    location: 'DHA Phase 6, Lahore',
    status: ProjectStatus.UPCOMING,
    type: ProjectType.COMMERCIAL,
    description: 'A futuristic business hub designed for global corporations.',
    longDescription: 'The Emerald Business Plaza is Lahore’s first gold-certified green building. Designed for energy efficiency and modern corporate requirements, it offers premium office spaces, high-speed fiber connectivity, and a multi-level business lounge.',
    imageUrl: 'https://picsum.photos/seed/plaza/1200/800',
    gallery: [
      'https://picsum.photos/seed/p4/800/600',
      'https://picsum.photos/seed/p5/800/600'
    ],
    features: ['LEED Gold Certified', 'High-Speed Elevators', 'Rooftop Cafe', 'Conference Centers'],
    specs: [
      { label: 'Plot Size', value: '2 Kanals' },
      { label: 'Unit Sizes', value: '500 - 5000 Sq Ft' },
      { label: 'Status', value: 'Pre-launch' }
    ],
    paymentPlan: '15% Booking, Customizable Corporate Plans.'
  },
  {
    id: 'asghar-villas',
    name: 'Asghar Grand Estates',
    location: 'Bahria Town Phase 8, Rawalpindi',
    status: ProjectStatus.RUNNING,
    type: ProjectType.RESIDENTIAL,
    description: 'Exclusive gated community of signature villas.',
    longDescription: 'Experience the pinnacle of luxury living in these custom-designed signature villas. Each estate is crafted with premium materials, private gardens, and state-of-the-art security systems.',
    imageUrl: 'https://picsum.photos/seed/villas/1200/800',
    gallery: [
      'https://picsum.photos/seed/p6/800/600',
      'https://picsum.photos/seed/p7/800/600'
    ],
    features: ['Gated Community', 'Private Lush Gardens', 'Solar Power Ready', 'Premium Fittings'],
    specs: [
      { label: 'Villa Size', value: '1 Kanal / 2 Kanals' },
      { label: 'Design', value: 'Modern Mediterranean' },
      { label: 'Structure', value: 'Grey Structure Complete' }
    ],
    paymentPlan: '10% Possession, Remaining over 2 years.'
  }
];
