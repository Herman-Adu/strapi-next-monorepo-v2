# 🚀 Automation Setup Guide

> **Quick Start:** Get cache invalidation webhooks and type generation working in 15 minutes

---

## ✅ What's Been Implemented

You now have 2 critical automations ready to use:

1. **Cache Invalidation Webhooks** - Strapi → Next.js real-time updates
2. **TypeScript Type Generation** - Auto-generate types from Strapi schema

---

## 🔧 Setup Steps

### Part 1: Cache Invalidation Webhooks (5 minutes)

#### Step 1: Add Environment Variable

Add to `apps/ui/.env.local`:

```bash
# Generate a random secret:
# In PowerShell: -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

STRAPI_WEBHOOK_SECRET=your-random-secret-here
```

#### Step 2: Configure Webhook in Strapi Admin

1. **Start Strapi** (if not running):

   ```powershell
   yarn dev:strapi
   ```

2. **Open Strapi Admin**: http://localhost:1337/admin

3. **Go to**: Settings → Webhooks → Create new webhook

4. **Configure webhook**:

   ```
   Name: Next.js Cache Invalidation
   URL: http://localhost:3000/api/webhooks/strapi

   Events (select these):
   ✅ Entry - Create
   ✅ Entry - Update
   ✅ Entry - Delete
   ✅ Entry - Publish
   ✅ Entry - Unpublish

   Headers:
   Key: x-webhook-secret
   Value: [paste your STRAPI_WEBHOOK_SECRET here]
   ```

5. **Click Save**

#### Step 3: Test the Webhook

1. **Start Next.js** (in another terminal):

   ```powershell
   yarn dev:ui
   ```

2. **Test webhook health**:

   - Open: http://localhost:3000/api/webhooks/strapi
   - You should see: `{"status":"ok","endpoint":"/api/webhooks/strapi",...}`

3. **Publish content in Strapi**:
   - Go to Content Manager → Blog (or any collection)
   - Publish or update an entry
   - Check Next.js terminal - you should see:
     ```
     📨 Received webhook: entry.publish for blog (ID: 1)
     ✅ Cache revalidation successful
        Paths: /blog, /blog/my-blog-post
        Tags: blogs
     ```

✅ **Cache invalidation is now working!** Content changes reflect immediately.

---

### Part 2: TypeScript Type Generation (10 minutes)

#### Step 1: Get Strapi API Token

1. **Open Strapi Admin**: http://localhost:1337/admin

2. **Go to**: Settings → API Tokens → Create new API Token

3. **Configure**:

   ```
   Name: Type Generation Token
   Description: For auto-generating TypeScript types
   Token duration: Unlimited
   Token type: Read-only
   ```

4. **Click Save** and **copy the token** (you won't see it again!)

#### Step 2: Add Token to Environment

Add to **root** `.env` (or `apps/ui/.env.local`):

```bash
STRAPI_API_TOKEN=paste_your_token_here
STRAPI_API_URL=http://localhost:1337
```

#### Step 3: Generate Types

```powershell
# From repository root
yarn generate:types
```

You should see:

```
🔄 Generating TypeScript types from Strapi...
📡 Fetching from: http://localhost:1337/api/content-type-builder/content-types
✅ Found 11 content types

📝 Generating interfaces for 11 API content types:
   - blog (Blog)
   - page (Page)
   - faq (FAQ)
   ...

✅ Types generated successfully!
📄 Output: packages/shared-data/strapi-types.ts
```

#### Step 4: Use Generated Types

```typescript
// In your Next.js code
import type { Blog, Page, StrapiResponse } from "@repo/shared-data/strapi-types"

async function getBlog(slug: string): Promise<Blog> {
  const response = await fetch(
    `${STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}`
  )
  const data: StrapiResponse<Blog[]> = await response.json()
  return data.data[0]
}
```

✅ **Type generation is now working!** Run `yarn generate:types` whenever schema changes.

---

## 🎯 Production Setup

### For Vercel Deployment

#### Add Environment Variables in Vercel:

```bash
# In Vercel Dashboard → Settings → Environment Variables

STRAPI_WEBHOOK_SECRET=your-production-secret
STRAPI_API_TOKEN=your-production-token
STRAPI_API_URL=https://your-strapi-domain.com
```

#### Update Webhook URL in Strapi:

```
Production webhook URL: https://your-nextjs-domain.vercel.app/api/webhooks/strapi
```

---

## 🔄 Workflow Integration

### When to Regenerate Types

**Manually (recommended for now):**

```powershell
# After changing Strapi schema
yarn generate:types
git add packages/shared-data/strapi-types.ts
git commit -m "chore: regenerate Strapi types"
```

**Future automation (Phase 2):**

- Strapi webhook triggers type generation on schema changes
- Automatic commit to Git or package publish

### When Cache Invalidation Happens

**Automatically:**

- Content published → Cache cleared
- Content updated → Cache cleared
- Content deleted → Cache cleared

**Check logs:**

```powershell
# Next.js terminal shows webhook activity
📨 Received webhook: entry.publish for blog (ID: 5)
✅ Cache revalidation successful
   Paths: /blog, /blog/my-new-post
```

---

## 🐛 Troubleshooting

### Webhook not working?

**Check 1: Webhook secret**

```powershell
# In Next.js terminal, you should NOT see:
❌ Invalid webhook signature

# If you do, verify:
# 1. STRAPI_WEBHOOK_SECRET in .env.local matches
# 2. x-webhook-secret header in Strapi webhook matches
```

**Check 2: Webhook URL accessible**

```powershell
# Test with curl (from another terminal)
curl http://localhost:3000/api/webhooks/strapi

# Should return:
{"status":"ok","endpoint":"/api/webhooks/strapi",...}
```

**Check 3: Strapi webhook events selected**

- Make sure you selected: entry.publish, entry.update, etc.

---

### Type generation failing?

**Error: "STRAPI_API_TOKEN environment variable is required"**

```powershell
# Set in .env or pass directly:
STRAPI_API_TOKEN=your_token yarn generate:types
```

**Error: "ECONNREFUSED"**

```powershell
# Make sure Strapi is running:
yarn dev:strapi

# Verify URL:
echo $env:STRAPI_API_URL  # Should be http://localhost:1337
```

**Error: HTTP 401 or 403**

```powershell
# Token is invalid or expired
# Generate new token in Strapi admin
# Settings → API Tokens → Create new token (Read-only)
```

---

## 📊 Verification Checklist

### Cache Invalidation

- [ ] STRAPI_WEBHOOK_SECRET set in .env.local
- [ ] Webhook created in Strapi admin
- [ ] x-webhook-secret header matches
- [ ] Events selected (publish, update, delete)
- [ ] Health check returns 200 OK
- [ ] Publishing content shows webhook log
- [ ] Cache clears (content updates visible)

### Type Generation

- [ ] STRAPI_API_TOKEN set in environment
- [ ] STRAPI_API_URL set correctly
- [ ] `yarn generate:types` runs successfully
- [ ] strapi-types.ts file created
- [ ] Types importable in code
- [ ] No TypeScript errors

---

## 🎉 Success!

You've successfully implemented:

✅ Real-time cache invalidation (content updates reflect instantly)  
✅ Automated TypeScript type generation (type-safe Strapi integration)

**Time saved per week:** ~3-6 hours  
**Setup time:** 15 minutes  
**ROI:** 🔥🔥🔥

---

## 📚 Next Steps

1. **Read detailed docs**:

   - [Webhooks Guide](./docs/strapi-integration/README.md#-04-webhooksmd)
   - [Type Generation Guide](./docs/strapi-integration/README.md#-03-type-generationmd)

2. **Phase 2 Automations** (see [AUTOMATION-STRATEGY.md](./docs/AUTOMATION-STRATEGY.md)):

   - Component Scaffolding CLI
   - Automated Testing in CI
   - Visual Regression Testing
   - Performance Budgets

3. **Customize webhook logic**:
   - Edit `apps/ui/src/app/api/webhooks/strapi/route.ts`
   - Add custom content type handling
   - Implement tag-based invalidation

---

**Questions? Check the [Troubleshooting Playbook](./TROUBLESHOOTING_PLAYBOOK.md) or [Automation Strategy](./docs/AUTOMATION-STRATEGY.md)**
