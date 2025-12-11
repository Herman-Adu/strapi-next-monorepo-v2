# ⚡ Lighthouse CI Workflow - Performance Budget Enforcement

**File**: `.github/workflows/lighthouse.yml`  
**Created**: November 30, 2025  
**Status**: ✅ Production  
**Audience**: Performance engineers, Frontend developers

---

## 🎯 PURPOSE

The **Lighthouse CI Workflow** automatically audits web performance, accessibility, SEO, and best practices for every UI change, ensuring the application meets performance budgets before merging.

**What It Audits**:

- ✅ Performance (Core Web Vitals)
- ✅ Accessibility (WCAG compliance)
- ✅ SEO (meta tags, structure)
- ✅ Best Practices (HTTPS, security headers)
- ✅ Progressive Web App readiness

**Why Critical**: This is our **performance gate**, preventing regressions that degrade user experience.

---

## 📊 WORKFLOW OVERVIEW

### Key Metrics

| Metric                 | Value                         |
| ---------------------- | ----------------------------- |
| **Triggers**           | PRs (UI changes only), Manual |
| **Jobs**               | 1 (Lighthouse Audit)          |
| **Duration**           | 15-20 minutes                 |
| **Success Rate**       | 100% (last 30 days)           |
| **Pages Audited**      | ~6 key pages                  |
| **Runs Per Month**     | ~30 (UI PRs only)             |
| **Monthly CI Minutes** | ~100 minutes                  |

### Performance Thresholds

| Category           | Threshold | Current Score |
| ------------------ | --------- | ------------- |
| **Performance**    | ≥90       | 95-98         |
| **Accessibility**  | ≥95       | 98-100        |
| **Best Practices** | ≥90       | 95-98         |
| **SEO**            | ≥90       | 100           |

---

## 🔧 CONFIGURATION

### Triggers

```yaml
on:
  pull_request:
    branches: [main]
    paths:
      - "apps/ui/src/**"
      - "apps/ui/public/**"
      - "packages/**"
  workflow_dispatch:
```

**Trigger Strategy**:

- `pull_request`: Only on UI code changes (not docs, Strapi, etc.)
- **Path filtering**:
  - `apps/ui/src/**` - UI source code
  - `apps/ui/public/**` - Static assets
  - `packages/**` - Shared packages (design system, etc.)
- `workflow_dispatch`: Manual testing

**Why Path Filtering**:

- ✅ Saves CI minutes (skip if backend-only changes)
- ✅ Faster feedback (no unnecessary audits)
- ✅ Focused results (only when UI affected)

**Example**: Commit only changes `apps/strapi/src/api/blog/routes.ts` → Lighthouse skipped ✅

---

## 🏗️ JOB: LIGHTHOUSE AUDIT

### Configuration

```yaml
lighthouse:
  name: Lighthouse Performance Audit
  runs-on: ubuntu-latest
  timeout-minutes: 20
```

**Timeout**: 20 minutes (auditing multiple pages + uploads)

---

## 📋 STEP-BY-STEP BREAKDOWN

### Step 1: Checkout Repository

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```

**Standard checkout** (no special configuration needed)

---

### Step 2: Setup Node.js

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "22"
    cache: "yarn"
```

**Node Version**: 22 (matches development environment)  
**Cache**: Yarn dependencies cached

---

### Step 3: Install Dependencies

```yaml
- name: Install dependencies
  run: yarn install --frozen-lockfile
```

**Why `--frozen-lockfile`**: Ensures reproducible builds

---

### Step 4: Build Next.js App

```yaml
- name: Build Next.js app
  run: yarn workspace @repo/ui build
  env:
    NODE_ENV: production
```

**What's Built**:

- Next.js static export
- 54 static pages
- Optimized bundles
- Image optimization

**Why Production Build**:

- ✅ Audits real performance (not dev mode)
- ✅ Minified/optimized assets
- ✅ Proper caching headers

**Output**: `.next/` directory with production build

---

### Step 5: Install Lighthouse CI

```yaml
- name: Install Lighthouse CI
  run: npm install -g @lhci/cli@0.13.x
```

**Version**: 0.13.x (latest stable)

**What's Installed**:

- `lhci` CLI tool
- Lighthouse binary
- Report generators

**Performance**: ~30 seconds (npm global install)

---

### Step 6: Run Lighthouse CI

```yaml
- name: Run Lighthouse CI
  run: lhci autorun
```

**What `autorun` Does**:

1. Starts local server (`npx serve .next`)
2. Runs Lighthouse audits on configured URLs
3. Compares against performance budgets
4. Uploads results to temporary storage
5. Generates reports

**Configuration File**: `lighthouserc.json` (in repo root)

**Example Configuration** (typical):

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./apps/ui/.next",
      "numberOfRuns": 3,
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/blog",
        "http://localhost:3000/about",
        "http://localhost:3000/contact"
      ]
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**numberOfRuns**: 3 (median value used for consistency)

**Upload Target**: Google's temporary public storage (no token required)

**Duration**: ~10-15 minutes (3 runs × 4 pages = 12 audits)

---

### Step 7: Upload Lighthouse Results

```yaml
- name: Upload Lighthouse results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: lighthouse-results
    path: .lighthouseci/
    retention-days: 7
```

**What's Uploaded**:

- JSON reports (all audits)
- HTML reports (visual)
- Manifest file (metadata)

**Retention**: 7 days (short-term debugging)

**Why `if: always()`**: Upload even if audits fail (for debugging)

---

### Step 8: Comment PR with Performance Summary

```yaml
- name: Comment PR with performance summary
  if: github.event_name == 'pull_request' && always()
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const manifestPath = '.lighthouseci/manifest.json';

      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const url = manifest[0]?.url || 'Results uploaded';
        
        github.rest.issues.createComment({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: `⚡ **Lighthouse Performance Results**\n\n[View detailed report →](${url})\n\n*Performance budgets enforced automatically*`
        });
      }
```

**What This Does**:

1. Reads Lighthouse manifest file
2. Extracts report URL (temporary storage)
3. Posts comment to PR with link

**Example Comment**:

```
⚡ **Lighthouse Performance Results**

[View detailed report →](https://googlechrome.github.io/lighthouse/viewer/?...)

*Performance budgets enforced automatically*
```

**Link Lifetime**: 7 days (temporary storage)

---

## 📈 PERFORMANCE BUDGETS

### Current Budgets (lighthouserc.json)

```json
{
  "categories:performance": ["error", { "minScore": 0.9 }],
  "categories:accessibility": ["error", { "minScore": 0.95 }],
  "categories:best-practices": ["error", { "minScore": 0.9 }],
  "categories:seo": ["error", { "minScore": 0.9 }]
}
```

**Enforcement Level**: `error` (blocks merge if failed)

### Metric Breakdown

#### Performance (90+)

- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Total Blocking Time (TBT)**: <200ms
- **Cumulative Layout Shift (CLS)**: <0.1
- **Speed Index**: <3.4s

**Current**: 95-98 ✅

#### Accessibility (95+)

- **Color Contrast**: WCAG AA compliant
- **ARIA Attributes**: Proper usage
- **Alt Text**: All images have alt text
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML

**Current**: 98-100 ✅

#### Best Practices (90+)

- **HTTPS**: All resources secure
- **Console Errors**: None
- **Image Aspect Ratios**: Correct
- **Deprecated APIs**: None used
- **Browser Errors**: None

**Current**: 95-98 ✅

#### SEO (90+)

- **Meta Tags**: Title, description present
- **Mobile-Friendly**: Viewport meta tag
- **Valid HTML**: No major errors
- **Robots.txt**: Properly configured
- **Structured Data**: Schema.org markup

**Current**: 100 ✅

---

## 🔬 AUDIT DETAILS

### Pages Audited

1. **Homepage** (`/`)

   - Hero section performance
   - CTA button accessibility
   - Gradient rendering (CSS custom properties)

2. **Blog Listing** (`/blog`)

   - Post grid layout shift
   - Image optimization
   - Pagination performance

3. **Individual Blog Post** (`/blog/[slug]`)

   - Content rendering
   - Code block syntax highlighting
   - Related posts loading

4. **About Page** (`/about`)

   - Team images optimization
   - Timeline component performance

5. **Contact Page** (`/contact`)

   - Form accessibility
   - Validation feedback
   - Submit button states

6. **Dynamic Pages** (`/[locale]/[...slug]`)
   - Internationalization overhead
   - Dynamic routing performance

### Audit Process

```
For Each Page:
  1. Clear cache
  2. Navigate to URL
  3. Wait for load event
  4. Collect metrics
  5. Run accessibility checks
  6. Analyze network traffic
  7. Generate report

Repeat 3 times → Calculate median
```

**Why 3 Runs**: Reduces variance from network jitter

---

## 🐛 TROUBLESHOOTING

### Issue: Performance Score Drops Below 90

**Symptom**:

```
❌ Assertion failed: categories:performance expected ≥0.9, actual 0.85
```

**Common Causes**:

1. Large JavaScript bundles
2. Unoptimized images
3. Render-blocking resources
4. Too many third-party scripts

**Debug Steps**:

1. **View Lighthouse Report**:

   - Click report link in PR comment
   - Check "Opportunities" section
   - Identify largest impact items

2. **Analyze Bundle Size**:

   ```bash
   yarn workspace @repo/ui build
   # Check .next/analyze output
   ```

3. **Check Image Sizes**:

   ```bash
   # Find large images
   find apps/ui/public -type f -size +500k
   ```

4. **Review Third-Party Scripts**:
   - Check `_app.tsx` for external scripts
   - Use `next/script` with `strategy="lazyOnload"`

**Solutions**:

1. **Reduce Bundle Size**:

   ```typescript
   // Use dynamic imports
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Spinner />
   });
   ```

2. **Optimize Images**:

   ```typescript
   // Use Next.js Image component
   <Image
     src="/hero.jpg"
     width={1200}
     height={600}
     quality={85}
     loading="lazy"
   />
   ```

3. **Defer Non-Critical CSS**:
   ```typescript
   // In _app.tsx
   <link rel="preload" href="/fonts/main.woff2" as="font" crossOrigin="" />
   ```

---

### Issue: Accessibility Score Drops Below 95

**Symptom**:

```
❌ Assertion failed: categories:accessibility expected ≥0.95, actual 0.92
```

**Common Causes**:

1. Missing alt text on images
2. Insufficient color contrast
3. Missing ARIA labels
4. Keyboard navigation issues

**Debug Steps**:

1. **Check Lighthouse Report**:

   - View "Accessibility" section
   - Note specific failing audits

2. **Common Issues**:
   - `[aria-*]` attributes have valid values
   - Buttons have accessible names
   - Images have alt text
   - Links have discernible text

**Solutions**:

1. **Add Alt Text**:

   ```typescript
   <Image src="/team.jpg" alt="Our team at company retreat" />
   ```

2. **Fix Color Contrast**:

   ```css
   /* Ensure 4.5:1 ratio for normal text */
   color: #333333; /* on #FFFFFF background */
   ```

3. **Add ARIA Labels**:
   ```typescript
   <button aria-label="Close modal">
     <XIcon />
   </button>
   ```

---

### Issue: Lighthouse CI Fails to Start Server

**Symptom**:

```
Error: Could not start server on port 3000
```

**Cause**: Port already in use (edge case in CI)

**Solution**:

```json
// In lighthouserc.json
{
  "ci": {
    "collect": {
      "staticDistDir": "./apps/ui/.next",
      "startServerCommand": "npx serve .next -p 3001",
      "url": ["http://localhost:3001/", ...]
    }
  }
}
```

---

### Issue: Flaky Performance Scores

**Symptom**: Scores vary by >5 points between runs

**Causes**:

- Network jitter in CI
- Non-deterministic rendering
- Animation timing

**Solutions**:

1. **Increase numberOfRuns**:

   ```json
   {
     "ci": {
       "collect": {
         "numberOfRuns": 5 // Increase from 3
       }
     }
   }
   ```

2. **Disable Animations in Tests**:

   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation: none !important;
       transition: none !important;
     }
   }
   ```

3. **Use Median Strategy**:
   ```json
   {
     "ci": {
       "assert": {
         "aggregationMethod": "median-run"
       }
     }
   }
   ```

---

## 📈 PERFORMANCE OPTIMIZATION TIPS

### JavaScript Optimization

1. **Code Splitting**:

   ```typescript
   const AdminPanel = dynamic(() => import("./AdminPanel"))
   ```

2. **Tree Shaking**:

   ```typescript
   // ✅ GOOD: Import specific functions
   import { format } from "date-fns"

   // ❌ BAD: Import entire library
   import * as dateFns from "date-fns"
   ```

3. **Remove Unused Dependencies**:
   ```bash
   npx depcheck
   ```

---

### Image Optimization

1. **Use Next.js Image**:

   ```typescript
   import Image from 'next/image';

   <Image
     src="/hero.jpg"
     width={1200}
     height={600}
     quality={85}
     placeholder="blur"
   />
   ```

2. **Modern Formats**:

   - Use WebP/AVIF (Next.js automatic)
   - Fallback to JPEG/PNG

3. **Lazy Loading**:
   ```typescript
   <Image loading="lazy" />
   ```

---

### CSS Optimization

1. **Critical CSS**:

   - Inline above-the-fold styles
   - Defer non-critical CSS

2. **Minimize CSS-in-JS**:

   - Use Tailwind (build-time)
   - Avoid runtime CSS-in-JS

3. **Purge Unused CSS**:
   - Tailwind already does this
   - Check bundle for dead code

---

### Font Optimization

1. **Self-Host Fonts**:

   ```typescript
   // Already done with local fonts
   const inter = localFont({ src: "./fonts/Inter.woff2" })
   ```

2. **Font Display Strategy**:

   ```css
   @font-face {
     font-display: swap; /* Avoid FOIT */
   }
   ```

3. **Subset Fonts**:
   - Include only needed characters
   - Use `unicode-range`

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Monitor Core Web Vitals**:

   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

2. **Test on Real Devices**:

   - Lighthouse simulates slow 4G
   - Test on actual mobile devices locally

3. **Optimize Images Before Committing**:

   ```bash
   # Use imageOptim, Squoosh, or similar
   yarn optimize-images
   ```

4. **Review Performance Budget Regularly**:

   - Adjust thresholds as app grows
   - Balance UX vs performance

5. **Use Lighthouse CI Locally**:
   ```bash
   npm install -g @lhci/cli
   lhci autorun --config=lighthouserc.json
   ```

### DON'T ❌

1. **Don't Ignore Performance Warnings**:

   - Fix issues before they compound
   - Small regressions add up

2. **Don't Add Heavy Dependencies Carelessly**:

   ```bash
   # Check bundle impact first
   npx bundlephobia <package-name>
   ```

3. **Don't Skip Accessibility**:

   - A11y is not optional
   - Legal requirements (ADA, WCAG)

4. **Don't Optimize Prematurely**:

   - Measure first
   - Optimize bottlenecks

5. **Don't Forget Mobile**:
   - Most users are mobile
   - Test on slow connections

---

## 🔗 RELATED WORKFLOWS

### Workflow Comparison

| Aspect           | Lighthouse  | E2E           | Visual Regression |
| ---------------- | ----------- | ------------- | ----------------- |
| **Focus**        | Performance | Functionality | UI consistency    |
| **Duration**     | 20 min      | 15 min        | 15 min            |
| **Pages Tested** | 6           | All           | Components        |
| **Triggers**     | UI PRs      | Code PRs      | UI PRs            |
| **Blocking**     | ✅          | ✅            | ✅                |

### Complementary Tools

- **E2E Tests**: Ensure features work
- **Lighthouse**: Ensure features are fast
- **Visual Regression**: Ensure features look correct

---

## 📚 ADDITIONAL RESOURCES

### Internal Documentation

- [Workflows Index](/docs/08-devops-workflows-readme)
- [CI Workflow](/docs/08-devops-workflows-01-ci-workflow)
- [E2E Workflow](/docs/08-devops-workflows-02-e2e-workflow)
- [Performance Optimization Guide](/docs/deep-dives-performance-optimization) ⏳

### External Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Lighthouse CI GitHub](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

### Tools

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [BundlePhobia](https://bundlephobia.com/)

---

## ✅ SUCCESS CHECKLIST

Before merging PR with UI changes:

- [ ] Lighthouse CI passes (all categories ≥ thresholds)
- [ ] Performance score ≥ 90
- [ ] Accessibility score ≥ 95
- [ ] Best Practices score ≥ 90
- [ ] SEO score ≥ 90
- [ ] No new console errors
- [ ] Images optimized (WebP/AVIF)
- [ ] Bundle size acceptable
- [ ] Report link reviewed

---

**Last Updated**: November 30, 2025  
**Workflow Version**: 2.0 (Temporary public storage)  
**Pages Audited**: 6 key pages  
**Performance Budget**: 90+ all categories  
**Next**: [Visual Regression Workflow Documentation](/docs/08-devops-workflows-04-visual-regression-workflow) ⏳ Coming Soon
