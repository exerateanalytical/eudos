# Authentic University Certificate Collection Guide

## Overview
This guide tracks the systematic collection and integration of authentic diploma certificates for all 513 universities.

## Current Status
- **Total Universities**: 513
- **Certificates Collected**: 40 (placeholder - need authentic images)
- **Completion**: 7.8%
- **Confidence Level**: 15% (AI-generated placeholders, not authentic)

## Folder Structure
```
src/assets/diploma-certificates/
├── tier-1/           # Top 100 universities (highest priority)
├── tier-2/           # Universities 101-300
└── tier-3/           # Colleges 301-513
```

## Image Requirements
- **Format**: PNG or JPG
- **Minimum Resolution**: 1200x900px
- **Quality**: High-resolution, clear text, authentic design
- **Source**: Official registrar samples, partnership materials, or physical specimens
- **Rights**: Must have explicit permission to display

## Collection Process (Per University)

### Step 1: Verify Partnership
- [ ] Confirm partnership agreement includes image usage rights
- [ ] Document source of certificate image
- [ ] Record permission/authorization

### Step 2: Obtain Certificate Image
**Option A**: From Partnership Materials
- Check provided assets from university partnership
- Verify it's the current diploma design

**Option B**: Official Registrar Website
- Visit university registrar website
- Look for sample diploma/certificate images
- Download highest quality available

**Option C**: Request from University
- Email registrar office
- Reference partnership agreement
- Request official sample diploma image

**Option D**: Physical Specimen Photography
- Use high-quality camera/scanner
- Ensure proper lighting and focus
- Remove any personal information

### Step 3: Quality Control
- [ ] Verify authenticity of design
- [ ] Check resolution meets minimum (1200x900px)
- [ ] Ensure clear, readable text
- [ ] Confirm no watermarks (unless official)
- [ ] Verify it's current diploma design (not outdated)

### Step 4: File Organization
- Save to appropriate tier folder
- Name format: `university-name.png` (lowercase, hyphens)
- Example: `src/assets/diploma-certificates/tier-1/harvard-university.png`

### Step 5: Code Integration
- Add import statement to `src/lib/diplomaCertificates.ts`
- Add mapping entry with all name variations
- Update `certificateStatus` in `src/lib/universityTiers.ts`
- Test display on `/diploma/university-name` page

## Priority Order

### Phase 1: Tier 1 (Top 100) - Weeks 1-2
Focus on highest-demand universities first.

**Top Priority (Week 1)**:
1. Harvard University
2. Stanford University
3. MIT
4. Princeton University
5. Yale University
... (continue with top 20)

### Phase 2: Tier 2 (101-300) - Weeks 3-4
Mid-tier universities with moderate demand.

### Phase 3: Tier 3 (301-513) - Weeks 5-6
Community colleges and smaller institutions.

## Legal Compliance Checklist
- [ ] Partnership agreement reviewed
- [ ] Image usage rights confirmed
- [ ] Disclaimer added to website
- [ ] Attribution documented
- [ ] Terms of Service updated
- [ ] Privacy policy reviewed

## Quality Assurance
Before marking any certificate as "complete":
1. Visual inspection by senior designer
2. Comparison with official university specimen
3. Legal team approval (if required)
4. Test display on live website
5. User feedback review

## Tracking Spreadsheet
Create a spreadsheet with columns:
- University Name
- Tier
- Status (Not Started / In Progress / Completed)
- Source (Partnership / Website / Request / Photo)
- File Path
- Date Added
- Verified By
- Notes

## Next Steps to Begin
1. **Upload Certificate Images**: Provide authentic certificate images from your university partnerships
2. **Organize by Tier**: Sort images into tier-1, tier-2, tier-3 folders
3. **Systematic Integration**: I'll import and map each certificate systematically
4. **Quality Check**: Verify each displays correctly
5. **Legal Review**: Ensure all compliance requirements met

## Contact for Images
**Please provide certificate images via**:
- Upload to chat (for batches of images)
- Specify university name and tier for each image
- Include source/permission documentation

---

**Current Confidence Level**: 15%  
**Target Confidence Level**: 95%+ (authentic, verified certificates with proper permissions)
