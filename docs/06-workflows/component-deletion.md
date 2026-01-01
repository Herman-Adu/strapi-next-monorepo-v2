# 🗑️ Component Deletion Workflow

> **THE COMPLETE, SYSTEMATIC PROCESS FOR REMOVING COMPONENTS**  
> Follow this guide to completely remove a component from Strapi and Frontend without leaving references, broken links, or orphaned data.

**Purpose:** Safely remove components when deprecating features, preparing client templates, or cleaning up unused code.

**Last Updated:** December 21, 2025

> **⚠️ IMPORTANT**: This workflow should be performed on a **feature branch**. All `git push origin main` commands in this document refer to the final step after creating and merging a PR. Follow [MANDATORY-WORKFLOW.md](./MANDATORY-WORKFLOW.md) for the complete branch → PR → merge process.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites & Safety Checks](#prerequisites--safety-checks)
3. [Phase 1: Strapi Backend Cleanup](#phase-1-strapi-backend-cleanup)
4. [Phase 2: Frontend Cleanup](#phase-2-frontend-cleanup)
5. [Phase 3: Database & Config Cleanup](#phase-3-database--config-cleanup)
6. [Phase 4: Validation & Testing](#phase-4-validation--testing)
7. [Complete Example Walkthrough](#complete-example-walkthrough)
8. [Advanced: Batch Component Removal](#advanced-batch-component-removal)

---

## 🎯 Overview

### The Golden Rule

**✅ ALWAYS COMPLETE CLEANUP IN THIS ORDER:**

```
Safety Audit → Backend Cleanup → Frontend Cleanup → Database Cleanup → Rebuild → Validate
```

### Why This Workflow Matters

- ❌ Deleting components randomly = Broken references, build errors, orphaned data
- ✅ Systematic deletion = Clean codebase, no broken references, safe database

### Component Deletion Phases

| Phase     | Focus                     | Time        | Critical? | Reversible? |
| --------- | ------------------------- | ----------- | --------- | ----------- |
| 0         | Safety Checks & Audit     | 10 min      | 🔴 YES    | ✅ Yes      |
| 1         | Strapi Backend Cleanup    | 15 min      | 🔴 YES    | ✅ Yes      |
| 2         | Frontend Cleanup          | 10 min      | 🟡 Medium | ✅ Yes      |
| 3         | Database & Config Cleanup | 5 min       | 🔴 YES    | ⚠️ Partial  |
| 4         | Validation & Testing      | 10 min      | 🔴 YES    | N/A         |
| **Total** | **Complete Removal**      | **~50 min** | -         | -           |

---

## ⚠️ Prerequisites & Safety Checks

**Before you delete ANYTHING, complete these checks:**

### ✅ Safety Checklist

```markdown
- [ ] **Backup database** (if component contains important content)
- [ ] **Check component usage** (is it used on any pages?)
- [ ] **Review dependencies** (do other components reference it?)
- [ ] **Commit current state** (create restore point)
- [ ] **Inform team** (if working in team environment)
- [ ] **Document reason** (why is this being removed?)
```

---

### Step 0.1: Backup Database (CRITICAL!)

**If component contains ANY user-created content, backup first!**

```powershell
# From monorepo root
cd apps\strapi
yarn backup:db

# Creates backup in database/backups/
# Format: backup_YYYY-MM-DD_HH-MM-SS.sql
```

**Verify backup created:**

```powershell
dir database\backups

# Should show new backup file
```

---

### Step 0.2: Audit Component Usage

**Check if component is actively used in Strapi:**

1. **Open Strapi Admin:** `http://localhost:1337/admin`
2. **Go to Content Manager** → **Page** (or other content types)
3. **Search for component usage:**
   - Open each page
   - Check if your target component appears in the Content section
   - Note which pages use it

**Document usage:**

```markdown
## Component Usage Audit

**Component:** sections.old-testimonials-section

**Used on:**

- ❌ Landing Page - Contains 12 testimonials (backup before delete!)
- ❌ About Page - Contains 3 testimonials (backup before delete!)

**Action Required:**

- Delete content manually before removing component
- OR export content to JSON for migration
```

---

### Step 0.3: Check Component Dependencies

**Search codebase for references:**

```powershell
# Search all files for component UID
findstr /s /i "old-testimonials-section" *.json *.ts *.tsx *.md

# Expected results (files you'll need to update):
# - apps/strapi/src/components/sections/old-testimonials-section.json
# - apps/strapi/src/api/page/content-types/page/schema.json
# - apps/strapi/src/documentMiddlewares/page.ts
# - apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.old-testimonials-section.json
# - apps/ui/src/components/page-builder/components/sections/StrapiOldTestimonialsSection.tsx
# - apps/ui/src/components/page-builder/index.tsx
```

**Document all files:**

```markdown
## Files Containing References

**Strapi:**

- Schema: `apps/strapi/src/components/sections/old-testimonials-section.json`
- Page Schema: `apps/strapi/src/api/page/content-types/page/schema.json`
- Populate Middleware: `apps/strapi/src/documentMiddlewares/page.ts`
- Config Sync: `apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.old-testimonials-section.json`

**Frontend:**

- Component: `apps/ui/src/components/page-builder/components/sections/StrapiOldTestimonialsSection.tsx`
- Component Map: `apps/ui/src/components/page-builder/index.tsx`

**Documentation:**

- `TEST_DATA_NEW_COMPONENTS.md` (mentions old testimonials)
```

---

### Step 0.4: Create Restore Point

**Commit current working state:**

```powershell
# From monorepo root (on feature branch)
git add .
git commit -m "chore: pre-cleanup snapshot before removing [component-name]" --no-verify
git push origin feature/remove-component-name
```

**Why this matters:**

- ✅ Easy rollback if something goes wrong
- ✅ Can cherry-pick specific files if needed
- ✅ Team can see what existed before deletion

---

## 🔧 Phase 1: Strapi Backend Cleanup

**Goal:** Remove ALL traces of component from Strapi backend

**Time:** ~15 minutes

**Deliverables:**

- ✅ Component schema deleted
- ✅ Component removed from dynamic zones
- ✅ Component removed from populate middleware
- ✅ Element components deleted (if orphaned)
- ✅ Strapi restarts successfully
- ✅ No TypeScript errors

---

### Step 1.1: Remove Component from Page Dynamic Zone

**⚠️ START HERE! If you delete the schema first, you'll get errors!**

**File:** `apps/strapi/src/api/page/content-types/page/schema.json`

**Before:**

```json
{
  "content": {
    "type": "dynamiczone",
    "components": [
      "sections.hero",
      "sections.benefits-section",
      "sections.old-testimonials-section", // ❌ REMOVE THIS LINE
      "sections.metrics-section",
      "forms.newsletter-form"
    ]
  }
}
```

**After:**

```json
{
  "content": {
    "type": "dynamiczone",
    "components": [
      "sections.hero",
      "sections.benefits-section",
      // ✅ Removed old-testimonials-section
      "sections.metrics-section",
      "forms.newsletter-form"
    ]
  }
}
```

**Critical:**

- ✅ Remove the entire line including the comma
- ✅ Fix comma placement (last item in array has no trailing comma)
- ✅ Save file

**⚠️ Strapi will auto-reload. Check terminal for errors!**

---

### Step 1.2: Remove from Populate Middleware

**File:** `apps/strapi/src/documentMiddlewares/page.ts`

**Find the component in `pagePopulateObject.content.on`:**

```typescript
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      "sections.hero": { ... },
      "sections.benefits-section": { ... },

      // ❌ REMOVE THIS ENTIRE BLOCK
      "sections.old-testimonials-section": {
        populate: {
          testimonials: {
            populate: {
              authorPhoto: { populate: { media: true } },
            },
          },
        },
      },

      "sections.metrics-section": { ... },
    },
  },
}
```

**After removal:**

```typescript
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      "sections.hero": { ... },
      "sections.benefits-section": { ... },
      // ✅ Removed old-testimonials-section populate
      "sections.metrics-section": { ... },
    },
  },
}
```

**Critical:**

- ✅ Remove entire key-value pair
- ✅ Fix comma placement
- ✅ Save file

**⚠️ TypeScript may show errors temporarily. This is expected until we delete the schema.**

---

### Step 1.3: Delete Component Schema File(s)

**⚠️ NOW you can delete the schema files!**

**Main Component Schema:**

```powershell
# From monorepo root
Remove-Item -Path "apps\strapi\src\components\sections\old-testimonials-section.json" -Confirm

# Confirm deletion when prompted
```

**If Component Uses Element Components:**

**Check if element components are ONLY used by this component:**

```powershell
# Search for element component references
findstr /s /i "testimonial-card" apps\strapi\src\components\*.json

# Results:
# - If ONLY found in old-testimonials-section.json → DELETE element
# - If found in OTHER component schemas → KEEP element (still in use)
```

**Delete orphaned element schemas:**

```powershell
# Example: Delete orphaned testimonial-card element
Remove-Item -Path "apps\strapi\src\components\elements\testimonial-card.json" -Confirm
```

---

### Step 1.4: Verify Strapi Restarts Successfully

**Check Strapi terminal output:**

```
[STRAPI] ✓ Reloading...
[STRAPI] ✓ Content-Type Builder: Loaded
[STRAPI] ✓ Server started
```

**✅ SUCCESS:** No errors, server running  
**❌ FAILURE:** Check error messages

**Common errors:**

```
Error: Unknown component "sections.old-testimonials-section"
→ Solution: You missed removing it from Page schema dynamic zone (Step 1.1)

Error: Cannot find module 'old-testimonials-section.json'
→ Solution: Lingering import somewhere, search for remaining references

TypeScript error: Type 'X' does not exist
→ Solution: Regenerate types (Step 1.5)
```

---

### Step 1.5: Regenerate Types

**After schema deletion, regenerate TypeScript types:**

```powershell
cd apps\strapi
yarn generate:types
```

**Expected output:**

```
✔ Types generated successfully
  Updated types/generated/contentTypes.d.ts
  Updated types/generated/components.d.ts
```

**Verify component type removed:**

```powershell
findstr /C:"old-testimonials-section" types\generated\*.d.ts

# Should return NO results
```

---

### Step 1.6: Check for TypeScript Errors

**Verify clean build:**

```powershell
cd apps\strapi
yarn type-check

# Should complete with no errors
```

**If errors appear:**

- Check for missed references in middleware
- Ensure all imports removed
- Regenerate types again if needed

---

### ✅ Phase 1 Checklist

Before moving to Phase 2:

- [ ] Component removed from Page dynamic zone (Step 1.1)
- [ ] Component removed from populate middleware (Step 1.2)
- [ ] Component schema file deleted (Step 1.3)
- [ ] Orphaned element schemas deleted (if applicable)
- [ ] Strapi restarted successfully (no errors)
- [ ] TypeScript types regenerated (Step 1.5)
- [ ] No TypeScript errors in Strapi backend

---

## 💻 Phase 2: Frontend Cleanup

**Goal:** Remove ALL traces of component from Next.js frontend

**Time:** ~10 minutes

**Deliverables:**

- ✅ Component React file(s) deleted
- ✅ Component removed from page-builder map
- ✅ Element components deleted (if orphaned)
- ✅ No TypeScript errors
- ✅ No import errors

---

### Step 2.1: Remove from Page Builder Component Map

**⚠️ START HERE! Remove registration before deleting files!**

**File:** `apps/ui/src/components/page-builder/index.tsx`

**Find the component mapping:**

```tsx
export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType<any>
} = {
  // ========================================
  // SECTIONS
  // ========================================
  "sections.hero": StrapiHeroSection,
  "sections.benefits-section": StrapiBenefitsSection,
  "sections.old-testimonials-section": StrapiOldTestimonialsSection, // ❌ REMOVE THIS LINE
  "sections.metrics-section": StrapiMetricsSection,

  // ========================================
  // ELEMENTS
  // ========================================
  "elements.testimonial-card": StrapiTestimonialCard, // ❌ REMOVE IF ORPHANED
}
```

**After removal:**

```tsx
export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType<any>
} = {
  // ========================================
  // SECTIONS
  // ========================================
  "sections.hero": StrapiHeroSection,
  "sections.benefits-section": StrapiBenefitsSection,
  // ✅ Removed old-testimonials-section
  "sections.metrics-section": StrapiMetricsSection,

  // ========================================
  // ELEMENTS
  // ========================================
  // ✅ Removed testimonial-card (if orphaned)
}
```

---

### Step 2.2: Remove Import Statements

**In the same file (`apps/ui/src/components/page-builder/index.tsx`):**

**Find and remove imports:**

```tsx
// ❌ REMOVE THIS IMPORT
import StrapiOldTestimonialsSection from "@/components/page-builder/components/sections/StrapiOldTestimonialsSection"

// ❌ REMOVE IF ELEMENT IS ORPHANED
import StrapiTestimonialCard from "@/components/page-builder/components/elements/StrapiTestimonialCard"
```

**After cleanup:**

```tsx
// Sections
import StrapiHeroSection from "@/components/page-builder/components/sections/StrapiHeroSection"
import StrapiBenefitsSection from "@/components/page-builder/components/sections/StrapiBenefitsSection"
// ✅ Removed old testimonials import
import StrapiMetricsSection from "@/components/page-builder/components/sections/StrapiMetricsSection"

// Elements
// ✅ Removed testimonial card import (if orphaned)
```

**Save file.**

---

### Step 2.3: Delete Component React File(s)

**Delete main section component:**

```powershell
# From monorepo root
Remove-Item -Path "apps\ui\src\components\page-builder\components\sections\StrapiOldTestimonialsSection.tsx" -Confirm
```

**Check if element components are orphaned:**

```powershell
# Search for usage in other components
findstr /s /i "StrapiTestimonialCard" apps\ui\src\components\*.tsx

# Results:
# - If ONLY found in StrapiOldTestimonialsSection.tsx → DELETE
# - If found in other components → KEEP (still in use)
```

**Delete orphaned element components:**

```powershell
Remove-Item -Path "apps\ui\src\components\page-builder\components\elements\StrapiTestimonialCard.tsx" -Confirm
```

---

### Step 2.4: Search for Remaining References

**Check for any missed imports or references:**

```powershell
# Search frontend codebase
findstr /s /i "OldTestimonial" apps\ui\src\*.tsx apps\ui\src\*.ts

# Should return NO results
# If results found, remove those references
```

---

### Step 2.5: Verify TypeScript Compilation

**Check for type errors:**

```powershell
cd apps\ui
yarn type-check

# Should complete with no errors
```

**Common errors:**

```
Cannot find module 'StrapiOldTestimonialsSection'
→ Solution: You missed removing an import statement

Property 'old-testimonials-section' does not exist
→ Solution: You missed removing from PageContentComponents map
```

---

### Step 2.6: Format Code

**Auto-format updated files:**

```powershell
# From monorepo root
yarn format
```

---

### ✅ Phase 2 Checklist

Before moving to Phase 3:

- [ ] Component removed from PageContentComponents map
- [ ] Import statements removed
- [ ] Component React file deleted
- [ ] Orphaned element files deleted (if applicable)
- [ ] No remaining references in codebase
- [ ] No TypeScript errors in frontend
- [ ] Code formatted

---

## 🗄️ Phase 3: Database & Config Cleanup

**Goal:** Clean database and config sync files

**Time:** ~5 minutes

**Deliverables:**

- ✅ Content using component deleted from database
- ✅ Config sync files removed
- ✅ Config sync exported
- ✅ Clean database state

---

### Step 3.1: Delete Content Using Component (In Strapi UI)

**⚠️ MANUAL STEP - Cannot be scripted!**

**For each page/content type using the component:**

1. Open Strapi Admin: `http://localhost:1337/admin`
2. Go to **Content Manager** → **Page**
3. Open page containing the old component
4. Scroll to **Content** section
5. Find the old component instance
6. Click **trash icon** to delete it
7. **Save** (Ctrl+S)
8. **Publish** (if page is published)
9. Repeat for all pages

**Expected behavior:**

- ⚠️ Component will show as "Unknown component" or render blank
- ✅ Deleting it removes data from database
- ✅ Save + Publish confirms deletion

**Alternative: Bulk Delete (Advanced)**

If you have many pages, use SQL:

```powershell
# Connect to database
cd apps\strapi
docker compose exec db psql -U strapi -d strapi

# Find component data
SELECT id, document_id FROM pages WHERE content::text LIKE '%old-testimonials-section%';

# CAUTION: Backup first! This is destructive!
# Delete component data from JSONB field
UPDATE pages
SET content = (
  SELECT jsonb_agg(elem)
  FROM jsonb_array_elements(content) elem
  WHERE elem->>'__component' != 'sections.old-testimonials-section'
)
WHERE content::text LIKE '%old-testimonials-section%';

# Exit
\q
```

**⚠️ SQL approach is risky! Only use if you have recent backup.**

---

### Step 3.2: Delete Config Sync Files

**Remove component configuration files:**

```powershell
# Remove section config
Remove-Item -Path "apps\strapi\config\sync\core-store.plugin_content_manager_configuration_components##sections.old-testimonials-section.json" -Confirm

# Remove element configs (if orphaned)
Remove-Item -Path "apps\strapi\config\sync\core-store.plugin_content_manager_configuration_components##elements.testimonial-card.json" -Confirm
```

**Verify files deleted:**

```powershell
dir apps\strapi\config\sync | findstr "old-testimonials"

# Should return NO results
```

---

### Step 3.3: Export Config Sync

**Synchronize database with filesystem:**

1. Open Strapi Admin: `http://localhost:1337/admin`
2. Go to **Settings** → **Config Sync**
3. Click **"Export"** button
4. Wait for success message

**What this does:**

- ✅ Removes deleted component configs from sync directory
- ✅ Ensures database and files are in sync
- ✅ Prepares clean state for Git commit

**Check for differences:**

- Click **"Diff"** button
- **Expected:** "No differences between DB and sync directory"
- **If differences exist:** Review and export again

---

### Step 3.4: Verify Clean Database State

**Check Content Manager:**

1. Go to **Content Manager** → **Page**
2. Open any page
3. Click **"Add a component"**
4. **Verify:** Old component NOT in picker
5. ✅ SUCCESS: Component fully removed

**Check Content-Type Builder:**

1. Go to **Content-Type Builder**
2. Expand **Components** → **Sections** (or Elements)
3. **Verify:** Old component NOT listed
4. ✅ SUCCESS: Component schema removed

---

### ✅ Phase 3 Checklist

Before moving to Phase 4:

- [ ] All content using component deleted (manually in Strapi UI)
- [ ] Config sync files deleted
- [ ] Config sync exported
- [ ] No differences between DB and sync directory
- [ ] Component not visible in Content Manager picker
- [ ] Component not visible in Content-Type Builder

---

## 🧪 Phase 4: Validation & Testing

**Goal:** Confirm component fully removed and system working

**Time:** ~10 minutes

**Deliverables:**

- ✅ Clean build (no errors)
- ✅ Strapi running without errors
- ✅ Frontend running without errors
- ✅ No broken pages
- ✅ Changes committed to Git

---

### Step 4.1: Rebuild Strapi (MANDATORY!)

**⚠️ CRITICAL: Full rebuild to validate changes**

```powershell
cd apps\strapi
yarn build

# Wait for completion
# ✅ "Done in X.XXs" = Success
# ❌ Errors = STOP, FIX, RE-RUN
```

**Why this is non-negotiable:**

- Schema changes require full rebuild
- Dev mode may hide errors
- Build validates all integrations

---

### Step 4.2: Rebuild Frontend (MANDATORY!)

```powershell
cd apps\ui
yarn build

# Wait for completion
# ✅ "Done in X.XXs" = Success
# ❌ Errors = STOP, FIX, RE-RUN
```

---

### Step 4.3: Test Strapi Admin

**Start Strapi:**

```powershell
cd apps\strapi
yarn develop
```

**Check Strapi Admin:**

1. Open: `http://localhost:1337/admin`
2. Go to **Content Manager** → **Page**
3. Open existing pages
4. **Verify:** No "Unknown component" errors
5. **Verify:** No broken layouts
6. Create new page → Add component → Verify old component NOT in picker

**✅ SUCCESS:** Everything works, no errors

---

### Step 4.4: Test Frontend

**Start Next.js:**

```powershell
cd apps\ui
yarn dev
```

**Check Frontend:**

1. Open: `http://localhost:3000`
2. Navigate to pages that USED to have the component
3. **Verify:** Pages render correctly
4. **Verify:** No console errors (F12 → Console tab)
5. **Verify:** No layout breaks

**✅ SUCCESS:** All pages render without errors

---

### Step 4.5: Search for Remaining References

**Final codebase sweep:**

```powershell
# From monorepo root
findstr /s /i "old-testimonials" *.json *.ts *.tsx *.md

# Expected results: ONLY documentation files (optional)
# - TEST_DATA_NEW_COMPONENTS.md (can update/remove)
# - README.md (can update/remove)

# Unexpected results: Code files still referencing component
# → Go back and remove those references
```

---

### Step 4.6: Update Documentation

**Clean up documentation files:**

**Files to check:**

- `TEST_DATA_NEW_COMPONENTS.md` - Remove component test data
- `COMPONENT_ARCHITECTURE.md` - Remove component mentions
- `README.md` - Update component lists
- Any component-specific guides

**Example edit:**

```markdown
<!-- Before -->

## Available Components

- Benefits Section
- Old Testimonials Section ❌ REMOVE THIS
- Metrics Section

<!-- After -->

## Available Components

- Benefits Section
- Metrics Section
```

---

### Step 4.7: Commit Changes (GREEN TICK WORKFLOW!)

**Only after builds pass:**

```powershell
# From monorepo root

# Check what changed
git status

# Format code
yarn format

# Stage all deletions and changes
git add .

# Commit with descriptive message
git commit -m "chore: remove old-testimonials-section component

- Removed from Strapi schema and dynamic zone
- Removed from populate middleware
- Deleted frontend component files
- Cleaned config sync files
- Updated documentation

Reason: Replaced with new atomic architecture testimonials section"

# Push to feature branch
git push origin feature/remove-old-testimonials

# Then create PR and merge to main
# See MANDATORY-WORKFLOW.md for PR process
```

**Commit Message Template:**

```
chore: remove [component-name] component

- Removed from Strapi schema and dynamic zone
- Removed from populate middleware
- Deleted frontend component files
- Cleaned config sync files
- Updated documentation

Reason: [Why component was removed]
```

---

### ✅ Phase 4 Checklist (FINAL!)

- [ ] Strapi builds successfully (green tick ✅)
- [ ] Frontend builds successfully (green tick ✅)
- [ ] Strapi admin works (no errors)
- [ ] Frontend renders correctly (no errors)
- [ ] No remaining code references (documentation only is OK)
- [ ] Documentation updated
- [ ] Changes committed to Git
- [ ] Pushed to GitHub

---

## 📖 Complete Example Walkthrough

Let's remove the **Old Marquee Section** component completely.

---

### Phase 0: Safety Checks (10 minutes)

**Step 0.1: Backup Database**

```powershell
cd apps\strapi
yarn backup:db
```

**Step 0.2: Audit Usage**

- Checked **Landing Page** → Uses new Marquee Section (safe to delete old)
- Checked **About Page** → No marquee (safe to delete)

**Step 0.3: Document Files**

```markdown
## Files to Update

**Strapi:**

- Schema: `apps/strapi/src/components/sections/old-marquee-section.json`
- Page Schema: `apps/strapi/src/api/page/content-types/page/schema.json`
- Populate: `apps/strapi/src/documentMiddlewares/page.ts`
- Config: `apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.old-marquee-section.json`

**Frontend:**

- Component: `apps/ui/src/components/page-builder/components/sections/StrapiOldMarqueeSection.tsx`
- Map: `apps/ui/src/components/page-builder/index.tsx`
```

**Step 0.4: Commit Restore Point**

```powershell
git add .
git commit -m "chore: snapshot before removing old-marquee-section" --no-verify
git push origin feature/remove-old-marquee
```

---

### Phase 1: Strapi Cleanup (15 minutes)

**Step 1.1: Remove from Page Schema**

Edit `apps/strapi/src/api/page/content-types/page/schema.json`:

```json
{
  "components": [
    "sections.hero",
    // Removed: "sections.old-marquee-section",
    "sections.benefits-section"
  ]
}
```

**Step 1.2: Remove from Populate**

Edit `apps/strapi/src/documentMiddlewares/page.ts`:

```typescript
// Removed entire block:
// "sections.old-marquee-section": {
//   populate: { logos: { populate: { media: true } } },
// },
```

**Step 1.3: Delete Schema File**

```powershell
Remove-Item -Path "apps\strapi\src\components\sections\old-marquee-section.json" -Confirm
```

**Step 1.4: Check Strapi Restart**

- Terminal shows successful reload ✅

**Step 1.5: Regenerate Types**

```powershell
cd apps\strapi
yarn generate:types
```

**Step 1.6: Verify No Errors**

```powershell
yarn type-check
# No errors ✅
```

---

### Phase 2: Frontend Cleanup (10 minutes)

**Step 2.1: Remove from Map**

Edit `apps/ui/src/components/page-builder/index.tsx`:

```tsx
// Removed:
// "sections.old-marquee-section": StrapiOldMarqueeSection,
```

**Step 2.2: Remove Import**

```tsx
// Removed:
// import StrapiOldMarqueeSection from "@/components/page-builder/components/sections/StrapiOldMarqueeSection"
```

**Step 2.3: Delete File**

```powershell
Remove-Item -Path "apps\ui\src\components\page-builder\components\sections\StrapiOldMarqueeSection.tsx" -Confirm
```

**Step 2.4: Search for References**

```powershell
findstr /s /i "OldMarquee" apps\ui\src\*.tsx
# No results ✅
```

**Step 2.5: Type Check**

```powershell
cd apps\ui
yarn type-check
# No errors ✅
```

**Step 2.6: Format**

```powershell
yarn format
```

---

### Phase 3: Database & Config Cleanup (5 minutes)

**Step 3.1: Delete Content (Strapi UI)**

- Opened Landing Page
- Found old marquee section instance
- Clicked trash icon
- Saved + Published

**Step 3.2: Delete Config File**

```powershell
Remove-Item -Path "apps\strapi\config\sync\core-store.plugin_content_manager_configuration_components##sections.old-marquee-section.json" -Confirm
```

**Step 3.3: Export Config Sync**

- Settings → Config Sync → Export
- Success message ✅
- Diff shows "No differences" ✅

**Step 3.4: Verify Clean State**

- Content Manager → Add component → Old marquee NOT in picker ✅
- Content-Type Builder → Components → Old marquee NOT listed ✅

---

### Phase 4: Validation (10 minutes)

**Step 4.1: Rebuild Strapi**

```powershell
cd apps\strapi
yarn build
# Done in 45.2s ✅
```

**Step 4.2: Rebuild Frontend**

```powershell
cd apps\ui
yarn build
# Done in 32.7s ✅
```

**Step 4.3: Test Strapi Admin**

- Started Strapi → No errors ✅
- Opened pages → No "Unknown component" ✅
- Tested component picker → Old marquee absent ✅

**Step 4.4: Test Frontend**

- Started Next.js → No errors ✅
- Opened Landing Page → Renders correctly ✅
- Console → No errors ✅

**Step 4.5: Search References**

```powershell
findstr /s /i "old-marquee" *.json *.ts *.tsx
# Only found in TEST_DATA_NEW_COMPONENTS.md (updated to remove)
```

**Step 4.6: Update Documentation**

- Removed old marquee from `TEST_DATA_NEW_COMPONENTS.md`

**Step 4.7: Commit**

```powershell
git add .
git commit -m "chore: remove old-marquee-section component

- Removed from Strapi schema and dynamic zone
- Removed from populate middleware
- Deleted frontend component files
- Cleaned config sync files
- Updated documentation

Reason: Replaced with new atomic architecture marquee section with multi-row support"
git push origin feature/remove-old-marquee

# Then create PR and merge to main (see MANDATORY-WORKFLOW.md)
```

**✅ COMPLETE: Old marquee section fully removed!**

---

## 🔄 Advanced: Batch Component Removal

**When removing multiple components at once (e.g., preparing client template):**

---

### Step 1: Create Removal List

**Document all components to remove:**

```markdown
## Components to Remove

**Marketing Demo Components (Remove for client):**

- sections.old-testimonials-section
- sections.old-marquee-section
- sections.demo-hero-section
- elements.demo-card

**Reason:** Preparing clean template for client deployment
```

---

### Step 2: Process in Order (Reverse Dependency)

**Order matters! Remove in this sequence:**

1. **Sections that USE elements** (delete first)
2. **Orphaned elements** (delete after sections)
3. **Independent sections** (delete anytime)

**Example order:**

```
1. sections.old-testimonials-section (uses elements.demo-card)
2. elements.demo-card (now orphaned)
3. sections.old-marquee-section (independent)
4. sections.demo-hero-section (independent)
```

---

### Step 3: Follow Workflow for Each Component

**For each component in the list:**

1. Complete Phase 0-4 for that component
2. Commit after EACH removal (separate commits)
3. Test after EACH removal
4. Don't batch delete! One at a time!

**Why separate commits?**

- ✅ Easy rollback if one deletion causes issues
- ✅ Clear history of what was removed
- ✅ Can cherry-pick specific removals if needed

---

### Step 4: Final Validation

**After removing ALL components:**

```powershell
# Full rebuild
cd apps\strapi
yarn build

cd apps\ui
yarn build

# Full test
yarn dev

# Search for any remaining demo references
findstr /s /i "demo" *.json *.ts *.tsx
```

---

## 🚨 Emergency Rollback

**If something breaks during deletion:**

---

### Option 1: Revert Last Commit

```powershell
# Undo last commit (keep changes in working directory)
git reset --soft HEAD~1

# OR: Undo last commit (discard changes)
git reset --hard HEAD~1

# Restore from backup
cd apps\strapi
yarn restore:db
```

---

### Option 2: Restore Specific Files

```powershell
# Restore schema file
git checkout HEAD~1 -- apps/strapi/src/components/sections/[component].json

# Restore frontend component
git checkout HEAD~1 -- apps/ui/src/components/page-builder/components/sections/[Component].tsx

# Restart Strapi
cd apps\strapi
yarn develop
```

---

### Option 3: Cherry-Pick from Snapshot

```powershell
# View snapshot commit
git log --oneline

# Find snapshot: "chore: snapshot before removing..."
git show [commit-hash]:[file-path]

# Restore individual files
git checkout [commit-hash] -- [file-path]
```

---

## 📊 Deletion Workflow Checklist

Print and use for each component deletion:

```markdown
## Component Deletion Checklist

**Component:** \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***

### Phase 0: Safety (10 min)

- [ ] Database backed up
- [ ] Component usage audited
- [ ] Dependencies documented
- [ ] Restore point committed

### Phase 1: Strapi Cleanup (15 min)

- [ ] Removed from Page dynamic zone
- [ ] Removed from populate middleware
- [ ] Schema file deleted
- [ ] Orphaned elements deleted
- [ ] Strapi restarted successfully
- [ ] Types regenerated
- [ ] No TypeScript errors

### Phase 2: Frontend Cleanup (10 min)

- [ ] Removed from component map
- [ ] Import removed
- [ ] Component file deleted
- [ ] Orphaned elements deleted
- [ ] No remaining references
- [ ] No TypeScript errors
- [ ] Code formatted

### Phase 3: Database & Config (5 min)

- [ ] Content deleted (Strapi UI)
- [ ] Config sync files deleted
- [ ] Config sync exported
- [ ] Clean database state verified

### Phase 4: Validation (10 min)

- [ ] Strapi builds successfully ✅
- [ ] Frontend builds successfully ✅
- [ ] Strapi admin tested (no errors)
- [ ] Frontend tested (no errors)
- [ ] No remaining code references
- [ ] Documentation updated
- [ ] Changes committed
- [ ] Pushed to GitHub

**Total Time:** **\_** minutes  
**Status:** ⬜ In Progress | ✅ Complete | ❌ Failed  
**Notes:** \***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***
```

---

## 🎓 Best Practices

### DO ✅

- **Always backup database first** (especially for components with user content)
- **Remove from dynamic zone BEFORE deleting schema** (prevents errors)
- **Commit after EACH component removal** (easy rollback)
- **Test after EACH removal** (catch issues early)
- **Document WHY component was removed** (future reference)
- **Update documentation** (keep docs in sync with code)
- **Use green tick workflow** (build before commit)

### DON'T ❌

- **Don't delete schema files first** (causes "Unknown component" errors)
- **Don't batch delete multiple components** (hard to debug if issues)
- **Don't skip backup** (can't undo data loss)
- **Don't skip builds** (errors may hide in dev mode)
- **Don't forget config sync** (UI will still show old configs)
- **Don't leave orphaned elements** (clutters codebase)
- **Don't skip documentation** (creates confusion for team)

---

## 🔮 Future Enhancements

**Planned Improvements:**

- **Automated deletion script** (PowerShell script to automate steps)
- **Pre-deletion validation** (check for broken references before delete)
- **Batch deletion support** (safe multi-component removal)
- **Component archive** (move to archive instead of delete)

---

## 📞 Quick Reference

**Most Common Deletion Scenario:**

```
Backup → Remove from dynamic zone → Remove from populate →
Delete schema → Regenerate types → Delete frontend files →
Remove from map → Delete config sync → Export sync →
Build → Test → Commit → Push
```

**Emergency Commands:**

```powershell
# Rollback last commit
git reset --hard HEAD~1

# Restore database
cd apps\strapi
yarn restore:db

# Restore specific file
git checkout HEAD~1 -- [file-path]
```

**Files Always Affected (Minimum):**

1. `apps/strapi/src/api/page/content-types/page/schema.json`
2. `apps/strapi/src/documentMiddlewares/page.ts`
3. `apps/strapi/src/components/[category]/[component].json`
4. `apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##[category].[component].json`
5. `apps/ui/src/components/page-builder/components/[category]/[Component].tsx`
6. `apps/ui/src/components/page-builder/index.tsx`

---

**Last Updated:** November 18, 2025  
**Version:** 1.0  
**Status:** ✅ Ready for Production Use

**Related Workflows:**

- `COMPONENT_DEVELOPMENT_GUIDE.md` - Creating components
- `COMPONENT_WORKFLOW.md` - Component modification
- `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` - Config sync operations
- `WORKFLOW_INDEX.md` - Workflow selection guide
