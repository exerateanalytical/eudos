import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Search, ShoppingCart, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SecurityFeaturesSection } from "@/components/SecurityFeaturesSection";
import { SEO } from "@/components/SEO";
import { seoConfig } from "@/config/seo";

const certifications = [
  // Project Management & Business (20)
  { id: 1, name: "PMP – Project Management Professional", provider: "PMI", category: "Project Management & Business", price: "$3,500" },
  { id: 2, name: "PRINCE2 Foundation & Practitioner", provider: "AXELOS", category: "Project Management & Business", price: "$3,200" },
  { id: 3, name: "CAPM – Certified Associate in Project Management", provider: "PMI", category: "Project Management & Business", price: "$2,800" },
  { id: 4, name: "PMI-ACP – Agile Certified Practitioner", provider: "PMI", category: "Project Management & Business", price: "$3,300" },
  { id: 5, name: "Certified ScrumMaster (CSM)", provider: "Scrum Alliance", category: "Project Management & Business", price: "$2,500" },
  { id: 6, name: "Scrum Product Owner / Professional Scrum", provider: "Scrum.org", category: "Project Management & Business", price: "$2,500" },
  { id: 7, name: "Lean Six Sigma Green Belt", provider: "ASQ/IASSC", category: "Project Management & Business", price: "$2,800" },
  { id: 8, name: "Lean Six Sigma Black Belt", provider: "ASQ/IASSC", category: "Project Management & Business", price: "$4,200" },
  { id: 9, name: "Lean Six Sigma Master Black Belt", provider: "ASQ/IASSC", category: "Project Management & Business", price: "$5,500" },
  { id: 10, name: "Certified Business Analysis Professional (CBAP)", provider: "IIBA", category: "Project Management & Business", price: "$3,200" },
  { id: 11, name: "PMI Risk Management Professional (PMI-RMP)", provider: "PMI", category: "Project Management & Business", price: "$3,400" },
  { id: 12, name: "PMI Scheduling Professional (PMI-SP)", provider: "PMI", category: "Project Management & Business", price: "$3,400" },
  { id: 13, name: "Certified Manager (CM)", provider: "ICPM", category: "Project Management & Business", price: "$2,600" },
  { id: 14, name: "Certified in Production and Inventory Management (CPIM)", provider: "APICS", category: "Project Management & Business", price: "$3,000" },
  { id: 15, name: "Supply Chain Professional (CSCP)", provider: "APICS", category: "Project Management & Business", price: "$3,200" },
  { id: 16, name: "PMI Portfolio Management Professional (PfMP)", provider: "PMI", category: "Project Management & Business", price: "$4,000" },
  { id: 17, name: "Business Process Management Professional (BPM)", provider: "ABPMP", category: "Project Management & Business", price: "$2,800" },
  { id: 18, name: "Change Management Certification", provider: "Prosci", category: "Project Management & Business", price: "$3,500" },
  { id: 19, name: "Certified Professional in Management (CPM)", provider: "AMA", category: "Project Management & Business", price: "$2,600" },
  { id: 20, name: "MBA / Executive MBA", provider: "Top Universities", category: "Project Management & Business", price: "$8,500" },

  // IT & Cloud Computing (30)
  { id: 21, name: "AWS Certified Solutions Architect – Professional", provider: "Amazon", category: "IT & Cloud Computing", price: "$3,800" },
  { id: 22, name: "AWS Certified Developer – Associate", provider: "Amazon", category: "IT & Cloud Computing", price: "$2,800" },
  { id: 23, name: "AWS Certified SysOps Administrator – Associate", provider: "Amazon", category: "IT & Cloud Computing", price: "$2,800" },
  { id: 24, name: "AWS Certified DevOps Engineer – Professional", provider: "Amazon", category: "IT & Cloud Computing", price: "$3,800" },
  { id: 25, name: "Microsoft Certified: Azure Solutions Architect Expert", provider: "Microsoft", category: "IT & Cloud Computing", price: "$3,600" },
  { id: 26, name: "Microsoft Certified: Azure Administrator Associate", provider: "Microsoft", category: "IT & Cloud Computing", price: "$2,600" },
  { id: 27, name: "Google Cloud Professional Cloud Architect", provider: "Google", category: "IT & Cloud Computing", price: "$3,500" },
  { id: 28, name: "Google Cloud Professional Data Engineer", provider: "Google", category: "IT & Cloud Computing", price: "$3,500" },
  { id: 29, name: "Cisco Certified Network Associate (CCNA)", provider: "Cisco", category: "IT & Cloud Computing", price: "$3,200" },
  { id: 30, name: "Cisco Certified Network Professional (CCNP)", provider: "Cisco", category: "IT & Cloud Computing", price: "$4,500" },
  { id: 31, name: "Cisco Certified Internetwork Expert (CCIE)", provider: "Cisco", category: "IT & Cloud Computing", price: "$6,500" },
  { id: 32, name: "CompTIA A+", provider: "CompTIA", category: "IT & Cloud Computing", price: "$2,200" },
  { id: 33, name: "CompTIA Network+", provider: "CompTIA", category: "IT & Cloud Computing", price: "$2,400" },
  { id: 34, name: "CompTIA Security+", provider: "CompTIA", category: "IT & Cloud Computing", price: "$2,600" },
  { id: 35, name: "CompTIA Cybersecurity Analyst (CySA+)", provider: "CompTIA", category: "IT & Cloud Computing", price: "$3,000" },
  { id: 36, name: "CompTIA Advanced Security Practitioner (CASP+)", provider: "CompTIA", category: "IT & Cloud Computing", price: "$3,500" },
  { id: 37, name: "Certified Ethical Hacker (CEH)", provider: "EC-Council", category: "IT & Cloud Computing", price: "$3,800" },
  { id: 38, name: "Offensive Security Certified Professional (OSCP)", provider: "Offensive Security", category: "IT & Cloud Computing", price: "$4,200" },
  { id: 39, name: "Certified Information Systems Security Professional (CISSP)", provider: "ISC2", category: "IT & Cloud Computing", price: "$4,500" },
  { id: 40, name: "Certified Information Security Manager (CISM)", provider: "ISACA", category: "IT & Cloud Computing", price: "$4,200" },
  { id: 41, name: "Certified Cloud Security Professional (CCSP)", provider: "ISC2", category: "IT & Cloud Computing", price: "$4,000" },
  { id: 42, name: "Kubernetes Administrator (CKA)", provider: "CNCF", category: "IT & Cloud Computing", price: "$3,200" },
  { id: 43, name: "Kubernetes Application Developer (CKAD)", provider: "CNCF", category: "IT & Cloud Computing", price: "$3,200" },
  { id: 44, name: "Google Professional DevOps Engineer", provider: "Google", category: "IT & Cloud Computing", price: "$3,400" },
  { id: 45, name: "Red Hat Certified Engineer (RHCE)", provider: "Red Hat", category: "IT & Cloud Computing", price: "$3,600" },
  { id: 46, name: "VMware Certified Professional (VCP)", provider: "VMware", category: "IT & Cloud Computing", price: "$3,400" },
  { id: 47, name: "Salesforce Certified Administrator", provider: "Salesforce", category: "IT & Cloud Computing", price: "$2,800" },
  { id: 48, name: "Salesforce Certified Developer", provider: "Salesforce", category: "IT & Cloud Computing", price: "$3,200" },
  { id: 49, name: "Salesforce Certified Technical Architect (CTA)", provider: "Salesforce", category: "IT & Cloud Computing", price: "$5,500" },
  { id: 50, name: "Oracle Certified Professional (OCP)", provider: "Oracle", category: "IT & Cloud Computing", price: "$3,400" },

  // Healthcare & Medical (25)
  { id: 51, name: "NCLEX-RN / NCLEX-PN", provider: "NCSBN", category: "Healthcare & Medical", price: "$4,500" },
  { id: 52, name: "USMLE Step 1 / 2 / 3", provider: "NBME", category: "Healthcare & Medical", price: "$5,500" },
  { id: 53, name: "PLAB (UK)", provider: "GMC", category: "Healthcare & Medical", price: "$4,800" },
  { id: 54, name: "MRCP – Membership of Royal College of Physicians", provider: "RCP", category: "Healthcare & Medical", price: "$5,200" },
  { id: 55, name: "FRCP – Fellowship of Royal College of Physicians", provider: "RCP", category: "Healthcare & Medical", price: "$6,000" },
  { id: 56, name: "ACLS – Advanced Cardiac Life Support", provider: "AHA", category: "Healthcare & Medical", price: "$2,200" },
  { id: 57, name: "BLS – Basic Life Support", provider: "AHA", category: "Healthcare & Medical", price: "$1,800" },
  { id: 58, name: "PALS – Pediatric Advanced Life Support", provider: "AHA", category: "Healthcare & Medical", price: "$2,200" },
  { id: 59, name: "CPR Certification", provider: "AHA/Red Cross", category: "Healthcare & Medical", price: "$1,500" },
  { id: 60, name: "Pharmacy Licensure (NAPLEX)", provider: "NABP", category: "Healthcare & Medical", price: "$4,200" },
  { id: 61, name: "Radiology Certification (ARRT, CAMRT)", provider: "ARRT", category: "Healthcare & Medical", price: "$3,800" },
  { id: 62, name: "Clinical Research Professional Certification", provider: "SOCRA", category: "Healthcare & Medical", price: "$3,200" },
  { id: 63, name: "CPH – Certified in Public Health", provider: "NBPHE", category: "Healthcare & Medical", price: "$3,500" },
  { id: 64, name: "CHES – Certified Health Education Specialist", provider: "NCHEC", category: "Healthcare & Medical", price: "$2,800" },
  { id: 65, name: "CHFM – Certified Healthcare Facility Manager", provider: "AHA", category: "Healthcare & Medical", price: "$3,000" },
  { id: 66, name: "Healthcare Quality Certification (CPHQ)", provider: "NAHQ", category: "Healthcare & Medical", price: "$3,200" },
  { id: 67, name: "Diabetes Educator Certification", provider: "NCBDE", category: "Healthcare & Medical", price: "$2,800" },
  { id: 68, name: "Neonatal Resuscitation Program (NRP)", provider: "AAP", category: "Healthcare & Medical", price: "$2,200" },
  { id: 69, name: "Oncology Nursing Certification (OCN)", provider: "ONCC", category: "Healthcare & Medical", price: "$3,000" },
  { id: 70, name: "Critical Care Registered Nurse (CCRN)", provider: "AACN", category: "Healthcare & Medical", price: "$3,200" },
  { id: 71, name: "Certified Emergency Nurse (CEN)", provider: "BCEN", category: "Healthcare & Medical", price: "$3,000" },
  { id: 72, name: "Certified Anesthesia Technician (CAT)", provider: "ASATT", category: "Healthcare & Medical", price: "$2,600" },
  { id: 73, name: "Certified Medical Assistant (CMA)", provider: "AAMA", category: "Healthcare & Medical", price: "$2,400" },
  { id: 74, name: "Certified Pharmacy Technician (CPhT)", provider: "PTCB", category: "Healthcare & Medical", price: "$2,400" },
  { id: 75, name: "Certified Professional in Healthcare Risk Management (CPHRM)", provider: "AHA", category: "Healthcare & Medical", price: "$3,200" },

  // Finance, Accounting & Investment (25)
  { id: 76, name: "CFA – Chartered Financial Analyst", provider: "CFA Institute", category: "Finance & Accounting", price: "$6,500" },
  { id: 77, name: "CPA – Certified Public Accountant", provider: "AICPA", category: "Finance & Accounting", price: "$5,500" },
  { id: 78, name: "ACCA – Association of Chartered Certified Accountants", provider: "ACCA", category: "Finance & Accounting", price: "$5,800" },
  { id: 79, name: "CIMA – Chartered Institute of Management Accountants", provider: "CIMA", category: "Finance & Accounting", price: "$5,500" },
  { id: 80, name: "CMA – Certified Management Accountant", provider: "IMA", category: "Finance & Accounting", price: "$4,800" },
  { id: 81, name: "CFP – Certified Financial Planner", provider: "CFP Board", category: "Finance & Accounting", price: "$4,500" },
  { id: 82, name: "FRM – Financial Risk Manager", provider: "GARP", category: "Finance & Accounting", price: "$5,200" },
  { id: 83, name: "CAIA – Chartered Alternative Investment Analyst", provider: "CAIA", category: "Finance & Accounting", price: "$5,500" },
  { id: 84, name: "ERP / SAP Financials Certification", provider: "SAP", category: "Finance & Accounting", price: "$3,800" },
  { id: 85, name: "Financial Modeling & Valuation Analyst (FMVA)", provider: "CFI", category: "Finance & Accounting", price: "$3,500" },
  { id: 86, name: "IFRS Certification", provider: "ACCA", category: "Finance & Accounting", price: "$3,200" },
  { id: 87, name: "Chartered Accountant (CA)", provider: "Various", category: "Finance & Accounting", price: "$5,500" },
  { id: 88, name: "Certified Internal Auditor (CIA)", provider: "IIA", category: "Finance & Accounting", price: "$4,200" },
  { id: 89, name: "Certified Fraud Examiner (CFE)", provider: "ACFE", category: "Finance & Accounting", price: "$3,800" },
  { id: 90, name: "Chartered Market Technician (CMT)", provider: "CMT Association", category: "Finance & Accounting", price: "$4,500" },
  { id: 91, name: "Investment Banking Certification", provider: "Top Banks", category: "Finance & Accounting", price: "$6,000" },
  { id: 92, name: "Risk Management Professional (RMP)", provider: "PMI", category: "Finance & Accounting", price: "$3,800" },
  { id: 93, name: "Financial Data Analyst Certification", provider: "Various", category: "Finance & Accounting", price: "$3,200" },
  { id: 94, name: "Certified Treasury Professional (CTP)", provider: "AFP", category: "Finance & Accounting", price: "$3,500" },
  { id: 95, name: "Professional Risk Manager (PRM)", provider: "PRMIA", category: "Finance & Accounting", price: "$4,000" },
  { id: 96, name: "Certified Fund Specialist (CFS)", provider: "ICI", category: "Finance & Accounting", price: "$3,200" },
  { id: 97, name: "Certified Credit Analyst (CCA)", provider: "RMA", category: "Finance & Accounting", price: "$3,500" },
  { id: 98, name: "Certificate in Quantitative Finance (CQF)", provider: "CQF Institute", category: "Finance & Accounting", price: "$5,200" },
  { id: 99, name: "ESG / Sustainability Finance Certifications", provider: "Various", category: "Finance & Accounting", price: "$3,800" },
  { id: 100, name: "Blockchain in Finance / Crypto Professional", provider: "Various", category: "Finance & Accounting", price: "$3,500" },

  // Language & Communication (15)
  { id: 101, name: "IELTS – International English Language Testing System", provider: "British Council", category: "Language & Communication", price: "$2,200" },
  { id: 102, name: "TOEFL – Test of English as a Foreign Language", provider: "ETS", category: "Language & Communication", price: "$2,200" },
  { id: 103, name: "CELTA – Certificate in Teaching English", provider: "Cambridge", category: "Language & Communication", price: "$2,800" },
  { id: 104, name: "TESOL – Teaching English to Speakers of Other Languages", provider: "TESOL International", category: "Language & Communication", price: "$2,600" },
  { id: 105, name: "DELF / DALF – French proficiency", provider: "CIEP", category: "Language & Communication", price: "$2,200" },
  { id: 106, name: "Goethe-Zertifikat – German proficiency", provider: "Goethe Institut", category: "Language & Communication", price: "$2,200" },
  { id: 107, name: "JLPT – Japanese Language Proficiency Test", provider: "JLPT", category: "Language & Communication", price: "$2,000" },
  { id: 108, name: "HSK – Chinese (Mandarin) proficiency", provider: "Hanban", category: "Language & Communication", price: "$2,000" },
  { id: 109, name: "CELI / CILS – Italian language proficiency", provider: "University of Siena", category: "Language & Communication", price: "$2,000" },
  { id: 110, name: "TEFL – Teaching English as a Foreign Language", provider: "Various", category: "Language & Communication", price: "$2,400" },
  { id: 111, name: "TestDaF – German language test", provider: "TestDaF Institute", category: "Language & Communication", price: "$2,200" },
  { id: 112, name: "DELE – Spanish language proficiency", provider: "Cervantes Institute", category: "Language & Communication", price: "$2,000" },
  { id: 113, name: "Russian TORFL / TRKI", provider: "Russian Ministry of Education", category: "Language & Communication", price: "$2,000" },
  { id: 114, name: "TOPIK – Korean language proficiency", provider: "NIIED", category: "Language & Communication", price: "$2,000" },
  { id: 115, name: "Cambridge English Qualifications (CAE, CPE)", provider: "Cambridge", category: "Language & Communication", price: "$2,400" },

  // Emerging Tech / Data / AI / Blockchain (25)
  { id: 116, name: "Certified Data Scientist", provider: "DASCA", category: "Emerging Tech & AI", price: "$4,200" },
  { id: 117, name: "Microsoft Certified: Azure AI Engineer Associate", provider: "Microsoft", category: "Emerging Tech & AI", price: "$3,500" },
  { id: 118, name: "Google AI / ML Engineer Certification", provider: "Google", category: "Emerging Tech & AI", price: "$3,800" },
  { id: 119, name: "TensorFlow Developer Certificate", provider: "Google", category: "Emerging Tech & AI", price: "$3,200" },
  { id: 120, name: "IBM Data Science Professional Certificate", provider: "IBM", category: "Emerging Tech & AI", price: "$3,500" },
  { id: 121, name: "Data Science Council of America (CDS / CDMP)", provider: "DASCA", category: "Emerging Tech & AI", price: "$3,800" },
  { id: 122, name: "Tableau Desktop Specialist / Certified Associate", provider: "Tableau", category: "Emerging Tech & AI", price: "$2,800" },
  { id: 123, name: "Power BI Certification", provider: "Microsoft", category: "Emerging Tech & AI", price: "$2,600" },
  { id: 124, name: "Certified Blockchain Professional (CBP)", provider: "Blockchain Council", category: "Emerging Tech & AI", price: "$3,500" },
  { id: 125, name: "Ethereum Developer Certification", provider: "B9lab", category: "Emerging Tech & AI", price: "$3,800" },
  { id: 126, name: "Certified Kubernetes Administrator (CKA)", provider: "CNCF", category: "Emerging Tech & AI", price: "$3,200" },
  { id: 127, name: "Certified Kubernetes Application Developer (CKAD)", provider: "CNCF", category: "Emerging Tech & AI", price: "$3,200" },
  { id: 128, name: "AI & Machine Learning Certifications", provider: "Coursera/EdX", category: "Emerging Tech & AI", price: "$3,000" },
  { id: 129, name: "Big Data Hadoop Certification", provider: "Cloudera", category: "Emerging Tech & AI", price: "$3,500" },
  { id: 130, name: "Apache Spark / Kafka Certifications", provider: "Databricks", category: "Emerging Tech & AI", price: "$3,400" },
  { id: 131, name: "SAS Certified Data Scientist", provider: "SAS", category: "Emerging Tech & AI", price: "$3,800" },
  { id: 132, name: "Cloudera Certified Professional Data Engineer", provider: "Cloudera", category: "Emerging Tech & AI", price: "$3,600" },
  { id: 133, name: "Google Analytics Individual Qualification", provider: "Google", category: "Emerging Tech & AI", price: "$2,200" },
  { id: 134, name: "Adobe Analytics Certification", provider: "Adobe", category: "Emerging Tech & AI", price: "$2,800" },
  { id: 135, name: "Certified Digital Transformation Professional", provider: "Various", category: "Emerging Tech & AI", price: "$3,200" },
  { id: 136, name: "NVIDIA Deep Learning Institute Certificates", provider: "NVIDIA", category: "Emerging Tech & AI", price: "$3,000" },
  { id: 137, name: "Python for Data Science Professional Certificate", provider: "Various", category: "Emerging Tech & AI", price: "$2,800" },
  { id: 138, name: "R Programming Data Science Certification", provider: "Various", category: "Emerging Tech & AI", price: "$2,600" },
  { id: 139, name: "AI Product Manager Certification", provider: "Various", category: "Emerging Tech & AI", price: "$3,500" },
  { id: 140, name: "Robotic Process Automation (RPA) Certification", provider: "UiPath/Automation Anywhere", category: "Emerging Tech & AI", price: "$3,200" },

  // Engineering / Technical / Trades (20)
  { id: 141, name: "PE – Professional Engineer", provider: "NCEES", category: "Engineering & Trades", price: "$4,500" },
  { id: 142, name: "LEED Accreditation (Green Building)", provider: "USGBC", category: "Engineering & Trades", price: "$3,500" },
  { id: 143, name: "AutoDesk Certified Professional (CAD, Revit)", provider: "Autodesk", category: "Engineering & Trades", price: "$2,800" },
  { id: 144, name: "SolidWorks Professional / Expert Certification", provider: "Dassault", category: "Engineering & Trades", price: "$3,000" },
  { id: 145, name: "Six Sigma Green / Black / Master Belt", provider: "ASQ", category: "Engineering & Trades", price: "$3,500" },
  { id: 146, name: "OSHA Safety Certification", provider: "OSHA", category: "Engineering & Trades", price: "$2,200" },
  { id: 147, name: "Welding Certification – AWS / International", provider: "AWS", category: "Engineering & Trades", price: "$2,600" },
  { id: 148, name: "HVAC Technician Certification", provider: "HVAC Excellence", category: "Engineering & Trades", price: "$2,400" },
  { id: 149, name: "PLC Programming / Automation Certification", provider: "Various", category: "Engineering & Trades", price: "$2,800" },
  { id: 150, name: "Electrical Engineering Certification", provider: "IEEE", category: "Engineering & Trades", price: "$3,500" },
  { id: 151, name: "Mechanical Engineering Professional Certification", provider: "ASME", category: "Engineering & Trades", price: "$3,500" },
  { id: 152, name: "Civil Engineering Professional Certification", provider: "ASCE", category: "Engineering & Trades", price: "$3,500" },
  { id: 153, name: "Structural Engineering License", provider: "NCEES", category: "Engineering & Trades", price: "$4,000" },
  { id: 154, name: "Marine Engineering Certification", provider: "SNAME", category: "Engineering & Trades", price: "$3,800" },
  { id: 155, name: "Petroleum Engineering Certification", provider: "SPE", category: "Engineering & Trades", price: "$4,200" },
  { id: 156, name: "Chemical Engineering Professional Certification", provider: "AIChE", category: "Engineering & Trades", price: "$3,800" },
  { id: 157, name: "Geotechnical Engineering Certification", provider: "ASCE", category: "Engineering & Trades", price: "$3,600" },
  { id: 158, name: "Robotics Engineering Certification", provider: "IEEE", category: "Engineering & Trades", price: "$3,800" },
  { id: 159, name: "Industrial Engineering Certification", provider: "IISE", category: "Engineering & Trades", price: "$3,400" },
  { id: 160, name: "Quality Control / Six Sigma Engineering", provider: "ASQ", category: "Engineering & Trades", price: "$3,200" },

  // Digital Marketing & Business Analytics (20)
  { id: 161, name: "Google Analytics / Ads Certification", provider: "Google", category: "Digital Marketing", price: "$2,400" },
  { id: 162, name: "HubSpot Inbound Marketing Certification", provider: "HubSpot", category: "Digital Marketing", price: "$2,200" },
  { id: 163, name: "Hootsuite Social Marketing Certification", provider: "Hootsuite", category: "Digital Marketing", price: "$2,200" },
  { id: 164, name: "Facebook Blueprint Certification", provider: "Meta", category: "Digital Marketing", price: "$2,400" },
  { id: 165, name: "Meta Certified Marketing Science Professional", provider: "Meta", category: "Digital Marketing", price: "$2,800" },
  { id: 166, name: "Digital Marketing Institute Professional Diploma", provider: "DMI", category: "Digital Marketing", price: "$3,000" },
  { id: 167, name: "Certified Marketing Executive (CME)", provider: "Various", category: "Digital Marketing", price: "$2,800" },
  { id: 168, name: "SEO / SEM Professional Certification", provider: "Various", category: "Digital Marketing", price: "$2,400" },
  { id: 169, name: "Content Marketing Institute Certification", provider: "CMI", category: "Digital Marketing", price: "$2,600" },
  { id: 170, name: "Google Tag Manager Certification", provider: "Google", category: "Digital Marketing", price: "$2,000" },
  { id: 171, name: "Certified Digital Marketing Professional (CDMP)", provider: "DMI", category: "Digital Marketing", price: "$2,800" },
  { id: 172, name: "Google Mobile Sites Certification", provider: "Google", category: "Digital Marketing", price: "$2,000" },
  { id: 173, name: "Conversion Optimization Specialist", provider: "Various", category: "Digital Marketing", price: "$2,400" },
  { id: 174, name: "Email Marketing Certification", provider: "HubSpot/Mailchimp", category: "Digital Marketing", price: "$2,000" },
  { id: 175, name: "Salesforce Marketing Cloud Certification", provider: "Salesforce", category: "Digital Marketing", price: "$3,200" },
  { id: 176, name: "Tableau / Power BI Analytics for Marketing", provider: "Microsoft/Tableau", category: "Digital Marketing", price: "$2,600" },
  { id: 177, name: "Certified Customer Experience Professional (CCXP)", provider: "CXPA", category: "Digital Marketing", price: "$3,000" },
  { id: 178, name: "Marketing Analytics Certification", provider: "Various", category: "Digital Marketing", price: "$2,800" },
  { id: 179, name: "UX / UI Design Certification", provider: "Various", category: "Digital Marketing", price: "$2,800" },
  { id: 180, name: "Certified E-Commerce Specialist", provider: "Various", category: "Digital Marketing", price: "$2,600" },

  // Miscellaneous / Other Professional (10)
  { id: 181, name: "FAA / Aviation Licenses / Pilot Certifications", provider: "FAA", category: "Other Professional", price: "$5,500" },
  { id: 182, name: "CISCO DevNet / IoT Certifications", provider: "Cisco", category: "Other Professional", price: "$3,200" },
  { id: 183, name: "Maritime Safety / Nautical Certifications", provider: "Various", category: "Other Professional", price: "$3,800" },
  { id: 184, name: "Logistics & Supply Chain Professional", provider: "APICS", category: "Other Professional", price: "$3,000" },
  { id: 185, name: "SAP ERP Modules Certification", provider: "SAP", category: "Other Professional", price: "$3,500" },
  { id: 186, name: "ISO 9001 / 14001 / 45001 Lead Auditor", provider: "ISO", category: "Other Professional", price: "$3,200" },
  { id: 187, name: "Hospitality & Tourism Professional (CHIA)", provider: "AHLEI", category: "Other Professional", price: "$2,800" },
  { id: 188, name: "Real Estate Licenses / Broker Certification", provider: "State Boards", category: "Other Professional", price: "$2,600" },
  { id: 189, name: "Lean Manufacturing Certification", provider: "SME", category: "Other Professional", price: "$2,800" },
  { id: 190, name: "Food Safety Certification (HACCP, ServSafe)", provider: "ServSafe", category: "Other Professional", price: "$2,000" },
];

const Certifications = () => {
  const navigate = useNavigate();
  const baseUrl = window.location.origin;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([1500, 8500]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(certifications.map(c => c.category))).sort();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([1500, 8500]);
    setSearchQuery("");
  };

  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(cert.category);
    
    const price = parseInt(cert.price.replace(/[$,]/g, ""));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={seoConfig.certifications.title}
        description={seoConfig.certifications.description}
        keywords={seoConfig.certifications.keywords}
        canonicalUrl={`${baseUrl}/certifications`}
      />
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Certifications</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              200+ Top Global Certifications
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Professional certifications from the world's most recognized certification bodies. 
              All certifications are <span className="font-semibold text-primary">apostilled</span>, <span className="font-semibold text-primary">registered in provider databases</span>, <span className="font-semibold text-primary">fully verifiable</span>, and contain <span className="font-semibold text-primary">all security features</span>.
              Complete package with certificate, transcript (where applicable), and verification documents. Fast 2-week delivery worldwide.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate("/apply")}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Order Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/faq")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search certifications by name or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Showing {filteredCertifications.length} of {certifications.length} certifications
          </p>
        </div>
      </section>

      {/* Mobile Filter Toggle */}
      <div className="container mx-auto px-4 py-4 lg:hidden">
        <Button 
          variant="outline" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          {sidebarOpen ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="border-border/50 bg-card backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Filters
                    </CardTitle>
                    {(selectedCategories.length > 0 || priceRange[0] !== 1500 || priceRange[1] !== 8500) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
                    <div className="space-y-4">
                      <Slider
                        min={1500}
                        max={8500}
                        step={500}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Category</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category}
                            <span className="text-muted-foreground ml-1">
                              ({certifications.filter(c => c.category === category).length})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(selectedCategories.length > 0 || priceRange[0] !== 1500 || priceRange[1] !== 8500) && (
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="font-semibold mb-2 text-foreground">Active Filters</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map(cat => (
                          <Badge key={cat} variant="secondary" className="cursor-pointer" onClick={() => toggleCategory(cat)}>
                            {cat} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        {(priceRange[0] !== 1500 || priceRange[1] !== 8500) && (
                          <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange([1500, 8500])}>
                            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Certifications Grid */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertifications.map((cert, index) => (
                <Card 
                  key={cert.id}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in border-2 hover:border-primary/50"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs font-bold">
                        {cert.category}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg text-sm font-bold px-3 py-1">
                        {cert.price}
                      </Badge>
                    </div>
                    
                    {/* Certification Icon */}
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                      {cert.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="font-medium">{cert.provider}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span><span className="font-semibold">Apostille certified</span> - Internationally recognized</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span><span className="font-semibold">Database registered</span> - Fully verifiable</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span><span className="font-semibold">All security features</span> - Holograms, seals</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span>Fast 2-week delivery worldwide</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1 group-hover:shadow-lg transition-all duration-300" 
                        size="lg"
                        onClick={() => navigate(`/certification/${encodeURIComponent(cert.name)}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        className="flex-1 group-hover:shadow-lg transition-all duration-300" 
                        size="lg"
                        onClick={() => navigate(`/apply?type=certification&name=${encodeURIComponent(cert.name)}`)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Features Section */}
      <SecurityFeaturesSection />
    </div>
  );
};

export default Certifications;