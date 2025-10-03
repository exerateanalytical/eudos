export interface EscrowProduct {
  id: string;
  name: string;
  price: number;
  delivery: string;
  category: string;
}

export interface EscrowProductCategory {
  category: string;
  items: EscrowProduct[];
}

export const escrowProducts: EscrowProductCategory[] = [
  {
    category: "Passports",
    items: [
      { id: "passport-usa", name: "USA Passport", price: 5000, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-uk", name: "UK Passport", price: 4500, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-canada", name: "Canada Passport", price: 4500, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-australia", name: "Australia Passport", price: 4500, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-germany", name: "Germany Passport", price: 4200, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-france", name: "France Passport", price: 4200, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-italy", name: "Italy Passport", price: 4000, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-spain", name: "Spain Passport", price: 4000, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-netherlands", name: "Netherlands Passport", price: 4200, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-sweden", name: "Sweden Passport", price: 4200, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-norway", name: "Norway Passport", price: 4200, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-denmark", name: "Denmark Passport", price: 4200, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-finland", name: "Finland Passport", price: 4200, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-ireland", name: "Ireland Passport", price: 4000, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-portugal", name: "Portugal Passport", price: 3800, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-belgium", name: "Belgium Passport", price: 4000, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-switzerland", name: "Switzerland Passport", price: 4500, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-austria", name: "Austria Passport", price: 4000, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-japan", name: "Japan Passport", price: 4800, delivery: "4-6 weeks", category: "Passports" },
      { id: "passport-singapore", name: "Singapore Passport", price: 4500, delivery: "4-6 weeks", category: "Passports" },
    ]
  },
  {
    category: "Driver's Licenses",
    items: [
      { id: "license-usa", name: "USA Driver's License", price: 800, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-uk", name: "UK Driver's License", price: 750, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-canada", name: "Canada Driver's License", price: 750, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-australia", name: "Australia Driver's License", price: 750, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-germany", name: "Germany Driver's License", price: 700, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-france", name: "France Driver's License", price: 700, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-italy", name: "Italy Driver's License", price: 650, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-spain", name: "Spain Driver's License", price: 650, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-netherlands", name: "Netherlands Driver's License", price: 700, delivery: "2-3 weeks", category: "Driver's Licenses" },
      { id: "license-sweden", name: "Sweden Driver's License", price: 700, delivery: "2-3 weeks", category: "Driver's Licenses" },
    ]
  },
  {
    category: "National ID Cards",
    items: [
      { id: "id-usa", name: "USA National ID Card", price: 600, delivery: "2-3 weeks", category: "National ID Cards" },
      { id: "id-uk", name: "UK National ID Card", price: 550, delivery: "2-3 weeks", category: "National ID Cards" },
      { id: "id-canada", name: "Canada National ID Card", price: 550, delivery: "2-3 weeks", category: "National ID Cards" },
      { id: "id-germany", name: "Germany National ID Card", price: 500, delivery: "2-3 weeks", category: "National ID Cards" },
      { id: "id-france", name: "France National ID Card", price: 500, delivery: "2-3 weeks", category: "National ID Cards" },
      { id: "id-italy", name: "Italy National ID Card", price: 480, delivery: "2-3 weeks", category: "National ID Cards" },
      { id: "id-spain", name: "Spain National ID Card", price: 480, delivery: "2-3 weeks", category: "National ID Cards" },
      { id: "id-netherlands", name: "Netherlands National ID Card", price: 500, delivery: "2-3 weeks", category: "National ID Cards" },
    ]
  },
  {
    category: "Diplomas",
    items: [
      { id: "diploma-harvard", name: "Harvard University Diploma", price: 1500, delivery: "3-4 weeks", category: "Diplomas" },
      { id: "diploma-mit", name: "MIT Diploma", price: 1500, delivery: "3-4 weeks", category: "Diplomas" },
      { id: "diploma-stanford", name: "Stanford University Diploma", price: 1500, delivery: "3-4 weeks", category: "Diplomas" },
      { id: "diploma-oxford", name: "Oxford University Diploma", price: 1400, delivery: "3-4 weeks", category: "Diplomas" },
      { id: "diploma-cambridge", name: "Cambridge University Diploma", price: 1400, delivery: "3-4 weeks", category: "Diplomas" },
      { id: "diploma-yale", name: "Yale University Diploma", price: 1500, delivery: "3-4 weeks", category: "Diplomas" },
      { id: "diploma-princeton", name: "Princeton University Diploma", price: 1500, delivery: "3-4 weeks", category: "Diplomas" },
      { id: "diploma-columbia", name: "Columbia University Diploma", price: 1400, delivery: "3-4 weeks", category: "Diplomas" },
    ]
  },
  {
    category: "Certifications",
    items: [
      { id: "cert-pmp", name: "PMP Certification", price: 800, delivery: "2-3 weeks", category: "Certifications" },
      { id: "cert-cpa", name: "CPA Certificate", price: 900, delivery: "2-3 weeks", category: "Certifications" },
      { id: "cert-cisco", name: "CISCO CCNA Certificate", price: 700, delivery: "2-3 weeks", category: "Certifications" },
      { id: "cert-aws", name: "AWS Solutions Architect Certificate", price: 750, delivery: "2-3 weeks", category: "Certifications" },
      { id: "cert-comptia", name: "CompTIA A+ Certificate", price: 650, delivery: "2-3 weeks", category: "Certifications" },
      { id: "cert-six-sigma", name: "Six Sigma Black Belt Certificate", price: 800, delivery: "2-3 weeks", category: "Certifications" },
    ]
  }
];

export const getAllProducts = (): EscrowProduct[] => {
  return escrowProducts.flatMap(category => category.items);
};

export const searchProducts = (query: string): EscrowProduct[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllProducts().filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getProductById = (id: string): EscrowProduct | undefined => {
  return getAllProducts().find(product => product.id === id);
};
