# Conversation Continuation Guide

**PURPOSE:** This document restores conversation context if interrupted. Read this FIRST when starting a new chat to understand our collaboration patterns, architectural decisions, and current state.

---

## 🎯 Our Working Philosophy

### Core Principles

1. **Backend-First Workflow** (ALWAYS follow this order):

   - Modify Strapi schema (.json files)
   - Run `yarn strapi-types` (generate TypeScript)
   - Run `yarn build` in Strapi (regenerate admin)
   - Update frontend components
   - Test in CMS

2. **Deep Review Process**:

   - User asks question or provides requirement
   - Agent provides comprehensive analysis with options
   - User reviews and approves approach
   - Agent creates detailed Todo list
   - Agent implements step-by-step
   - Agent commits with clean checkpoint

3. **Maximum Customization**:

   - Everything should be CMS-controllable
   - No hardcoded values
   - Think future evolution and scalability
   - Separate concerns for maintainability

4. **Documentation-First**:
   - Every major feature documented
   - Clean, organized structure
   - Professional presentation for future dashboard/tutorials

---

## 🏗️ Project Architecture

### Technology Stack

**Backend:**

- Strapi v5.29.0 (Headless CMS)
- PostgreSQL database
- strapi-plugin-config-sync (schema versioning)
- TypeScript with strict mode

**Frontend:**

- Next.js 15.5.6 (App Router, Server Components)
- React 18
- TypeScript strict mode
- Tailwind CSS v4 with CSS custom properties
- Framer Motion v12.23.24 (animations)

**Monorepo:**

- Turborepo for build orchestration
- Yarn 1.22.x workspaces
- @repo/strapi, @repo/ui, @repo/shared-data packages

### Directory Structure

```
apps/
  strapi/
    src/
      components/
        elements/     # Reusable UI building blocks
        forms/        # Form components
        sections/     # Page section components
        shared/       # ⚠️ NEW: Reusable shared configs (future)
        seo-utilities/
        utilities/
      config/
        sync/         # Config-sync JSON files
      types/
        generated/    # Auto-generated TypeScript types

  ui/
    src/
      components/
        page-builder/
          components/
            elements/    # Strapi element renderers
            sections/    # Strapi section renderers
            utilities/   # Strapi utility renderers
          single-types/  # Navbar, Footer
        ui/              # shadcn/ui components
        elementary/      # Base UI components
```

---

## 🎨 Current Features (Committed State)

### Theme System

- **Themes:** default (green #16a34a), theme-adu-dev (orange)
- **Persistence:** localStorage with client/server sync
- **Components:** ThemeSwitcher.tsx, ThemeInitializer.tsx
- **Implementation:** CSS custom properties via Tailwind v4

### Orbiting Badge Animation

- **Component:** StrapiOrbitingBadge.tsx
- **Backend:** 8 CMS fields in metrics-section.json
  - badgeAnimation (boolean)
  - badgeAnimationSpeed (extra-slow/slow/medium/fast)
  - badgeOrbSize (small/medium/large)
  - badgeBorderRadius (sm/md/lg/full)
  - badgeOrbGlow (subtle/normal/intense)
  - badge (text)
  - badgeIcon (emoji or Lucide name)
  - badgeSize (small/medium/large)
- **Animation:** Framer Motion with SVG path (100 border points)
- **Theme-Aware:** Light (green), Dark (white)
- **Performance:** GPU-accelerated, ResizeObserver

### MetricsSection

- **Schema:** `apps/strapi/src/components/sections/metrics-section.json`
- **Customization:** 16 total fields
  - Badge (8 fields above)
  - heading, headingAccent, description
  - headingStyle (default/gradient/two-tone)
  - backgroundStyle (transparent/muted/theme-subtle/theme-muted)
  - containerStyle (default/bordered)
  - metrics (repeatable stat-card components)
- **Renderer:** StrapiMetricsSection.tsx

### MarqueeSection

- **Schema:** `apps/strapi/src/components/sections/marquee-section.json`
- **Features:** 18 fields, 4 content types (logos/testimonials/reviews)
- **Variants:** Classic testimonials, Pro testimonials (emerald accents)
- **Multi-row:** Up to 3 rows with alternating direction/speed
- **Responsive:** 3 rows desktop, 2 tablet, 1 mobile
- **Elements:** marquee-logo, marquee-testimonial, marquee-testimonial-pro, marquee-review
- **Renderer:** StrapiMarqueeSection.tsx

---

## 🚀 Next Major Task: Shared Components Refactoring

### The Problem

- Badge/background/heading customization locked in MetricsSection
- Every section wanting these features must duplicate 11+ fields
- Maintenance nightmare, type bloat, CMS clutter

### The Solution: Shared Components (Option 1 - APPROVED)

**Create 3 shared components:**

1. **shared/section-badge.json** (8 fields)

   - All badge customization fields
   - Reusable across ANY section

2. **shared/section-background.json** (2 fields)

   - backgroundStyle
   - containerStyle

3. **shared/section-header.json** (4 fields)
   - heading, headingAccent
   - headingStyle
   - description

**Usage Pattern:**

```json
{
  "attributes": {
    "badge": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-badge"
    },
    "header": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-header"
    },
    "background": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-background"
    }
    // ... section-specific fields
  }
}
```

**Frontend Pattern:**

```tsx
// Utility components
<SectionWrapper background={component.background}>
  <SectionHeader badge={component.badge} header={component.header} />
  {/* Section-specific content */}
</SectionWrapper>
```

### Migration Strategy (DATABASE SCRIPT - User Requested)

**Requirements:**

- Comprehensive planning and documentation
- Safe rollback plan
- Backup strategy (strapi-export.tar.gz)
- Test on dev environment first
- Clear folder structure for migration scripts

**Process:**

1. Create migration script
2. Test thoroughly on dev
3. Create strapi-export backup
4. Run migration
5. Verify data integrity
6. Document process

---

## 📚 Documentation Files (Current)

### Architecture & Development

- `COMPONENT_ARCHITECTURE.md` - Component structure and relationships
- `COMPONENT_DEVELOPMENT_GUIDE.md` - Step-by-step development process
- `COMPONENT_WORKFLOW.md` - Workflow patterns
- `DEVELOPMENT_WORKFLOW.md` - Development best practices
- `FILE_MAP.md` - Complete file organization
- `PROJECT_STATUS.md` - Current state and roadmap

### Feature Guides

- `BADGE_USAGE_GUIDE.md` - How to use orbiting badge system
- `THEME_SYSTEM_GUIDE.md` - Theme implementation and usage
- `MARQUEE_COMPONENT_GUIDE.md` - Marquee section documentation

### Reference

- `QUICK_REFERENCE.md` - Quick lookup for common patterns
- `DOCUMENTATION_SUMMARY.md` - Overview of all docs
- `TROUBLESHOOTING_PLAYBOOK.md` - Common issues and solutions

### Planning

- `TEST_DATA_NEW_COMPONENTS.md` - Test data for new features
- `REFACTORING_COMPONENTS_CHECKLIST.md` - Refactoring tasks
- `WORKFLOW_IMPROVEMENTS.md` - Process improvements

---

## 🔧 Common Commands

### Strapi

```powershell
# Generate TypeScript types
cd apps/strapi
yarn run generate:types

# Build admin panel
yarn build

# Start development
yarn develop

# Export database
yarn export:all
```

### UI

```powershell
# Build Next.js app
cd apps/ui
yarn build

# Development server
yarn dev
```

### Monorepo

```powershell
# Build all packages
yarn build

# Install dependencies
yarn install

# Format code
yarn format
```

---

## 🎯 User's Preferences & Patterns

### User Communication Style

- **Direct and decisive:** Provides clear requirements
- **Appreciative:** Acknowledges good work with "excellent", "amazing"
- **Detail-oriented:** Catches small issues (like orb color)
- **Strategic thinker:** Always considers future implications
- **Documentation-focused:** Wants everything well-documented

### Collaboration Patterns

1. User provides high-level requirement
2. Agent analyzes and presents options
3. User reviews and provides clear decision
4. Agent creates Todo list for transparency
5. Agent implements step-by-step
6. User reviews and provides feedback
7. Agent adjusts and commits

### Key Phrases User Uses

- "Backend-first workflow" - Always start with Strapi schema
- "I'm in if you are" - Ready to tackle complex challenges
- "Deep review process" - Thorough analysis before action
- "Customization all the way" - Maximum CMS control
- "Clean stable codebase" - Commit before major changes

---

## ⚠️ Critical Context for Continuation

### Last Conversation State

- **Date:** November 11, 2025
- **Commit:** fb5b81e "feat: complete metrics section with orbiting badge and theme system"
- **Build Status:** ✅ All packages built successfully
- **Type Generation:** ✅ 0 errors, 0 warnings
- **Files Changed:** 91 files, 13,169 insertions, 336 deletions

### Current Todo List

1. ✅ Secure clean codebase - COMPLETED
2. ⏳ Create conversation continuation document - IN PROGRESS
3. ⏳ Create future considerations document
4. Create 3 shared component schemas
5. Generate TypeScript types
6. Rebuild Strapi admin panel
7. Create reusable UI components (SectionWrapper, SectionHeader)
8. Update newsletter-cta-section schema
9. Update StrapiNewsletterCTASection frontend
10. Test in CMS
11. Plan MetricsSection migration
12. Execute migration (database script)
13. Roll out to remaining sections
14. Final build and commit

### Database Migration Considerations

- User wants database script approach
- Must be extremely safe with rollback plan
- Backup with `strapi export --file strapi-export --no-encrypt`
- Test on dev environment first
- Comprehensive documentation required
- Use `strapi transfer` for environment sync if needed

---

## 🎨 Future Vision (See FUTURE_CONSIDERATIONS.md)

### Component Marketplace (SaaS Model)

- **Basic Components:** Free, available to all clients
- **Pro Components:** Behind paywall, unlocked on subscription
- **Admin Dashboard:** Locked component preview with upgrade CTA

### Organization Improvements

- **Categorized Components:** Group by type (Heroes, Features, etc.)
- **Component Preview:** Visual selection in Strapi
- **Documentation Integration:** In-app guides for content managers

### Technical Foundation

- Start with clean data architecture NOW
- Build with future monetization in mind
- Maintain separation of concerns
- Keep components modular and reusable

---

## 💡 If You're Reading This After Conversation Loss

### Step 1: Acknowledge Context

Say: "I've read CONVERSATION_CONTINUATION_GUIDE.md and understand our collaboration patterns, current state, and next steps."

### Step 2: Confirm Understanding

- Backend-first workflow
- Deep review process
- Maximum customization principle
- Documentation-first approach

### Step 3: Check Current State

```powershell
# Verify build status
yarn build

# Check git status
git status

# Review last commit
git log -1
```

### Step 4: Resume Work

Continue from the current Todo list item. If unsure, ask: "Should we continue with [next todo item] or is there something more urgent?"

---

## 📖 Related Documents

**MUST READ NEXT:**

- `FUTURE_CONSIDERATIONS.md` - Strategic vision for component marketplace

**Reference as Needed:**

- `COMPONENT_ARCHITECTURE.md` - Detailed component structure
- `DEVELOPMENT_WORKFLOW.md` - Development best practices
- `QUICK_REFERENCE.md` - Quick patterns lookup

---

## 🚨 Emergency Procedures

### If Build Fails

1. Check last working commit: `git log`
2. Review error output carefully
3. Check `apps/strapi/types/generated/` for type errors
4. Verify all Strapi schemas are valid JSON
5. Run `yarn strapi-types` to regenerate

### If Types Out of Sync

1. `cd apps/strapi`
2. `yarn run generate:types`
3. Check for 0 errors, 0 warnings
4. Rebuild Next.js: `cd ../ui && yarn build`

### If Migration Goes Wrong

1. Restore from backup: `yarn import -f strapi-export.tar.gz`
2. Review migration script
3. Test on fresh dev database
4. Document issue in TROUBLESHOOTING_PLAYBOOK.md

---

**VERSION:** 1.0.0  
**LAST UPDATED:** November 11, 2025  
**COMMIT REFERENCE:** fb5b81e  
**AUTHOR:** Herman & GitHub Copilot Collaboration
