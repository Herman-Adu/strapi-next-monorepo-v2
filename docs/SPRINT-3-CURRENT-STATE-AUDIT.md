# 📋 SPRINT 3: CURRENT STATE AUDIT

**Date**: January 1, 2026  
**Purpose**: Document ACTUAL current architecture (not planned features)  
**Status**: 🔄 IN PROGRESS

---

## 🎯 OBJECTIVE

This document captures the **REAL, WORKING** architecture as of January 1, 2026. No aspirational features. No "we should do X." Only what EXISTS and WORKS right now.

---

## 📦 MONOREPO STRUCTURE

### Package Manager: Yarn Workspaces

**Why Yarn?**

- Consistent, predictable installs
- Workspace protocol for monorepo dependencies
- Fast, reliable, industry standard

**Critical Rule**: ALL commands run from monorepo root

```bash
# ✅ CORRECT (from root)
yarn workspace @repo/ui dev
yarn workspace @repo/strapi build
yarn workspace @repo/ui playwright test

# ❌ WRONG
cd apps/ui && npm run dev
npx playwright test
```

**Reference Document**: `MONOREPO_COMMAND_REFERENCE.md` (Gold Standard)

---

## 🏗️ ARCHITECTURE OVERVIEW

### **Apps**

1. **`apps/strapi`** - Strapi 5.8+ Backend (Headless CMS)
2. **`apps/ui`** - Next.js 15.1+ Frontend (App Router + RSC)

### **Packages**

1. **`packages/design-system`** - Shared CKEditor configuration
2. **`packages/eslint-config`** - Shared ESLint rules
3. **`packages/prettier-config`** - Shared Prettier configuration
4. **`packages/shared-data`** - TypeScript types (Strapi→Next.js)
5. **`packages/typescript-config`** - Shared TypeScript configuration

### **Monorepo Tool**: Turborepo

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 🗄️ DATABASE ARCHITECTURE

### **Current State**: Hybrid PostgreSQL Architecture

After 5 database deletion incidents, we implemented a **dual-database disaster recovery system**.

```
┌─────────────────────────────────────────────────────┐
│  ACTUAL PRODUCTION SETUP (Jan 2026)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PRIMARY DATABASE                                   │
│  ├── Docker PostgreSQL 16                          │
│  ├── Port: 5432                                     │
│  ├── Used for: Active development                   │
│  └── docker-compose.yml configuration               │
│                                                     │
│  BACKUP DATABASE (Disaster Recovery)                │
│  ├── Local PostgreSQL 17                            │
│  ├── Port: 5433                                     │
│  ├── Used for: Emergency fallback                   │
│  └── Synced via automated backups                   │
│                                                     │
│  AUTOMATED BACKUPS                                  │
│  ├── PostgreSQL dumps: 2:00 AM (daily)             │
│  ├── Strapi exports: 2:05 AM (daily)               │
│  ├── Retention: 7 days                              │
│  └── Scripts: backup-database.ps1, backup-strapi.ps1│
│                                                     │
│  RECOVERY CAPABILITY                                │
│  ├── PostgreSQL restore: 35 seconds                │
│  ├── Strapi import: 28 seconds                     │
│  └── Zero data loss since Dec 28, 2025             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### **Database Configuration**

**Development** (`apps/strapi/.env`):

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=temppass123  # TODO: Rotate after migration
DATABASE_SSL=false
```

**Production** (`apps/strapi/config/env/production/database.ts`):

```typescript
connection: {
  client: 'postgres',
  connection: {
    connectionString: env('DATABASE_URL'),
    host: env('DATABASE_HOST', 'localhost'),
    port: env.int('DATABASE_PORT', 5432),
    database: env('DATABASE_NAME', 'strapi'),
    user: env('DATABASE_USERNAME', 'strapi'),
    password: env('DATABASE_PASSWORD', 'strapi'),
    ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
    schema: env('DATABASE_SCHEMA', 'public'),
  }
}
```

### **Why PostgreSQL?**

**Before (Oct-Dec 2025)**: SQLite

- ❌ Too easy to delete (single .db file)
- ❌ No separation between test/dev databases
- ❌ 4 accidental deletions in 3 weeks
- ❌ Final straw: Dec 21-22 incident

**After (Dec 22, 2025+)**: PostgreSQL Dual Setup

- ✅ Robust, industry-standard database
- ✅ Dual database = disaster recovery protection
- ✅ Automated daily backups
- ✅ Tested recovery procedures (35s restore)
- ✅ Zero incidents since migration

**ADR Reference**: ADR-002 (Sprint 2 doc)

---

## 🧪 TESTING ARCHITECTURE

### **Current Strategy**: MSW + Playwright (User Behavior Testing)

**Critical Philosophy Shift** (Dec 15, 2025):

> "Test what users see and do, NOT Strapi internals"

### **Testing Layers**

```
┌─────────────────────────────────────────────────────┐
│  TESTING ARCHITECTURE (Jan 2026)                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  E2E TESTS (apps/ui/tests/e2e/)                    │
│  ├── Framework: Playwright                          │
│  ├── Mock API: MSW (Mock Service Worker)           │
│  ├── Purpose: User behavior testing                │
│  ├── Tests: 55 passing                              │
│  ├── Duration: 2-3 minutes                          │
│  ├── CI Success: 95%+                               │
│  └── NO database, NO backend required               │
│                                                     │
│  INTEGRATION TESTS (apps/ui/tests/integration/)     │
│  ├── Framework: Playwright                          │
│  ├── Purpose: Real Strapi API testing              │
│  ├── Tests: 9 passing                               │
│  ├── Duration: 3-4 minutes                          │
│  └── Requires: Real Strapi backend                 │
│                                                     │
│  VISUAL REGRESSION (Chromatic)                      │
│  ├── Framework: Storybook + Chromatic              │
│  ├── Purpose: Component visual testing             │
│  ├── Duration: 2-3 minutes                          │
│  └── Triggers: UI changes only                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### **MSW Implementation**

**Why MSW?** (Dec 15, 2025 decision)

- ✅ 2-3x faster tests (no backend startup)
- ✅ No database dependencies (can't delete prod data!)
- ✅ Reliable (no network/timing issues)
- ✅ Follows Playwright best practice: "Avoid testing third-party dependencies"

**Architecture**:

```typescript
// apps/ui/tests/e2e/fixtures/msw-handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Strapi API responses
  http.get('http://127.0.0.1:1337/api/pages', () => {
    return HttpResponse.json({
      data: mockPageData, // From fixtures
      meta: { pagination: {...} }
    });
  }),

  http.post('http://127.0.0.1:1337/api/contact-messages', () => {
    return HttpResponse.json({
      data: { id: 1, attributes: {...} }
    });
  })
];
```

**Test Pattern**:

```typescript
// ✅ NEW WAY: User behavior
test("user can submit contact form", async ({ page }) => {
  await page.goto("/contact")
  await page.fill('[name="email"]', "user@example.com")
  await page.click('button[type="submit"]')

  // Test what USER SEES
  await expect(page.getByText("Thank you!")).toBeVisible()
})

// ❌ OLD WAY: Implementation testing (Nov-Dec 14, 2025)
test("contact form submission", async ({ page }) => {
  await seedDatabase() // Fragile
  await startStrapi() // Slow (30-60s)
  // ... API calls, database verification
  // Result: 40% CI success rate, dangerous
})
```

**Results**:

- CI Success: 40% → 95%+ (**+137% improvement**)
- Test Time: 6-8 min → 2-3 min (**-60% faster**)
- Database Incidents: 0 (since MSW adoption)

**Reference Documents**:

- `apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md` (Gold Standard)
- `apps/ui/tests/e2e/README.md`
- `docs/13-testing/MSW_IMPLEMENTATION.md`

**ADR Reference**: ADR-001 (Sprint 2 doc)

---

## 🔄 CI/CD WORKFLOWS

### **Current State**: 7 Production-Ready Workflows

All workflows located in `.github/workflows/`

#### **1. ci.yml** - Continuous Integration

- **Purpose**: Build verification, linting, type checking
- **Triggers**: Push to main, PRs
- **Jobs**:
  - Lint (ESLint, Prettier)
  - Build all apps (Strapi + UI)
  - TypeScript type checking
- **Duration**: ~4 minutes
- **Status**: ✅ Production-ready

#### **2. e2e-tests.yml** - End-to-End Testing

- **Purpose**: MSW-based user behavior tests
- **Triggers**: Push to main, PRs (path filtered)
- **Features**:
  - MSW mock server (no Strapi needed)
  - Chromium only in CI (resource optimization)
  - Artifact uploads: report, traces, test-results
  - Path filters: Skip on docs changes
- **Duration**: ~3-4 minutes (55 tests)
- **Success Rate**: 95%+
- **Status**: ✅ Production-ready

#### **3. integration-tests.yml** - Integration Testing

- **Purpose**: Real Strapi API integration tests
- **Triggers**: Push to main, PRs (path filtered)
- **Features**:
  - Real Strapi backend (no mocks)
  - MSW bridge for orchestration
  - Force trace generation (`--trace on`) ← Fixed Jan 1, 2026 (PR #63)
  - Consistent 1.9 MB artifacts
- **Duration**: ~3-4 minutes (9 tests)
- **Status**: ✅ Production-ready

#### **4. visual-regression.yml** - Visual Testing

- **Purpose**: Chromatic visual regression testing
- **Triggers**: PRs with UI changes
- **Features**:
  - Storybook-based visual testing
  - Auto-accept on main branch
  - Only changed stories tested
- **Duration**: ~2-3 minutes
- **Status**: ✅ Production-ready

#### **5. backup.yml** - Database Backup Automation

- **Purpose**: Daily PostgreSQL + Strapi backups
- **Schedule**: 2:00 AM (database), 2:05 AM (Strapi)
- **Features**:
  - Test mode for safe CI validation
  - 7-day retention with auto-cleanup
  - Error handling and logging
- **Scripts**: `backup-database.ps1`, `backup-strapi.ps1`
- **Status**: ✅ Production-ready

#### **6. dependabot-auto-merge.yml** - Dependency Automation

- **Purpose**: Auto-merge Dependabot PRs after tests pass
- **Features**:
  - Only patch/minor updates
  - Requires all checks to pass
  - Skips E2E/Integration tests (optimization)
- **Impact**: Saves ~30 min/week
- **Status**: ✅ Production-ready

#### **7. cleanup-caches.yml** - Cache Management

- **Purpose**: Clean up old GitHub Actions caches
- **Schedule**: Weekly (Sunday 2:00 AM)
- **Why**: Prevent cache bloat (10GB limit)
- **Status**: ✅ Production-ready

### **Workflow Optimizations**

**Path Filtering** (PR #62 - Dec 31, 2025):

```yaml
on:
  push:
    branches: [main]
    paths:
      - "apps/**"
      - "packages/**"
      - ".github/workflows/ci.yml" # ← Critical: Workflow changes trigger tests
      - "!**/*.md" # Skip docs changes
```

**Why**: Learned from PR #61 failure - workflow changes MUST trigger tests

**Artifact Generation** (PR #63 - Jan 1, 2026):

```yaml
- name: Run integration tests
  run: yarn workspace @repo/ui playwright test tests/integration --trace on # ← Force traces
```

**Why**: Integration tests passing without failures = no artifacts = warnings

**ADR References**:

- ADR-004: Path-Filtered Workflows
- ADR-005: Force Trace Generation

### **CI/CD Health Metrics** (Jan 1, 2026)

| Metric                 | Status           | Notes                        |
| ---------------------- | ---------------- | ---------------------------- |
| **CI Success Rate**    | 95%+             | ✅ Up from 40% (Nov 2025)    |
| **E2E Tests**          | 55 passing       | ✅ MSW-based, fast, reliable |
| **Integration Tests**  | 9 passing        | ✅ Real API validated        |
| **Visual Regression**  | Automated        | ✅ Chromatic integration     |
| **Build Time**         | ~4 min           | ✅ Optimized                 |
| **Database Incidents** | 0 (since Dec 28) | ✅ Backup system working     |
| **Backup Health**      | Daily automated  | ✅ 7-day retention           |
| **Recovery Tested**    | Yes (35s)        | ✅ Documented procedures     |
| **Workflow Warnings**  | Zero             | ✅ Clean artifacts           |
| **False CI Failures**  | Zero             | ✅ Path filters working      |

**Reference Documents**:

- `docs/08-devops/workflows/01-ci-workflow.md`
- `docs/08-devops/workflows/02-e2e-workflow.md`
- `docs/08-devops/workflows/03-lighthouse-workflow.md`
- `docs/08-devops/workflows/04-visual-regression-workflow.md`
- `docs/08-devops/workflows/05-cache-cleanup-workflow.md`
- `docs/08-devops/workflows/06-database-backup-workflow.md`
- ⚠️ **TODO**: Integration tests workflow not documented yet

---

## 🚀 DEPLOYMENT STRATEGY

### **Current State**: Options Under Evaluation

**Decision Status**: ⏳ **NOT YET DECIDED** - Active discussion phase

As of January 1, 2026, the project has THREE viable deployment options being evaluated. No production deployment has been made yet.

---

### **Option 1: Heroku (Backend + Frontend)**

**Status**: 🟡 **Prepared but not deployed**

**Heroku-Specific Files Present**:

- `apps/strapi/Procfile`
- `apps/ui/Procfile`
- `scripts/heroku/heroku-postbuild.sh`

**Strapi Procfile**:

```
web: cd apps/strapi && yarn start
release: cd apps/strapi && yarn build
```

**UI Procfile**:

```
web: cd apps/ui && yarn start
```

**Pros**:

- ✅ Platform-as-a-Service (zero server management)
- ✅ PostgreSQL add-on (one-click)
- ✅ Git-based deployment (`git push heroku main`)
- ✅ Automatic SSL certificates
- ✅ Simple environment variable management
- ✅ Built-in monitoring and logging

**Cons**:

- ❌ Dyno sleep on free tier (must upgrade)
- ❌ File uploads lost on dyno restart (requires S3)
- ❌ More expensive than VPS at scale
- ❌ Less control over infrastructure

**Required Configuration**:

```env
# Heroku-specific .env additions
AWS_ACCESS_KEY_ID=xxx          # S3 for file uploads
AWS_ACCESS_SECRET=xxx
AWS_REGION=us-east-1
AWS_BUCKET=my-strapi-bucket

APP_URL=https://my-app.herokuapp.com
NODE_ENV=production
```

**S3 Requirement**:

> "In Heroku deployments you always should use S3 (or different external) storage instead of default local upload directory. Heroku resets dyno periodically (at least once a day or after every re-deploy) and so all uploaded files are removed."

**Deployment Steps** (Not executed yet):

```bash
# 1. Create Heroku app
heroku create my-strapi-app

# 2. Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set ADMIN_JWT_SECRET=xxx
# ... (all secrets)

# 4. Deploy
git push heroku main
```

**Reference Documents**:

- `apps/strapi/README.md` (AWS S3 section)
- `docs/14-deep-dives/docker/02-PRODUCTION.md`
- `content/articles/series-5-thought-leadership/5.1-solo-developer-tech-stack-2025.md`

---

### **Option 2: Hostinger VPS (Backend) + Vercel (Frontend)**

**Status**: 🟢 **Recommended for full control**

**Strategy**: Split deployment for optimal performance

#### **Backend: Hostinger VPS**

**Why Hostinger VPS?**

- ✅ Full server control (root access)
- ✅ Persistent file storage (no S3 required)
- ✅ Cheaper than Heroku at scale (~$4-8/month)
- ✅ Can run Docker containers
- ✅ Direct database access
- ✅ Custom NGINX configuration

**Server Requirements**:

- **RAM**: 2GB minimum (4GB recommended for Strapi)
- **Storage**: 50GB SSD
- **OS**: Ubuntu 22.04 LTS
- **Node.js**: v20+
- **PostgreSQL**: 16+
- **PM2**: For process management

**Deployment Architecture**:

```
┌─────────────────────────────────────────────────────┐
│  HOSTINGER VPS (Backend)                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  NGINX (Reverse Proxy)                              │
│  ├── Port 80 → 443 redirect                         │
│  ├── Port 443 → Strapi (1337)                       │
│  ├── SSL: Let's Encrypt (Certbot)                   │
│  └── Domain: api.yourdomain.com                     │
│                                                     │
│  STRAPI (Node.js App)                               │
│  ├── Port: 1337                                     │
│  ├── Process Manager: PM2                           │
│  ├── Auto-restart on crash                          │
│  └── Logs: PM2 log management                       │
│                                                     │
│  POSTGRESQL (Database)                              │
│  ├── Port: 5432 (localhost only)                    │
│  ├── Daily backups via cron                         │
│  └── 7-day retention                                │
│                                                     │
│  FILE STORAGE                                       │
│  ├── Local: /var/www/strapi/public/uploads         │
│  ├── Persistent across restarts                     │
│  └── Backup via rsync to remote storage            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**VPS Setup Steps** (Not executed yet):

```bash
# 1. SSH into VPS
ssh root@your-vps-ip

# 2. Install dependencies
apt update && apt upgrade -y
apt install -y nodejs npm postgresql nginx certbot python3-certbot-nginx
npm install -g pm2 yarn

# 3. Setup PostgreSQL
sudo -u postgres createuser strapi_user -P
sudo -u postgres createdb strapi_db -O strapi_user

# 4. Clone repository
cd /var/www
git clone https://github.com/Herman-Adu/strapi-next-monorepo-v2.git
cd strapi-next-monorepo-v2

# 5. Install and build
yarn install
yarn workspace @repo/strapi build

# 6. Setup environment
cp apps/strapi/.env.example apps/strapi/.env
# Edit .env with production values

# 7. Start with PM2
cd apps/strapi
pm2 start yarn --name "strapi" -- start
pm2 startup
pm2 save

# 8. Setup NGINX
nano /etc/nginx/sites-available/strapi
# (NGINX config below)
ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 9. Setup SSL
certbot --nginx -d api.yourdomain.com
```

**NGINX Configuration**:

```nginx
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 250M;  # Match Strapi upload limit
}
```

**PM2 Ecosystem File** (`ecosystem.config.js`):

```javascript
module.exports = {
  apps: [
    {
      name: "strapi",
      cwd: "/var/www/strapi-next-monorepo-v2/apps/strapi",
      script: "yarn",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 1337,
      },
    },
  ],
}
```

**Automated Backups** (Cron):

```bash
# Daily PostgreSQL backup (2:00 AM)
0 2 * * * /usr/bin/pg_dump -U strapi_user strapi_db | gzip > /backups/postgres/strapi_$(date +\%Y\%m\%d).sql.gz

# Daily Strapi export (2:05 AM)
5 2 * * * cd /var/www/strapi-next-monorepo-v2/apps/strapi && yarn strapi export --file /backups/strapi/export_$(date +\%Y\%m\%d).tar.gz

# Cleanup old backups (keep 7 days)
0 3 * * * find /backups -type f -mtime +7 -delete
```

**Pros**:

- ✅ Full control (root access)
- ✅ No file upload issues (persistent storage)
- ✅ Cheaper long-term (~$4-8/month)
- ✅ Can optimize NGINX caching
- ✅ Direct database access for debugging
- ✅ Custom SSL/security configurations

**Cons**:

- ❌ Requires server management skills
- ❌ Manual security updates
- ❌ Self-managed monitoring
- ❌ More setup complexity

---

#### **Frontend: Vercel (Recommended)**

**Why Vercel for Next.js?**

- ✅ Built by Next.js creators (optimal integration)
- ✅ Edge network (global CDN)
- ✅ Automatic deployments (GitHub integration)
- ✅ Zero configuration for Next.js App Router
- ✅ Serverless functions support
- ✅ Free tier generous (100GB bandwidth)

**Deployment Architecture**:

```
┌─────────────────────────────────────────────────────┐
│  VERCEL (Frontend)                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  NEXT.JS APP (apps/ui)                              │
│  ├── Deployed to: https://yourdomain.com           │
│  ├── Build: Automatic on git push                   │
│  ├── Edge Functions: /api routes                    │
│  └── Static Assets: CDN-optimized                   │
│                                                     │
│  ENVIRONMENT VARIABLES                              │
│  ├── NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com │
│  ├── NEXT_PUBLIC_SITE_URL=https://yourdomain.com   │
│  ├── NEXTAUTH_URL=https://yourdomain.com           │
│  └── STRAPI_API_TOKEN=xxx (for authenticated API)  │
│                                                     │
│  CUSTOM DOMAIN                                      │
│  ├── Domain: yourdomain.com                         │
│  ├── SSL: Automatic (Let's Encrypt)                │
│  └── DNS: Configured in domain registrar           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Vercel Deployment Steps** (Not executed yet):

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Link project
cd apps/ui
vercel link

# 4. Set environment variables (via CLI or dashboard)
vercel env add NEXT_PUBLIC_STRAPI_URL production
vercel env add NEXTAUTH_SECRET production
# ... (all env vars)

# 5. Deploy
vercel --prod

# 6. Configure custom domain (Vercel dashboard)
# Settings → Domains → Add yourdomain.com

# 7. Setup GitHub integration (automatic deployments)
# Vercel dashboard → Git → Connect GitHub repo
```

**Environment Variables** (Production):

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-random-secret>

# Strapi API Token (for authenticated requests)
STRAPI_API_TOKEN=<your-strapi-api-token>

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Pros**:

- ✅ Zero infrastructure management
- ✅ Automatic scaling
- ✅ Built-in CDN
- ✅ Preview deployments for PRs
- ✅ Automatic HTTPS
- ✅ Edge Functions (serverless API routes)

**Cons**:

- ❌ Vendor lock-in (Vercel-specific features)
- ❌ Limited server-side capabilities (compared to VPS)
- ❌ Costs can increase with traffic

---

### **Option 3: Full Docker + VPS (Advanced)**

**Status**: 🔵 **Alternative approach**

**Strategy**: Containerize everything, deploy to single VPS

**Architecture**:

```
┌─────────────────────────────────────────────────────┐
│  VPS (Single Server)                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  DOCKER COMPOSE (Orchestration)                     │
│  ├── Container 1: NGINX (Reverse Proxy)            │
│  ├── Container 2: Strapi (Backend)                 │
│  ├── Container 3: Next.js (Frontend)               │
│  └── Container 4: PostgreSQL (Database)            │
│                                                     │
│  NGINX ROUTING                                      │
│  ├── yourdomain.com → Next.js container (3000)     │
│  ├── api.yourdomain.com → Strapi container (1337)  │
│  └── SSL: Let's Encrypt (Certbot)                  │
│                                                     │
│  PERSISTENT VOLUMES                                 │
│  ├── /var/lib/postgresql/data (database)           │
│  ├── /app/public/uploads (Strapi uploads)          │
│  └── /backups (automated backups)                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**docker-compose.yml** (Simplified):

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - strapi
      - nextjs

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: strapi_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: strapi_db
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  strapi:
    build:
      context: .
      dockerfile: apps/strapi/Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
    volumes:
      - strapi_uploads:/app/apps/strapi/public/uploads
    depends_on:
      - postgres
    ports:
      - "1337:1337"

  nextjs:
    build:
      context: .
      dockerfile: apps/ui/Dockerfile
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_STRAPI_URL: http://strapi:1337
    depends_on:
      - strapi
    ports:
      - "3000:3000"

volumes:
  db_data:
  strapi_uploads:
```

**Pros**:

- ✅ Complete isolation (containers)
- ✅ Easy scaling (add more containers)
- ✅ Consistent across environments
- ✅ Simple rollback (previous image)
- ✅ All services on one server (cost-effective)

**Cons**:

- ❌ More complex setup
- ❌ Requires Docker knowledge
- ❌ Resource-intensive (all services on one server)
- ❌ Manual orchestration management

**Reference Documents**:

- `apps/strapi/Dockerfile`
- `apps/ui/Dockerfile`
- `apps/strapi/docker-compose.yml` (development)
- `docs/14-deep-dives/docker/01-FUNDAMENTALS.md`
- `docs/14-deep-dives/docker/02-PRODUCTION.md`

---

### **Deployment Decision Matrix**

| Criteria          | Heroku         | VPS (Hostinger) + Vercel | Docker + VPS   |
| ----------------- | -------------- | ------------------------ | -------------- |
| **Ease of Setup** | 🟢 Easiest     | 🟡 Moderate              | 🔴 Complex     |
| **Monthly Cost**  | 🔴 $25-50      | 🟢 $12-20                | 🟢 $8-15       |
| **Control**       | 🔴 Limited     | 🟢 Full                  | 🟢 Full        |
| **Scaling**       | 🟢 Automatic   | 🟡 Manual                | 🟢 Easy        |
| **File Storage**  | 🔴 Requires S3 | 🟢 Persistent            | 🟢 Persistent  |
| **Maintenance**   | 🟢 Zero        | 🟡 Medium                | 🔴 High        |
| **Performance**   | 🟡 Good        | 🟢 Excellent             | 🟢 Excellent   |
| **Rollback**      | 🟢 Easy        | 🟡 Manual                | 🟢 Easy        |
| **Monitoring**    | 🟢 Built-in    | 🔴 Self-hosted           | 🔴 Self-hosted |

### **Recommendation** (Based on Current Needs)

**For Production Launch**: **Option 2 (VPS + Vercel)**

**Why?**

1. **Cost-Effective**: ~$12-20/month vs. $25-50 (Heroku)
2. **No S3 Required**: Persistent file storage on VPS
3. **Best of Both Worlds**:
   - Strapi on VPS (full control, persistent storage)
   - Next.js on Vercel (optimal performance, zero config)
4. **Scalability**: Can upgrade VPS or migrate to Docker later
5. **Learning Curve**: Moderate (not as complex as full Docker)

**Next Steps to Deploy**:

1. ⏳ **Choose VPS provider** (Hostinger, DigitalOcean, Linode)
2. ⏳ **Setup domain** (register or transfer domain)
3. ⏳ **Configure DNS** (api.yourdomain.com → VPS, yourdomain.com → Vercel)
4. ⏳ **Deploy backend to VPS** (follow Hostinger VPS steps above)
5. ⏳ **Deploy frontend to Vercel** (follow Vercel steps above)
6. ⏳ **Setup automated backups** (cron jobs on VPS)
7. ⏳ **Configure monitoring** (Sentry, Uptime Robot)
8. ⏳ **Load test** (ensure performance)

---

## 🛠️ TOOLS & VERSIONS

### **Backend (Strapi)**

| Tool           | Version                 | Purpose      |
| -------------- | ----------------------- | ------------ |
| **Strapi**     | 5.8+                    | Headless CMS |
| **Node.js**    | 20+                     | Runtime      |
| **TypeScript** | 5.x                     | Type safety  |
| **PostgreSQL** | 16 (Docker), 17 (Local) | Database     |

### **Frontend (Next.js)**

| Tool             | Version | Purpose              |
| ---------------- | ------- | -------------------- |
| **Next.js**      | 15.1+   | React framework      |
| **React**        | 19+     | UI library           |
| **TypeScript**   | 5.x     | Type safety          |
| **Tailwind CSS** | v4      | Styling              |
| **Radix UI**     | Latest  | Component primitives |

### **Testing**

| Tool           | Version | Purpose                    |
| -------------- | ------- | -------------------------- |
| **Playwright** | Latest  | E2E testing                |
| **MSW**        | Latest  | API mocking                |
| **Vitest**     | Latest  | Unit testing (minimal use) |
| **Storybook**  | Latest  | Component development      |
| **Chromatic**  | Latest  | Visual regression          |

### **DevOps**

| Tool               | Version | Purpose                       |
| ------------------ | ------- | ----------------------------- |
| **Docker**         | 24+     | Containerization              |
| **Docker Compose** | 2.x     | Multi-container orchestration |
| **GitHub Actions** | N/A     | CI/CD pipelines               |
| **Husky**          | 9.x     | Git hooks                     |
| **lint-staged**    | Latest  | Pre-commit linting            |
| **Turborepo**      | Latest  | Monorepo build system         |

### **Code Quality**

| Tool                  | Version | Purpose                       |
| --------------------- | ------- | ----------------------------- |
| **ESLint**            | 9.x     | JavaScript/TypeScript linting |
| **Prettier**          | 3.x     | Code formatting               |
| **TypeScript ESLint** | Latest  | TypeScript-specific linting   |
| **commitlint**        | Latest  | Commit message linting        |

---

## 📝 STANDARD WORKFLOW (NON-NEGOTIABLE)

Every development session follows this pattern:

```
Development → Test → Build Locally → Format/Lint → Commit → Push
```

**Enforcement**:

- Pre-commit hooks (Husky)
- Lint-staged for formatting
- Manual verification step
- Documented in `PRE_COMMIT_VALIDATION_WORKFLOW.md`

**Example**:

```bash
# 1. Development
yarn workspace @repo/ui dev

# 2. Test (if applicable)
yarn workspace @repo/ui playwright test

# 3. Build Locally (verify no errors)
yarn build

# 4. Format/Lint (automatic via pre-commit hook, or manual)
yarn format
yarn lint

# 5. Commit (Husky runs format check)
git add .
git commit -m "feat: add new feature"

# 6. Push
git push origin main
```

**If pre-commit hook fails** (formatting issues):

```bash
# Format manually
yarn format

# Commit with --no-verify (ONLY if already formatted)
git commit --no-verify -m "style: format files"
```

---

## 🗂️ CONTENT & DOCUMENTATION

### **Content Folder** (`content/`)

**Purpose**: Planning docs, article drafts, social media content

- `content/articles/` - Article drafts (5 series)
- `content/tutorials/` - Tutorial outlines (4 series)
- `content/social-media/` - Social media content
- `content/planning/` - Sprint planning, progress tracking

**Status**: ⚠️ Needs rebuild after docs/ overhaul (Sprint 8)

### **Docs Library** (`docs/`)

**Purpose**: Technical documentation for development

**Structure** (01-17 organization):

- `docs/01-getting-started/` - Installation, quick start
- `docs/02-architecture/` - Component architecture, spacing
- `docs/03-strapi/` - Strapi integration, best practices
- `docs/04-components/` - Component patterns, development guide
- `docs/05-styling/` - Tailwind v4, theme system
- `docs/06-workflows/` - Development workflows, automation
- `docs/07-content-manager/` - Test data, content creation
- `docs/08-devops/` - CI/CD, workflows, disaster recovery
- `docs/09-troubleshooting/` - Playbooks, common issues
- `docs/10-reference/` - Quick reference, project status
- `docs/11-recovery/` - Session recovery, incident reports
- `docs/12-planning/` - Future planning, refactoring
- `docs/13-testing/` - E2E, integration, visual testing
- `docs/14-deep-dives/` - Advanced topics (Strapi 5, Docker)
- `docs/15-professional-presence/` - Portfolio, CTO positioning
- `docs/16-platform-vision/` - Long-term vision
- `docs/17-learning-lessons/` - Incident learnings, history

**Status**:

- ✅ 252 files catalogued (Sprint 1)
- ⚠️ 45% need updates
- ⚠️ 40% need archiving
- ⚠️ Many npx/npm references (WRONG - should be yarn workspace)

**Next Steps** (Sprint 4+):

- Remove npx/npm references
- Update outdated testing docs
- Consolidate scattered information
- Archive obsolete content

---

## 🔐 SECURITY & SECRETS

### **Environment Variables**

**Development** (`.env.local`, `.env`):

- ⚠️ Contains default/insecure secrets (acceptable for local dev)

**Production** (Not yet deployed):

- 🔴 **CRITICAL**: All secrets MUST be rotated before production
- 🔴 **TODO**: PostgreSQL password rotation (currently `temppass123`)

**Secrets Management**:

```bash
# Generate secure secrets (32 bytes base64)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Required secrets for production:
APP_KEYS=generated,generated
API_TOKEN_SALT=generated
ADMIN_JWT_SECRET=generated
TRANSFER_TOKEN_SALT=generated
JWT_SECRET=generated
NEXTAUTH_SECRET=generated
DATABASE_PASSWORD=generated
```

### **Git Hooks** (Husky)

**Pre-commit**:

- Runs lint-staged (Prettier formatting)
- Ensures code quality before commit

**Commit-msg**:

- Validates commit message format (commitlint)
- Enforces Conventional Commits

---

## 📊 CURRENT METRICS

### **Project Stats** (Jan 1, 2026)

- **Total Commits**: 321 (since Oct 30, 2025)
- **Duration**: 63 days (2 months + 2 days)
- **Contributors**: 1 (Herman-Adu) + Dependabot
- **Documentation Files**: 252 markdown files
- **E2E Tests**: 55 passing (95%+ success rate)
- **Integration Tests**: 9 passing
- **Database Incidents**: 0 (since Dec 28, 2025)

### **Performance**

- **CI Build Time**: ~4 minutes
- **E2E Test Time**: 2-3 minutes (down from 6-8 min)
- **Integration Test Time**: 3-4 minutes
- **PostgreSQL Recovery**: 35 seconds
- **Strapi Import**: 28 seconds

### **Evolution**

| Metric                    | Nov 2025 | Jan 2026 | Change    |
| ------------------------- | -------- | -------- | --------- |
| CI Success Rate           | 40%      | 95%+     | **+137%** |
| E2E Test Time             | 6-8 min  | 2-3 min  | **-60%**  |
| Database Incidents        | 4        | 0        | **-100%** |
| Manual Dependency Updates | 100%     | 5%       | **-95%**  |
| False CI Failures         | Common   | Zero     | **-100%** |

---

## ✅ WHAT WORKS RIGHT NOW

**Confirmed Working** (Jan 1, 2026):

1. ✅ **Monorepo**: Yarn workspaces + Turborepo
2. ✅ **Database**: Dual PostgreSQL architecture (Docker + Local)
3. ✅ **Backups**: Automated daily backups (2AM, 7-day retention)
4. ✅ **Testing**: MSW + Playwright (95%+ success rate)
5. ✅ **CI/CD**: 7 production-ready workflows
6. ✅ **Development**: Local dev environment (Strapi + Next.js)
7. ✅ **Type Safety**: TypeScript strict mode across monorepo
8. ✅ **Code Quality**: ESLint + Prettier + Husky
9. ✅ **Recovery**: Tested disaster recovery (35s/28s)
10. ✅ **Documentation**: 252 files (being overhauled)

---

## ⚠️ KNOWN ISSUES & TECHNICAL DEBT

### **High Priority**

1. **PostgreSQL Password**: Still using `temppass123` (temporary from Dec 22 migration)

   - **Action**: Rotate password before any production deployment
   - **Reference**: `docs/11-recovery/postgresql-migration-dec-22-2025.md`

2. **npx/npm Commands**: Scattered throughout documentation

   - **Action**: Global find/replace in Sprint 4
   - **Correct**: `yarn workspace @repo/[app] [command]`

3. **Deployment Strategy**: Not decided yet

   - **Action**: Choose between Heroku, VPS+Vercel, or Docker+VPS
   - **Blocker**: Prevents production launch

4. **Integration Tests Workflow**: Not documented
   - **Action**: Create `docs/08-devops/workflows/07-integration-tests-workflow.md`

### **Medium Priority**

5. **Content Folder**: Needs rebuild after docs overhaul

   - **Action**: Sprint 8 - Rebuild content from updated docs

6. **Outdated Testing Docs**: Reference old implementation testing

   - **Action**: Sprint 5-6 - Update to MSW patterns

7. **AWS S3 Configuration**: Prepared but not configured
   - **Action**: Only needed if deploying to Heroku
   - **Required**: `AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET`, `AWS_REGION`, `AWS_BUCKET`

### **Low Priority**

8. **SQLite References**: Some docs still mention SQLite

   - **Action**: Remove during Sprint 5 restructure

9. **Heroku Files**: Procfiles present but not used
   - **Action**: Remove if VPS+Vercel chosen, keep if Heroku chosen

---

## 📚 GOLD STANDARD DOCUMENTS

These documents are **current, accurate, and should be referenced frequently**:

1. **MONOREPO_COMMAND_REFERENCE.md** - All yarn workspace commands
2. **PRE_COMMIT_VALIDATION_WORKFLOW.md** - Standard workflow
3. **apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md** - MSW patterns
4. **docs/SPRINT-1-DOCUMENTATION-INVENTORY.md** - Documentation baseline
5. **docs/SPRINT-2-GIT-HISTORY-EVOLUTION.md** - Project evolution timeline

---

## 🎯 NEXT STEPS (POST-SPRINT 3)

### **Sprint 4: Gap Analysis**

- Compare inventory vs. current state
- Identify critical gaps (CI/CD workflows, MSW consolidation)
- Flag dangerous inaccuracies (npx/npm)
- Expansion opportunities
- Create prioritized work plan

### **Sprint 5: Core Library Restructure**

- Update docs/01-17 with current reality
- Remove/archive obsolete content
- Add missing critical sections

### **Sprint 6: Consolidate Scattered Docs**

- Process scattered docs from inventory
- Merge or keep as READMEs
- Update internal links
- Eliminate orphaned files

### **Sprint 7: Professional Presence Documentation**

- CTO tier: Architecture Decision Records
- Lead tier: Team workflows, quality gates
- Developer tier: Getting started, examples
- Portfolio pieces: Case studies

### **Sprint 8: Living Documentation System**

- Create documentation templates
- Define monthly consolidation process
- Integrate into standard workflow
- Document the documentation process

---

**STATUS**: Sprint 3 Complete - Ready for Sprint 4 (Gap Analysis)  
**NEXT**: Identify critical gaps and create prioritized work plan
