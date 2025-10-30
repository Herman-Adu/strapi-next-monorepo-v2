# 📘 Development & Git Workflow Guide

This guide explains how to build, test, and push your Strapi + Next.js monorepo to GitHub for version control and recovery.

---

## 🏗️ **Building the Applications**

### **Build All Apps (Production)**

```powershell
# From monorepo root
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2

# Build both Strapi and Next.js for production
yarn build
```

This runs Turborepo's build command which:

- Builds Strapi in production mode
- Builds Next.js in standalone mode (optimized for deployment)
- Uses caching to speed up subsequent builds

### **Build Individual Apps**

```powershell
# Build only Strapi
yarn build:strapi

# Build only Next.js UI
yarn build:ui
```

### **Test Production Builds Locally**

After building, you can test the production versions:

```powershell
# Start Strapi in production mode
yarn start:strapi

# Start Next.js in production mode
yarn start:ui
```

---

## 🧪 **Testing Before Commit**

Before pushing changes to GitHub, ensure everything works:

### **1. Run Linting**

```powershell
# Lint all apps
yarn lint

# Check code formatting
yarn format:check
```

### **2. Fix Formatting Issues**

```powershell
# Auto-format all code
yarn format
```

### **3. Test Development Mode**

```powershell
# Ensure both apps run in dev mode
yarn dev
```

Test in browser:

- Next.js: http://localhost:3000
- Strapi: http://localhost:1337/admin

### **4. Test Production Build**

```powershell
# Build everything
yarn build

# Start in production mode
yarn start:strapi
yarn start:ui
```

---

## 📦 **What Gets Committed to Git**

Your `.gitignore` is already configured correctly. Here's what's **EXCLUDED** from Git:

### **Not Committed (Safe):**

- ❌ `node_modules/` - Dependencies (reinstalled with `yarn`)
- ❌ `.env` and `.env.local` - Environment secrets
- ❌ `.next/` - Next.js build output
- ❌ `build/`, `dist/` - Build artifacts
- ❌ `.turbo/` - Turborepo cache
- ❌ `.strapi-updater.json` - Strapi temp files
- ❌ Database volumes (handled by Docker)

### **Committed (Important):**

- ✅ Source code (`apps/`, `packages/`, `scripts/`)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Environment examples (`.env.example`, `.env.local.example`)
- ✅ Strapi config sync files (`apps/strapi/config/sync/`)
- ✅ Docker configurations (`docker-compose.yml`, `Dockerfile`)
- ✅ Generated TypeScript types (`apps/strapi/types/generated/`)

---

## 🔐 **Important: Protecting Sensitive Data**

### **Before First Push - Verify .gitignore**

Double-check these files are **NOT** being committed:

```powershell
# Check what will be committed
git status

# If you see .env or .env.local files, they should NOT be there!
```

### **Create Environment Variable Documentation**

Document your environment variables (without actual values) in the README or a separate file:

```markdown
## Required Environment Variables

### Strapi (.env)

- `DATABASE_PASSWORD` - Your PostgreSQL password
- `APP_KEYS` - Session cookie signing keys
- `API_TOKEN_SALT` - API token salt
- etc.

### Next.js (.env.local)

- `STRAPI_REST_READONLY_API_KEY` - Read-only Strapi API token
- `NEXTAUTH_SECRET` - NextAuth encryption secret
- etc.
```

---

## 🚀 **Git Workflow - Best Practices**

### **Initial Setup (One Time)**

```powershell
# Navigate to repo
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2

# Check git status
git status

# Configure git (if not already done)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### **Regular Development Workflow**

#### **1. Before Starting Work**

```powershell
# Pull latest changes from GitHub
git pull origin main

# Install any new dependencies
yarn install

# Start development
yarn dev
```

#### **2. Making Changes**

Make your code changes, then:

```powershell
# Check what files changed
git status

# Review your changes
git diff

# Test everything works
yarn build
yarn lint
```

#### **3. Committing Changes**

This repo has **Husky** configured for automatic code quality checks!

```powershell
# Stage files you want to commit
git add .

# Use the interactive commit tool (recommended!)
yarn commit
```

The `yarn commit` command:

- Opens an interactive prompt
- Helps create conventional commit messages
- Automatically runs linting and formatting
- Validates commit message format

**Or use standard git commit:**

```powershell
git commit -m "feat: add new feature description"
```

**Conventional Commit Format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

#### **4. Pushing to GitHub**

```powershell
# Push to main branch
git push origin main

# Or if using a feature branch
git push origin feature-name
```

---

## 🔄 **Creating a Stable Version (Tagging)**

When you have a stable, working version:

```powershell
# Create an annotated tag
git tag -a v1.0.0 -m "Initial stable release with working Strapi and Next.js"

# Push the tag to GitHub
git push origin v1.0.0

# Or push all tags
git push --tags
```

This creates a snapshot you can always return to!

---

## 🆘 **Recovery - Pulling Down Stable Code**

### **If Something Breaks**

#### **Option 1: Revert to Last Commit**

```powershell
# Discard all local changes
git reset --hard HEAD

# Pull latest from GitHub
git pull origin main
```

#### **Option 2: Go Back to a Specific Tag**

```powershell
# List all tags
git tag

# Checkout a specific version
git checkout v1.0.0

# Create a new branch from that version
git checkout -b recovery-branch v1.0.0
```

#### **Option 3: Clone Fresh Copy**

```powershell
# In a different folder
git clone https://github.com/Herman-Adu/strapi-next-monorepo-v2.git
cd strapi-next-monorepo-v2

# Install dependencies
yarn install

# Copy your .env files from backup
copy path\to\backup\.env apps\strapi\.env
copy path\to\backup\.env.local apps\ui\.env.local

# Start database
cd apps\strapi
docker compose up -d db

# Start apps
cd ..\..
yarn dev
```

---

## 🔧 **Backup Strategy**

### **What to Backup Separately**

1. **Environment Files** (NOT in Git)

   - `apps/strapi/.env`
   - `apps/ui/.env.local`
   - Store in a secure password manager or encrypted location

2. **Database Data**

   ```powershell
   # Export Strapi data
   cd apps\strapi
   yarn strapi export --file backup-$(Get-Date -Format 'yyyy-MM-dd') --no-encrypt
   ```

3. **Uploaded Files**
   - `apps/strapi/public/uploads/` (if using local storage)
   - Better: Use AWS S3 for production

### **Create a Pre-Push Checklist**

Before pushing to GitHub:

```powershell
# 1. Test build
yarn build

# 2. Run linter
yarn lint

# 3. Check for sensitive files
git status

# 4. Review changes
git diff --staged

# 5. Export Strapi config
cd apps\strapi
# Go to Strapi Admin > Settings > Config Sync > Export

# 6. Commit and push
git push origin main
```

---

## 📋 **Quick Reference**

### **Daily Development**

```powershell
yarn dev                    # Start both apps
yarn dev:strapi            # Start Strapi only
yarn dev:ui                # Start Next.js only
```

### **Code Quality**

```powershell
yarn lint                  # Check code quality
yarn format                # Auto-format code
yarn build                 # Test production build
```

### **Git Operations**

```powershell
git status                 # See changes
git add .                  # Stage all changes
yarn commit                # Interactive commit (recommended)
git push origin main       # Push to GitHub
git pull origin main       # Get latest code
```

### **Recovery**

```powershell
git reset --hard HEAD      # Discard all local changes
git checkout v1.0.0        # Go to specific version
git clone <repo-url>       # Fresh start
```

---

## 🎯 **Recommended Workflow for Safety**

1. **Work on feature branches** instead of main:

   ```powershell
   git checkout -b feature/new-feature
   # Make changes
   git add .
   yarn commit
   git push origin feature/new-feature
   # Merge to main when stable
   ```

2. **Tag stable versions regularly:**

   ```powershell
   git tag -a v1.0.1 -m "Description of changes"
   git push --tags
   ```

3. **Export Strapi data before major changes:**

   ```powershell
   cd apps\strapi
   yarn strapi export --file pre-change-backup --no-encrypt
   ```

4. **Keep a local backup of .env files** in a secure location

---

## ✅ **Final Checklist Before First Push**

- [ ] `.gitignore` is configured (it is!)
- [ ] `.env` and `.env.local` files are **NOT** staged
- [ ] Code builds successfully (`yarn build`)
- [ ] Code passes linting (`yarn lint`)
- [ ] You have backups of environment files
- [ ] You've tested both development and production modes
- [ ] Strapi config is exported and committed
- [ ] You understand how to recover if needed

**Ready to push!** 🚀
