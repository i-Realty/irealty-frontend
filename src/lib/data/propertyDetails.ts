/**
 * Hardcoded property detail data used on the [id] detail pages.
 * Extracted from inline JSX to a single source of truth.
 * When a real API is wired up, this file can be replaced with fetch calls.
 */

export const fullDescription = [
  "This residential project is designed to offer residents a high level of luxury and comfort in their daily living. Key features include premium amenities such as a fully equipped fitness center, landscaped outdoor areas, a swimming pool, and communal spaces for recreation and social activities.",
  "The apartments feature spacious floor plans with modern interiors, incorporating high-quality finishes like durable flooring, efficient cabinetry, and contemporary fixtures. Open layouts include large windows and balconies to facilitate natural ventilation and daylight, which contribute to energy efficiency and a healthier indoor environment.",
  "The property is situated in a strategically accessible location, providing convenient connections to major transportation routes, commercial centers, educational institutions, and medical facilities. Modern infrastructure is integrated throughout the development, including smart home technologies for lighting, temperature control, and security systems. Sustainable practices, such as energy-efficient appliances and water conservation measures, are incorporated to reduce environmental impact.",
];

export const features = [
  'Fully equipped fitness center',
  'Swimming pool',
  'Landscaped outdoor areas',
  '24/7 security',
  'Backup power',
  'Ample parking',
];

export const amenitiesData = [
  { key: 'electricity', label: 'Electricity', note: 'Backup available' },
  { key: 'water', label: 'Water', note: 'Borehole + municipal' },
  { key: 'gated', label: 'Gated Community', note: 'Controlled access' },
  { key: 'parking', label: 'Parking', note: 'Ample space' },
  { key: 'pool', label: 'Swimming Pool', note: 'Adult & kids' },
  { key: 'security', label: '24/7 Security', note: 'Patrols & CCTV' },
];

export const documentsData = [
  { key: 'c_of_o', title: 'Certificate of Occupancy', file: 'certOfOccupancy.pdf', size: '1.2 MB' },
  { key: 'survey', title: 'Survey Plan', file: 'surveyPlan.pdf', size: '860 KB' },
  { key: 'title_deed', title: 'Title Deed', file: 'titleDeed.pdf', size: '2.4 MB' },
  { key: 'building_plan', title: 'Building Plan', file: 'buildingPlan.pdf', size: '980 KB' },
  { key: 'receipt', title: 'Payment Receipts', file: 'paymentReceipts.pdf', size: '420 KB' },
  { key: 'compliance', title: 'Compliance / NDC', file: 'compliance.pdf', size: '320 KB' },
];

export const landmarksData = [
  { key: 'school', label: "St. Mary's Primary School", dist: '0.4 km' },
  { key: 'hospital', label: 'City General Hospital', dist: '1.2 km' },
  { key: 'mall', label: 'Central Mall', dist: '2.0 km' },
  { key: 'park', label: 'Riverside Park', dist: '0.8 km' },
  { key: 'station', label: 'Main Bus Terminal', dist: '1.5 km' },
  { key: 'airport', label: 'Enugu Airport', dist: '15 km' },
];

export const milestones = [
  { n: 1, title: 'Initial Deposit', subtitle: 'Available for payment', amount: '₦19.0M', percent: '20% of total', active: true },
  { n: 2, title: 'Foundation/Lock-Up', subtitle: 'Unlocks after previous milestone', amount: '₦19.0M', percent: '20% of total', active: false },
  { n: 3, title: 'Roofing/Structure', subtitle: 'Unlocks after previous milestone', amount: '₦19.0M', percent: '20% of total', active: false },
  { n: 4, title: 'Handover/Finishing', subtitle: 'Unlocks after previous milestone', amount: '₦19.0M', percent: '20% of total', active: false },
];
