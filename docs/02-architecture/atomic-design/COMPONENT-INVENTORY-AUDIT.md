# Component Inventory & Atomic Mapping - Day 1 Audit

**Date**: November 21, 2025  
**Status**: ✅ COMPLETE - Backend Audit (46/46 components)  
**Auditor**: AI Agent + Herman  
**Next**: Frontend Component Audit → Gap Analysis → Phase 3 Refactoring

---

## 📊 Summary Statistics

### Strapi Components (Backend) - FULLY AUDITED ✅

- **Total Components**: 46/46 ✅
- **Atoms**: 3 (text-style, gradient-colors, orb-animation) + 3 from utilities = **6 total**
- **Molecules**: 13 (in elements/) + 4 from utilities + 2 forms = **19 total**
- **Organisms (Shared)**: 3 (section-header, section-badge, section-background)
- **Sections**: 16 (14 conformant, 2 non-conformant)
- **Special**: 5 SEO utilities + 1 ck-editor-content = **6 total**

### Middleware Verification Results

- ✅ **45/46 correct** (97.8% accuracy)
- 🐛 **1 bug found**: integration-grid-section missing `icon: true` populate
- ✅ **All media fields verified**: Proper populate patterns confirmed

### Folder Structure Issues Found

- ❌ **`elements/` folder** - Should be renamed to `molecules/` (13 components affected)
- ⚠️ **`utilities/` folder** - 7/8 components misclassified (need reclassification)
- ✅ **`atoms/`** - Correct atomic level (3 components)
- ✅ **`shared/`** - Contains organisms (3 components, correct)
- ✅ **`seo-utilities/`** - Separate folder (5 components, appropriate for special category)
- ✅ **`forms/`** - Separate folder (2 components, recommendation: keep separate)

### Atomic Pattern Conformance

- ✅ **14/16 sections follow atomic pattern** (87.5% conformance)
- ❌ **2 sections need refactoring**: hero-section, landing-hero-section (custom pattern, no shared organisms)
- 📋 **Atomic Pattern**: background (organism) + badge (organism) + header (organism) + content (molecules/organisms)

---

## 🧬 Strapi Components Detailed Inventory

### ATOMS (3 components) ✅ Correctly Placed

| Component           | Path                         | Attributes                                                                               | Used In                                | Issues | Middleware                         | Notes                                 |
| ------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- | ------ | ---------------------------------- | ------------------------------------- |
| **text-style**      | `atoms/text-style.json`      | textStyle (enum), gradientDirection (enum), customGradient (component → gradient-colors) | section-header, newsletter-cta-section | None   | Nested component populate required | ✅ Perfect atom - pure styling data   |
| **gradient-colors** | `atoms/gradient-colors.json` | 6 color fields (lightModeStart/Middle/End, darkModeStart/Middle/End)                     | text-style (nested)                    | None   | No relations (primitives only)     | ✅ Perfect atom - color picker values |
| **orb-animation**   | `atoms/orb-animation.json`   | enabled (bool), speed (enum), size (enum), color (string), blur (int)                    | section-badge                          | None   | No relations (primitives only)     | ✅ Perfect atom - animation config    |

**Atoms Assessment**: ✅ **EXCELLENT** - All three are true atoms (no composition, pure data)

---

### MOLECULES (Currently in "elements/" folder) ⚠️ FOLDER NAME WRONG

| Component                   | Path                                    | Atomic Level | Attributes                                                                              | Used In                                                 | Media Fields | Middleware Status                                        | Priority |
| --------------------------- | --------------------------------------- | ------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------ | -------------------------------------------------------- | -------- |
| **icon-button**             | `elements/icon-button.json`             | MOLECULE ✅  | label, href, icon (enum), variant (enum), newTab (bool)                                 | final-cta-section, newsletter-cta-section, landing-hero | None         | ✅ Primitives only                                       | KEEP     |
| **feature-card**            | `elements/feature-card.json`            | MOLECULE ✅  | icon (string), title (string), description (text)                                       | feature-grid-section, benefits-section                  | None         | ✅ Primitives only                                       | KEEP     |
| **testimonial-card**        | `elements/testimonial-card.json`        | MOLECULE ✅  | quote, authorName, authorRole, authorCompany, authorImage (component), rating, featured | testimonials-section                                    | authorImage  | ✅ CORRECT: `authorImage: { populate: { media: true } }` | KEEP     |
| **integration-card**        | `elements/integration-card.json`        | MOLECULE ✅  | title, icon (media), description, category (enum), link, linkText, newTab               | integration-grid-section                                | icon         | 🐛 **BUG**: Missing `icon: true` populate                | KEEP     |
| **partner-card**            | `elements/partner-card.json`            | MOLECULE ✅  | name, logo (media), description, link, linkText, newTab                                 | partner-showcase-section                                | logo         | ✅ CORRECT: `logo: true`                                 | KEEP     |
| **stat-card**               | `elements/stat-card.json`               | MOLECULE ✅  | number (string), description (string)                                                   | metrics-section                                         | None         | ✅ Primitives only                                       | KEEP     |
| **list-item**               | `elements/list-item.json`               | MOLECULE ✅  | title, description, iconType (enum)                                                     | newsletter-cta-section, benefits-section, roadmap       | None         | ✅ Primitives only                                       | KEEP     |
| **company-logo**            | `elements/company-logo.json`            | MOLECULE ✅  | name (string), image (media, optional)                                                  | Credibility section                                     | image        | ✅ CORRECT: `image: true` (via populate)                 | KEEP     |
| **footer-item**             | `elements/footer-item.json`             | MOLECULE ✅  | title (string), links (component → utilities.link)                                      | Footer                                                  | None         | ✅ CORRECT: `links: true`                                | KEEP     |
| **marquee-logo**            | `elements/marquee-logo.json`            | MOLECULE ✅  | image (media), name, link, newTab, showBackground, altText                              | marquee-section                                         | image        | ✅ CORRECT: `image: true`                                | KEEP     |
| **marquee-review**          | `elements/marquee-review.json`          | MOLECULE ✅  | name, username, avatar (media), body, rating                                            | marquee-section                                         | avatar       | ✅ CORRECT: `avatar: true`                               | KEEP     |
| **marquee-testimonial**     | `elements/marquee-testimonial.json`     | MOLECULE ✅  | author, role, company, avatar (media), quote, rating                                    | marquee-section                                         | avatar       | ✅ CORRECT: `avatar: true`                               | KEEP     |
| **marquee-testimonial-pro** | `elements/marquee-testimonial-pro.json` | MOLECULE ✅  | author, role, company, avatar (media), quote, rating (identical to marquee-testimonial) | marquee-section                                         | avatar       | ✅ CORRECT: `avatar: true`                               | KEEP     |

**Molecules Assessment**:

- ✅ **13 components total - ALL FULLY AUDITED**
- ⚠️ **CRITICAL**: Folder named `elements/` should be `molecules/`
- ✅ **Atomic Level**: All correctly identified as molecules
- 🐛 **1 MIDDLEWARE BUG FOUND**: integration-card missing `icon: true` populate
- ✅ **12/13 Middleware Correct**: All other populates verified

**Media Field Summary**:

- 7 components with media fields (integration-card, partner-card, company-logo, marquee-logo, marquee-review, marquee-testimonial, marquee-testimonial-pro)
- 1 component with nested component media (testimonial-card → authorImage → media)
- 6 components primitives only (icon-button, feature-card, stat-card, list-item, footer-item has component but no media)

**ACTION ITEM**:

1. Rename `elements/` → `molecules/` during refactoring
2. Fix middleware bug for integration-card

---

### ORGANISMS (Currently in "shared/" folder) ✅ Correctly Named

| Component              | Path                             | Composition                                                                                                                                                  | Used In      | Issues | Middleware                                                                       | Notes                                     |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------ | -------------------------------------------------------------------------------- | ----------------------------------------- |
| **section-header**     | `shared/section-header.json`     | heading, headingAccent, description, headingSize (enum), **textStyle (component)**, **descriptionTextStyle (component)**, alignment, showDivider, showHeader | ALL sections | None   | ✅ Nested populate required: `textStyle: { populate: { customGradient: true } }` | ✅ Perfect organism - composes atoms      |
| **section-badge**      | `shared/section-badge.json`      | text, icon, variant, size, alignment, **orbAnimation (component)**, pulse, showBadge                                                                         | ALL sections | None   | ✅ Nested populate required: `orbAnimation: true`                                | ✅ Perfect organism - composes atom       |
| **section-background** | `shared/section-background.json` | backgroundStyle (enum), pattern, gradient, containerStyle, containerWidth, padding                                                                           | ALL sections | None   | No relations (primitives only)                                                   | ✅ Perfect organism - pure styling config |

**Organisms Assessment**: ✅ **PERFECT** - All three compose atoms/molecules correctly

**Middleware Pattern**:

```typescript
header: {
  populate: {
    textStyle: { populate: { customGradient: true } },
    descriptionTextStyle: { populate: { customGradient: true } }
  }
},
badge: { populate: { orbAnimation: true } },
background: true // No nested populates needed
```

---

### SECTIONS (16 components) ✅ ALL FULLY AUDITED

| Component                    | Path                                      | Atomic Level | Composition Pattern                                                         | Background | Badge | Header | Content             | Middleware Status                                                                        | Priority |
| ---------------------------- | ----------------------------------------- | ------------ | --------------------------------------------------------------------------- | ---------- | ----- | ------ | ------------------- | ---------------------------------------------------------------------------------------- | -------- |
| **newsletter-cta-section**   | `sections/newsletter-cta-section.json`    | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + features + form + buttons) | ✅         | ✅    | ✅     | list-item + form    | ✅ CORRECT: All nested components populated                                              | KEEP     |
| **feature-grid-section**     | `sections/feature-grid-section.json`      | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + features)                  | ✅         | ✅    | ✅     | feature-card        | ✅ CORRECT: Primitives only                                                              | KEEP     |
| **final-cta-section**        | `sections/final-cta-section.json`         | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + subtitle + buttons)        | ✅         | ✅    | ✅     | icon-button         | ✅ CORRECT: Primitives only                                                              | KEEP     |
| **testimonials-section**     | `sections/testimonials-section.json`      | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + testimonials)              | ✅         | ✅    | ✅     | testimonial-card    | ✅ CORRECT: `testimonials: { populate: { authorImage: { populate: { media: true } } } }` | KEEP     |
| **workflow-section**         | `sections/workflow-section.json`          | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + steps)                     | ✅         | ✅    | ✅     | workflow-step       | ✅ CORRECT: `steps: { populate: { image: { populate: { media: true } } } }`              | KEEP     |
| **benefits-section**         | `sections/benefits-section.json`          | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + features + list)           | ✅         | ✅    | ✅     | feature-card + list | ✅ CORRECT: Primitives only                                                              | KEEP     |
| **faq-section**              | `sections/faq-section.json`               | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + accordion)                 | ✅         | ✅    | ✅     | accordions          | ✅ CORRECT: `accordion: true`                                                            | KEEP     |
| **hero-section**             | `sections/hero-section.json`              | SECTION ⚠️   | CUSTOM PATTERN ❌ (title + subtitle + features + buttons + media + trust)   | ❌         | ❌    | ❌     | Custom content      | ✅ CORRECT: Complex populates verified                                                   | REFACTOR |
| **landing-hero-section**     | `sections/landing-hero-section.json`      | SECTION ⚠️   | CUSTOM PATTERN ❌ (title + description + list + button + media)             | ❌         | ❌    | ❌     | Custom content      | ✅ CORRECT: Complex populates verified                                                   | REFACTOR |
| **horizontal-images**        | `sections/horizontal-images-section.json` | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + media)                     | ✅         | ✅    | ✅     | basic-image         | ✅ CORRECT: `media: { populate: { media: true } }`                                       | KEEP     |
| **image-with-cta-button**    | `sections/image-with-cta-button.json`     | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + media + buttons)           | ✅         | ✅    | ✅     | image + icon-button | ✅ CORRECT: `media: { populate: { media: true } }`                                       | KEEP     |
| **integration-grid-section** | `sections/integration-grid-section.json`  | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + integrations)              | ✅         | ✅    | ✅     | integration-card    | 🐛 **BUG**: Should be `integrations: { populate: { icon: true } }`                       | FIX BUG  |
| **marquee-section**          | `sections/marquee-section.json`           | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + marquee items)             | ✅         | ✅    | ✅     | 4 marquee variants  | ✅ CORRECT: All 4 variants populated correctly                                           | KEEP     |
| **metrics-section**          | `sections/metrics-section.json`           | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + stats)                     | ✅         | ✅    | ✅     | stat-card           | ✅ CORRECT: Primitives only                                                              | KEEP     |
| **partner-showcase-section** | `sections/partner-showcase-section.json`  | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + partners)                  | ✅         | ✅    | ✅     | partner-card        | ✅ CORRECT: `partners: { populate: { logo: true } }`                                     | KEEP     |
| **roadmap-section**          | `sections/roadmap-section.json`           | SECTION ✅   | ATOMIC PATTERN ✅ (background + badge + header + phases)                    | ✅         | ✅    | ✅     | roadmap-phase       | ✅ CORRECT: `phases: true`                                                               | KEEP     |

**Sections Assessment**:

- ✅ **16 components total - ALL FULLY AUDITED**
- ✅ **14/16 follow atomic pattern** (background + badge + header + content)
- ⚠️ **2 custom patterns**: hero-section, landing-hero-section (older implementations, need refactoring)
- 🐛 **1 MIDDLEWARE BUG**: integration-grid-section missing nested icon populate
- ✅ **15/16 Middleware Correct**: All other populates verified

**Atomic Pattern Conformance**:

- **Perfect conformance (14)**: newsletter-cta, feature-grid, final-cta, testimonials, workflow, benefits, faq, horizontal-images, image-with-cta-button, integration-grid, marquee, metrics, partner-showcase, roadmap
- **Non-conformance (2)**: hero-section, landing-hero-section (custom content structure, no shared organisms)

**Newsletter CTA Duplication Issue**:

- Has `header` component (section-header organism) ✅
- BUT ALSO has custom `heading` field (rich text) ⚠️
- DECISION NEEDED: Remove custom heading field, use header organism exclusively?

**ACTION ITEMS**:

1. Fix middleware bug for integration-grid-section
2. Refactor hero-section to atomic pattern (Day 2-9)
3. Refactor landing-hero-section to atomic pattern (Day 2-9)
4. DEFER: Newsletter CTA duplication (address during section refactoring)

---

### UTILITIES (8 components) ✅ ALL FULLY AUDITED ⚠️ NEED RECLASSIFICATION

| Component             | Path                               | Current Folder | Correct Atomic Level | Attributes                                               | Used In                             | Media Fields | Middleware Status                                      | Destination Folder |
| --------------------- | ---------------------------------- | -------------- | -------------------- | -------------------------------------------------------- | ----------------------------------- | ------------ | ------------------------------------------------------ | ------------------ |
| **basic-image**       | `utilities/basic-image.json`       | utilities/     | **MOLECULE**         | media (media), altText, aspectRatio, priority            | horizontal-images, workflow, others | media        | ✅ Via parent populate                                 | molecules/         |
| **link**              | `utilities/link.json`              | utilities/     | **ATOM**             | text (string), url (string), newTab (bool)               | footer-item, icon-button, others    | None         | ✅ Primitives only                                     | atoms/             |
| **image-with-link**   | `utilities/image-with-link.json`   | utilities/     | **MOLECULE**         | image (component → basic-image), link (component → link) | horizontal-images-section           | Nested       | ✅ Via parent populate                                 | molecules/         |
| **social-link**       | `utilities/social-link.json`       | utilities/     | **ATOM**             | platform (enum), url (string), ariaLabel (string)        | Footer, navbar                      | None         | ✅ Primitives only                                     | atoms/             |
| **text**              | `utilities/text.json`              | utilities/     | **ATOM**             | text (string), textStyle (component)                     | Various                             | None         | ✅ `textStyle: { populate: { customGradient: true } }` | atoms/             |
| **ck-editor-content** | `utilities/ck-editor-content.json` | utilities/     | **SPECIAL**          | content (rich text)                                      | Various                             | Embedded     | ⚠️ Rich text media handled by Strapi                   | utilities/ (KEEP)  |
| **accordions**        | `utilities/accordions.json`        | utilities/     | **MOLECULE**         | items (repeatable: question + answer)                    | faq-section                         | None         | ✅ Primitives only                                     | molecules/         |
| **links-with-title**  | `utilities/links-with-title.json`  | utilities/     | **MOLECULE**         | title (string), links (repeatable component → link)      | Footer                              | None         | ✅ `links: true`                                       | molecules/         |

**Utilities Assessment**:

- ✅ **8 components total - ALL FULLY AUDITED**
- ⚠️ **CRITICAL**: "Utilities" is not an atomic design level - folder name inappropriate
- ⚠️ **Classification breakdown**:
  - **3 ATOMS**: link, social-link, text → Move to `atoms/`
  - **4 MOLECULES**: basic-image, image-with-link, accordions, links-with-title → Move to `molecules/`
  - **1 SPECIAL**: ck-editor-content → Keep in `utilities/` (rich text handler)

**Reclassification Recommendations**:

1. **Move to atoms/** (3 components):

   - link (text + url + newTab)
   - social-link (platform + url + ariaLabel)
   - text (text + textStyle component)

2. **Move to molecules/** (4 components):

   - basic-image (media + altText + aspectRatio + priority)
   - image-with-link (combines basic-image + link)
   - accordions (question/answer pairs)
   - links-with-title (title + link list)

3. **Keep in utilities/** (1 component):
   - ck-editor-content (special rich text handler, not atomic)

**ACTION ITEM**: Reclassify utilities during Phase 3 refactoring (keep utilities/ folder for ck-editor-content only)

---

### FORMS (2 components) ✅ ALL FULLY AUDITED

| Component           | Path                         | Atomic Level | Attributes                                                             | Used In                | Media Fields | Middleware Status          | Decision                         |
| ------------------- | ---------------------------- | ------------ | ---------------------------------------------------------------------- | ---------------------- | ------------ | -------------------------- | -------------------------------- |
| **contact-form**    | `forms/contact-form.json`    | MOLECULE ✅  | title (string), description (text), gdprConsent (component → link)     | Contact page           | None         | ✅ `gdprConsent: true`     | KEEP forms/ folder (special cat) |
| **newsletter-form** | `forms/newsletter-form.json` | MOLECULE ✅  | title (string), description (text), gdprConsentLink (component → link) | Newsletter CTA section | None         | ✅ `gdprConsentLink: true` | KEEP forms/ folder (special cat) |

**Forms Assessment**:

- ✅ **2 components total - ALL FULLY AUDITED**
- ✅ **Both are molecules** (title + description + gdpr link)
- ✅ **Middleware correct**: Both populate gdpr link components
- ✅ **Recommendation**: Keep separate `forms/` folder (special category like `seo-utilities/`)

**Rationale for Separate Folder**:

- Forms have unique functionality (submissions, validation, integrations)
- Similar to SEO utilities (special purpose, not pure atomic design)
- Easier to locate and manage as separate category
- Only 2 components, not worth scattering

**DECISION MADE**: Keep `forms/` folder separate (not moving to molecules/)

---

### SEO UTILITIES (5 components) ✅ Separate Category OK

| Component        | Path                              | Purpose               | Issues | Priority |
| ---------------- | --------------------------------- | --------------------- | ------ | -------- |
| **seo**          | `seo-utilities/seo.json`          | Main SEO metadata     | None   | KEEP     |
| **seo-og**       | `seo-utilities/seo-og.json`       | Open Graph metadata   | None   | KEEP     |
| **seo-twitter**  | `seo-utilities/seo-twitter.json`  | Twitter Card metadata | None   | KEEP     |
| **meta-social**  | `seo-utilities/meta-social.json`  | Social metadata       | None   | KEEP     |
| **social-icons** | `seo-utilities/social-icons.json` | Social icon links     | None   | KEEP     |

**SEO Assessment**: ✅ Separate folder appropriate for SEO components

---

## 🔍 Critical Findings

### 🐛 MIDDLEWARE BUG FOUND

**Location**: `apps/strapi/src/documentMiddlewares/page.ts` (Line ~219)

**Current Code**:

```typescript
'sections.integration-grid-section': {
  populate: {
    background: true,
    badge: { populate: { orbAnimation: true } },
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },
        descriptionTextStyle: { populate: { customGradient: true } }
      }
    },
    integrations: true // ❌ BUG: Missing nested icon populate
  }
}
```

**Should Be**:

```typescript
'sections.integration-grid-section': {
  populate: {
    background: true,
    badge: { populate: { orbAnimation: true } },
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },
        descriptionTextStyle: { populate: { customGradient: true } }
      }
    },
    integrations: { populate: { icon: true } } // ✅ FIX: Nested icon populate
  }
}
```

**Reason**: `integration-card` component has `icon` field (media type) that needs explicit populate

**Impact**: Integration card icons not loading on frontend

**Priority**: HIGH - Fix immediately after audit completion

---

### ⚠️ FOLDER NAMING ISSUES

**1. `elements/` Folder Should Be `molecules/`**

- **Current**: `apps/strapi/src/components/elements/` (13 components)
- **Should Be**: `apps/strapi/src/components/molecules/`
- **Reason**: Atomic design terminology uses "molecules", not "elements"
- **Impact**: Confusing for developers, inconsistent with architecture docs
- **Action**: Rename folder during Phase 3 refactoring

**2. `utilities/` Folder Inappropriately Named**

- **Current**: `apps/strapi/src/components/utilities/` (8 components)
- **Should Be**: Components reclassified to proper atomic folders
- **Impact**: 7/8 components misplaced, only ck-editor-content should remain
- **Action**: Move components during Phase 3 refactoring (see reclassification table above)

---

### 📊 ATOMIC PATTERN CONFORMANCE

**Perfect Conformance (14 sections)**:

- newsletter-cta-section ✅
- feature-grid-section ✅
- final-cta-section ✅
- testimonials-section ✅
- workflow-section ✅
- benefits-section ✅
- faq-section ✅
- horizontal-images-section ✅
- image-with-cta-button-section ✅
- integration-grid-section ✅
- marquee-section ✅
- metrics-section ✅
- partner-showcase-section ✅
- roadmap-section ✅

**Non-Conformance (2 sections)**:

- hero-section ❌ (custom pattern: title + subtitle + features + buttons + media + trust)
- landing-hero-section ❌ (custom pattern: title + description + list + button + media)

**Atomic Pattern Definition**:

```
SECTION = background (organism) + badge (organism) + header (organism) + content (molecules/organisms)
```

**Why Non-Conformant Sections Need Refactoring**:

- Don't use shared organisms (background, badge, header)
- Have custom title/subtitle fields instead of header component
- Inconsistent with 87.5% of sections
- Harder to maintain and style consistently
- Priority for Phase 3 Days 2-9 refactoring

---

### ⚠️ NEWSLETTER CTA DUPLICATION

**Issue**: `newsletter-cta-section` has both:

1. `header` component (section-header organism) ✅ Correct atomic pattern
2. Custom `heading` field (rich text) ⚠️ Legacy duplication

**Schema Fields**:

```json
{
  "header": {
    "type": "component",
    "component": "shared.section-header"
  },
  "heading": {
    "type": "richtext"
  }
}
```

**Question**: Should we remove custom `heading` field and use `header` organism exclusively?

**Recommendation**: DEFER until section refactoring (Day 2-9) - verify frontend usage first

---

### 📈 AUDIT SUMMARY STATS

**Total Components Audited**: 46

**By Atomic Level**:

- **Atoms**: 3 (text-style, gradient-colors, orb-animation) + 3 from utilities (link, social-link, text) = **6 total**
- **Molecules**: 13 (in elements/ folder) + 4 from utilities (basic-image, image-with-link, accordions, links-with-title) + 2 forms = **19 total**
- **Organisms**: 3 (section-header, section-badge, section-background)
- **Sections**: 16 (14 conformant, 2 non-conformant)
- **Special**: 5 SEO utilities + 1 ck-editor-content = **6 total**

**Middleware Status**:

- ✅ **45/46 correct** (97.8% accuracy)
- 🐛 **1 bug found**: integration-grid-section missing icon populate

**Folder Reclassification Needed**:

- ⚠️ Rename `elements/` → `molecules/` (13 components)
- ⚠️ Reclassify `utilities/` (7 components move, 1 stays)
- ✅ Keep `forms/` separate (2 components, special category)
- ✅ Keep `seo-utilities/` separate (5 components, special category)

---

### 1. **Folder Naming Issues** ⚠️ HIGH PRIORITY

**Problem**: `elements/` folder should be `molecules/` per atomic design

**Impact**: Confusing terminology, doesn't match atomic design methodology

**Solution**: Rename `elements/` → `molecules/` during refactoring

**Components Affected**: All 13 components in elements/

---

### 2. **Middleware Populate Patterns** ⚠️ CRITICAL (From Nov 20 Bug)

**Verified Patterns**:

```typescript
// ✅ CORRECT - Nested component populate
header: {
  populate: {
    textStyle: { populate: { customGradient: true } },
    descriptionTextStyle: { populate: { customGradient: true } }
  }
},

// ✅ CORRECT - Simple component populate
badge: { populate: { orbAnimation: true } },

// ✅ CORRECT - Primitive fields only
background: true,

// ✅ CORRECT - Repeatable with nested components
testimonials: {
  populate: {
    authorImage: { populate: { media: true } }
  }
}
```

**To Verify**:

- ⚠️ testimonials-section → testimonial-card.authorImage populate
- ⚠️ All marquee section components
- ⚠️ Integration/partner/stat cards with potential media fields

---

### 3. **Newsletter CTA Section Duplication** ⚠️ MEDIUM PRIORITY

**Problem**: Has both `header` component AND custom `heading`, `headingAccent`, `headingTextStyle` fields

**Why**: Section needs different heading for newsletter form vs. section header

**Impact**: Duplication of heading logic, potential confusion

**Solutions**:

1. **Option A**: Keep both (section header + form header separate)
2. **Option B**: Refactor to single header with subheading field
3. **Option C**: Extract newsletter form to separate organism

**Recommendation**: ⏳ Defer decision until full section audit

---

## 📋 Next Steps

### ✅ IMMEDIATE ACTIONS (Before Frontend Audit)

1. **Fix Middleware Bug** (5 minutes)

   - File: `apps/strapi/src/documentMiddlewares/page.ts` (Line ~219)
   - Change: `integrations: true` → `integrations: { populate: { icon: true } }`
   - Test: yarn dev → Strapi admin → Integration grid section → Verify icon loads
   - Commit: "fix: add missing icon populate for integration-grid-section"

2. **Update Todo List** (1 minute)
   - Mark "Update audit document" as completed
   - Keep "Frontend component audit" as next in-progress

---

### 📊 PHASE 3 DAY 1 AFTERNOON - Frontend Component Audit

**Objective**: Map React components to Strapi schemas, identify gaps

**Tasks**:

1. **Read all Section Components** (`apps/ui/src/components/sections/`)

   - Verify atomic pattern conformance (background + badge + header + content)
   - Check Strapi data mapping correctness
   - Identify custom implementations needing extraction

2. **Read Shared/Organism Components** (`apps/ui/src/components/shared/`)

   - Verify section-header, section-badge, section-background implementations
   - Check consistency across sections

3. **Read Element/Molecule Components** (`apps/ui/src/components/elements/` or similar)

   - Map to Strapi molecules
   - Identify missing molecules (e.g., integration-card, partner-card not yet implemented)

4. **Gap Analysis**
   - List Strapi components without React implementations
   - List React components without Strapi schemas
   - Prioritize missing implementations for Phase 3

**Time Estimate**: 60-90 minutes

---

### 📝 PHASE 3 DAY 1 END OF DAY - Review & Planning

**Review**:

- ✅ Complete Strapi backend audit (46 components)
- ✅ Complete React frontend audit
- ✅ Gap analysis documented
- ✅ Middleware bug fixed

**Planning**:

- 📋 Prioritize refactoring work for Days 2-9
- 📋 Update Phase 3 plan with findings
- 📋 Assign components to refactoring days
- 📋 Prepare first refactoring task (Day 2 morning)

**Time Estimate**: 30 minutes

---

### 🔄 PHASE 3 DAYS 2-9 - Systematic Refactoring

**Priorities Based on Audit**:

1. **HIGH PRIORITY - Middleware Bug Fix** ✅ (DONE)
2. **HIGH PRIORITY - Hero Section Refactoring** (2 sections: hero, landing-hero)
3. **MEDIUM PRIORITY - Folder Renaming** (elements/ → molecules/, utilities/ reclassification)
4. **MEDIUM PRIORITY - Missing React Implementations** (integration-card, partner-card, stat-card, etc.)
5. **LOW PRIORITY - Newsletter CTA Duplication** (defer until section refactoring)

**Approach**: One component per day, test-driven, commit after each successful test

---

## 🎯 Questions for User Review

### 1. Folder Naming Decision

**Question**: Rename `elements/` → `molecules/` during refactoring?

**Context**:

- Atomic design terminology uses "molecules", not "elements"
- 13 components affected
- Requires Strapi schema path updates + git rename + middleware updates

**Recommendation**: ✅ YES - Rename for consistency with atomic design terminology

**Your Decision**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

### 2. Utilities Reclassification

**Question**: Reclassify 7 components from `utilities/` to proper atomic folders?

**Context**:

- 3 should move to `atoms/` (link, social-link, text)
- 4 should move to `molecules/` (basic-image, image-with-link, accordions, links-with-title)
- 1 stays in `utilities/` (ck-editor-content - special rich text handler)

**Recommendation**: ✅ YES - Reclassify during refactoring (keep utilities/ for ck-editor-content only)

**Your Decision**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

### 3. Forms Folder Decision

**Question**: Keep separate `forms/` folder or move to `molecules/`?

**Context**:

- Contact-form and newsletter-form are technically molecules
- Forms have special functionality (submissions, validation, integrations)
- Only 2 components, small category
- Similar to `seo-utilities/` (special purpose, not pure atomic design)

**Recommendation**: ✅ KEEP SEPARATE - Forms folder as special category (like SEO utilities)

**Your Decision**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

### 4. Newsletter CTA Duplication

**Question**: Should we remove duplicate heading fields from newsletter-cta-section?

**Context**:

- Has `header` component (section-header organism) ✅
- ALSO has custom `heading` field (rich text) ⚠️
- Duplication may be intentional (different heading for form vs section)

**Recommendation**: ⏸️ DEFER - Verify frontend usage first during section refactoring (Day 2-9)

**Your Decision**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

### 5. Hero Sections Refactoring Priority

**Question**: Prioritize hero-section and landing-hero-section refactoring in Phase 3?

**Context**:

- Only 2/16 sections don't follow atomic pattern
- High visibility (hero sections appear on most pages)
- Complex refactoring (need to extract organisms, update middleware, test thoroughly)

**Recommendation**: ✅ HIGH PRIORITY - Refactor in Days 2-4 (after middleware bug fix)

**Your Decision**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## 📚 Appendix: Audit Methodology

### How This Audit Was Conducted

**Step 1: Systematic Schema Reading**

- Read all 46 Strapi component JSON schemas
- Documented attributes, field types, and relationships
- Classified atomic levels (atoms, molecules, organisms, sections)

**Step 2: Middleware Verification**

- Cross-referenced schemas with `apps/strapi/src/documentMiddlewares/page.ts`
- Verified populate patterns for all nested components
- Checked media field populates (learned from Nov 20 middleware bug)
- Found 1 bug: integration-grid-section missing icon populate

**Step 3: Pattern Analysis**

- Identified atomic pattern: background + badge + header + content
- 14/16 sections follow pattern perfectly (87.5% conformance)
- 2 sections (hero, landing-hero) use custom pattern (need refactoring)

**Step 4: Classification & Recommendations**

- Assigned proper atomic levels to all components
- Identified folder naming issues (elements/ should be molecules/)
- Recommended utilities reclassification (spread across atoms/molecules)
- Documented gaps and priorities for Phase 3 refactoring

**Step 5: Documentation**

- Created comprehensive audit document with findings
- Prepared strategic questions for user review
- Outlined next steps for frontend audit and refactoring

---

## ✅ Audit Completion Checklist

- [x] Read all 3 atom schemas
- [x] Read all 13 molecule schemas (in elements/ folder)
- [x] Read all 3 organism schemas (in shared/ folder)
- [x] Read all 16 section schemas
- [x] Read all 8 utility schemas
- [x] Read all 2 form schemas
- [x] Verified middleware populate patterns for all components
- [x] Identified middleware bugs (1 found: integration-grid-section)
- [x] Classified all components by atomic level
- [x] Documented folder naming issues
- [x] Documented atomic pattern conformance
- [x] Prepared strategic questions for user review
- [x] Outlined next steps for frontend audit

**Total Components Audited**: 46/46 ✅

**Total Middleware Bugs Found**: 1 🐛

**Total Folder Naming Issues**: 2 ⚠️ (elements/ + utilities/)

**Next**: Frontend component audit (60-90 minutes) → Gap analysis → Phase 3 refactoring plan

---

_Last Updated: November 21, 2025 - Phase 3 Day 1 (Discovery & Audit)_

_Auditor: GitHub Copilot (Claude Sonnet 4.5)_

_Status: ✅ COMPLETE - Ready for user review & frontend audit_

- Classify each into proper atomic level
- Identify which need reclassification

4. ✅ **Frontend component audit** (map Strapi → React components)

5. ✅ **Gap analysis** (identify missing molecules/duplications)

---

## 🔄 Frontend Component Audit - React/Next.js Components

### Frontend Structure Overview

**Location**: `apps/ui/src/components/page-builder/`

```
page-builder/
├── atoms/
│   ├── OrbAnimation.tsx ✅
│   ├── TextStyle.tsx ✅
├── molecules/
│   ├── GDPRCheckbox/ ✅
│   ├── GlassmorphismCard/ ✅
│   └── TestimonialCard/ ✅
├── shared/ (organisms)
│   ├── SectionBadge.tsx ✅
│   ├── SectionHeader.tsx ✅
│   └── SectionWrapper.tsx ✅
├── components/
│   ├── elements/ (12 molecule components) ✅
│   ├── sections/ (15 section components) ✅
│   ├── utilities/ (5 utility components) ✅
│   └── forms/ (3 form components) ✅
└── single-types/ (navbar, footer) ✅
```

---

### Atomic Components Mapping (Frontend ↔ Strapi)

| Component Type | Strapi Backend                                          | React Frontend                                              | Status |
| -------------- | ------------------------------------------------------- | ----------------------------------------------------------- | ------ |
| **ATOMS**      | text-style, gradient-colors, orb-animation (3)          | TextStyle.tsx, OrbAnimation.tsx (2)                         | ✅     |
| **MOLECULES**  | 13 in elements/ + 4 from utilities + 2 forms (19 total) | 12 in elements/ + 3 in molecules/ + forms (15+)             | ⚠️     |
| **ORGANISMS**  | section-header, section-badge, section-background (3)   | SectionHeader.tsx, SectionBadge.tsx, SectionWrapper.tsx (3) | ✅     |
| **SECTIONS**   | 16 sections                                             | 15 section components                                       | ⚠️     |

---

### Section Components Audit

| Strapi Section            | React Component                  | Atomic Pattern | Status |
| ------------------------- | -------------------------------- | -------------- | ------ |
| newsletter-cta-section    | StrapiNewsletterCTASection.tsx   | ✅ Full        | ✅     |
| feature-grid-section      | StrapiFeatureGridSection.tsx     | ✅ Full        | ✅     |
| final-cta-section         | StrapiFinalCTASection.tsx        | ✅ Full        | ✅     |
| testimonials-section      | StrapiTestimonialsSection.tsx    | ✅ Full        | ✅     |
| workflow-section          | StrapiWorkflowSection.tsx        | ✅ Full        | ✅     |
| benefits-section          | StrapiBenefitsSection.tsx        | ✅ Full        | ✅     |
| faq-section               | StrapiFaq.tsx                    | ✅ Full        | ✅     |
| hero-section              | StrapiHero.tsx                   | ❌ Custom      | ⚠️     |
| landing-hero-section      | StrapiLandingHero.tsx            | ❌ Custom      | ⚠️     |
| horizontal-images-section | StrapiHorizontalImages.tsx       | ✅ Full        | ✅     |
| image-with-cta-button     | ❌ MISSING                       | N/A            | ❌     |
| integration-grid-section  | StrapiIntegrationGridSection.tsx | ✅ Full        | ✅     |
| marquee-section           | StrapiMarqueeSection.tsx         | ✅ Full        | ✅     |
| metrics-section           | StrapiMetricsSection.tsx         | ✅ Full        | ✅     |
| partner-showcase-section  | StrapiPartnerShowcaseSection.tsx | ✅ Full        | ✅     |
| roadmap-section           | StrapiRoadmapSection.tsx         | ✅ Full        | ✅     |

**Sections Assessment**:

- ✅ **14/16 sections fully implemented with atomic pattern**
- ⚠️ **2 sections use custom pattern** (hero, landing-hero) - need refactoring
- ❌ **1 section missing React component** (image-with-cta-button) - Phase 2 extraction not completed

---

### Molecule Components Audit

| Strapi Molecule (elements/) | React Component                      | Status | Notes                                   |
| --------------------------- | ------------------------------------ | ------ | --------------------------------------- |
| icon-button                 | StrapiIconButton.tsx                 | ✅     | Perfect atomic implementation           |
| feature-card                | StrapiFeatureCard.tsx                | ✅     | Perfect atomic implementation           |
| testimonial-card            | TestimonialCard/ (full molecule dir) | ✅     | Extracted during Phase 2, with tests    |
| integration-card            | StrapiIntegrationCard.tsx            | ✅     | ⚠️ Middleware bug fixed today           |
| partner-card                | StrapiPartnerCard.tsx                | ✅     | Perfect atomic implementation           |
| stat-card                   | StrapiStatCard.tsx                   | ✅     | Perfect atomic implementation           |
| list-item                   | StrapiListItem.tsx                   | ✅     | Perfect atomic implementation           |
| company-logo                | StrapiCompanyLogo.tsx                | ✅     | Perfect atomic implementation           |
| footer-item                 | ❌ MISSING                           | ❌     | Used in footer single-type, custom impl |
| marquee-logo                | StrapiMarqueeLogo.tsx                | ✅     | Perfect atomic implementation           |
| marquee-review              | StrapiMarqueeReview.tsx              | ✅     | Perfect atomic implementation           |
| marquee-testimonial         | StrapiMarqueeTestimonial.tsx         | ✅     | Perfect atomic implementation           |
| marquee-testimonial-pro     | StrapiMarqueeTestimonialPro.tsx      | ✅     | Perfect atomic implementation           |

**Additional React Molecules** (not in Strapi):

- GDPRCheckbox/ ✅ (extracted Phase 2, with tests)
- GlassmorphismCard/ ✅ (extracted Phase 2, with tests)
- BlogCard/ ✅ (future content type, with tests)

**Molecules Assessment**:

- ✅ **12/13 Strapi molecules have React implementations**
- ❌ **1 missing**: footer-item (used differently in footer single-type)
- ✅ **3 additional React molecules** extracted during Phase 2 (GDPRCheckbox, GlassmorphismCard, BlogCard)

---

### Utility Components Audit

| Strapi Utility (utilities/) | React Component (utilities/) | Atomic Level | Status | Notes                                 |
| --------------------------- | ---------------------------- | ------------ | ------ | ------------------------------------- |
| basic-image                 | StrapiBasicImage.tsx         | MOLECULE     | ✅     | Handles media field with Next Image   |
| link                        | StrapiLink.tsx               | ATOM         | ✅     | Simple link wrapper                   |
| image-with-link             | StrapiImageWithLink.tsx      | MOLECULE     | ✅     | Combines basic-image + link           |
| social-link                 | StrapiSocialLinks.tsx        | ATOM         | ✅     | Social media links                    |
| text                        | ❌ MISSING                   | ATOM         | ❌     | Not needed (native React rendering)   |
| ck-editor-content           | StrapiCkEditorContent.tsx    | SPECIAL      | ✅     | Rich text renderer                    |
| accordions                  | ❌ MISSING                   | MOLECULE     | ❌     | Used in FAQ, custom implementation    |
| links-with-title            | ❌ MISSING                   | MOLECULE     | ❌     | Used in footer, custom implementation |

**Utilities Assessment**:

- ✅ **5/8 utilities have React implementations**
- ❌ **3 missing**: text (not needed), accordions (custom FAQ impl), links-with-title (custom footer impl)
- ⚠️ **Utilities classification issue applies to frontend too** - should reclassify

---

### Form Components Audit

| Strapi Form (forms/) | React Component (forms/)                        | Status | Notes                                         |
| -------------------- | ----------------------------------------------- | ------ | --------------------------------------------- |
| contact-form         | StrapiContactForm.tsx                           | ✅     | Perfect atomic implementation                 |
| newsletter-form      | StrapiNewsletterForm.tsx + StrapiNewsletter.tsx | ✅     | 2 implementations (section + standalone form) |

**Forms Assessment**:

- ✅ **2/2 Strapi forms have React implementations**
- ⚠️ **Newsletter form has 2 implementations** - section-specific + standalone (design decision)

---

### Organism Components Audit

| Strapi Organism (shared/) | React Component (shared/) | Implementation Quality | Status |
| ------------------------- | ------------------------- | ---------------------- | ------ |
| section-header            | SectionHeader.tsx         | ✅ Excellent           | ✅     |
| section-badge             | SectionBadge.tsx          | ✅ Excellent           | ✅     |
| section-background        | SectionWrapper.tsx        | ✅ Excellent           | ✅     |

**Organisms Assessment**:

- ✅ **3/3 organisms perfectly implemented**
- ✅ **All use atomic atoms** (TextStyle, OrbAnimation)
- ✅ **Spacing architecture fully implemented** (background.padding → sectionGap)

---

### Frontend-Only Components (Not in Strapi)

**Elementary Components** (`apps/ui/src/components/elementary/`):

- Container.tsx ✅ (layout helper)
- Starfield.tsx ✅ (background effect for hero)
- ImageWithBlur.tsx, ImageWithFallback.tsx, ImageWithPlaiceholder.tsx ✅ (image optimization utilities)
- Various UI primitives (forms, data tables, date pickers, etc.)

**UI Components** (`apps/ui/src/components/ui/` - shadcn/ui):

- Complete shadcn/ui component library ✅
- Button, Input, Card, Dialog, Dropdown, etc.

**Standalone Section Components** (root `components/` - legacy?):

- benefits.tsx, company-marquee.tsx, credibility.tsx ⚠️
- features.tsx, final-cta.tsx, footer.tsx, header.tsx ⚠️
- hero.tsx, newsletter-section.tsx, review-card.tsx ⚠️
- roadmap-section.tsx, workflow-section.tsx ⚠️

**Question**: Are these legacy components still in use, or can they be removed? They seem duplicated by page-builder components.

---

## 📊 Gap Analysis - Strapi vs Frontend

### Missing React Implementations (Strapi → Frontend)

1. ❌ **image-with-cta-button-section** (Strapi section schema exists, no React component)

   - **Impact**: Cannot render this section type on frontend
   - **Priority**: LOW (may not be used in production)
   - **Action**: Verify usage, create component or deprecate schema

2. ❌ **footer-item** molecule (Strapi schema exists, no dedicated React component)

   - **Impact**: Footer uses custom implementation instead
   - **Priority**: LOW (footer works fine with current custom impl)
   - **Action**: Verify if extraction needed or deprecate schema

3. ❌ **text** utility (Strapi schema exists, no React component)

   - **Impact**: None - text rendering handled natively by React
   - **Priority**: NONE (not needed)
   - **Action**: Consider deprecating Strapi schema

4. ❌ **accordions** utility (Strapi schema exists, no dedicated React component)

   - **Impact**: FAQ section uses custom accordion implementation
   - **Priority**: MEDIUM (could extract for reusability)
   - **Action**: Extract AccordionList molecule from FAQ section

5. ❌ **links-with-title** utility (Strapi schema exists, no dedicated React component)
   - **Impact**: Footer uses custom implementation
   - **Priority**: LOW (footer works fine)
   - **Action**: Verify if extraction needed or deprecate schema

### Extra React Components (Frontend → Strapi)

1. ✅ **GDPRCheckbox** molecule (React only, no Strapi schema)

   - **Impact**: None - used as UI molecule, doesn't need Strapi schema
   - **Status**: Correct - UI-only molecule

2. ✅ **GlassmorphismCard** molecule (React only, no Strapi schema)

   - **Impact**: None - used as UI molecule, doesn't need Strapi schema
   - **Status**: Correct - UI-only molecule

3. ✅ **BlogCard** molecule (React only, no Strapi schema)

   - **Impact**: None - prepared for future blog content type
   - **Status**: Correct - future-ready component

4. ⚠️ **Standalone section components** in root `components/` (13 files)
   - **Impact**: Potential code duplication, maintenance burden
   - **Question**: Are these legacy? Can they be removed?
   - **Action**: Audit usage and remove if duplicated by page-builder

### Pattern Conformance Issues

**Backend (Strapi)**:

- ⚠️ 2/16 sections don't follow atomic pattern (hero, landing-hero)
- ⚠️ Folder naming wrong (elements/ should be molecules/)
- ⚠️ Utilities folder misclassified (7/8 components in wrong folder)

**Frontend (React)**:

- ✅ 14/16 sections follow atomic pattern perfectly
- ⚠️ 2/16 sections use custom pattern (hero, landing-hero) - match backend issues
- ✅ Organisms perfectly implemented with atomic composition
- ⚠️ Same folder naming issue (elements/ mirrors backend)
- ⚠️ Potential legacy components duplication

---

## 🎯 Critical Findings Summary

### ✅ Strengths

1. **Excellent Atomic Implementation**: 14/16 sections follow atomic pattern perfectly on both backend and frontend
2. **Perfect Organism Layer**: SectionHeader, SectionBadge, SectionWrapper flawlessly implemented with atomic composition
3. **Middleware Accuracy**: 97.8% (45/46 populates correct) - only 1 bug found and fixed today
4. **Component Coverage**: 90%+ of Strapi components have React implementations
5. **Phase 2 Extractions**: TestimonialCard, GDPRCheckbox, GlassmorphismCard extracted with tests and docs

### ⚠️ Issues Found

1. **Middleware Bug**: integration-grid-section missing icon populate ✅ **FIXED TODAY**
2. **Folder Naming**: elements/ should be molecules/ (backend + frontend both wrong)
3. **Utilities Misclassification**: 7/8 utilities in wrong folder (backend + frontend)
4. **Hero Sections**: 2 sections don't follow atomic pattern (hero, landing-hero)
5. **Missing Components**: image-with-cta-button section, footer-item, accordions, links-with-title
6. **Potential Duplication**: 13 standalone section components may be legacy duplicates

### 📋 Recommendations

**HIGH PRIORITY**:

1. ✅ Fix middleware bug (COMPLETED)
2. Refactor hero-section and landing-hero-section to atomic pattern
3. Audit standalone section components (remove if legacy)
4. Complete image-with-cta-button section extraction (if used)

**MEDIUM PRIORITY**:

5. Rename elements/ → molecules/ (backend + frontend)
6. Reclassify utilities into proper atomic folders
7. Extract AccordionList molecule from FAQ section
8. Decide on Newsletter CTA duplication

**LOW PRIORITY**:

9. Verify footer-item and links-with-title usage
10. Consider deprecating unused Strapi schemas (text utility)
11. Update all folder references in documentation

---

- ⏳ Sections audit partial (6/16 - 37%)
- ⏳ Utilities audit pending (0/8)
- ✅ SEO utilities reviewed (5/5)
- ⏳ Forms audit pending (0/2)

**Next**: Continue reading remaining schemas to complete Strapi audit

---

**Audit continues...**
