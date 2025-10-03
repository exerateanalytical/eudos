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
import nycCert from "@/assets/diploma-certificates/nyu.png";
import brownCert from "@/assets/diploma-certificates/brown-university.png";

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
  "New York University": nycCert,
  "NYU": nycCert,
  "Brown University": brownCert,
};

/**
 * Get diploma certificate image for a university
 * @param universityName - The name of the university
 * @returns The diploma certificate image path, or undefined if not available
 */
export const getDiplomaCertificate = (universityName: string): string | undefined => {
  return diplomaCertificateMap[universityName];
};
