import {
  Briefcase, Clipboard, LayoutGrid, Target, TrendingUp,
  Cloud, Server, Shield, Lock, Database, Network, Cpu,
  Heart, Stethoscope, Cross, Activity, Syringe, Pill,
  DollarSign, Calculator, PiggyBank, LineChart, Wallet,
  MessageSquare, Globe, BookOpen, Languages, GraduationCap,
  Brain, Zap, Boxes, Binary, Smartphone, Code,
  Wrench, Construction, Ruler, Cog, Hammer,
  BarChart, Megaphone, Mail, Users, Store,
  Award, type LucideIcon
} from "lucide-react";

// Icon mapping for certification providers
export const certificationProviderIcons: Record<string, LucideIcon> = {
  // Project Management & Business
  "PMI": Briefcase,
  "AXELOS": Clipboard,
  "Scrum Alliance": LayoutGrid,
  "Scrum.org": Target,
  "ASQ/IASSC": TrendingUp,
  "IIBA": Briefcase,
  "ICPM": Clipboard,
  "APICS": LayoutGrid,
  "ABPMP": Briefcase,
  "Prosci": Target,
  "AMA": Briefcase,
  "Top Universities": GraduationCap,
  
  // IT & Cloud Computing
  "Amazon": Cloud,
  "Microsoft": Server,
  "Google": Cloud,
  "Cisco": Network,
  "CompTIA": Shield,
  "EC-Council": Lock,
  "Offensive Security": Shield,
  "ISC2": Shield,
  "ISACA": Lock,
  "CNCF": Boxes,
  "Red Hat": Server,
  "VMware": Server,
  "Salesforce": Cloud,
  "Oracle": Database,
  
  // Healthcare & Medical
  "NCSBN": Cross,
  "NBME": Stethoscope,
  "GMC": Heart,
  "RCP": Stethoscope,
  "AHA": Heart,
  "AHA/Red Cross": Cross,
  "NABP": Pill,
  "ARRT": Activity,
  "SOCRA": Stethoscope,
  "NBPHE": Heart,
  "NCHEC": Activity,
  "NAHQ": Heart,
  "NCBDE": Heart,
  "AAP": Syringe,
  "ONCC": Heart,
  "AACN": Heart,
  "BCEN": Cross,
  "ASATT": Stethoscope,
  "AAMA": Stethoscope,
  "PTCB": Pill,
  
  // Finance & Accounting
  "CFA Institute": LineChart,
  "AICPA": Calculator,
  "ACCA": DollarSign,
  "CIMA": Calculator,
  "IMA": Calculator,
  "CFP Board": PiggyBank,
  "GARP": LineChart,
  "CAIA": TrendingUp,
  "SAP": Database,
  "CFI": LineChart,
  "Various": Award,
  "IIA": Calculator,
  "ACFE": Shield,
  "CMT Association": LineChart,
  "Top Banks": DollarSign,
  "AFP": Wallet,
  "PRMIA": LineChart,
  "ICI": TrendingUp,
  "RMA": Calculator,
  "CQF Institute": LineChart,
  
  // Language & Communication
  "British Council": MessageSquare,
  "ETS": BookOpen,
  "Cambridge": GraduationCap,
  "TESOL International": Languages,
  "CIEP": Globe,
  "Goethe Institut": BookOpen,
  "JLPT": Languages,
  "Hanban": Globe,
  "University of Siena": GraduationCap,
  "TestDaF Institute": BookOpen,
  "Cervantes Institute": Languages,
  "Russian Ministry of Education": Globe,
  "NIIED": Languages,
  
  // Emerging Tech & AI
  "DASCA": Brain,
  "IBM": Cpu,
  "Tableau": BarChart,
  "Blockchain Council": Binary,
  "B9lab": Code,
  "Coursera/EdX": GraduationCap,
  "Cloudera": Database,
  "Databricks": Zap,
  "SAS": BarChart,
  "Adobe": Code,
  "NVIDIA": Cpu,
  "DeepLearning.AI": Brain,
  "Fast.ai": Brain,
  "OpenAI": Brain,
  
  // Engineering & Architecture
  "NCEES": Wrench,
  "Autodesk": Ruler,
  "ABET": Cog,
  "IEEE": Cpu,
  "ASHRAE": Construction,
  "AISC": Hammer,
  "NCARB": Ruler,
  "PMP": Construction,
  "NICET": Cog,
  "LEED": Construction,
  "OSHA": Shield,
  
  // Digital Marketing & Media
  "HubSpot": Megaphone,
  "Meta": Users,
  "Facebook": Users,
  "Shopify": Store,
  "Hootsuite": Megaphone,
  "SEMrush": BarChart,
  "AMA (Marketing)": Target,
  "IAB": BarChart,
  
  // Aviation & Transportation
  "FAA": Globe,
  "ICAO": Globe,
  "IATA": Globe,
  
  // Default fallback
  "default": Award
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
  "Engineering & Architecture": {
    gradient: "from-gray-500/10 to-slate-600/10",
    icon: "text-gray-600 dark:text-gray-400",
    badge: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20"
  },
  "Digital Marketing & Media": {
    gradient: "from-yellow-500/10 to-amber-600/10",
    icon: "text-yellow-600 dark:text-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20"
  },
  "default": {
    gradient: "from-primary/10 to-primary/20",
    icon: "text-primary",
    badge: "bg-primary/10 text-primary border-primary/20"
  }
};

// Get icon for a certification provider
export const getCertificationIcon = (provider: string): LucideIcon => {
  return certificationProviderIcons[provider] || certificationProviderIcons["default"];
};

// Get color scheme for a category
export const getCategoryColors = (category: string) => {
  return categoryColors[category] || categoryColors["default"];
};
