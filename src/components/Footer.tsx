import { useNavigate } from "react-router-dom";
import { Globe, Mail, Phone, MapPin, Shield } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                SecurePrint Labs
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Licensed government document production facility serving agencies worldwide with military-grade security features.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>ISO 9001 & ISO 27001 Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/products")} className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/about")} className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/apply")} className="text-muted-foreground hover:text-primary transition-colors">
                  Apply Now
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/citizenship")} className="text-muted-foreground hover:text-primary transition-colors">
                  Citizenship
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate("/faq")} className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/blog")} className="text-muted-foreground hover:text-primary transition-colors">
                  Security Blog
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/testimonials")} className="text-muted-foreground hover:text-primary transition-colors">
                  Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>contact@secureprintlabs.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>+1 (800) GOV-DOCS</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Government Services District<br />Secure Facility Complex</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SecurePrint Labs. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-primary transition-colors">Privacy Policy</button>
            <button className="hover:text-primary transition-colors">Terms of Service</button>
            <button className="hover:text-primary transition-colors">Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
