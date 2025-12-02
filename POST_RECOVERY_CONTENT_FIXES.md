# Post-Recovery Content Fixes

**Date**: December 1, 2025  
**Status**: ✅ Schemas updated - Ready for content fixes in Strapi  
**Priority**: Update sections to new atomic component structure

---

## 🎉 What's Done

- ✅ CkEditor section schema created (`sections.ckeditor`)
- ✅ CkEditor added to Page dynamic zone
- ✅ All section schemas already have atomic structure (background, badge, header)
- ✅ Strapi will auto-restart when you run `yarn dev` next

---

## Overview

After the database recovery, most content is intact but several sections need updating to use the new atomic component structure (badge, header, background) instead of the old flat fields (heading, description, title, subTitle).

**Good News**: The schemas are already correct! You just need to add the missing components to your existing content in Strapi.

---

## Sections Requiring Updates

### 1. FAQ Section (`sections.faq`)

**Current Structure** (Old - from backup):

```
❌ heading: "Common Questions"
❌ description: "Quick answers to questions you may have"
✅ accordions: [array of Q&A items]
```

**New Structure** (Atomic Components):

```yaml
Background:
  backgroundStyle: "none" | "gradient" | "dots" | "grid"
  gradientFrom: "cyan" (if gradient selected)
  gradientTo: "blue" (if gradient selected)

Badge:
  text: "FAQ"
  variant: "default"
  size: "default"

Header:
  heading: "Common Questions"
  description: "Quick answers to questions you may have"
  headingSize: "large"
  showHeader: true
  showDivider: true

Component (accordions):
  - question: "How quickly will I get a response?"
    answer: "We typically respond within 24 hours during business days (Monday-Friday)."

  - question: "What information should I include?"
    answer: "Please provide as much detail as possible about your inquiry..."

  [... remaining accordion items]
```

**How to Fix in Strapi**:

1. Open Content Manager → Pages → Contact (or any page with FAQ)
2. Scroll to FAQ section
3. Click "Add component" next to **background**
   - Choose `shared.section-background`
   - Set `backgroundStyle: "none"` (or choose gradient/dots/grid)
4. Click "Add component" next to **badge** (optional but recommended)
   - Choose `shared.section-badge`
   - Set `text: "FAQ"`
5. Click "Add component" next to **header** (REQUIRED)
   - Choose `shared.section-header`
   - Move old heading text: "Common Questions" → `heading` field
   - Move old description text: "Quick answers..." → `description` field
   - Set `headingSize: "large"`
   - Check `showHeader: true`
   - Check `showDivider: true`
6. **Accordions** should already be populated (preserved from backup)
7. Save Draft, then Publish

---

### 2. Final CTA Section (`sections.final-cta-section`)

**Current Structure** (Old):

```
❌ heading: "Stay Updated"
❌ description: "Subscribe to our newsletter..."
✅ ctaButtons: [array of CTA buttons]
```

**New Structure**:

```yaml
Background:
  backgroundStyle: "gradient"
  gradientFrom: "purple"
  gradientTo: "pink"

Badge:
  text: "Newsletter"
  variant: "default"

Header:
  heading: "Stay Updated"
  description: "Subscribe to our newsletter for product updates, tips, and industry insights."
  headingSize: "large"
  showHeader: true
  showDivider: false

Component (ctaButtons):
  - text: "Subscribe Now"
    href: "/newsletter"
    variant: "default"
    openInNewTab: false
```

**How to Fix**:

1. Open page with Final CTA section
2. Scroll to Final CTA section
3. Add **background** component:
   - `backgroundStyle: "gradient"`
   - `gradientFrom: "purple"`
   - `gradientTo: "pink"`
4. Add **badge** component:
   - `text: "Newsletter"`
5. Add **header** component:
   - `heading: "Stay Updated"`
   - `description: "Subscribe to our newsletter..."`
   - `headingSize: "large"`
   - `showHeader: true`
   - `showDivider: false`
6. **ctaButtons** should be preserved from backup
7. Save & Publish

---

### 3. Feature Grid Section (`sections.feature-grid-section`)

**Current Structure** (Old):

```
❌ title: "Key Features"
❌ subTitle: "Everything you need to succeed"
✅ items: [array of feature cards]
✅ listItems: [optional list]
✅ footerNote: "text"
✅ gridColumns: 3
```

**New Structure**:

```yaml
Background:
  backgroundStyle: "dots"
  gradientFrom: null
  gradientTo: null

Badge:
  text: "Features"
  variant: "default"

Header:
  heading: "Key Features"
  description: "Everything you need to succeed"
  headingSize: "large"
  showHeader: true
  showDivider: true

Component:
  items: [preserved from backup]
  listItems: [preserved from backup]
  footerNote: "text"
  gridColumns: 3
```

**How to Fix**:

1. Open page with Feature Grid section
2. Add **background**: `backgroundStyle: "dots"`
3. Add **badge**: `text: "Features"`
4. Add **header**:
   - Move `title` → `heading`
   - Move `subTitle` → `description`
5. **items**, **listItems**, **footerNote**, **gridColumns** preserved
6. Save & Publish

---

### 4. CkEditor Section (NEW - Needs Creation)

**Purpose**: House rich text content with just a background, no header needed.

**Structure**:

```yaml
Background:
  backgroundStyle: "none" | "gradient" | "dots" | "grid"
  gradientFrom: (optional)
  gradientTo: (optional)

Content:
  richTextContent: [CKEditor WYSIWYG content]
```

**Schema Location**:

- File: `apps/strapi/src/components/sections/ckeditor.json`
- Component name: `sections.ckeditor`

**Schema Definition**:

```json
{
  "collectionName": "components_sections_ckeditor",
  "info": {
    "displayName": "CkEditor",
    "description": "Rich text editor section with background only"
  },
  "options": {},
  "attributes": {
    "background": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-background"
    },
    "content": {
      "type": "richtext",
      "required": true
    }
  }
}
```

**How to Create** (if doesn't exist):

1. Create file: `apps/strapi/src/components/sections/ckeditor.json`
2. Add schema above
3. Restart Strapi: `Ctrl+C` then `yarn develop`
4. Go to Content-Type Builder → Page → Content (Dynamic Zone)
5. Add `sections.ckeditor` to allowed components
6. Save
7. Use in Content Manager → Add to page → Select CkEditor section

**How to Use**:

1. In Content Manager, add CkEditor section to page
2. Add **background** component (optional)
3. Fill **content** field with rich text
4. Save & Publish

---

## Quick Reference: Field Mapping

| Old Field     | New Location                 | Component                   |
| ------------- | ---------------------------- | --------------------------- |
| `heading`     | `header.heading`             | `shared.section-header`     |
| `description` | `header.description`         | `shared.section-header`     |
| `title`       | `header.heading`             | `shared.section-header`     |
| `subTitle`    | `header.description`         | `shared.section-header`     |
| N/A           | `background.backgroundStyle` | `shared.section-background` |
| N/A           | `badge.text`                 | `shared.section-badge`      |

---

## Page-by-Page Checklist

### Index Page (Home)

- [ ] FAQ section: Add background, badge, header
- [ ] Final CTA section: Add background, badge, header
- [ ] Feature Grid section: Add background, badge, header

### Contact Page

- [ ] FAQ section: Add background, badge, header
- [ ] Final CTA section: Add background, badge, header

### Features Page

- [ ] Feature Grid section: Add background, badge, header
- [ ] FAQ section (if exists): Add background, badge, header
- [ ] Final CTA section: Add background, badge, header

### Landing Page

- [ ] Any sections needing updates (check individually)

### Page 1 (Delete or Rename)

- [ ] Review if still needed
- [ ] Delete if obsolete
- [ ] Or rename and update content

---

## Testing After Each Fix

After updating each section:

1. **Visual Check**:

   - Badge displays above header (if added)
   - Header displays with correct spacing
   - Background renders correctly
   - Component content (accordions/buttons/items) intact

2. **Functionality Check**:

   - FAQ accordions expand/collapse
   - CTA buttons link correctly
   - Feature grid displays in correct columns
   - Rich text content renders properly

3. **Responsive Check**:
   - Mobile (375px): Stacks correctly
   - Tablet (768px): Adjusts layout
   - Desktop (1440px): Full width

---

## Expected Time

- **Per section**: 3-5 minutes
- **Total estimated**: 30-45 minutes (assuming 10-12 sections across all pages)

---

## Prevention: Schema Sync Going Forward

To prevent schema drift in future backups:

1. **Before major schema changes**:

   ```bash
   cd apps/strapi
   yarn strapi export --file export_pre_schema_change.tar.gz --no-encrypt
   ```

2. **After schema changes**:

   ```bash
   yarn strapi export --file export_post_schema_change.tar.gz --no-encrypt
   ```

3. **Document schema migrations** in `COMPONENT_ARCHITECTURE.md`

---

## Notes

- ✅ All component data (accordions, buttons, items) preserved from backup
- ✅ Only missing: New atomic components (background, badge, header)
- ✅ No data loss, just structural updates needed
- ✅ Contact page 2-column layout toggle still works 😊

---

**Ready to start?** Open Strapi Content Manager and work through the checklist above! 🚀
