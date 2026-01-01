# Migrating Sections to Atomic Component Structure

> **For Content Managers**: Step-by-step guide to updating existing sections with the new Badge, Header, and Background components

**Date**: December 1, 2025  
**Status**: Active guidance for legacy content updates  
**Time per Section**: 3-5 minutes

---

## What Changed?

### Old Structure (Flat Fields)

```
Section:
├── heading: "My Section Title"
├── description: "Section description text"
└── [component-specific content]
```

### New Structure (Atomic Components)

```
Section:
├── Background (optional)
│   ├── backgroundStyle: "gradient" | "dots" | "grid" | "none"
│   ├── gradientFrom: color
│   └── gradientTo: color
├── Badge (optional)
│   ├── text: "Badge text"
│   └── variant: "default"
├── Header (required)
│   ├── heading: "My Section Title"
│   ├── description: "Section description text"
│   ├── headingSize: "large"
│   ├── showHeader: true
│   └── showDivider: true
└── [component-specific content]
```

---

## Why This Matters

**Benefits of Atomic Structure**:

- ✅ **Consistent styling** across all sections
- ✅ **Easy background changes** (gradient, dots, grid patterns)
- ✅ **Optional badges** for categorization
- ✅ **Standardized spacing** and dividers
- ✅ **Centralized updates** (change once, applies everywhere)

**Your Content is Safe**:

- ✅ All accordions, buttons, and items preserved
- ✅ Only adding new components (not replacing)
- ✅ Can update sections one at a time
- ✅ No data loss risk

---

## Field Mapping Quick Reference

| Old Field     | New Location                 | Component          |
| ------------- | ---------------------------- | ------------------ |
| `heading`     | `header.heading`             | Section Header     |
| `description` | `header.description`         | Section Header     |
| `title`       | `header.heading`             | Section Header     |
| `subTitle`    | `header.description`         | Section Header     |
| (new)         | `background.backgroundStyle` | Section Background |
| (new)         | `badge.text`                 | Section Badge      |

---

## Step-by-Step Migration Process

### Section 1: FAQ Section

**Location**: Contact page, Services page (wherever FAQ appears)

#### What You'll Update

- Add Background component (optional gradient/pattern)
- Add Badge component (optional "FAQ" label)
- Add Header component (required - contains heading/description)
- Accordions preserved automatically

#### Steps

1. **Open Strapi Content Manager**

   - Navigate to: Content Manager → Pages
   - Open page containing FAQ section
   - Scroll to FAQ section

2. **Add Background Component** (Optional)

   - Click "Add component" next to **background**
   - Select `shared.section-background`
   - Choose `backgroundStyle`:
     - `none`: No special background
     - `gradient`: Color gradient (requires gradientFrom/gradientTo)
     - `dots`: Dot pattern overlay
     - `grid`: Grid pattern overlay
   - If gradient selected:
     - Set `gradientFrom`: "cyan", "blue", "purple", etc.
     - Set `gradientTo`: "blue", "purple", "pink", etc.

3. **Add Badge Component** (Optional but recommended)

   - Click "Add component" next to **badge**
   - Select `shared.section-badge`
   - Set `text`: "FAQ" (or "Questions", "Help", etc.)
   - Leave `variant`: "default"

4. **Add Header Component** (REQUIRED)

   - Click "Add component" next to **header**
   - Select `shared.section-header`
   - Fill in fields:
     - `heading`: "Common Questions" (or your section title)
     - `description`: "Quick answers to questions you may have" (or your text)
     - `headingSize`: "large" (recommended)
     - `showHeader`: ✅ Checked
     - `showDivider`: ✅ Checked (adds line under header)

5. **Verify Accordions Preserved**

   - Check that accordion items still appear below
   - Question and answer text should be intact

6. **Save and Publish**
   - Click "Save" (top right)
   - Click "Publish" to make live

#### Visual Example

**Before**:

```
FAQ Section
├── heading: "Common Questions"
├── description: "Quick answers..."
└── accordions: [Q&A items]
```

**After**:

```
FAQ Section
├── background:
│   └── backgroundStyle: "none"
├── badge:
│   └── text: "FAQ"
├── header:
│   ├── heading: "Common Questions"
│   ├── description: "Quick answers..."
│   └── showDivider: true
└── accordions: [Q&A items preserved]
```

---

### Section 2: Final CTA Section

**Location**: Most pages (call-to-action sections)

#### What You'll Update

- Add Background (recommended: gradient)
- Add Badge (optional "Newsletter", "Subscribe", etc.)
- Add Header (required)
- CTA buttons preserved automatically

#### Steps

1. **Open page with Final CTA section**

2. **Add Background Component**

   - Select `shared.section-background`
   - Set `backgroundStyle`: "gradient"
   - Set `gradientFrom`: "purple"
   - Set `gradientTo`: "pink"
   - (Creates attractive gradient effect)

3. **Add Badge Component**

   - Select `shared.section-badge`
   - Set `text`: "Newsletter" (or "Subscribe", "Stay Connected")

4. **Add Header Component**

   - `heading`: "Stay Updated"
   - `description`: "Subscribe to our newsletter for product updates..."
   - `headingSize`: "large"
   - `showHeader`: ✅ Checked
   - `showDivider`: ❌ Unchecked (CTAs often don't need divider)

5. **Verify CTA Buttons Preserved**

   - Check button text, links, variants intact

6. **Save and Publish**

#### Recommended Gradients

| Purpose     | gradientFrom | gradientTo | Effect                      |
| ----------- | ------------ | ---------- | --------------------------- |
| Newsletter  | purple       | pink       | Vibrant, attention-grabbing |
| Get Started | cyan         | blue       | Professional, trustworthy   |
| Contact     | blue         | purple     | Approachable, modern        |
| Pricing     | pink         | orange     | Energetic, action-oriented  |

---

### Section 3: Feature Grid Section

**Location**: Home page, Features page

#### What You'll Update

- Add Background (recommended: dots or grid pattern)
- Add Badge (optional "Features", "Benefits", etc.)
- Add Header (required)
- Feature items preserved automatically

#### Steps

1. **Open page with Feature Grid**

2. **Add Background Component**

   - Select `shared.section-background`
   - Set `backgroundStyle`: "dots" (subtle pattern)
   - Alternative: "grid" for different texture

3. **Add Badge Component**

   - Set `text`: "Features" (or "Benefits", "Why Choose Us")

4. **Add Header Component**

   - Find old `title` field → copy text
   - Find old `subTitle` field → copy text
   - In Header:
     - `heading`: [paste title text] e.g., "Key Features"
     - `description`: [paste subTitle text] e.g., "Everything you need"
     - `headingSize`: "large"
     - `showHeader`: ✅
     - `showDivider`: ✅

5. **Verify Feature Items Preserved**

   - Check feature cards, icons, descriptions intact
   - Check `gridColumns` setting (2, 3, or 4 columns)

6. **Save and Publish**

---

### Section 4: Workflow Section

**Location**: Services page, About page

#### Updates Needed

- Add Background (optional)
- Add Badge (optional)
- Add Header (required)
- Workflow points preserved

#### Steps

1. **Add Background**

   - `backgroundStyle`: "gradient", "none", "dots", or "grid"
   - If gradient: choose complementary colors

2. **Add Badge**

   - `text`: "Process", "How It Works", "Our Approach"

3. **Add Header**

   - `heading`: "Our Workflow" (or your title)
   - `description`: "Step-by-step process..." (or your text)
   - `showDivider`: ✅

4. **Verify Workflow Points**

   - Check numbered steps preserved
   - Check icons displaying correctly

5. **Save and Publish**

---

## Testing After Migration

### Visual Checks

For each updated section:

- [ ] **Badge displays** above header (if added)
- [ ] **Header renders** with correct spacing
- [ ] **Background shows** (gradient/pattern if selected)
- [ ] **Component content intact** (accordions, buttons, items)
- [ ] **Spacing consistent** with other sections

### Functionality Checks

- [ ] **FAQ accordions** expand and collapse
- [ ] **CTA buttons** link to correct pages
- [ ] **Feature grid** displays in correct columns
- [ ] **Workflow steps** show in order

### Responsive Checks

- [ ] **Mobile (375px)**: Sections stack properly
- [ ] **Tablet (768px)**: Layout adjusts correctly
- [ ] **Desktop (1440px)**: Full width utilized

---

## Page-by-Page Migration Checklist

### Home Page

- [ ] Hero section (check if needs update)
- [ ] Feature Grid section
- [ ] Workflow section
- [ ] Testimonials section
- [ ] FAQ section
- [ ] Final CTA section

### Contact Page

- [ ] Contact form section
- [ ] FAQ section
- [ ] Final CTA section

### Services Page

- [ ] Services Grid section
- [ ] Workflow section
- [ ] FAQ section
- [ ] Final CTA section

### About Page

- [ ] Team section
- [ ] Workflow section
- [ ] Final CTA section

---

## Common Questions

### Q: Do I have to update all sections at once?

**A**: No! Update sections one page at a time, or even one section at a time. Your content remains functional during migration.

### Q: What if I skip adding Background or Badge?

**A**: That's fine! Only Header is required. Background and Badge are optional enhancements.

### Q: Can I change my mind after adding components?

**A**: Yes! You can edit Background, Badge, and Header anytime. Just click into the section and modify.

### Q: What happens to my old heading/description fields?

**A**: They remain in the database but won't display. Copy their content to the new Header component, then the old fields can be ignored.

### Q: How do I remove a gradient if I don't like it?

**A**: Edit the section, click into Background, change `backgroundStyle` from "gradient" to "none".

### Q: Can I preview changes before publishing?

**A**: Yes! Click "Save" (doesn't publish), then view your development site to see changes. When satisfied, click "Publish".

---

## Time Estimates

| Task                     | Time          |
| ------------------------ | ------------- |
| Single section migration | 3-5 minutes   |
| Single page (5 sections) | 15-25 minutes |
| Full site (20 sections)  | 60-90 minutes |

**Tip**: Start with your most visible page (usually Home) to see benefits immediately.

---

## Getting Help

### If Section Doesn't Display Correctly

1. **Check Header is added** (required component)
2. **Verify heading field filled** (not empty)
3. **Check showHeader is checked**
4. **Clear browser cache** (Ctrl+Shift+R)
5. **Check Strapi terminal** for errors

### If Background Doesn't Show

1. **Verify backgroundStyle selected** (not empty)
2. **If gradient**: Check both gradientFrom and gradientTo set
3. **Check browser console** for CSS errors
4. **Try different backgroundStyle** (dots/grid instead of gradient)

### If Badge Doesn't Appear

1. **Check badge text filled** (not empty)
2. **Verify badge component added** (not skipped)
3. **Check showHeader is checked** (badge only shows if header shown)

---

## Best Practices

### Background Patterns

- **Gradient**: Use for CTAs, hero sections (high visual impact)
- **Dots**: Use for feature grids, content sections (subtle texture)
- **Grid**: Use for technical sections, workflows (structured feel)
- **None**: Use for simple sections, text-heavy content (clean look)

### Badge Usage

- **Use badges for**: Categorization, navigation aids, section labels
- **Don't overuse**: 1-2 badges per page maximum
- **Keep text short**: 1-3 words ("FAQ", "Features", "Get Started")
- **Consistent naming**: Use same badge text for similar sections across pages

### Header Guidelines

- **Heading**: 3-7 words, action-oriented when possible
- **Description**: 1-2 sentences, clear value proposition
- **Dividers**: Use for content-heavy sections, skip for CTAs
- **Size**: "large" for main sections, "medium" for subsections

---

## Related Documentation

- [Component Development Workflow](/docs/04-components-workflow) - For developers creating new components
- [Atomic Architecture Guide](/docs/02-architecture-atomic-design-02-atomic-design-primer) - Understanding atomic design
- [Section Background Component](/docs/04-components-patterns-section-background) - Background options
- [Section Header Component](/docs/04-components-patterns-section-header) - Header configuration

---

## Summary

**What You Learned**:

- How to add Background, Badge, and Header components
- Where to migrate old heading/description fields
- How to test sections after migration
- Best practices for backgrounds and badges

**Next Steps**:

1. Start with your Home page
2. Migrate one section at a time
3. Test after each section
4. Repeat for other pages

**Time Investment**: ~60-90 minutes for full site migration  
**Benefit**: Consistent, professional sections with flexible styling options

---

**Last Updated**: December 11, 2025  
**Original File**: [POST_RECOVERY_CONTENT_FIXES.md](/docs/post_recovery_content_fixes) (root - to be archived)
