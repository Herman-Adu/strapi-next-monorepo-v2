# ⚡ Quick Reference - Automation Commands

> **One-page cheat sheet** for daily automation tasks

---

## 🔄 Type Generation

### Generate types from Strapi

```powershell
yarn generate:types
```

### With custom Strapi URL

```powershell
$env:STRAPI_API_URL="http://localhost:1337"; yarn generate:types
```

### Verify generated types

```powershell
cat packages/shared-data/strapi-types.ts
```

**When to run:** After changing Strapi schema (content types, fields, relations)

---

## 🌐 Webhook Commands

### Test webhook health

```powershell
curl http://localhost:3000/api/webhooks/strapi
```

### Test with payload (PowerShell)

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-webhook-secret" = "your-secret-here"
}

$body = @{
    event = "entry.publish"
    model = "blog"
    entry = @{
        id = 1
        slug = "test-post"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/webhooks/strapi" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

**When to use:** Testing cache invalidation locally

---

## 📋 Environment Variables

### Required for Cache Invalidation

```bash
# apps/ui/.env.local
STRAPI_WEBHOOK_SECRET=your-random-secret
```

### Required for Type Generation

```bash
# Root .env or apps/ui/.env.local
STRAPI_API_TOKEN=your-read-only-token
STRAPI_API_URL=http://localhost:1337
```

### Generate random secret (PowerShell)

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## 🚀 Daily Workflow

### Morning Setup

```powershell
# Start Strapi
yarn dev:strapi

# In another terminal, start Next.js
yarn dev:ui

# Verify webhook health
curl http://localhost:3000/api/webhooks/strapi
```

### After Schema Changes

```powershell
# 1. Make changes in Strapi Content-Type Builder
# 2. Regenerate types
yarn generate:types

# 3. Commit types
git add packages/shared-data/strapi-types.ts
git commit -m "chore: regenerate Strapi types"
```

### Testing Cache Invalidation

```powershell
# 1. Publish content in Strapi
# 2. Check Next.js terminal for:
#    📨 Received webhook: entry.publish for blog (ID: X)
#    ✅ Cache revalidation successful

# 3. Verify content updated in browser (refresh page)
```

---

## 🐛 Quick Troubleshooting

### Webhook not triggering?

```powershell
# Check webhook secret matches
echo $env:STRAPI_WEBHOOK_SECRET

# Check Strapi webhook configuration
# Strapi Admin → Settings → Webhooks
# Verify: URL, Events selected, Header x-webhook-secret
```

### Type generation failing?

```powershell
# Check token is set
echo $env:STRAPI_API_TOKEN

# Check Strapi is running
curl http://localhost:1337/_health

# Generate new token if needed
# Strapi Admin → Settings → API Tokens → Create (Read-only)
```

### Types not updating?

```powershell
# Force regenerate
Remove-Item packages/shared-data/strapi-types.ts
yarn generate:types

# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📊 Verification

### Cache Invalidation Working

✅ Webhook health check returns 200 OK  
✅ Publishing content shows webhook log in Next.js terminal  
✅ Content changes reflect on frontend (after refresh)

### Type Generation Working

✅ `yarn generate:types` completes successfully  
✅ `strapi-types.ts` file exists with interfaces  
✅ Types importable: `import type { Blog } from '@repo/shared-data/strapi-types'`  
✅ No TypeScript errors in VS Code

---

## 🎯 Performance

### Cache Hit Rates (Expected)

- **Browser Cache:** Instant (80% hit rate)
- **CDN Edge:** ~50ms (60% hit rate)
- **Next.js ISR:** ~100ms (40% hit rate)
- **Database:** ~500ms (cache miss)

### Webhook Response Time

- **Typical:** 100-200ms
- **Includes:** Signature validation + revalidation

---

## 🧪 Testing Commands

### Run Unit Tests (Vitest)

```powershell
# Run all tests
yarn test

# Watch mode
yarn test:watch

# With UI
yarn test:ui

# Coverage report
yarn test --coverage
```

### Run E2E Tests (Playwright)

```powershell
# Run E2E tests (all browsers)
yarn test:e2e

# Run in UI mode (interactive)
yarn test:e2e:ui

# Run specific browser
npx playwright test --project=chromium
```

### Visual Regression (Chromatic)

```powershell
# Run Storybook locally
yarn storybook

# Build and publish to Chromatic
yarn chromatic

# Only check for changes (no CI credits)
yarn chromatic --only-changed
```

---

## 🎨 Component Generation

### Create New Component

```powershell
# Interactive CLI
yarn generate:component

# Non-interactive
yarn generate:component --type molecule --name ProductCard
```

### Generated Files

```
apps/ui/src/components/molecules/ProductCard/
├── ProductCard.tsx         # Component code
├── ProductCard.module.css  # Styles
├── ProductCard.stories.tsx # Storybook story
├── ProductCard.test.tsx    # Vitest tests
├── index.ts                # Barrel export
└── README.md               # Component docs
```

**Atomic levels:** atom | molecule | organism | template | page

---

## ⚡ Performance Monitoring

### Run Lighthouse Audit

```powershell
# Run locally
yarn lighthouse

# Check specific URLs
npx lhci autorun --url http://localhost:3000/en
```

### Performance Budgets (lighthouserc.js)

- **LCP (Largest Contentful Paint):** ≤ 2.5s
- **FID (First Input Delay):** ≤ 100ms
- **CLS (Cumulative Layout Shift):** ≤ 0.1
- **TBT (Total Blocking Time):** ≤ 300ms
- **Accessibility Score:** ≥ 95%

---

## 💾 Database Backup & Restore

### Manual Backup

```powershell
# Run backup script
yarn backup:db

# With S3 upload
yarn backup:db -UploadToS3
```

### Restore from Backup

```powershell
# Windows (PowerShell)
$env:PGPASSWORD="your-password"
psql -h localhost -U strapi -d strapi < backups/strapi-2025-11-16-140530.sql

# Linux/macOS
psql $DATABASE_URL < backups/strapi-2025-11-16-140530.sql
```

### Verify Backup

```powershell
# Check backup file exists
ls backups/

# Check file size (should be > 0)
(Get-Item backups/strapi-*.sql | Sort-Object LastWriteTime -Descending | Select-Object -First 1).Length
```

---

## 🔐 GitHub Secrets Configuration

### Required Secrets for CI/CD

```yaml
# Visual Regression
CHROMATIC_PROJECT_TOKEN: your-chromatic-token

# Performance Testing
LHCI_GITHUB_APP_TOKEN: your-lighthouse-token (optional)

# Database Backups
STRAPI_DATABASE_URL: postgresql://user:pass@host:port/db
AWS_ACCESS_KEY_ID: your-aws-key
AWS_SECRET_ACCESS_KEY: your-aws-secret
AWS_S3_BACKUP_BUCKET: your-backup-bucket
AWS_REGION: us-east-1 (optional, defaults to us-east-1)
```

### Add Secrets to GitHub

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add name and value
4. Click **Add secret**

---

## 🚀 CI/CD Workflows

### Workflows Overview

| Workflow                | Trigger   | Purpose             | Duration |
| ----------------------- | --------- | ------------------- | -------- |
| `ci.yml`                | Push/PR   | Lint & Build        | 2-4 min  |
| `visual-regression.yml` | PR        | Visual diff testing | 3-5 min  |
| `lighthouse.yml`        | PR        | Performance audit   | 5-8 min  |
| `backup.yml`            | Daily 2AM | Database backup     | 2-3 min  |

### Manual Workflow Trigger

```powershell
# Using GitHub CLI
gh workflow run backup.yml

# Or via GitHub UI
# Actions → Backup → Run workflow
```

---

## 🐛 Advanced Troubleshooting

### Playwright Test Failing

```powershell
# Install browsers
npx playwright install

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Update snapshots
npx playwright test --update-snapshots
```

### Vitest Test Failing

```powershell
# Clear cache
yarn test --clearCache

# Run specific test file
yarn test BlogCard.test.tsx

# Verbose output
yarn test --reporter=verbose
```

### Chromatic Build Failing

```powershell
# Check Storybook builds locally
yarn build-storybook

# Verify token
echo $env:CHROMATIC_PROJECT_TOKEN

# Force full rebuild
yarn chromatic --force-rebuild
```

### Lighthouse CI Failing

```powershell
# Test locally first
yarn lighthouse

# Check dev server starts
yarn dev

# Adjust budgets in lighthouserc.js if needed
```

---

## 📚 Related Docs

- **Full Setup:** [AUTOMATION-SETUP.md](./AUTOMATION-SETUP.md)
- **Strategy:** [docs/AUTOMATION-STRATEGY.md](./docs/AUTOMATION-STRATEGY.md)
- **Webhooks:** [docs/strapi-integration/README.md#-04-webhooksmd](./docs/strapi-integration/README.md)
- **Types:** [docs/strapi-integration/README.md#-03-type-generationmd](./docs/strapi-integration/README.md)
- **Testing:** [docs/workflows-automation/README.md#-03-testing-strategymd](./docs/workflows-automation/README.md)

---

**💡 Tip:** Bookmark this file for quick access during development!
