# Development Workflow Documentation

## Table of Contents

1. [Systematic Development Process](#systematic-development-process)
2. [Troubleshooting Methodology](#troubleshooting-methodology)
3. [Component Integration Patterns](#component-integration-patterns)
4. [Common Issues and Solutions](#common-issues-and-solutions)
5. [Best Practices](#best-practices)
6. [Environment Management](#environment-management)

---

## Systematic Development Process

### 1. Backend-First Approach

**Always start with Strapi backend before frontend integration**

```bash
# 1. Start Strapi development server (from root)
yarn workspace @repo/strapi develop

# 2. Verify in Strapi Admin (http://localhost:1337/admin)
# - Check content types exist
# - Verify component references
# - Ensure data is populated
# - Test API endpoints manually
```

### 2. API Integration Validation

**Verify API responses before frontend implementation**

```bash
# Test API endpoints directly
curl "http://localhost:1337/api/navbar?populate[logoImage][populate]=*&populate[links]=*"
curl "http://localhost:1337/api/footer?populate=deep"
```

### 3. Frontend Integration

**Only after backend is confirmed working**

```bash
# 3. Start Next.js development server (from root)
yarn workspace @repo/ui dev

# 4. Test integration at http://localhost:3000
```

### 4. Build Verification

**🚨 CRITICAL: Always run commands from MONOREPO ROOT and stop dev server before building**

**⚠️ MANDATORY PRE-BUILD CHECKLIST:**

1. **Navigate to root directory** (NOT apps/ui or apps/strapi)
2. **Stop all running dev servers** (Ctrl+C in all terminals)
3. **Clean build artifacts** (automatic with updated scripts)
4. **Run build command** (see below)

```bash
# ✅ CORRECT: Always run from monorepo root
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2

# ✅ Build commands (auto-clean before build)
yarn build         # Cleans ALL, then builds both Strapi and UI
yarn build:strapi  # Cleans Strapi dist, then builds Strapi only
yarn build:ui      # Cleans UI .next, then builds UI only

# ✅ Manual clean commands (if needed)
yarn clean         # Clean all build artifacts (.next, dist, .turbo)
yarn clean:strapi  # Clean apps/strapi/dist only
yarn clean:ui      # Clean apps/ui/.next only
yarn clean:turbo   # Clean .turbo cache only
```

**Why clean builds matter:**

- **Prevents cache issues**: Old config/types can cause mysterious errors
- **Stops port locking**: Hanging processes from old builds won't block new ones
- **Fresh TypeScript types**: Ensures generated types match current schemas
- **No stale modules**: Eliminates old build artifacts that cause conflicts

**Why this matters:**

- Dev mode may hide TypeScript errors that fail in production
- SSG/SSR builds validate all API integrations
- Catches component type mismatches before deployment
- Verifies all imports resolve correctly

**Expected build warnings (safe to ignore):**

- "Error fetching navbar/footer" - Normal when Strapi isn't running
- "Browserslist data is 7 months old" - Cosmetic, update with `npx update-browserslist-db@latest`
- Sentry config deprecation - Will be addressed in future update

**⚠️ MANDATORY WORKFLOW RULE:**

**🟢 GREEN TICK BEFORE PROCEEDING 🟢**

Never move to the next step until the build completes successfully with no errors. This is non-negotiable:

1. Make code changes
2. **Run `yarn build` (or `yarn build:ui` for frontend-only changes)**
3. **Wait for build completion**
4. **✅ Verify green tick / "Done in X.XXs" / successful exit**
5. **ONLY THEN** proceed to commit
6. Commit changes
7. Push to GitHub immediately
8. Repeat for next feature/fix

**Why this workflow is critical:**

- **Small, safe commits**: Each commit is verified to work
- **Minimal rollback risk**: Only need to revert 1 commit if something fails
- **Clean history**: Every commit in main is guaranteed to build
- **Fast debugging**: Know exactly which change broke the build
- **Team safety**: Never push broken code to shared branches

**If build fails:**

- ❌ DO NOT commit
- ❌ DO NOT move to next feature
- ❌ DO NOT push to GitHub
- ✅ Fix the errors immediately
- ✅ Re-run `yarn build`
- ✅ Only proceed when you see the green tick

**Build must pass before:**

- Creating commits
- Merging to main branch
- Deploying to staging/production
- Moving to next task or feature

---

## Troubleshooting Methodology

### Phase 1: Backend Verification

1. **Check Strapi Admin Panel**

   - Verify content types exist and are populated
   - Check component references in schema files
   - Ensure all referenced components exist

2. **Validate API Responses**

   - Test endpoints with browser/Postman
   - Check population parameters
   - Verify nested data structure

3. **Review Schema Integrity**
   - Check `apps/strapi/src/api/*/content-types/*/schema.json`
   - Ensure all component references exist
   - Remove references to non-existent components

### Phase 2: Frontend Integration

1. **API Client Verification**

   - Check `apps/ui/src/lib/strapi-api/content/server.ts`
   - Verify population parameters match backend structure
   - Test API functions in isolation

2. **Component Rendering**

   - Check component props and data flow
   - Verify conditional rendering logic
   - Test with both populated and empty data

3. **Network Analysis**
   - Use browser DevTools Network tab
   - Check for failed requests
   - Verify request/response structure

### Phase 3: Styling and UX

1. **Layout Verification**

   - Test responsive design across breakpoints
   - Check container and spacing consistency
   - Verify theme compatibility

2. **Interactive Elements**
   - Test hover states and animations
   - Check accessibility features
   - Verify keyboard navigation

---

## Component Integration Patterns

### Strapi Component Structure

```typescript
// Standard pattern for Strapi components
export function StrapiComponent({
  component,
}: {
  readonly component: Data.Component<"namespace.component-name">
}) {
  // Always check for component existence
  if (!component) return null

  // Extract data safely
  const { title, description, links } = component

  return (
    <div>
      {/* Render component */}
    </div>
  )
}
```

### API Population Pattern

```typescript
// In server-side API functions
const response = await strapiApi.get(`/api/content-type`, {
  searchParams: {
    "populate[field][populate]": "*",
    "populate[nestedField][populate][media]": "*",
    "populate[links]": "*",
  },
})
```

### Image Handling Pattern

```typescript
// For image components with proper population
<StrapiImageWithLink
  component={navbar.logoImage}
  linkProps={{
    className: "hover:opacity-80 transition-opacity",
  }}
  imageProps={{
    hideWhenMissing: true,
    className: "h-8 w-auto object-contain",
  }}
/>
```

---

## Common Issues and Solutions

### 1. Internal Server Error 500

**Symptom**: Page collection or content type returns 500 error
**Cause**: Missing component references in schema
**Solution**:

```bash
# Check schema file
apps/strapi/src/api/page/content-types/page/schema.json

# Remove non-existent component references
# Restart Strapi server
```

### 2. Images Not Displaying

**Symptom**: Images appear as broken links or don't load
**Cause**: Missing media population in API calls
**Solution**:

```typescript
// Add proper media population
'populate[logoImage][populate][image][populate][media]': '*'
```

### 3. Double Underline Animation

**Symptom**: Navigation links show multiple underlines on hover
**Cause**: Default AppLink underline conflicting with custom animation
**Solution**:

```typescript
// Override default underline styles
className={cn(
  "no-underline hover:no-underline", // Override defaults
  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
  "after:bg-primary after:scale-x-0 after:transition-transform",
  "hover:after:scale-x-100"
)}
```

### 4. TIME_WAIT Connection Issues

**Symptom**: Port already in use errors, connection buildup
**Solution**:

```bash
# Apply registry fix for Windows
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpTimedWaitDelay /t REG_DWORD /d 30 /f
```

---

## Best Practices

### File Organization

```
apps/
├── strapi/                     # Backend
│   ├── src/api/               # Content types
│   └── config/sync/           # Config sync files
└── ui/                        # Frontend
    ├── src/components/
    │   └── page-builder/
    │       ├── components/    # Reusable components
    │       └── single-types/  # Single type components
    └── src/lib/strapi-api/    # API integration
```

### Component Naming Convention

- **Strapi Components**: `StrapiComponentName.tsx`
- **Single Types**: `StrapiNavbar.tsx`, `StrapiFooter.tsx`
- **Sections**: `StrapiHero.tsx`, `StrapiFeatureSection.tsx`
- **Utilities**: `StrapiLink.tsx`, `StrapiImage.tsx`

### CSS and Styling

- Use **container-based layouts** for professional appearance
- Apply **consistent spacing** with Tailwind utilities
- Implement **theme-aware styling** with CSS variables
- Override **default styles explicitly** when needed

### API Integration

- **Always populate nested fields** required for rendering
- **Test API responses** before frontend integration
- **Handle missing data gracefully** with conditional rendering
- **Use TypeScript interfaces** for type safety

---

## Environment Management

### Development Servers

```bash
# Terminal 1: Strapi Backend
cd apps/strapi && npm run develop

# Terminal 2: Next.js Frontend
cd apps/ui && npm run dev

# Terminal 3: Development tasks
# For testing, building, or debugging
```

### Port Management

- **Strapi**: http://localhost:1337
- **Next.js**: http://localhost:3000
- **Strapi Admin**: http://localhost:1337/admin

### Database Management

- Use **PostgreSQL** for production consistency
- Run **migrations** when schema changes occur
- Keep **config sync** enabled for team collaboration

---

## Quick Reference Commands

```bash
# Start development environment
yarn dev                       # From root (orchestrated startup)

# Individual server management
yarn dev:strapi                # Start Strapi only
yarn dev:ui                    # Start Next.js only
yarn dev:all                   # Start both in parallel (legacy)

# Build for production (ALWAYS run before committing!)
yarn build                     # Build both apps
yarn build:strapi              # Build Strapi only
yarn build:ui                  # Build Next.js only

# Database operations
cd apps/strapi && yarn strapi generate:api

# Code quality
yarn lint                      # Check code quality
yarn format                    # Format code with Prettier
yarn format:check              # Check formatting without changes

# Testing
yarn test                      # Run test suite
```

---

## Debugging Checklist

When encountering issues, follow this systematic approach:

- [ ] **Backend**: Strapi admin panel shows content
- [ ] **API**: Direct API calls return expected data
- [ ] **Population**: All required fields are populated
- [ ] **Components**: All referenced components exist
- [ ] **Frontend**: API integration functions work
- [ ] **Network**: No failed requests in DevTools
- [ ] **Styling**: CSS conflicts resolved
- [ ] **Responsive**: Works across all breakpoints
- [ ] **🚨 BUILD**: Production build passes with `yarn build` - **GREEN TICK REQUIRED**
- [ ] **Types**: All TypeScript types match Strapi schemas
- [ ] **Linting**: No ESLint errors or warnings
- [ ] **Commit**: Only after all above checks pass
- [ ] **Push**: Immediately after successful commit

**Remember: Never move on until you know the build is safe. Green tick baby! 🟢✅**

---

_This documentation should be updated as new patterns and solutions are discovered during development._
