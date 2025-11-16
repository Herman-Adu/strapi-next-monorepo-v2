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

## 📚 Related Docs

- **Full Setup:** [AUTOMATION-SETUP.md](./AUTOMATION-SETUP.md)
- **Strategy:** [docs/AUTOMATION-STRATEGY.md](./docs/AUTOMATION-STRATEGY.md)
- **Webhooks:** [docs/strapi-integration/README.md#-04-webhooksmd](./docs/strapi-integration/README.md)
- **Types:** [docs/strapi-integration/README.md#-03-type-generationmd](./docs/strapi-integration/README.md)

---

**💡 Tip:** Bookmark this file for quick access during development!
