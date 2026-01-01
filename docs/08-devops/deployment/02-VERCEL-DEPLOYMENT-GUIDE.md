# Vercel Deployment Guide (Next.js Frontend)

**Status**: 📝 Preparation (Do NOT deploy yet - Security hardening in Step 2)  
**Target Platform**: Vercel Pro Account  
**Date**: January 1, 2026

---

## 🎯 Overview

This guide covers deploying the Next.js frontend (`apps/ui`) to Vercel Pro. This is **preparation only** - actual deployment happens after documentation refactor and security hardening (Step 2).

---

## 📋 Prerequisites

- Vercel Pro account
- GitHub repository access
- Domain name configured
- Strapi backend deployed (see `01-VPS-SETUP-GUIDE.md`)

---

## 🚀 Deployment Methods

### Method 1: Vercel Dashboard (Recommended for First Deploy)

#### Step 1: Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose repository: `Herman-Adu/strapi-next-monorepo-v2`
5. Configure project settings:

```
Framework Preset: Next.js
Root Directory: apps/ui
Build Command: yarn build
Output Directory: .next
Install Command: yarn install
```

#### Step 2: Configure Environment Variables

**⚠️ CRITICAL**: These values are placeholders. Real secrets configured in Step 2 (security hardening).

```bash
# Strapi API Configuration
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com
STRAPI_API_URL=https://api.yourdomain.com
STRAPI_API_TOKEN=PLACEHOLDER_CONFIGURE_IN_STEP_2

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=PLACEHOLDER_CONFIGURE_IN_STEP_2

# JWT Secret
JWT_SECRET=PLACEHOLDER_CONFIGURE_IN_STEP_2

# Google reCAPTCHA (if using contact forms)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=PLACEHOLDER_CONFIGURE_IN_STEP_2

# Database (if Next.js needs direct access - usually not needed)
# DATABASE_URL=postgresql://user:password@host:5432/database

# Sentry (Error Tracking)
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=PLACEHOLDER_CONFIGURE_IN_STEP_2

# Node Environment
NODE_ENV=production
```

#### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~3-5 minutes)
3. Vercel will provide deployment URL: `your-project.vercel.app`

---

### Method 2: Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd apps/ui

# Deploy to preview (test deployment)
vercel

# Deploy to production
vercel --prod

# Set environment variables via CLI
vercel env add NEXT_PUBLIC_STRAPI_URL production
# Enter value when prompted

# Pull environment variables locally (for testing)
vercel env pull .env.local
```

---

## 🌐 Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to project settings
2. Navigate to **"Domains"**
3. Click **"Add Domain"**
4. Enter your domain: `yourdomain.com`

### Step 2: Configure DNS Records

**For Hostinger DNS:**

```
Type    Name    Value                           TTL
A       @       76.76.21.21 (Vercel IP)         Automatic
CNAME   www     cname.vercel-dns.com            Automatic
```

**For Cloudflare DNS:**

```
Type    Name    Value                           Proxy Status
A       @       76.76.21.21                     DNS only (gray cloud)
CNAME   www     cname.vercel-dns.com            DNS only (gray cloud)
```

### Step 3: Verify Domain

- Vercel will automatically verify DNS configuration
- SSL certificate issued automatically (usually within 5-10 minutes)
- Domain will be accessible at `https://yourdomain.com`

---

## 🔄 Automatic Deployments

### Production Branch

Vercel automatically deploys when you push to `main`:

```bash
git push origin main
# Triggers production deployment
```

### Preview Deployments

Every branch/PR gets automatic preview deployment:

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# Triggers preview deployment at unique URL
```

---

## ⚙️ Build Configuration

### `vercel.json` (Optional - for advanced configuration)

Create in `apps/ui/vercel.json`:

```json
{
  "buildCommand": "yarn build",
  "installCommand": "yarn install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "rewrites": [
    {
      "source": "/api/strapi/:path*",
      "destination": "https://api.yourdomain.com/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

1. Navigate to project → **"Analytics"**
2. View:
   - Real User Monitoring (RUM)
   - Core Web Vitals
   - Page load performance
   - Geographic distribution

### Vercel Speed Insights

```bash
# Already installed in your project
# Check package.json for @vercel/speed-insights
```

---

## 🐛 Troubleshooting

### Build Failures

**Issue**: Build fails with module not found

```bash
# Solution: Ensure all dependencies in package.json
cd apps/ui
yarn install
yarn build  # Test locally first
```

**Issue**: Environment variable not accessible

```bash
# Solution: Ensure NEXT_PUBLIC_ prefix for client-side variables
# Browser-accessible: NEXT_PUBLIC_STRAPI_URL
# Server-only: STRAPI_API_TOKEN (no prefix)
```

### Domain Issues

**Issue**: Domain not verifying

```bash
# Check DNS propagation
nslookup yourdomain.com

# Check Vercel DNS
dig yourdomain.com

# Wait 24-48 hours for DNS propagation
```

### API Connection Issues

**Issue**: Frontend can't connect to Strapi

```bash
# Verify NEXT_PUBLIC_STRAPI_URL is correct
# Verify CORS configured on Strapi backend
# Check NGINX reverse proxy on VPS
# Verify SSL certificates on both domains
```

---

## 🔒 Security Best Practices (Step 2 - After Documentation Refactor)

**⚠️ Configure in Step 2 (Security Hardening):**

- [ ] Rotate all API tokens and secrets
- [ ] Configure Content Security Policy (CSP)
- [ ] Enable rate limiting on API routes
- [ ] Setup Vercel authentication protection
- [ ] Configure allowed CORS origins
- [ ] Enable Vercel Web Application Firewall (WAF)
- [ ] Setup Sentry error tracking with proper DSN
- [ ] Configure environment variable encryption
- [ ] Enable deployment protection (password-protect previews)
- [ ] Setup Vercel deploy hooks with authentication

**Reference**: `docs/08-devops/deployment/03-SECURITY-CHECKLIST.md`

---

## 🚀 Performance Optimization

### Image Optimization

```typescript
// Already configured in next.config.mjs
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'api.yourdomain.com',
    },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

### Edge Functions

```typescript
// Use edge runtime for API routes
export const runtime = "edge"

export async function GET(request: Request) {
  // Lightning-fast edge response
  return Response.json({ status: "ok" })
}
```

### Caching Strategy

```typescript
// Configure revalidation in fetch calls
const data = await fetch("https://api.yourdomain.com/api/pages", {
  next: { revalidate: 3600 }, // Cache for 1 hour
})
```

---

## 🔄 Deployment Workflow

### Standard Deployment Process

```bash
# 1. Local testing
cd apps/ui
yarn dev  # Test locally

# 2. Run tests
yarn test  # Unit tests
yarn playwright test  # E2E tests

# 3. Build locally
yarn build  # Verify build succeeds

# 4. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 5. Monitor deployment
# Watch Vercel dashboard for deployment status
# Vercel will send notifications on success/failure

# 6. Verify production
# Visit https://yourdomain.com
# Test critical user flows
```

---

## 📈 Vercel Pro Features

### Team Collaboration

- Unlimited team members
- Preview deployment comments
- Deploy protection
- Password-protected deployments

### Performance

- Edge Functions (global)
- Incremental Static Regeneration (ISR)
- Image optimization
- Enhanced analytics

### Enterprise

- Priority support
- SLA guarantees
- Custom domains unlimited
- Advanced monitoring

---

## 🔗 Next Steps

1. **Complete Vercel setup** using this guide
2. **Wait for Step 2** (security hardening after documentation refactor)
3. **Test deployment** with preview environments
4. **Configure monitoring** with Sentry and Vercel Analytics
5. **Setup CI/CD integration** with GitHub Actions

---

## 📚 Related Documentation

- `docs/08-devops/deployment/01-VPS-SETUP-GUIDE.md` - VPS setup for Strapi
- `docs/08-devops/deployment/03-SECURITY-CHECKLIST.md` - Security hardening guide
- `scripts/deployment/setup-vercel.sh` - Automated Vercel configuration
- `docs/SPRINT-3-CURRENT-STATE-AUDIT.md` - Current architecture overview

---

## 📌 Environment Variables Reference

**Client-side (NEXT*PUBLIC*\*):**

```bash
NEXT_PUBLIC_STRAPI_URL     # Strapi API endpoint
NEXT_PUBLIC_RECAPTCHA_SITE_KEY  # reCAPTCHA site key
```

**Server-side:**

```bash
STRAPI_API_TOKEN           # Strapi API authentication
NEXTAUTH_SECRET            # NextAuth.js secret
JWT_SECRET                 # JWT token secret
RECAPTCHA_SECRET_KEY       # reCAPTCHA verification
SENTRY_AUTH_TOKEN          # Sentry deployment token
DATABASE_URL               # Database connection (if needed)
```

---

## ⚠️ Important Notes

1. **Do NOT deploy with placeholder secrets** - Configure real values in Step 2
2. **Do NOT skip security hardening** - Wait for Step 2 completion
3. **Test in preview environment first** - Use branch deployments before production
4. This is **preparation only** - Actual deployment after documentation refactor complete
5. **Vercel Pro benefits** - Make full use of enhanced features for production
