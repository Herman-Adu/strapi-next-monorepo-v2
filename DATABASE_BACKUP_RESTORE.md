# Strapi Database Backup & Restore Guide

## 🎯 Purpose

Protect against critical failures and enable quick recovery with complete database snapshots including media files.

---

## ⚠️ CRITICAL: Stop Strapi Before Operations

**ALWAYS stop Strapi server before:**

- Creating backups/exports
- Restoring/importing data
- Making component schema changes
- Running database migrations
- Modifying configuration files

**Why?**

- SQLite database locks prevent concurrent access
- Running server can cause schema sync issues
- Export/import commands may conflict with active connections
- Changes to components may not sync properly
- Risk of data corruption or incomplete backups

**Workflow:**

1. Stop Strapi server (Ctrl+C in terminal)
2. Wait for clean shutdown ("Strapi server stopped")
3. Perform operation (backup, import, schema changes)
4. Verify operation completed successfully
5. Restart Strapi server

**Common Issues When Server is Running:**

- ❌ Backup fails with database lock error
- ❌ Import hangs or fails silently
- ❌ Component changes don't appear in admin
- ❌ TypeScript types not regenerated
- ❌ Config Sync shows perpetual differences

---

## 📦 What Gets Backed Up

### Included:

- ✅ All content types (pages, sections, components)
- ✅ Configuration (plugins, settings)
- ✅ Media library (images, files in `public/uploads/`)
- ✅ User accounts and permissions
- ✅ API tokens
- ✅ Custom fields and relations

### Excluded:

- ❌ `node_modules/`
- ❌ `.cache/`
- ❌ Build artifacts
- ❌ Environment variables (`.env` - must backup separately)

---

## 🔧 Backup Methods

### Method 1: Strapi Export (Recommended for Development)

**Location**: `apps/strapi/`

#### Create Backup:

```powershell
# Navigate to Strapi directory
cd apps/strapi

# Export all data (includes media files)
npm run strapi export -- --file ../backups/strapi-export-$(Get-Date -Format 'yyyy-MM-dd-HHmm').tar.gz --no-encrypt

# OR with encryption (recommended for production)
npm run strapi export -- --file ../backups/strapi-export-$(Get-Date -Format 'yyyy-MM-dd-HHmm').tar.gz
```

#### Restore from Backup:

```powershell
# Navigate to Strapi directory
cd apps/strapi

# Import data (will prompt for conflicts)
npm run strapi import -- --file ../backups/strapi-export-2025-11-12-1430.tar.gz

# OR force overwrite (destructive!)
npm run strapi import -- --file ../backups/strapi-export-2025-11-12-1430.tar.gz --force
```

---

### Method 2: Database + Media Folder (Production-Ready)

#### Backup Database:

**SQLite** (Development):

```powershell
# Copy database file
Copy-Item "apps/strapi/.tmp/data.db" -Destination "backups/database-$(Get-Date -Format 'yyyy-MM-dd').db"
```

**PostgreSQL** (Production):

```powershell
# Dump database
pg_dump -h localhost -U strapi_user -d strapi_db -F c -f backups/strapi-db-$(Get-Date -Format 'yyyy-MM-dd').dump
```

**MySQL** (Production):

```powershell
# Dump database
mysqldump -u strapi_user -p strapi_db > backups/strapi-db-$(Get-Date -Format 'yyyy-MM-dd').sql
```

#### Backup Media Files:

```powershell
# Compress uploads folder
Compress-Archive -Path "apps/strapi/public/uploads/*" -DestinationPath "backups/media-$(Get-Date -Format 'yyyy-MM-dd').zip"

# OR use robocopy for faster incremental backup
robocopy "apps/strapi/public/uploads" "backups/uploads-$(Get-Date -Format 'yyyy-MM-dd')" /MIR /Z /R:3
```

#### Restore Database + Media:

**SQLite**:

```powershell
# Stop Strapi first!
# Restore database
Copy-Item "backups/database-2025-11-12.db" -Destination "apps/strapi/.tmp/data.db" -Force

# Restore media
Expand-Archive -Path "backups/media-2025-11-12.zip" -DestinationPath "apps/strapi/public/uploads" -Force
```

**PostgreSQL**:

```powershell
# Drop and recreate database
psql -U postgres -c "DROP DATABASE strapi_db;"
psql -U postgres -c "CREATE DATABASE strapi_db OWNER strapi_user;"

# Restore dump
pg_restore -h localhost -U strapi_user -d strapi_db backups/strapi-db-2025-11-12.dump

# Restore media
Expand-Archive -Path "backups/media-2025-11-12.zip" -DestinationPath "apps/strapi/public/uploads" -Force
```

---

## 🌱 Seed Data Scripts

### Creating Seed Data (After Newsletter Complete)

**Script Location**: `apps/strapi/database/seeds/`

#### 1. Export Current State as Seed:

```powershell
cd apps/strapi

# Create seed data (newsletter component complete state)
npm run strapi export -- --file database/seeds/01-newsletter-complete.tar.gz --no-encrypt
```

#### 2. Create Seed Script:

```javascript
// apps/strapi/database/seeds/01-newsletter.js
module.exports = {
  async seed(strapi) {
    // Import newsletter CTA section data
    await strapi.db.query("api::page.page").create({
      data: {
        // Newsletter page setup
        title: "Newsletter Test Page",
        slug: "newsletter-test",
        sections: [
          {
            __component: "sections.newsletter-cta-section",
            heading: "Subscribe to our newsletter",
            // ... full newsletter config
          },
        ],
      },
    })
  },
}
```

#### 3. Run Seed Script:

```powershell
# Custom seed command (add to package.json)
npm run strapi seed
```

---

## 📂 Backup Directory Structure

```
strapi-next-monorepo-v2/
├── backups/
│   ├── daily/
│   │   ├── 2025-11-12/
│   │   │   ├── strapi-export.tar.gz
│   │   │   ├── database.db
│   │   │   └── media.zip
│   ├── milestones/
│   │   ├── newsletter-complete/
│   │   │   ├── strapi-export.tar.gz
│   │   │   └── README.md (what's in this backup)
│   │   ├── atomic-components-complete/
│   │   └── production-ready/
│   └── automated/  (automated backups)
├── apps/strapi/database/seeds/
│   ├── 01-newsletter-complete.tar.gz
│   ├── 02-testimonials-complete.tar.gz
│   └── README.md
```

---

## 🔄 Automated Backup Strategy

### Daily Backups (Development):

Create `scripts/backup-strapi.ps1`:

```powershell
# Daily automated backup script
$timestamp = Get-Date -Format 'yyyy-MM-dd-HHmm'
$backupDir = "backups/daily/$(Get-Date -Format 'yyyy-MM-dd')"

# Create backup directory
New-Item -ItemType Directory -Force -Path $backupDir

# Export Strapi data
cd apps/strapi
npm run strapi export -- --file "../../$backupDir/strapi-export.tar.gz" --no-encrypt

# Copy database
Copy-Item ".tmp/data.db" -Destination "../../$backupDir/database.db"

# Compress media
Compress-Archive -Path "public/uploads/*" -DestinationPath "../../$backupDir/media.zip"

Write-Host "✅ Backup completed: $backupDir"
```

Schedule with Windows Task Scheduler or run manually.

---

## 🚨 Emergency Recovery Procedures

### Scenario 1: Database Corrupted

```powershell
# 1. Stop Strapi
# 2. Restore latest backup
cd apps/strapi
npm run strapi import -- --file ../../backups/daily/2025-11-12/strapi-export.tar.gz --force

# 3. Restart Strapi
npm run dev
```

### Scenario 2: Lost Media Files

```powershell
# Restore media folder
Expand-Archive -Path "backups/daily/2025-11-12/media.zip" -DestinationPath "apps/strapi/public/uploads" -Force
```

### Scenario 3: Schema Drift (Component changes not syncing)

```powershell
cd apps/strapi

# 1. Clear cache
Remove-Item -Recurse -Force .cache

# 2. Rebuild
npm run build

# 3. Restart in development to regenerate types
npm run dev
```

### Scenario 4: Complete System Rebuild

```powershell
# 1. Clone repository
git clone <repo-url>
cd strapi-next-monorepo-v2

# 2. Install dependencies
npm install

# 3. Restore latest milestone backup
cd apps/strapi
npm run strapi import -- --file ../../backups/milestones/newsletter-complete/strapi-export.tar.gz

# 4. Copy environment variables
Copy-Item "../../backups/milestones/newsletter-complete/.env.example" -Destination ".env"

# 5. Build and start
npm run build
npm run dev
```

---

## ✅ Pre-Commit Backup Checklist

Before major commits:

- [ ] Export current Strapi state: `npm run strapi export`
- [ ] Copy `.env` to backup folder (encrypted or excluded from git)
- [ ] Backup media folder (if new uploads added)
- [ ] Document what's in this backup (README.md in backup folder)
- [ ] Test restore process (verify backup works)
- [ ] Commit backup metadata to git (not the actual .tar.gz files!)

---

## 📝 Backup Naming Convention

```
strapi-export-[date]-[milestone].tar.gz

Examples:
- strapi-export-2025-11-12-newsletter-complete.tar.gz
- strapi-export-2025-11-15-atomic-components.tar.gz
- strapi-export-2025-11-20-production-ready.tar.gz
```

---

## 🔐 Security Best Practices

### For Production Backups:

1. **Encrypt exports**:

   ```powershell
   npm run strapi export -- --file backup.tar.gz --key="YourSecretKey123"
   ```

2. **Store in secure location**:

   - Azure Blob Storage
   - AWS S3 with encryption
   - Local encrypted drive

3. **Exclude sensitive data from git**:

   ```gitignore
   # .gitignore
   backups/*.tar.gz
   backups/*.db
   backups/*.zip
   !backups/README.md
   ```

4. **Rotate backups**:
   - Keep daily: 7 days
   - Keep weekly: 4 weeks
   - Keep monthly: 12 months
   - Keep milestones: indefinitely

---

## 🎯 Current Milestone: Newsletter Complete

### Backup Checklist:

- [ ] Export: `strapi-export-2025-11-12-newsletter-complete.tar.gz`
- [ ] Document: What gradient features are included
- [ ] Test: Restore in clean environment
- [ ] Verify: All newsletter gradient options work
- [ ] Commit: Backup metadata to git

### What This Backup Contains:

- ✅ Newsletter CTA section with shared components
- ✅ Section header with gradient direction options
- ✅ Section badge with orb animation
- ✅ Section background with theme-pastel option
- ✅ All gradient CSS classes (diagonal, horizontal, vertical, radial)
- ✅ Test content for newsletter section

### Recovery Point Objective (RPO):

- Maximum acceptable data loss: 1 day
- Backup frequency: After each major feature completion

### Recovery Time Objective (RTO):

- Target recovery time: < 30 minutes
- Includes: Database restore + media restore + rebuild

---

## 📚 Additional Resources

- [Strapi Export/Import Docs](https://docs.strapi.io/dev-docs/data-management)
- [Database Migration Guide](https://docs.strapi.io/dev-docs/migration-guides)
- [Deployment Best Practices](https://docs.strapi.io/dev-docs/deployment)

---

_Last Updated: 2025-11-12_  
_Next Review: After Newsletter Completion_  
_Owner: Development Team_
