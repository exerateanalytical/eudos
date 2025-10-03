// Import certification provider logos
import pmiLogo from '@/assets/certification-logos/pmi.png';
import awsLogo from '@/assets/certification-logos/aws.png';
import microsoftLogo from '@/assets/certification-logos/microsoft.png';
import googleLogo from '@/assets/certification-logos/google.png';
import ciscoLogo from '@/assets/certification-logos/cisco.png';
import comptiaLogo from '@/assets/certification-logos/comptia.png';
import cfaInstituteLogo from '@/assets/certification-logos/cfa-institute.png';
import isc2Logo from '@/assets/certification-logos/isc2.png';

// Logo mapping for certification providers
export const certificationLogos: Record<string, string> = {
  // Project Management & Business
  "PMI": pmiLogo,
  "AXELOS": pmiLogo, // Fallback
  "Scrum Alliance": pmiLogo, // Fallback
  "Scrum.org": pmiLogo, // Fallback
  "ASQ/IASSC": pmiLogo, // Fallback
  "IIBA": pmiLogo, // Fallback
  "ICPM": pmiLogo, // Fallback
  "APICS": pmiLogo, // Fallback
  "ABPMP": pmiLogo, // Fallback
  "Prosci": pmiLogo, // Fallback
  "AMA": pmiLogo, // Fallback
  
  // IT & Cloud Computing
  "Amazon": awsLogo,
  "Microsoft": microsoftLogo,
  "Google": googleLogo,
  "Cisco": ciscoLogo,
  "CompTIA": comptiaLogo,
  "EC-Council": comptiaLogo, // Fallback
  "Offensive Security": comptiaLogo, // Fallback
  "ISC2": isc2Logo,
  "ISACA": isc2Logo, // Fallback
  "CNCF": googleLogo, // Fallback
  "Red Hat": microsoftLogo, // Fallback
  "VMware": microsoftLogo, // Fallback
  "Salesforce": microsoftLogo, // Fallback
  "Oracle": microsoftLogo, // Fallback
  
  // Finance & Accounting
  "CFA Institute": cfaInstituteLogo,
  "AICPA": cfaInstituteLogo, // Fallback
  "ACCA": cfaInstituteLogo, // Fallback
  "CIMA": cfaInstituteLogo, // Fallback
  "IMA": cfaInstituteLogo, // Fallback
  "CFP Board": cfaInstituteLogo, // Fallback
  "GARP": cfaInstituteLogo, // Fallback
  "CAIA": cfaInstituteLogo, // Fallback
  "SAP": microsoftLogo, // Fallback
  "CFI": cfaInstituteLogo, // Fallback
  
  // Default fallback
  "Various": pmiLogo,
};

// Category color schemes (HSL values matching design system)
export const categoryColors: Record<string, { gradient: string; icon: string; badge: string }> = {
  "Project Management & Business": {
    gradient: "from-blue-500/10 to-blue-600/10",
    icon: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
  },
  "IT & Cloud Computing": {
    gradient: "from-purple-500/10 to-purple-600/10",
    icon: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
  },
  "Healthcare & Medical": {
    gradient: "from-red-500/10 to-pink-600/10",
    icon: "text-red-600 dark:text-red-400",
    badge: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20"
  },
  "Finance & Accounting": {
    gradient: "from-green-500/10 to-emerald-600/10",
    icon: "text-green-600 dark:text-green-400",
    badge: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20"
  },
  "Language & Communication": {
    gradient: "from-orange-500/10 to-amber-600/10",
    icon: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20"
  },
  "Emerging Tech & AI": {
    gradient: "from-cyan-500/10 to-sky-600/10",
    icon: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20"
  },
  "Engineering & Trades": {
    gradient: "from-gray-500/10 to-slate-600/10",
    icon: "text-gray-600 dark:text-gray-400",
    badge: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20"
  },
  "Digital Marketing": {
    gradient: "from-yellow-500/10 to-amber-600/10",
    icon: "text-yellow-600 dark:text-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20"
  },
  "Other Professional": {
    gradient: "from-indigo-500/10 to-violet-600/10",
    icon: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
  },
  "default": {
    gradient: "from-primary/10 to-primary/20",
    icon: "text-primary",
    badge: "bg-primary/10 text-primary border-primary/20"
  }
};

// Get logo for a certification provider
export const getCertificationLogo = (provider: string): string | null => {
  return certificationLogos[provider] || null;
};

// Get color scheme for a category
export const getCategoryColors = (category: string) => {
  return categoryColors[category] || categoryColors["default"];
};
