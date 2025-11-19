# ⚡ Quick Start Guide

## 🚀 First Time Setup (You've Done This!)

```powershell
# 1. Install dependencies
yarn install

# 2. Environment files are auto-created by setup-env.js

# 3. Start database
cd apps\strapi
docker compose up -d db

# 4. Start Strapi
yarn develop
# → Create admin account at http://localhost:1337/admin
# → Import strapi-export.tar.gz data
# → Import Config Sync configuration
# → Generate API tokens

# 5. Add API token to apps/ui/.env.local

# 6. Start Next.js
cd ..\ui
yarn dev
```

---

## 💾 **Save Your Work to GitHub**

### **Quick Push (After Making Changes)**

```powershell
# 1. Check what changed
git status

# 2. Test everything works
yarn build
yarn lint

# 3. Commit with interactive prompt (recommended)
git add .
yarn commit

# 4. Push to GitHub
git push origin main
```

### **Create a Safe Point (Tag a Version)**

```powershell
# Create a version tag you can return to
git tag -a v1.0.0 -m "Working version - stable"
git push origin v1.0.0
```

---

## 🔄 **Daily Development**

```powershell
# Pull latest changes
git pull origin main

# Start everything
yarn dev

# Apps running at:
# - Next.js: http://localhost:3000
# - Strapi: http://localhost:1337/admin
```

---

## 🆘 **If Something Breaks**

### **Discard Local Changes**

```powershell
git reset --hard HEAD
git pull origin main
```

### **Go Back to Tagged Version**

```powershell
git checkout v1.0.0
```

### **Fresh Clone**

```powershell
# Different folder
git clone https://github.com/Herman-Adu/strapi-next-monorepo-v2.git
cd strapi-next-monorepo-v2
yarn install
# Copy your .env files from backup
# Start docker compose and yarn dev
```

---

## 📁 **Important Files to Backup (NOT in Git)**

Save these securely:

- `apps/strapi/.env` (database password, API secrets)
- `apps/ui/.env.local` (API tokens, auth secrets)

---

## ✅ **Current Status**

Your project is configured correctly:

- ✅ `.env` files are ignored by Git
- ✅ Sensitive data won't be committed
- ✅ Source code and configs will be saved
- ✅ You can safely push to GitHub

---

## 📖 **Full Documentation**

See `DEVELOPMENT_GUIDE.md` for complete details on:

- Building for production
- Testing strategies
- Advanced Git workflows
- Recovery procedures
- Backup strategies
