# Asset Import Checklist

## Current Status: VERIFICATION PHASE

### Phase 1: University Seals Audit ✅ IN PROGRESS

#### University Seal Files Status
**Total Universities**: 513 (across all countries)

**Import Structure Created**: ✅ Complete
- File: `src/lib/universitySeals.ts`
- Imports: 650+ seal imports defined
- Mapping: Complete with fallback logic

**Image Files Required**: 🔴 MISSING
- Directory: `src/assets/university-seals/`
- Status: Import statements exist but actual PNG files are NOT present
- Action Required: Upload all 513 university seal image files

#### Breakdown by Region:
1. **U.S. Universities**: ~385 seals
   - Top Tier (Ivy League, Top 50): Harvard, Stanford, MIT, Yale, etc.
   - State Universities: All major state systems
   - Community Colleges: Generic fallback available

2. **Canadian Universities**: ~80 seals
   - Major institutions: Toronto, McGill, UBC, etc.
   - University Colleges: Western affiliated colleges, etc.
   - Generic fallback: Available

3. **UK Universities**: ~20 seals
   - Russell Group: Oxford, Cambridge, Imperial, LSE, etc.

4. **German Universities**: ~15 seals
   - TU9 + major research universities

5. **French Universities**: ~13 seals
   - Grandes écoles and major universities

---

### Phase 2: Certification Provider Logos ✅ COMPLETE (Structure)

#### Certification Logo System Created
**File**: `src/lib/certificationLogos.ts` ✅ Created

**Total Providers Mapped**: 85+ organizations

#### Breakdown by Category:

1. **Project Management & Business** (12 providers)
   - ✅ PMI, AXELOS, Scrum Alliance, Scrum.org
   - ✅ ASQ, IASSC, IIBA, ICPM
   - ✅ APICS, ABPMP, Prosci, AMA

2. **IT & Cloud Computing** (14 providers)
   - ✅ Amazon (AWS), Microsoft (Azure), Google Cloud
   - ✅ Cisco, CompTIA, EC-Council
   - ✅ Offensive Security, ISC2, ISACA
   - ✅ CNCF, Red Hat, VMware
   - ✅ Salesforce, Oracle

3. **Healthcare & Medical** (20 providers)
   - ✅ NCSBN, NBME, GMC, RCP
   - ✅ AHA, Red Cross, NABP, ARRT
   - ✅ SOCRA, NBPHE, NCHEC, NAHQ
   - ✅ NCBDE, AAP, ONCC, AACN
   - ✅ BCEN, ASATT, AAMA, PTCB

4. **Finance & Accounting** (11 providers)
   - ✅ CFA Institute, AICPA, ACCA
   - ✅ CIMA, IMA, GARP (FRM)
   - ✅ AFP, PRMIA, IIA (CIA)
   - ✅ CFP Board

5. **Teaching & Language** (14 providers)
   - ✅ British Council, ETS, Cambridge Assessment
   - ✅ IELTS, telc, Goethe Institut
   - ✅ Alliance Française, JLPT
   - ✅ Instituto Cervantes, NCATE
   - ✅ NBCTS, NABTC, ACEI

6. **Engineering & Architecture** (6 providers)
   - ✅ NCARB, NCEBS, NCEES
   - ✅ NCQA, USGBC (LEED), RAB

7. **Law & Legal** (4 providers)
   - ✅ NCBE, NALS, NACM, IAALS

8. **Marketing & Media** (6 providers)
   - ✅ Google Ads, HubSpot, Hootsuite
   - ✅ Facebook Blueprint, AMA Marketing
   - ✅ Digital Marketing Institute

9. **Human Resources** (5 providers)
   - ✅ HRCI, SHRM, ATD, WDP

**Image Files Required**: 🔴 MISSING
- Directory: `src/assets/certification-logos/`
- Status: Mapping complete but PNG files NOT uploaded
- Total files needed: ~85 logo images

---

### Phase 3: Integration with Pages 🔴 PENDING

#### Files to Update:
1. ✅ `src/lib/certificationLogos.ts` - Created
2. 🔴 `src/pages/Certifications.tsx` - Needs logo integration
3. 🔴 `src/pages/CertificationDetail.tsx` - Needs logo display
4. 🔴 `src/components/CertificationCard.tsx` - Create new component with logo

---

## Action Items

### Immediate (This Week):
1. 🔴 **CRITICAL**: Upload all 513 university seal PNG files to `src/assets/university-seals/`
   - Format: PNG with transparent background
   - Size: Minimum 300x300px, ideally 500x500px
   - Naming: Match import statements (e.g., `harvard.png`, `stanford.png`)

2. 🔴 **CRITICAL**: Upload all 85 certification provider logos to `src/assets/certification-logos/`
   - Format: PNG with transparent background
   - Size: Minimum 200x200px, ideally 400x400px
   - Include: `generic-certification.png` for fallback

3. ✅ **COMPLETE**: Create certification logo mapping system

### Next Steps (Week 2):
4. 🔴 Integrate logos into Certifications page
5. 🔴 Create enhanced CertificationCard component
6. 🔴 Add logo display to CertificationDetail page
7. 🔴 Implement lazy loading for images
8. 🔴 Add error handling with fallbacks

### Quality Assurance (Week 3):
9. 🔴 Test all 513 university pages for seal display
10. 🔴 Test all 200+ certification pages for logo display
11. 🔴 Performance testing with all images
12. 🔴 Mobile responsiveness check
13. 🔴 Accessibility audit (alt text, ARIA)

---

## Image Specifications

### University Seals:
- **Format**: PNG (transparent background preferred)
- **Resolution**: 300x300px minimum, 500x500px ideal
- **Quality**: High-resolution, official university seal
- **Source**: University official websites (about/branding pages)

### Certification Logos:
- **Format**: PNG (transparent background preferred)
- **Resolution**: 200x200px minimum, 400x400px ideal
- **Quality**: Official provider branding
- **Source**: Provider official websites/press kits

### File Naming Convention:
- Lowercase with hyphens: `johns-hopkins.png`, `aws.png`
- Match import statement exactly
- No spaces or special characters

---

## Progress Tracking

**Last Updated**: Current Session

**Completion Status**:
- ✅ Phase 1: Seal mapping system (100%)
- ✅ Phase 2: Logo mapping system (100%)
- 🔴 Image Files: (0% - Need upload)
- 🔴 Integration: (0% - Pending images)
- 🔴 Testing: (0% - Pending integration)

**Overall Progress**: 40% (Structure complete, assets and integration pending)
