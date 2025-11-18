# Page Creation Workflow

**Purpose**: Standard operating procedure for creating pages in Strapi  
**Last Updated**: November 16, 2025  
**Status**: Production-Ready

---

## Overview

This document outlines the complete workflow for creating new pages in Strapi, including all automation steps, permission requirements, and verification checks.

---

## When to Use This Workflow

✅ **Use for**:

- Creating brand new pages (e.g., Contact, About, Services)
- Building marketing pages (Landing, Features, Pricing)
- Adding content pages (Blog posts, Case studies)

❌ **Don't use for**:

- Renaming existing pages (use rename workflow)
- Updating page content (use edit workflow)
- Deleting pages (use delete workflow)

---

## Complete Page Creation Process

### Step 1: Plan Your Page

**Before opening Strapi**, decide on:

```yaml
Page Structure:
  title: "Contact" # Display title
  slug: "contact" # URL slug (lowercase, no spaces)
  parent: null # Parent page (for nested pages)

Content Sections:
  - Hero section
  - Contact form
  - FAQ
  - Newsletter CTA

SEO Requirements:
  - Meta title
  - Meta description
  - Open Graph image
  - Keywords/focus
```

---

### Step 2: Create Page in Strapi

**Location**: Strapi Admin → Content Manager → Page → Create new entry

#### 2.1 Fill Required Metadata

```yaml
title: "Contact" # REQUIRED
breadcrumbTitle: "Contact" # Optional (defaults to title)
slug: "contact" # REQUIRED (lowercase, hyphenated)
fullPath: "" # LEAVE BLANK - auto-calculated by internal job
```

#### 2.2 Add SEO Component

Click "Add component" → Select `seo-utilities.seo`:

```yaml
metaTitle: "Contact Us | Your Company"
metaDescription: "Get in touch with our team. We respond within 24 hours."
canonicalURL: "https://yourdomain.com/contact"
metaRobots: "index, follow"

openGraph:
  - ogTitle: "Contact Us"
  - ogDescription: "Get in touch with our team."
  - ogImage: [Upload 1200x630px image]
  - ogType: "website"
```

#### 2.3 Build Content (Dynamic Zone)

Add components in order:

1. **Hero Section** (`sections.hero`)
2. **Contact Form** (`forms.contact-form`)
3. **FAQ** (`sections.faq`)
4. **Newsletter CTA** (`sections.final-cta-section`)

See content examples in `CONTACT_PAGE_DATA_BACKUP.md`

#### 2.4 Upload Images

- Hero image: 1200x800px (optimal)
- OG share image: 1200x630px (required)
- Alt text for all images (accessibility)

#### 2.5 Save Draft

Click **Save** button (do NOT publish yet)

---

### Step 3: Run Internal Jobs (CRITICAL)

**Location**: Content Manager → InternalJob

#### 3.1 Recalculate Full Paths

**Purpose**: Generates the full URL path for your new page

1. Click **"Recalculate all fullpaths"** button (top right of InternalJob list)
2. Wait for job to complete (status changes to "completed")
3. Go back to your page → Refresh
4. Verify `fullPath` field now shows `/contact`

**What this does**:

- Calculates nested paths (e.g., `/services/web-development`)
- Updates all pages in the database
- Ensures consistent URL structure

#### 3.2 Create Redirects (Only if needed)

**Skip this step for NEW pages** (like Contact)

Only run if:

- You renamed a page and want to redirect old URL
- You're migrating content from another path

---

### Step 4: Set Permissions (REQUIRED)

**Location**: Settings → Users & Permissions Plugin → Roles → Public

#### 4.1 Page Permissions

Enable public access to pages:

```
Page:
  ✅ find (list all pages)
  ✅ findOne (view single page)
```

**Why needed**: Without these, users get 404 on frontend

#### 4.2 Form Submission Permissions

If your page has forms, enable:

```
Contact-message: (for contact forms)
  ✅ create

Subscriber: (for newsletter forms)
  ✅ create
```

**Why needed**: Forms will return 403 Forbidden without this

#### 4.3 Save Permissions

Click **Save** button in top right

---

### Step 5: Publish Page

**Location**: Content Manager → Page → Your page

1. Click **Publish** button
2. Confirm publication
3. Page is now live!

---

### Step 6: Verification & Testing

#### 6.1 Frontend Checks

Visit `http://localhost:3000/contact` (or production URL)

**Visual Checks**:

- [ ] Page loads without errors
- [ ] All sections render correctly
- [ ] Images display properly
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Dark/light mode switching works
- [ ] Breadcrumbs show correct path

**Functional Checks**:

- [ ] Forms submit successfully
- [ ] Links work correctly
- [ ] Navigation includes new page
- [ ] FAQ accordion functions
- [ ] CTA buttons route correctly

#### 6.2 SEO Validation

View page source (`Ctrl+U` or `Cmd+U`):

- [ ] `<title>` tag present
- [ ] Meta description present
- [ ] Canonical URL correct
- [ ] Open Graph tags present
- [ ] Structured data (if applicable)

#### 6.3 Performance Testing

Run Lighthouse audit:

```bash
yarn lighthouse
```

Check scores:

- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 95

---

## Common Workflows

### Creating a Nested Page

Example: `/services/web-development`

1. Create parent page first: `services` (slug: `services`)
2. Run recalculate paths
3. Create child page: `Web Development` (slug: `web-development`)
4. Set parent: Select "Services" from dropdown
5. Run recalculate paths again
6. Result: fullPath becomes `/services/web-development`

### Creating a Sibling Page

Example: Adding `/about` alongside `/contact`

1. Create page with slug: `about`
2. Leave parent empty (root level)
3. Run recalculate paths
4. Result: fullPath becomes `/about`

---

## Troubleshooting

### Page Returns 404

**Causes**:

1. Page not published
2. Missing permissions (find/findOne)
3. Full path not calculated
4. Strapi not running

**Solutions**:

- Verify page status is "Published"
- Check Public role permissions
- Run recalculate paths job
- Restart Strapi if needed

### Form Submissions Fail (403)

**Cause**: Missing create permission for collection

**Solution**:

- Settings → Public role
- Find form collection (Contact-message, Subscriber)
- Enable `create` permission
- Save

### Full Path is Empty

**Cause**: Internal job not run

**Solution**:

- Go to InternalJob
- Click "Recalculate all fullpaths"
- Wait for completion
- Refresh page entry

### Images Don't Display

**Causes**:

1. Image not uploaded to Strapi Media Library
2. Wrong media field selected
3. Missing alt text

**Solutions**:

- Re-upload image to Media Library
- Select correct image in component
- Add alt text for accessibility

---

## Best Practices

### Development vs Production

**Development**:

- ✅ Create fresh pages instead of renaming
- ✅ Delete unused pages regularly
- ✅ Test thoroughly before production
- ❌ Don't worry about redirects

**Production**:

- ✅ Always create redirects when renaming
- ✅ Keep old pages as drafts temporarily
- ✅ Monitor 404 errors
- ✅ Use redirects for SEO preservation

### Naming Conventions

**Slugs**:

- Use lowercase
- Hyphenate multi-word slugs: `web-development`
- Avoid special characters
- Keep concise: `about` not `about-our-company-and-team`

**Titles**:

- Title case: `Contact Us`
- Be descriptive: `Web Development Services`
- Match breadcrumb navigation

### SEO Optimization

**Meta Titles**:

- 50-60 characters max
- Include primary keyword
- Add brand name: `Contact | YourCompany`

**Meta Descriptions**:

- 150-160 characters max
- Compelling call-to-action
- Include secondary keywords
- No duplicate descriptions

**Canonical URLs**:

- Always absolute URLs: `https://yourdomain.com/contact`
- Match production domain
- No trailing slashes (unless required)

---

## Automation Features

### Auto-Generated Fields

The following fields are **automatically calculated** by Strapi:

1. **fullPath**:

   - Calculated by internal job
   - Based on slug + parent relationship
   - Updates when parent changes

2. **Redirects**:

   - Created when pages renamed
   - Links old URL → new URL
   - Permanent (301) by default

3. **Breadcrumbs**:
   - Generated from page hierarchy
   - Uses breadcrumbTitle or title
   - Starts from root (/)

### Internal Jobs

**RECALCULATE_FULLPATH**:

- Runs when: New page created, parent changed
- Trigger: Manual button in InternalJob
- Duration: 1-5 seconds
- Status: Check InternalJob collection

**CREATE_REDIRECT**:

- Runs when: Page slug/parent changes
- Trigger: Automatic or manual
- Duration: <1 second
- Result: New Redirect entry created

---

## Checklist: New Page Creation

Print this and check off as you go:

```
[ ] 1. Plan page structure and content
[ ] 2. Create page in Strapi Content Manager
[ ] 3. Fill required metadata (title, slug)
[ ] 4. Add SEO component
[ ] 5. Build content sections
[ ] 6. Upload and optimize images
[ ] 7. Save as draft
[ ] 8. Run "Recalculate all fullpaths" internal job
[ ] 9. Verify fullPath field populated
[ ] 10. Set Public permissions (find, findOne)
[ ] 11. Set form permissions if needed (create)
[ ] 12. Publish page
[ ] 13. Test on frontend (all devices)
[ ] 14. Verify SEO metadata in source
[ ] 15. Run Lighthouse performance audit
[ ] 16. Add to navigation/sitemap if needed
```

---

## Related Documentation

- **Contact Page Example**: `CONTACT_PAGE_DATA_BACKUP.md`
- **Component Guide**: `COMPONENT_DEVELOPMENT_GUIDE.md`
- **SEO Guide**: `docs/seo/SEO_BEST_PRACTICES.md`
- **Automation Strategy**: `docs/AUTOMATION-STRATEGY.md`
- **Styling Guide**: `STYLING_GUIDE.md`

---

## Quick Reference Commands

```bash
# Start development servers
yarn dev

# Run type generation (after schema changes)
yarn generate:types

# Run Lighthouse audit
yarn lighthouse

# Build for production
yarn build
```

---

## Support

**Issues with page creation?**

1. Check InternalJob status
2. Verify permissions are saved
3. Check Strapi logs for errors
4. Restart Strapi if needed
5. Clear browser cache

**Still stuck?**

- Review this document step-by-step
- Check related documentation
- Verify all checkboxes completed
- Test in incognito/private browsing

---

**Last Updated**: November 16, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready
