import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, Search, Calendar, User, Tag, BookOpen, Shield, Cpu, Globe, Lock, Sparkles, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "All", icon: BookOpen, count: 24 },
    { name: "Security Features", icon: Shield, count: 8 },
    { name: "Technology", icon: Cpu, count: 6 },
    { name: "Compliance", icon: Lock, count: 5 },
    { name: "Industry News", icon: Globe, count: 5 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Evolution of Biometric Security in Government Documents",
      excerpt: "Exploring how fingerprint and facial recognition technology has revolutionized document authentication, providing unprecedented security layers that make forgery virtually impossible.",
      author: "Dr. Sarah Mitchell",
      date: "2025-01-15",
      category: "Security Features",
      tags: ["Biometrics", "Security", "Innovation"],
      readTime: "8 min",
      image: "biometric"
    },
    {
      id: 2,
      title: "ICAO Standards 2025: What's New in Travel Document Security",
      excerpt: "A comprehensive overview of the latest International Civil Aviation Organization standards for machine-readable travel documents and how they enhance global security.",
      author: "James Chen",
      date: "2025-01-12",
      category: "Compliance",
      tags: ["ICAO", "Passports", "Standards"],
      readTime: "10 min",
      image: "compliance"
    },
    {
      id: 3,
      title: "RFID vs NFC: Choosing the Right Chip Technology for ID Cards",
      excerpt: "Understanding the differences between RFID and NFC technologies, their security implications, and how to select the optimal solution for your government agency.",
      author: "Dr. Marcus Weber",
      date: "2025-01-10",
      category: "Technology",
      tags: ["RFID", "NFC", "Smart Cards"],
      readTime: "7 min",
      image: "technology"
    },
    {
      id: 4,
      title: "Multi-Layer Hologram Technology: The Future of Document Security",
      excerpt: "Discover how advanced 3D holographic overlays with micro-patterns and color-shifting effects create authentication features that are impossible to replicate.",
      author: "Prof. Yuki Tanaka",
      date: "2025-01-08",
      category: "Security Features",
      tags: ["Holograms", "Authentication", "Innovation"],
      readTime: "9 min",
      image: "holograms"
    },
    {
      id: 5,
      title: "Database Integration Best Practices for Document Verification",
      excerpt: "Learn how real-time database integration enables instant verification of government documents while maintaining security and privacy compliance.",
      author: "Elizabeth Okonkwo",
      date: "2025-01-05",
      category: "Technology",
      tags: ["Database", "Verification", "API"],
      readTime: "11 min",
      image: "database"
    },
    {
      id: 6,
      title: "UV Security Features: Invisible Protection Against Forgery",
      excerpt: "An in-depth look at ultraviolet ink patterns and elements that provide covert security features visible only under specialized lighting conditions.",
      author: "Pierre Dubois",
      date: "2025-01-03",
      category: "Security Features",
      tags: ["UV Security", "Anti-Forgery", "Materials"],
      readTime: "6 min",
      image: "uv"
    },
    {
      id: 7,
      title: "ISO 27001 Compliance: Protecting Sensitive Document Data",
      excerpt: "How information security management systems ensure the protection of personal data throughout the document production lifecycle.",
      author: "Anna Kowalski",
      date: "2024-12-28",
      category: "Compliance",
      tags: ["ISO 27001", "Data Security", "Privacy"],
      readTime: "8 min",
      image: "iso"
    },
    {
      id: 8,
      title: "Microtext Printing: The Microscopic Guardian of Document Integrity",
      excerpt: "Exploring how text smaller than the human eye can see provides robust security that standard copying equipment cannot reproduce.",
      author: "Dr. David Thompson",
      date: "2024-12-25",
      category: "Security Features",
      tags: ["Microtext", "Printing", "Security"],
      readTime: "7 min",
      image: "microtext"
    },
    {
      id: 9,
      title: "Global Trends in National ID Systems: 2025 and Beyond",
      excerpt: "Analyzing emerging trends in government identification systems, from digital integration to enhanced biometric capabilities.",
      author: "Minister Fatima Al-Rahman",
      date: "2024-12-22",
      category: "Industry News",
      tags: ["National ID", "Trends", "Digital Identity"],
      readTime: "12 min",
      image: "trends"
    },
    {
      id: 10,
      title: "Laser Engraving vs Traditional Printing: Security Comparison",
      excerpt: "A technical comparison of laser engraving and traditional printing methods, focusing on permanence, security, and tamper resistance.",
      author: "Colonel Marcus Weber",
      date: "2024-12-20",
      category: "Technology",
      tags: ["Laser Engraving", "Printing", "Technology"],
      readTime: "9 min",
      image: "laser"
    },
    {
      id: 11,
      title: "Tamper-Proof Materials: Engineering Document Resilience",
      excerpt: "Understanding the science behind self-destructing security features and materials designed to reveal any attempt at document alteration.",
      author: "Dr. Sarah Mitchell",
      date: "2024-12-18",
      category: "Security Features",
      tags: ["Materials", "Tamper-Proof", "Engineering"],
      readTime: "10 min",
      image: "materials"
    },
    {
      id: 12,
      title: "Diplomatic Document Security: Special Considerations",
      excerpt: "The unique security requirements for diplomatic passports and credentials, balancing accessibility with maximum protection.",
      author: "Ambassador Yuki Tanaka",
      date: "2024-12-15",
      category: "Industry News",
      tags: ["Diplomacy", "Security", "Passports"],
      readTime: "8 min",
      image: "diplomatic"
    },
    {
      id: 13,
      title: "Machine Learning in Document Verification: AI-Powered Authentication",
      excerpt: "How artificial intelligence and machine learning enhance document verification accuracy and speed in border control and law enforcement.",
      author: "James Chen",
      date: "2024-12-12",
      category: "Technology",
      tags: ["AI", "Machine Learning", "Verification"],
      readTime: "11 min",
      image: "ai"
    },
    {
      id: 14,
      title: "Driver's License Modernization: A State-by-State Analysis",
      excerpt: "Reviewing how different states and countries are upgrading driver's license security features and what agencies should consider.",
      author: "Maria Rodriguez",
      date: "2024-12-10",
      category: "Industry News",
      tags: ["Driver's License", "Modernization", "Security"],
      readTime: "13 min",
      image: "license"
    },
    {
      id: 15,
      title: "Watermark Technology: From Banknotes to Government Documents",
      excerpt: "The evolution of watermark technology and how multi-tone watermarks with security threads provide authentication confidence.",
      author: "Hassan Al-Masri",
      date: "2024-12-08",
      category: "Security Features",
      tags: ["Watermarks", "Security Threads", "Authentication"],
      readTime: "7 min",
      image: "watermark"
    },
    {
      id: 16,
      title: "Cross-Border Document Verification: Building International Systems",
      excerpt: "Challenges and solutions in creating interoperable verification systems that work seamlessly across international borders.",
      author: "Pierre Dubois",
      date: "2024-12-05",
      category: "Technology",
      tags: ["International", "Verification", "Integration"],
      readTime: "10 min",
      image: "crossborder"
    },
    {
      id: 17,
      title: "Academic Credential Security: Protecting Educational Documents",
      excerpt: "Specialized security features for diplomas and certificates that preserve institutional integrity and prevent credential fraud.",
      author: "Prof. David Thompson",
      date: "2024-12-03",
      category: "Security Features",
      tags: ["Diplomas", "Education", "Credentials"],
      readTime: "8 min",
      image: "academic"
    },
    {
      id: 18,
      title: "GDPR and Document Production: Privacy Compliance Guide",
      excerpt: "Navigating European data protection regulations while maintaining secure document production workflows and data management.",
      author: "Anna Kowalski",
      date: "2024-12-01",
      category: "Compliance",
      tags: ["GDPR", "Privacy", "Compliance"],
      readTime: "9 min",
      image: "gdpr"
    },
    {
      id: 19,
      title: "Blockchain and Government Documents: Future Applications",
      excerpt: "Exploring how distributed ledger technology could revolutionize document verification and create immutable credential records.",
      author: "Dr. Marcus Weber",
      date: "2024-11-28",
      category: "Technology",
      tags: ["Blockchain", "Future Tech", "Innovation"],
      readTime: "12 min",
      image: "blockchain"
    },
    {
      id: 20,
      title: "Emergency Document Production: 24-Hour Protocols",
      excerpt: "How government agencies can maintain security standards while meeting urgent document needs in crisis situations.",
      author: "Linda Nyström",
      date: "2024-11-25",
      category: "Industry News",
      tags: ["Emergency", "Protocols", "Operations"],
      readTime: "7 min",
      image: "emergency"
    },
    {
      id: 21,
      title: "Color-Shifting Inks: The Science of Optical Variable Devices",
      excerpt: "Understanding how specialized inks change color based on viewing angle, creating security features visible to the naked eye.",
      author: "Dr. Sarah Mitchell",
      date: "2024-11-22",
      category: "Security Features",
      tags: ["OVD", "Inks", "Materials"],
      readTime: "8 min",
      image: "inks"
    },
    {
      id: 22,
      title: "Quality Assurance in Document Production: ISO 9001 Standards",
      excerpt: "Implementing quality management systems that ensure every document meets exacting standards and specifications.",
      author: "Elizabeth Okonkwo",
      date: "2024-11-20",
      category: "Compliance",
      tags: ["Quality", "ISO 9001", "Standards"],
      readTime: "10 min",
      image: "quality"
    },
    {
      id: 23,
      title: "Mobile Document Verification: Apps and Technology",
      excerpt: "The rise of mobile verification applications and how they're changing document authentication in the field.",
      author: "James Chen",
      date: "2024-11-18",
      category: "Technology",
      tags: ["Mobile", "Apps", "Verification"],
      readTime: "9 min",
      image: "mobile"
    },
    {
      id: 24,
      title: "Sustainable Security: Eco-Friendly Document Production",
      excerpt: "Balancing environmental responsibility with security requirements in modern document manufacturing processes.",
      author: "Maria Rodriguez",
      date: "2024-11-15",
      category: "Industry News",
      tags: ["Sustainability", "Environment", "Innovation"],
      readTime: "11 min",
      image: "sustainability"
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <Printer className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SecurePrint Labs
            </h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigate("/")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Home
            </button>
            <button onClick={() => navigate("/products")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Products
            </button>
            <button onClick={() => navigate("/about")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              About
            </button>
            <button onClick={() => navigate("/faq")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              FAQ
            </button>
            <button onClick={() => navigate("/testimonials")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Testimonials
            </button>
            <button onClick={() => navigate("/blog")} className="text-primary font-medium">
              Blog
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Insights & Updates</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Security Blog</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert insights on document security, technology trends, and industry best practices
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg border-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Categories */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            selectedCategory === category.name
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-primary/10 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <Badge variant="secondary" className={selectedCategory === category.name ? "bg-primary-foreground/20 text-primary-foreground" : ""}>
                            {category.count}
                          </Badge>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Popular Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["Biometrics", "RFID", "Security", "ICAO", "Compliance", "Innovation", "Verification", "AI"].map((tag) => (
                        <Badge key={tag} variant="outline" className="hover:bg-primary/10 cursor-pointer">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="text-lg">Stay Updated</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Subscribe to receive the latest security insights and industry updates
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Blog Posts Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group cursor-pointer"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                        <Badge variant="outline">{post.readTime}</Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
