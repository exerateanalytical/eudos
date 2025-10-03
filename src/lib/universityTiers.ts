// University Tier Classification for Certificate Management
// This helps organize the 513 universities by priority for certificate collection

export interface UniversityTier {
  name: string;
  tier: 1 | 2 | 3;
  hasCertificate: boolean;
  priority: number;
}

// Tier 1: Top 100 Universities (Highest Priority)
export const tier1Universities = [
  "Harvard University",
  "Stanford University",
  "Massachusetts Institute of Technology (MIT)",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "California Institute of Technology (Caltech)",
  "University of California, Berkeley",
  "University of Chicago",
  "Johns Hopkins University",
  "University of Pennsylvania",
  "Cornell University",
  "Northwestern University",
  "Duke University",
  "University of Michigan",
  "Carnegie Mellon University",
  "University of Virginia",
  "University of Southern California",
  "New York University",
  "Brown University",
  "University of Oxford",
  "University of Cambridge",
  "Imperial College London",
  "University of Toronto",
  "McGill University",
  "University of British Columbia",
  "University of California, Los Angeles",
  "University of Washington",
  "Georgia Institute of Technology",
  "University of Texas at Austin",
  "University of Wisconsin-Madison",
  "University of Illinois at Urbana-Champaign",
  "University of North Carolina at Chapel Hill",
  "Rice University",
  "Dartmouth College",
  "Vanderbilt University",
  "Emory University",
  "Georgetown University",
  "Washington University in St. Louis",
  "University of Notre Dame",
  // Add remaining tier 1 universities (up to 100)
];

// Tier 2: Universities 101-300
export const tier2Universities = [
  // Add tier 2 universities here
];

// Tier 3: Colleges & Community Colleges (301-513)
export const tier3Universities = [
  // Add tier 3 universities here
];

/**
 * Get the tier for a specific university
 */
export const getUniversityTier = (universityName: string): 1 | 2 | 3 => {
  if (tier1Universities.includes(universityName)) return 1;
  if (tier2Universities.includes(universityName)) return 2;
  return 3;
};

/**
 * Track which universities have certificate images
 * This will be updated as certificates are added
 */
export const certificateStatus: Record<string, boolean> = {
  "Harvard University": true,
  "Stanford University": true,
  "Massachusetts Institute of Technology (MIT)": true,
  // ... will be expanded as we add certificates
};

/**
 * Get certificate completion stats
 */
export const getCertificateStats = () => {
  const total = 513;
  const completed = Object.values(certificateStatus).filter(Boolean).length;
  const percentage = (completed / total) * 100;
  
  return {
    total,
    completed,
    remaining: total - completed,
    percentage: percentage.toFixed(1),
  };
};
