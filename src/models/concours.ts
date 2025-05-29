// Types for the concours hierarchy

export type Country = 'Maroc' | 'France';

export type EducationLevel = 'Bac' | 'Bac+2' | 'Bac+3' | 'Bac+5' | 'Classes préparatoires';

export interface University {
  id: string;
  name: string;
  logo?: string;
  location: string;
  description?: string;
}

export interface ConcoursItem {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: string;
  isPaid: boolean;
  hasAccess: boolean;
  universityId: string;
  country: Country;
  educationLevel: EducationLevel;
}

// Data structure for the countries
export const countries: Country[] = ['Maroc', 'France'];

// Data structure for education levels
export const educationLevels: EducationLevel[] = [
  'Bac',
  'Bac+2',
  'Bac+3',
  'Bac+5',
  'Classes préparatoires'
];

// Moroccan universities
export const moroccanUniversities: University[] = [
  {
    id: 'encg',
    name: 'ENCG (École Nationale de Commerce et Gestion)',
    location: 'Multiple locations',
    description: 'Réseau des écoles nationales de commerce et de gestion au Maroc'
  },
  {
    id: 'ensam',
    name: 'ENSAM (École Nationale Supérieure d\'Arts et Métiers)',
    location: 'Casablanca, Meknès',
    description: 'École d\'ingénieurs spécialisée dans les arts et métiers'
  },
  {
    id: 'iscae',
    name: 'ISCAE (Institut Supérieur de Commerce et d\'Administration des Entreprises)',
    location: 'Casablanca, Rabat',
    description: 'Institut de formation en commerce et gestion'
  },
  {
    id: 'ena',
    name: 'ENA (École Nationale d\'Architecture)',
    location: 'Rabat, Tétouan, Fès',
    description: 'École d\'architecture nationale'
  },
  {
    id: 'cnc',
    name: 'CNC (Concours National Commun)',
    location: 'Nationwide',
    description: 'Concours d\'accès aux grandes écoles d\'ingénieurs'
  },
  {
    id: 'medecine',
    name: 'Facultés de Médecine et de Pharmacie',
    location: 'Multiple locations',
    description: 'Facultés de médecine et de pharmacie du Maroc'
  }
];

// French universities/schools
export const frenchUniversities: University[] = [
  {
    id: 'polytechnique',
    name: 'École Polytechnique',
    location: 'Palaiseau',
    description: 'Une des écoles d\'ingénieurs les plus prestigieuses de France'
  },
  {
    id: 'hec',
    name: 'HEC Paris',
    location: 'Jouy-en-Josas',
    description: 'Grande école de commerce et de management'
  },
  {
    id: 'sciences_po',
    name: 'Sciences Po',
    location: 'Paris',
    description: 'Institut d\'études politiques de Paris'
  },
  {
    id: 'centrale',
    name: 'CentraleSupélec',
    location: 'Paris-Saclay',
    description: 'École d\'ingénieurs généraliste'
  }
];

// Sample concours data organized by country, education level, and university
export const concoursData: ConcoursItem[] = [
  // Moroccan ENCG
  {
    id: 'encg-2023',
    title: 'Concours ENCG',
    subject: 'Économie',
    year: 2023,
    level: 'Bac+2',
    isPaid: false,
    hasAccess: true,
    universityId: 'encg',
    country: 'Maroc',
    educationLevel: 'Bac+2'
  },
  {
    id: 'encg-2021',
    title: 'Concours ENCG',
    subject: 'Économie',
    year: 2021,
    level: 'Bac+2',
    isPaid: true,
    hasAccess: false,
    universityId: 'encg',
    country: 'Maroc',
    educationLevel: 'Bac+2'
  },
  
  // Moroccan ENSAM
  {
    id: 'ensam-2023',
    title: 'Concours ENSAM',
    subject: 'Physique',
    year: 2023,
    level: 'Classes préparatoires',
    isPaid: false,
    hasAccess: true,
    universityId: 'ensam',
    country: 'Maroc',
    educationLevel: 'Classes préparatoires'
  },
  
  // Moroccan CNC
  {
    id: 'cnc-2023',
    title: 'Concours CNC',
    subject: 'Mathématiques',
    year: 2023,
    level: 'Classes préparatoires',
    isPaid: true,
    hasAccess: true,
    universityId: 'cnc',
    country: 'Maroc',
    educationLevel: 'Classes préparatoires'
  },
  {
    id: 'cnc-2021',
    title: 'Concours CNC',
    subject: 'Physique',
    year: 2021,
    level: 'Classes préparatoires',
    isPaid: true,
    hasAccess: false,
    universityId: 'cnc',
    country: 'Maroc',
    educationLevel: 'Classes préparatoires'
  },
  
  // Moroccan Medicine
  {
    id: 'medecine-2022',
    title: 'Concours Médecine 2022',
    subject: 'Touts les composantes',
    year: 2022,
    level: 'Bac',
    isPaid: true,
    hasAccess: true,
    universityId: 'medecine',
    country: 'Maroc',
    educationLevel: 'Bac'
  },

  {
    id: 'medecine-2021',
    title: 'Concours Médecine 2021',
    subject: 'Touts les composantes',
    year: 2021,
    level: 'Bac',
    isPaid: true,
    hasAccess: true,
    universityId: 'medecine',
    country: 'Maroc',
    educationLevel: 'Bac'
  },
  
  // French Polytechnique
  {
    id: 'x-2023',
    title: 'Concours Polytechnique',
    subject: 'Mathématiques',
    year: 2023,
    level: 'Classes préparatoires',
    isPaid: true,
    hasAccess: false,
    universityId: 'polytechnique',
    country: 'France',
    educationLevel: 'Classes préparatoires'
  },
  
  // French HEC
  {
    id: 'hec-2023',
    title: 'Concours HEC',
    subject: 'Économie',
    year: 2023,
    level: 'Classes préparatoires',
    isPaid: true,
    hasAccess: false,
    universityId: 'hec',
    country: 'France',
    educationLevel: 'Classes préparatoires'
  }
];

// Utility function to get universities by country
export function getUniversitiesByCountry(country: Country): University[] {
  return country === 'Maroc' ? moroccanUniversities : frenchUniversities;
}

// Utility function to get concours by country and education level
export function getConcoursByCountryAndLevel(country: Country, level: EducationLevel): ConcoursItem[] {
  return concoursData.filter(
    concours => concours.country === country && concours.educationLevel === level
  );
}

// Utility function to get concours by university
export function getConcoursByUniversity(universityId: string): ConcoursItem[] {
  return concoursData.filter(concours => concours.universityId === universityId);
}

// Utility function to get all concours by country
export function getAllConcoursByCountry(country: Country): ConcoursItem[] {
  return concoursData.filter(concours => concours.country === country);
} 