# Installation Guide

## Complete Setup Guide for Strapi + Next.js Monorepo

This guide covers everything from initial clone to running the full development environment.

---

## Prerequisites

### Required Software

| Software              | Version | Required       | Installation                                      |
| --------------------- | ------- | -------------- | ------------------------------------------------- |
| **Node.js**           | 22.x.x  | ✅ Required    | [Download](https://nodejs.org/)                   |
| **Yarn**              | 1.22.x  | ✅ Required    | `npm install -g yarn`                             |
| **Git**               | Latest  | ✅ Required    | [Download](https://git-scm.com/)                  |
| **PostgreSQL**        | 14+     | ⚠️ Recommended | [Download](https://www.postgresql.org/) or Docker |
| **Docker** (optional) | Latest  | ⚙️ Optional    | [Download](https://www.docker.com/)               |

### System Requirements

- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: ~2GB for dependencies + build artifacts

---

## Quick Start (5 Minutes)

### 1. Clone Repository

```bash
git clone https://github.com/Herman-Adu/strapi-next-monorepo-v2.git
cd strapi-next-monorepo-v2
```

### 2. Install Dependencies

```bash
yarn install
```

**What happens**:

- Installs all packages across monorepo
- Sets up Husky git hooks
- Creates `.env` files with default values (via `postinstall` script)

### 3. Configure Environment Variables

#### Option A: Use Defaults (SQLite - Development Only)

```bash
# The postinstall script already created .env files
# You can start immediately with SQLite
```

#### Option B: Use PostgreSQL (Recommended for Production)

```bash
# Edit apps/strapi/.env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false
```

### 4. Start Development Servers

```bash
yarn dev
```

**This starts**:

- Strapi: `http://localhost:1337`
- Next.js: `http://localhost:3000`

**Wait for**:

- Strapi admin to be created (follow prompts)
- Next.js compilation to complete

---

## Detailed Installation

### Step 1: Environment Setup

#### Create PostgreSQL Database (If Using PostgreSQL)

**Using Docker**:

```bash
docker run --name strapi-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=strapi_db \
  -p 5432:5432 \
  -d postgres:14
```

**Using PostgreSQL Directly**:

```sql
CREATE DATABASE strapi_db;
CREATE USER strapi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE strapi_db TO strapi_user;
```

#### Configure Strapi Environment

**File**: `apps/strapi/.env`

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets (CHANGE THESE IN PRODUCTION!)
APP_KEYS=toBeModified1,toBeModified2
API_TOKEN_SALT=toBeModified
ADMIN_JWT_SECRET=toBeModified
TRANSFER_TOKEN_SALT=toBeModified
JWT_SECRET=toBeModified

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false
```

**Generate Secure Secrets** (Production):

```bash
# Use Node.js to generate random strings
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Configure Next.js Environment

**File**: `apps/ui/.env.local`

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Strapi API Token (Optional - for authenticated requests)
STRAPI_API_TOKEN=your-strapi-api-token
```

---

### Step 2: Initial Build

#### Why Build First?

- Ensures all TypeScript types are generated
- Verifies environment configuration
- Catches errors early

```bash
# Clean any existing build artifacts
yarn clean

# Build all packages
yarn build
```

**Expected Output**:

```
✓ Generating static pages (54/54)
✓ Collecting build traces
✓ Finalizing page optimization

Tasks:    4 successful, 4 total
Time:     ~2 minutes
```

---

### Step 3: Database Setup

#### Create Strapi Admin User

1. Start Strapi:

   ```bash
   yarn dev:strapi
   ```

2. Open admin panel: `http://localhost:1337/admin`

3. Create admin account:

   - **Username**: admin (or your choice)
   - **Email**: your-email@example.com
   - **Password**: Strong password (min 8 chars)

4. Complete onboarding wizard

#### Seed Initial Data (Optional)

```bash
# Import content types and data
cd apps/strapi
yarn strapi import -f ../../backup/export.tar.gz
```

---

### Step 4: Development Workflow

#### Start All Services

```bash
yarn dev
```

**This runs**:

- Strapi on port 1337
- Next.js on port 3000
- Auto-reload on file changes

#### Start Individual Services

**Strapi Only**:

```bash
yarn dev:strapi
```

**Next.js Only**:

```bash
yarn dev:ui
```

**Production Mode**:

```bash
yarn build
yarn start:strapi  # Terminal 1
yarn start:ui      # Terminal 2
```

---

## Post-Installation

### Verify Installation

#### Check Strapi

1. Visit `http://localhost:1337/admin`
2. Login with admin credentials
3. Navigate to Content Manager
4. Create test content

#### Check Next.js

1. Visit `http://localhost:3000`
2. Should see homepage
3. Check `/docs/welcome` for documentation hub

### Common First-Time Issues

#### Port Already in Use

```bash
# Kill processes on ports
yarn kill:port 3000
yarn kill:port 1337
```

#### Database Connection Errors

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:

1. Verify PostgreSQL is running: `pg_isready`
2. Check credentials in `.env`
3. Ensure database exists

#### Module Not Found Errors

```
Error: Cannot find module '@repo/...'
```

**Solution**:

```bash
# Clean install
yarn clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
yarn install
```

---

## Package Scripts Reference

### Development

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `yarn dev`        | Start all services (orchestrated with wait-on) |
| `yarn dev:strapi` | Start Strapi only                              |
| `yarn dev:ui`     | Start Next.js only                             |

### Building

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `yarn build`        | Build all packages (clean + turbo build) |
| `yarn build:strapi` | Build Strapi only                        |
| `yarn build:ui`     | Build Next.js only                       |

### Cleaning

| Command             | Description                |
| ------------------- | -------------------------- |
| `yarn clean`        | Clean all build artifacts  |
| `yarn clean:strapi` | Remove `apps/strapi/dist/` |
| `yarn clean:ui`     | Remove `apps/ui/.next/`    |
| `yarn clean:turbo`  | Remove `.turbo/` cache     |

### Quality

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `yarn lint`         | Run ESLint across all packages   |
| `yarn format`       | Format code with Prettier        |
| `yarn format:check` | Check formatting without changes |

### Utilities

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `yarn kill:port <port>` | Kill process on specified port    |
| `yarn commit`           | Commitizen (conventional commits) |

---

## Project Structure

```
strapi-next-monorepo-v2/
├── apps/
│   ├── strapi/              # Strapi CMS (Backend)
│   │   ├── config/          # Configuration files
│   │   ├── src/
│   │   │   ├── api/         # API routes
│   │   │   ├── components/  # Strapi components
│   │   │   └── admin/       # Admin panel customization
│   │   └── .env             # Strapi environment variables
│   │
│   └── ui/                  # Next.js (Frontend)
│       ├── src/
│       │   ├── app/         # App router (Next.js 14+)
│       │   ├── components/  # React components
│       │   ├── lib/         # Utilities and helpers
│       │   └── styles/      # Global styles
│       └── .env.local       # Next.js environment variables
│
├── packages/
│   ├── design-system/       # Shared UI components
│   ├── eslint-config/       # Shared ESLint configs
│   ├── prettier-config/     # Shared Prettier config
│   ├── typescript-config/   # Shared TypeScript configs
│   └── shared-data/         # Shared types and constants
│
├── docs/                    # Documentation (Markdown)
├── scripts/                 # Build and utility scripts
├── .github/workflows/       # CI/CD pipelines
└── package.json             # Root package (workspace management)
```

---

## Environment Variables Reference

### Strapi Required Variables

| Variable              | Description                       | Example                        |
| --------------------- | --------------------------------- | ------------------------------ |
| `HOST`                | Server host                       | `0.0.0.0`                      |
| `PORT`                | Server port                       | `1337`                         |
| `APP_KEYS`            | Encryption keys (comma-separated) | `key1,key2,key3`               |
| `API_TOKEN_SALT`      | Salt for API tokens               | Random base64 string           |
| `ADMIN_JWT_SECRET`    | Admin JWT secret                  | Random base64 string           |
| `TRANSFER_TOKEN_SALT` | Salt for transfer tokens          | Random base64 string           |
| `JWT_SECRET`          | JWT secret for authentication     | Random base64 string           |
| `DATABASE_CLIENT`     | Database type                     | `postgres` or `sqlite`         |
| `DATABASE_HOST`       | Database host                     | `localhost`                    |
| `DATABASE_PORT`       | Database port                     | `5432`                         |
| `DATABASE_NAME`       | Database name                     | `strapi_db`                    |
| `DATABASE_USERNAME`   | Database user                     | `postgres`                     |
| `DATABASE_PASSWORD`   | Database password                 | Your password                  |
| `DATABASE_SSL`        | Use SSL for database              | `false` (local), `true` (prod) |

### Next.js Required Variables

| Variable                 | Description                | Example                 |
| ------------------------ | -------------------------- | ----------------------- |
| `NEXT_PUBLIC_SITE_URL`   | Frontend URL               | `http://localhost:3000` |
| `NEXT_PUBLIC_STRAPI_URL` | Strapi API URL             | `http://localhost:1337` |
| `NEXTAUTH_URL`           | NextAuth callback URL      | `http://localhost:3000` |
| `NEXTAUTH_SECRET`        | NextAuth encryption secret | Random string           |

### Optional Variables

| Variable           | Description              | Default       |
| ------------------ | ------------------------ | ------------- |
| `STRAPI_API_TOKEN` | Strapi API token for SSR | None          |
| `NODE_ENV`         | Environment mode         | `development` |

---

## Troubleshooting

### Installation Issues

#### Yarn Install Fails

```bash
# Clear cache and retry
yarn cache clean
rm -rf node_modules
yarn install
```

#### Husky Hooks Not Working

```bash
# Reinstall Husky
rm -rf .husky
yarn husky install
```

### Runtime Issues

#### Strapi Won't Start

1. Check database connection
2. Verify `.env` file exists and is valid
3. Check port 1337 is free
4. Review Strapi logs for detailed errors

#### Next.js Build Errors

1. Ensure Strapi is running (UI fetches data during build)
2. Check `NEXT_PUBLIC_STRAPI_URL` is correct
3. Clear `.next` folder: `yarn clean:ui`

#### Port Conflicts

```bash
# Windows (PowerShell)
yarn kill:port 3000

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All secrets changed from defaults
- [ ] Database backed up
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CORS settings configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Build succeeds locally: `yarn build`

### Deployment Platforms

#### Heroku

```bash
# The project includes Heroku-specific scripts
git push heroku main

# Heroku will run:
# 1. heroku-postbuild.sh (builds both apps)
# 2. Start Strapi on PORT
# 3. Serve Next.js static export
```

#### Vercel (Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy UI only
cd apps/ui
vercel
```

#### Railway / Render (Strapi)

- Set environment variables in platform dashboard
- Configure PostgreSQL database
- Deploy from GitHub repository

---

## Next Steps

### Recommended Reading

1. [Strapi Documentation](https://docs.strapi.io/)
2. [Next.js Documentation](https://nextjs.org/docs)
3. [Turborepo Documentation](https://turbo.build/repo/docs)
4. [Project CI/CD Documentation](./CI_CD_DOCUMENTATION.md)

### Explore Features

1. **Content Types**: Create custom content types in Strapi
2. **Page Builder**: Use dynamic components in Next.js
3. **Authentication**: NextAuth.js integration
4. **Documentation Hub**: Add markdown files to `docs/`
5. **Styling**: Tailwind v4 with custom gradients and themes

### Join the Community

- Report issues on GitHub
- Contribute improvements
- Share your projects

---

## Support

### Getting Help

1. Check this guide first
2. Review [CI/CD Documentation](./CI_CD_DOCUMENTATION.md)
3. Search existing GitHub issues
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version)

### Useful Commands for Debug

```bash
# Check Node/Yarn versions
node --version
yarn --version

# Verify workspace setup
yarn workspaces info

# Check for outdated packages
yarn outdated

# Full clean reinstall
yarn clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
yarn install
yarn build
```

---

**Last Updated**: November 15, 2025  
**Version**: 2.0  
**Status**: Production Ready ✅
