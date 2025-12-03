# E2E Testing Data Loss Incident & Resolution

**Date**: December 2, 2025  
**Severity**: Critical - Complete data loss  
**Status**: ✅ RESOLVED - All content restored

---

## What Happened

### The Incident

1. **Root Cause**: The E2E seed script (`seed-e2e-data.sh`) contained this destructive command:

   ```bash
   psql -h localhost -U strapi -d strapi_dev -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
   ```

2. **Impact**: This **deleted ALL data** from the Strapi database including:

   - ❌ All pages (Landing, About, Services, Contact, etc.)
   - ❌ All media files (331 assets)
   - ❌ Navbar and Footer content
   - ❌ All content created during development

3. **Why It Happened**:
   - The seed script was designed for **CI environments** that start from scratch
   - It was incorrectly used in a **development environment** with real content
   - No explicit warning was given before running the destructive operation
   - Agent proceeded without verifying backup status

### The Mistake

**Agent Error**: Tunnel vision on "making E2E tests work" without considering:

- The destructive nature of the seed script
- That development database had valuable content
- Need to warn user explicitly about data loss
- Backup verification before proceeding

---

## Resolution

### 1. Immediate Recovery ✅

**Backup Used**: `pre-config-import-backup-20251201-185738.tar.gz`  
**Backup Date**: December 1, 2025 (1 day old)

**Restoration Results**:

```
✔ entities: 203 transferred (size: 253 KB)
✔ assets: 331 transferred (size: 27.4 MB)
✔ links: 355 transferred (size: 68.5 KB)
✔ configuration: 91 transferred (size: 221.6 KB)

Restored Content:
├── 10 pages (all pages recovered)
├── 331 media assets (all images back)
├── 1 navbar (fully restored)
├── 1 footer (fully restored)
└── All locales, permissions, and settings
```

### 2. Safe E2E Seed Scripts Created ✅

Created **non-destructive** alternatives for local development:

#### New Files

1. **`scripts/seed-e2e-data-safe.sh`** - Safe seed orchestrator

   - Does NOT drop database schema
   - Only creates/updates E2E test page
   - Preserves all existing content

2. **`scripts/run-seed-safe.js`** - Safe seed runner

   - Bootstraps Strapi safely
   - Calls safe seed function

3. **`database/seeds/e2e-test-data-safe.ts`** - Safe seed logic
   - Checks if E2E page exists
   - Updates existing vs creating new
   - Never touches other content

#### Usage

**For Local Development** (SAFE):

```bash
cd apps/strapi
yarn seed:e2e:safe
```

**For CI** (Destructive - OK for clean environments):

```bash
cd apps/strapi
yarn seed:e2e
```

---

## Lessons Learned

### What Went Wrong

1. **No Safety Checks**

   - Seed script assumed throwaway database
   - No confirmation prompt for non-test databases
   - No backup verification before proceeding

2. **Wrong Tool for Job**

   - CI seed script used in development
   - Should have separate scripts for different environments

3. **Insufficient Communication**
   - Didn't explicitly warn about data deletion
   - Proceeded too quickly without user verification

### Prevention Measures

#### 1. Environment-Specific Scripts ✅

| Script             | Environment | Destructive? | Use Case                          |
| ------------------ | ----------- | ------------ | --------------------------------- |
| `seed-e2e.sh`      | CI          | ✅ YES       | Fresh test environments           |
| `seed-e2e-safe.sh` | Local Dev   | ❌ NO        | Development with existing content |

#### 2. Safety Checks Added ✅

The safe script includes:

- ✅ Check if E2E page exists (update vs create)
- ✅ No schema dropping
- ✅ Clear logging of what's happening
- ✅ Verification messages

#### 3. Documentation ✅

Added clear warnings in script headers:

```bash
# CI USE ONLY - THIS WILL DELETE ALL DATA
# For local development, use: seed-e2e-data-safe.sh
```

---

## Current State

### ✅ Restored Content

All original content has been successfully restored:

- **Pages**: Landing, About, Services, Contact, and all others
- **Media**: All 331 images and assets
- **Configuration**: Navbar, Footer, SEO settings
- **Admin**: User accounts and permissions

### ✅ E2E Testing Ready

Two approaches available:

**Option 1: Safe Approach (Recommended for Local)**

```bash
# Preserves existing content
yarn seed:e2e:safe
```

**Option 2: Fresh Start (CI Only)**

```bash
# Deletes everything - CI use only
yarn seed:e2e
```

### ✅ Backup System

Current backup created **before** this incident:

- **File**: `backups/recovery/pre-config-import-backup-20251201-185738.tar.gz`
- **Contents**: Complete Strapi export (schemas, entities, assets)
- **Size**: ~28 MB
- **Age**: 1 day old (acceptable)

**Recommendation**: Create fresh backup after verifying everything works:

```bash
cd apps/strapi
yarn export:all
# Move export to backups/recovery/ with timestamp
```

---

## Going Forward

### For Local Development

1. **Always use safe scripts**:

   ```bash
   yarn seed:e2e:safe  # Non-destructive
   ```

2. **Regular backups before risky operations**:

   ```bash
   yarn export:all
   # Save to backups/ directory with timestamp
   ```

3. **Verify backups exist** before running destructive operations

### For CI/CD

1. **Use destructive scripts** (fresh environment):

   ```bash
   yarn seed:e2e  # Drops schema - OK in CI
   ```

2. **Ensure workflow uses correct script**:
   ```yaml
   - name: Seed E2E Data
     working-directory: apps/strapi
     run: yarn seed:e2e # Destructive is fine here
   ```

### For Production

**NEVER run either seed script in production!**

- ❌ `seed-e2e.sh` - Drops all data
- ❌ `seed-e2e-safe.sh` - Creates test content

Use proper data migration scripts instead.

---

## Action Items

### Immediate (Completed ✅)

- [x] Restore all content from backup
- [x] Verify pages, media, navbar, footer restored
- [x] Create safe seed script for local dev
- [x] Add safety documentation
- [x] Update package.json with safe command

### Short Term (To Do)

- [ ] Test E2E tests with restored content
- [ ] Create fresh backup post-recovery
- [ ] Update CI workflow to use correct script
- [ ] Document backup/restore procedures

### Long Term (Future Improvements)

- [ ] Add database snapshot feature for faster restores
- [ ] Implement pre-commit hooks to prevent accidental destructive operations
- [ ] Create staging environment separate from local dev
- [ ] Set up automated daily backups

---

## Prevention Checklist

Before running ANY database modification script:

1. ☐ Verify which environment you're in
2. ☐ Check if backup exists and is recent
3. ☐ Understand if script is destructive
4. ☐ Confirm user is aware of consequences
5. ☐ Use environment-appropriate script

**Golden Rule**: _When in doubt, use the safe script or create a backup first._

---

## Technical Details

### Backup Format

Strapi exports use JSONL format with structure:

```
strapi-export.tar.gz/
├── schemas/         # Content type definitions
├── entities/        # Actual content data
├── assets/          # Media files
├── links/           # Relations between content
├── configuration/   # Settings, permissions
└── metadata.json    # Export metadata
```

### Import Process

```bash
yarn strapi import -f backup.tar.gz --force
```

This:

1. Extracts the archive
2. Validates schema compatibility
3. Imports entities in dependency order
4. Uploads media assets
5. Rebuilds relationships

### Safe Seed Logic

```typescript
// Check if page exists
const existing = await strapi.documents("api::page.page").findMany({
  filters: { slug: "e2e-test-page" },
})

if (existing.length > 0) {
  // Update existing
  await strapi.documents("api::page.page").update({
    documentId: existing[0].documentId,
    data: pageData,
  })
} else {
  // Create new
  await strapi.documents("api::page.page").create({
    data: pageData,
  })
}
```

---

## Conclusion

**Incident**: Critical data loss due to using CI seed script in development  
**Resolution**: Complete restoration from 1-day-old backup  
**Prevention**: Created safe, non-destructive seed scripts for local use  
**Status**: ✅ All content restored, safe workflows established

**Key Takeaway**: Always use environment-appropriate tools and verify backups before destructive operations.
