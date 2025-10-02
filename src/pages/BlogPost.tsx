import { useNavigate, useParams } from "react-router-dom";
import { Printer, Calendar, User, ArrowLeft, Share2, BookmarkPlus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


// Blog post data (in a real app, this would come from a CMS or API)
const blogPostsData: { [key: string]: any } = {
  "1": {
    id: 1,
    title: "The Evolution of Biometric Security in Government Documents",
    author: "Dr. Sarah Mitchell",
    date: "2025-01-15",
    category: "Security Features",
    tags: ["Biometrics", "Security", "Innovation"],
    readTime: "8 min",
    content: `
# The Evolution of Biometric Security in Government Documents

Biometric security has revolutionized the way governments authenticate and verify the identity of their citizens. From fingerprint scanning to facial recognition, these technologies have become integral to modern identity documents.

## The Early Days of Biometric Authentication

The journey began in the late 1990s when countries started exploring digital fingerprint storage on passports and national ID cards. What seemed like science fiction then has become standard practice today.

### Key Milestones

1. **1998** - First biometric passports introduced in Malaysia
2. **2006** - ICAO mandates biometric data in machine-readable travel documents
3. **2015** - Facial recognition becomes standard across most developed nations
4. **2020** - Multi-modal biometric systems gain widespread adoption

## Modern Biometric Technologies

Today's government documents incorporate multiple biometric modalities:

### Fingerprint Recognition
High-resolution fingerprint capture (500+ DPI) enables accurate matching even in challenging conditions. Modern systems can store multiple fingerprints with 256-bit encryption, ensuring both security and redundancy.

### Facial Recognition
Advanced algorithms can identify individuals with 99.9% accuracy, even accounting for aging, facial hair changes, and minor disguises. The technology uses deep learning models trained on millions of faces.

### Iris Scanning
The most accurate biometric method, iris recognition provides unique patterns that remain stable throughout life. Some high-security facilities now incorporate iris data into diplomatic and military credentials.

## Security Advantages

Biometric integration provides several critical security benefits:

- **Impossible to Forge**: Unlike printed information, biometric data cannot be replicated
- **Tamper Detection**: Any attempt to alter the biometric chip triggers security alerts
- **Real-time Verification**: Border control can verify identity in seconds
- **Cross-database Matching**: Integration with criminal and security databases

## Privacy and Data Protection

With great power comes great responsibility. Governments must balance security with privacy:

- End-to-end encryption of all biometric data
- Strict access controls limiting who can read biometric information
- Data retention policies that protect citizen privacy
- Compliance with GDPR and similar regulations

## The Future of Biometric Security

Emerging technologies promise even greater security:

- **Behavioral Biometrics**: Gait recognition and signature dynamics
- **DNA Markers**: Genetic authentication for ultra-high security applications
- **Vein Pattern Recognition**: Palm and finger vein mapping for contactless verification
- **3D Facial Mapping**: Advanced depth sensors preventing photo-based spoofing

## Implementation Challenges

Despite the benefits, governments face several challenges:

1. **Cost**: Biometric systems require significant initial investment
2. **Infrastructure**: Border controls must upgrade equipment nationwide
3. **Training**: Officials need comprehensive training on new systems
4. **Public Acceptance**: Privacy concerns must be addressed transparently

## Best Practices for Government Agencies

Based on our 20+ years of experience, we recommend:

- Implement multi-modal biometric systems for redundancy
- Ensure compatibility with international standards (ICAO, ISO)
- Invest in regular system updates and security audits
- Provide clear communication to citizens about data usage
- Maintain fallback authentication methods for edge cases

## Conclusion

Biometric security has transformed government document authentication from a purely visual process to a sophisticated digital verification system. As technologies continue to advance, the gap between legitimate documents and forgeries will only widen, making our borders and institutions more secure while maintaining citizen privacy through proper implementation.

At SecurePrint Labs, we stay at the forefront of these technologies, ensuring every document we produce incorporates the latest biometric security features while meeting international standards.
    `
  },
  "2": {
    id: 2,
    title: "ICAO Standards 2025: What's New in Travel Document Security",
    author: "James Chen",
    date: "2025-01-12",
    category: "Compliance",
    tags: ["ICAO", "Passports", "Standards"],
    readTime: "10 min",
    content: `
# ICAO Standards 2025: What's New in Travel Document Security

The International Civil Aviation Organization (ICAO) has released updated standards for 2025, introducing significant enhancements to travel document security that all member states must implement.

## Overview of Changes

The 2025 ICAO Doc 9303 revision introduces stricter requirements for machine-readable travel documents (MRTDs), with a focus on enhanced biometric security and contactless verification.

## Major Updates

### Enhanced Chip Security
The new standards mandate:
- Minimum 256-bit encryption for all contactless chips
- Active Authentication (AA) v2.0 protocol
- Extended Access Control (EAC) for sensitive biometric data
- Secure Messaging for all chip communications

### Biometric Data Requirements
All passports issued after January 2026 must include:
- High-resolution facial image (minimum 600 DPI)
- Optional but recommended fingerprint data (two prints minimum)
- Digital signature using SHA-256 or higher
- Liveness detection compatibility for facial recognition

### Visual Security Features
New mandatory security elements include:
- Multi-layer holograms with dynamic effects
- UV-reactive inks in specific patterns
- Microtext smaller than 0.2mm
- Optically variable devices (OVD) with color-shifting properties

## Implementation Timeline

- **Q1 2025**: Member states begin transition planning
- **Q3 2025**: Production facilities must achieve compliance
- **January 2026**: All new passports must meet 2025 standards
- **2030**: Full global compliance deadline for all documents in circulation

## Technical Specifications

### Chip Specifications
- **Storage Capacity**: Minimum 64KB, recommended 128KB
- **Communication Protocol**: ISO/IEC 14443 Type B
- **Operating Frequency**: 13.56 MHz
- **Data Groups**: Mandatory DG1, DG2, DG14, DG15
- **Security**: BAC + PACE + SAC protocols

### Machine-Readable Zone (MRZ)
Updated format requirements:
- OCR-B font with enhanced readability
- Error detection using check digits
- Compatibility with ISO/IEC 7501-1
- Special characters handling for international names

## Security Implications

The 2025 standards significantly raise the bar for document forgery:

1. **Chip Cloning Prevention**: New cryptographic protocols make chip duplication virtually impossible
2. **Database Integration**: Real-time verification against issuing authority databases
3. **Tamper Evidence**: Advanced materials that show visible damage if alteration is attempted
4. **Cross-border Verification**: Standardized protocols enable seamless international checking

## Cost Considerations

Upgrading to 2025 standards requires investment in:
- New printing equipment ($500K - $2M per facility)
- Chip encoding systems with updated firmware
- Security feature application machinery
- Staff training and certification
- Quality control systems

However, the long-term benefits include:
- Reduced fraud and counterfeiting
- Faster border processing times
- Enhanced national security
- International compliance and recognition

## Compliance Checklist for Agencies

✓ Assess current production capabilities
✓ Identify equipment upgrades needed
✓ Budget for transition costs
✓ Train production and quality control staff
✓ Update document design to incorporate new features
✓ Test samples with ICAO reference readers
✓ Obtain certification from national authority
✓ Coordinate with border control for reader updates

## SecurePrint Labs' Compliance

We are proud to announce full compliance with ICAO 2025 standards:
- Production facilities upgraded with latest equipment
- All security features incorporated as standard
- Staff certified in new production protocols
- Quality assurance aligned with updated specifications
- Ready to produce compliant documents for government agencies

## Conclusion

The ICAO 2025 standards represent the most significant update to travel document security in over a decade. While implementation requires investment, the security benefits are substantial. Governments that act now will be well-positioned to meet the 2026 deadline while enhancing citizen protection.

Contact our compliance team to discuss how we can support your agency's transition to ICAO 2025 standards.
    `
  },
  "3": {
    id: 3,
    title: "RFID vs NFC: Choosing the Right Chip Technology for ID Cards",
    author: "Dr. Marcus Weber",
    date: "2025-01-10",
    category: "Technology",
    tags: ["RFID", "NFC", "Smart Cards"],
    readTime: "7 min",
    content: `
# RFID vs NFC: Choosing the Right Chip Technology for ID Cards

When designing secure government identification cards, one of the most critical decisions is selecting between RFID and NFC chip technology. While related, these technologies have distinct characteristics that make them suitable for different applications.

## Understanding the Technologies

### RFID (Radio-Frequency Identification)
RFID operates at various frequencies:
- **Low Frequency (LF)**: 125-134 kHz, range 10cm
- **High Frequency (HF)**: 13.56 MHz, range 10cm-1m
- **Ultra-High Frequency (UHF)**: 860-960 MHz, range up to 12m

### NFC (Near Field Communication)
NFC is a subset of HF RFID operating at 13.56 MHz with:
- Read range: Maximum 4cm (typically 1-2cm)
- Bi-directional communication
- Peer-to-peer capability
- Mobile device compatibility

## Key Differences

### Security
**RFID**: 
- Longer range can be a security vulnerability
- Susceptible to unauthorized scanning
- Requires additional encryption layers

**NFC**:
- Short range provides inherent security
- Difficult to intercept communication
- Built-in encryption protocols
- Mutual authentication support

### Use Cases

**RFID Best For**:
- Building access control
- Vehicle identification
- Supply chain tracking
- Large-area monitoring

**NFC Best For**:
- Payment systems
- Passport and visa verification
- Mobile device authentication
- Secure data exchange

## Implementation Considerations

### Cost Analysis
- **RFID Tags**: $0.10 - $5.00 per unit
- **NFC Chips**: $0.50 - $10.00 per unit
- **Readers**: RFID ($100-$500), NFC ($50-$200)

### Infrastructure Requirements
Government agencies must consider:
- Existing reader infrastructure
- Mobile compatibility needs
- International standards compliance
- Future scalability

## Our Recommendation

For government ID cards, we typically recommend **NFC technology** because:

1. **Enhanced Security**: Short read range prevents unauthorized scanning
2. **International Standards**: Compatible with ICAO and ISO requirements
3. **Mobile Integration**: Citizens can use smartphones for verification
4. **Future-Proof**: Supports emerging authentication methods
5. **Privacy Protection**: Difficult to track individuals without consent

However, RFID may be appropriate for:
- Long-range access control systems
- Vehicle registration plates
- Inventory management
- Non-sensitive applications

## Hybrid Solutions

Some advanced ID systems use both:
- NFC for primary authentication
- RFID for building access
- Different security levels for different applications

## Conclusion

The choice between RFID and NFC depends on your specific security requirements, infrastructure, and use cases. For most government ID applications, NFC provides the optimal balance of security, functionality, and future compatibility.

Our team can help you evaluate your needs and implement the right solution for your agency.
    `
  }
};

const BlogPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const post = id ? blogPostsData[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </Card>
      </div>
    );
  }

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
            <button onClick={() => navigate("/apply")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Apply
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

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate("/blog")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <Badge variant="outline">{post.readTime}</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Article Actions */}
          <div className="flex gap-3 mb-8 pb-8 border-b border-border/40">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="space-y-6 text-foreground"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .split('\n')
                  .map((line: string) => {
                    // Convert markdown-style headers
                    if (line.startsWith('# ')) return `<h1 class="text-4xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2 class="text-3xl font-bold mt-8 mb-4">${line.slice(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3 class="text-2xl font-semibold mt-6 mb-3">${line.slice(4)}</h3>`;
                    
                    // Convert bold
                    if (line.match(/\*\*(.+?)\*\*/g)) {
                      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                    }
                    
                    // Convert lists
                    if (line.match(/^[-•]\s/)) return `<li class="ml-6">${line.slice(2)}</li>`;
                    if (line.match(/^\d+\.\s/)) return `<li class="ml-6">${line.slice(3)}</li>`;
                    if (line.startsWith('✓ ')) return `<li class="ml-6 flex items-start gap-2"><span class="text-primary">✓</span><span>${line.slice(2)}</span></li>`;
                    
                    // Regular paragraphs
                    if (line.trim() === '') return '<br />';
                    if (!line.startsWith('<')) return `<p class="text-muted-foreground leading-relaxed mb-4">${line}</p>`;
                    
                    return line;
                  })
                  .join('\n')
              }}
            />
          </div>

          {/* Tags Section */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/10">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.values(blogPostsData)
                .filter((p: any) => p.id !== post.id && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost: any) => (
                  <Card 
                    key={relatedPost.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50"
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  >
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">{relatedPost.category}</Badge>
                      <h4 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{relatedPost.author}</span>
                        <span>•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
