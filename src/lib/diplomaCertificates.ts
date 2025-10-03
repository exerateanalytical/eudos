// Diploma Certificate Images
// This file maps university names to their diploma certificate template images

// Top 20 US Universities
import harvardCert from "@/assets/diploma-certificates/harvard-university.png";
import stanfordCert from "@/assets/diploma-certificates/stanford-university.png";
import mitCert from "@/assets/diploma-certificates/mit.png";
import princetonCert from "@/assets/diploma-certificates/princeton-university.png";
import yaleCert from "@/assets/diploma-certificates/yale-university.png";
import columbiaCert from "@/assets/diploma-certificates/columbia-university.png";
import caltechCert from "@/assets/diploma-certificates/caltech.png";
import berkeleyCert from "@/assets/diploma-certificates/uc-berkeley.png";
import chicagoCert from "@/assets/diploma-certificates/university-of-chicago.png";
import johnshopkinsCert from "@/assets/diploma-certificates/johns-hopkins-university.png";
import pennCert from "@/assets/diploma-certificates/university-of-pennsylvania.png";
import cornellCert from "@/assets/diploma-certificates/cornell-university.png";
import northwesternCert from "@/assets/diploma-certificates/northwestern-university.png";
import dukeCert from "@/assets/diploma-certificates/duke-university.png";
import michiganCert from "@/assets/diploma-certificates/university-of-michigan.png";
import carnegiemellonCert from "@/assets/diploma-certificates/carnegie-mellon-university.png";
import virginiaCert from "@/assets/diploma-certificates/university-of-virginia.png";
import uscCert from "@/assets/diploma-certificates/usc.png";
import nyuCert from "@/assets/diploma-certificates/nyu.png";
import brownCert from "@/assets/diploma-certificates/brown-university.png";

// Next Tier - Major International & US Universities
import oxfordCert from "@/assets/diploma-certificates/oxford-university.png";
import cambridgeCert from "@/assets/diploma-certificates/cambridge-university.png";
import imperialCert from "@/assets/diploma-certificates/imperial-college-london.png";
import torontoCert from "@/assets/diploma-certificates/university-of-toronto.png";
import mcgillCert from "@/assets/diploma-certificates/mcgill-university.png";
import ubcCert from "@/assets/diploma-certificates/ubc.png";
import uclaCert from "@/assets/diploma-certificates/ucla.png";
import uwashingtonCert from "@/assets/diploma-certificates/university-of-washington.png";
import georgiatechCert from "@/assets/diploma-certificates/georgia-tech.png";
import utaustinCert from "@/assets/diploma-certificates/ut-austin.png";
import uwmadisonCert from "@/assets/diploma-certificates/uw-madison.png";
import uiucCert from "@/assets/diploma-certificates/uiuc.png";
import uncCert from "@/assets/diploma-certificates/unc-chapel-hill.png";
import riceCert from "@/assets/diploma-certificates/rice-university.png";
import dartmouthCert from "@/assets/diploma-certificates/dartmouth-college.png";
import vanderbiltCert from "@/assets/diploma-certificates/vanderbilt-university.png";
import emoryCert from "@/assets/diploma-certificates/emory-university.png";
import georgetownCert from "@/assets/diploma-certificates/georgetown-university.png";
import washuCert from "@/assets/diploma-certificates/washu.png";
import notredameCert from "@/assets/diploma-certificates/notre-dame.png";

export const diplomaCertificateMap: Record<string, string> = {
  // Top 20 US Universities
  "Harvard University": harvardCert,
  "Stanford University": stanfordCert,
  "Massachusetts Institute of Technology (MIT)": mitCert,
  "MIT": mitCert,
  "Princeton University": princetonCert,
  "Yale University": yaleCert,
  "Columbia University": columbiaCert,
  "California Institute of Technology (Caltech)": caltechCert,
  "Caltech": caltechCert,
  "University of California, Berkeley": berkeleyCert,
  "UC Berkeley": berkeleyCert,
  "University of Chicago": chicagoCert,
  "Johns Hopkins University": johnshopkinsCert,
  "University of Pennsylvania": pennCert,
  "Cornell University": cornellCert,
  "Northwestern University": northwesternCert,
  "Duke University": dukeCert,
  "University of Michigan": michiganCert,
  "Carnegie Mellon University": carnegiemellonCert,
  "University of Virginia": virginiaCert,
  "University of Southern California": uscCert,
  "USC": uscCert,
  "New York University": nyuCert,
  "NYU": nyuCert,
  "Brown University": brownCert,
  
  // UK Universities
  "University of Oxford": oxfordCert,
  "Oxford University": oxfordCert,
  "University of Cambridge": cambridgeCert,
  "Cambridge University": cambridgeCert,
  "Imperial College London": imperialCert,
  
  // Canadian Universities
  "University of Toronto": torontoCert,
  "McGill University": mcgillCert,
  "University of British Columbia": ubcCert,
  "UBC": ubcCert,
  
  // Additional Top US Universities
  "University of California, Los Angeles": uclaCert,
  "UCLA": uclaCert,
  "University of Washington": uwashingtonCert,
  "Georgia Institute of Technology": georgiatechCert,
  "Georgia Tech": georgiatechCert,
  "University of Texas at Austin": utaustinCert,
  "UT Austin": utaustinCert,
  "University of Wisconsin-Madison": uwmadisonCert,
  "UW-Madison": uwmadisonCert,
  "University of Illinois at Urbana-Champaign": uiucCert,
  "UIUC": uiucCert,
  "University of North Carolina at Chapel Hill": uncCert,
  "UNC Chapel Hill": uncCert,
  "Rice University": riceCert,
  "Dartmouth College": dartmouthCert,
  "Vanderbilt University": vanderbiltCert,
  "Emory University": emoryCert,
  "Georgetown University": georgetownCert,
  "Washington University in St. Louis": washuCert,
  "WashU": washuCert,
  "University of Notre Dame": notredameCert,
  "Notre Dame": notredameCert,
};

/**
 * Get diploma certificate image for a university
 * @param universityName - The name of the university
 * @returns The diploma certificate image path, or undefined if not available
 */
export const getDiplomaCertificate = (universityName: string): string | undefined => {
  return diplomaCertificateMap[universityName];
};
