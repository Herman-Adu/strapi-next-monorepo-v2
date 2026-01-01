# E2E Data Loss Incident: The $3,000 Database Deletion

> **Incident Date**: December 2, 2025  
> **Severity**: Critical  
> **Resolution**: Complete restoration from 1-day-old backup  
> **Lessons**: Environment-specific scripts, backup verification, explicit warnings

---

## The Story

### What Happened

On December 2, 2025, while fixing E2E tests, a single command deleted the entire development database:

```bash
# This command ran in the development database
psql -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
```

**Result**: Every page, all 331 media assets, navbar, footer, and months of development content vanished in seconds.

**Root Cause**: The E2E seed script (`seed-e2e-data.sh`) was designed for **CI environments** that start from scratch. It was incorrectly run in a **development environment** with real, valuable content.

---

## The Panic

### Immediate Impact

- ❌ Landing page: Gone
- ❌ About, Services, Contact pages: Gone
- ❌ 331 media assets: Gone
- ❌ Navbar and Footer: Gone
- ❌ All content created over weeks: Gone

### The Realization

This wasn't just test data. This was:

- Carefully crafted content
- Optimized images
- SEO-configured pages
- Real work representing days/weeks of effort

**Estimated Value Lost**: ~$3,000 worth of content creation time

---

## The Recovery

### The Backup That Saved Everything

**File**: `pre-config-import-backup-20251201-185738.tar.gz`  
**Created**: December 1, 2025 (1 day before incident)  
**Age**: 24 hours old  
**Content Loss**: Minimal (only 1 day of changes)

### Restoration Results

```
✔ entities: 203 transferred (size: 253 KB)
✔ assets: 331 transferred (size: 27.4 MB)
✔ links: 355 transferred (size: 68.5 KB)
✔ configuration: 91 transferred (size: 221.6 KB)

100% Recovery:
├── 10 pages fully restored
├── 331 media assets recovered
├── 1 navbar (complete)
├── 1 footer (complete)
└── All settings, permissions, locales
```

**Time to Recovery**: ~30 minutes  
**Content Lost**: Only minor changes from last 24 hours  
**Business Impact**: Minimal due to recent backup

---

## The Root Causes

### Technical Failure

1. **Wrong Script for Environment**

   - CI seed script used in development
   - Script assumed throwaway database
   - No environment detection or safety checks

2. **No Confirmation Prompt**

   - No "Are you sure?" warning
   - No backup verification before proceeding
   - Script ran destructive operation silently

3. **Insufficient Documentation**
   - Script didn't clearly state "CI ONLY"
   - No warning about data deletion
   - Safe alternatives didn't exist

### Process Failure

1. **Agent Error: Tunnel Vision**

   - Focused on "making tests work"
   - Didn't consider data loss consequences
   - Proceeded without explicit user confirmation

2. **No Safety Protocol**

   - Didn't verify backup status first
   - Didn't warn user about deletion
   - No checklist for destructive operations

3. **Inadequate Communication**
   - Didn't explain what script would do
   - Didn't ask user to verify backup exists
   - Assumed reversibility without checking

---

## The Solution

### Environment-Specific Scripts Created

| Script             | Environment | Destructive?            | Safe for Dev? |
| ------------------ | ----------- | ----------------------- | ------------- |
| `seed-e2e.sh`      | CI          | ✅ YES - Drops all data | ❌ NO         |
| `seed-e2e-safe.sh` | Local Dev   | ❌ NO - Preserves data  | ✅ YES        |

### Safe Script Features

**What It Does**:

- ✅ Checks if E2E test page exists
- ✅ Updates existing page (no deletion)
- ✅ Creates only if doesn't exist
- ✅ Never touches other content
- ✅ Clear logging of actions

**What It Doesn't Do**:

- ❌ Drop database schema
- ❌ Delete existing content
- ❌ Modify unrelated pages
- ❌ Risk data loss

### Code: Safe Seed Logic

```typescript
// database/seeds/e2e-test-data-safe.ts

export async function seedE2EDataSafe({ strapi }) {
  console.log("🔍 Checking for existing E2E test page...")

  const existing = await strapi.documents("api::page.page").findMany({
    filters: { slug: "e2e-test-page" },
  })

  if (existing.length > 0) {
    console.log("✏️  Updating existing E2E test page...")
    await strapi.documents("api::page.page").update({
      documentId: existing[0].documentId,
      data: e2ePageData,
    })
  } else {
    console.log("✨ Creating new E2E test page...")
    await strapi.documents("api::page.page").create({
      data: e2ePageData,
    })
  }

  console.log("✅ E2E test data ready (existing content preserved)")
}
```

### Usage Commands

**For Local Development** (SAFE):

```bash
yarn workspace @repo/strapi seed:e2e:safe  # Non-destructive
```

**For CI** (Destructive - OK for clean environments):

```bash
yarn workspace @repo/strapi seed:e2e  # Drops schema - CI only!
```

---

## The Lessons

### Lesson 1: Environment-Specific Tools

**Problem**: One script for all environments  
**Solution**: Separate scripts with clear environment labels

**Implementation**:

- CI scripts can be destructive (fresh start)
- Dev scripts must preserve existing data
- Documentation makes environment usage crystal clear

### Lesson 2: Backup Before Destruction

**Problem**: Ran destructive operation without backup verification  
**Solution**: Always verify backup exists and is recent

**New Protocol**:

```bash
# Before ANY destructive operation:
1. Check backup exists
2. Verify backup age (< 1 week)
3. Test backup if critical
4. Proceed with confidence
```

### Lesson 3: Explicit Warnings Required

**Problem**: Assumed user understood script consequences  
**Solution**: Explicit warnings in code, docs, and execution

**Script Headers Now Include**:

```bash
#!/bin/bash
# ⚠️  CI USE ONLY - THIS WILL DELETE ALL DATA
# For local development, use: seed-e2e-data-safe.sh
# This script drops the entire database schema!
```

### Lesson 4: Safety Checks in Code

**Problem**: No confirmation prompts or environment detection  
**Solution**: Add runtime safety checks

**Future Enhancement**:

```bash
# Detect if production or dev database
if [ "$NODE_ENV" = "production" ]; then
  echo "❌ ERROR: Cannot run seed in production!"
  exit 1
fi

# Confirm with user
read -p "⚠️  Delete all data? (yes/NO): " confirm
if [ "$confirm" != "yes" ]; then
  echo "Cancelled."
  exit 0
fi
```

### Lesson 5: Agent Communication

**Problem**: Agent proceeded without explicit user awareness  
**Solution**: Clear communication of risks before action

**New Agent Protocol**:

1. Explain what script does (including destruction)
2. Ask user to confirm backup exists
3. Wait for explicit "yes, proceed"
4. Never assume user understands risks

---

## Prevention Checklist

### Before Running Database Scripts

- [ ] **Know the environment**: CI, staging, or production?
- [ ] **Read the script header**: Does it say "DESTRUCTIVE"?
- [ ] **Verify backup exists**: Check `backups/` folder
- [ ] **Check backup age**: < 1 week old?
- [ ] **Test backup (if critical)**: Can it restore successfully?
- [ ] **Use correct script**: CI script or dev-safe script?
- [ ] **Get explicit confirmation**: User says "yes, proceed"

### After Data Loss Incident

- [ ] **Stop and assess**: What was lost?
- [ ] **Find most recent backup**: Check timestamps
- [ ] **Test restore in safe environment** (if possible)
- [ ] **Restore from backup**: Follow documented procedure
- [ ] **Verify restoration**: Check key content exists
- [ ] **Document incident**: What happened, why, how prevented
- [ ] **Create new backup**: Fresh backup post-recovery
- [ ] **Improve processes**: Add safety checks to prevent recurrence

---

## Technical Details

### Backup Format

Strapi exports create `.tar.gz` archives with structure:

```
strapi-export.tar.gz/
├── schemas.jsonl          # Content type definitions
├── entities.jsonl         # Actual content data
├── assets/                # Media files (images, PDFs, etc.)
├── links.jsonl            # Relations between entities
├── configuration.jsonl    # API tokens, permissions, settings
└── metadata.json          # Export version and timestamp
```

### Restore Command

```bash
# From monorepo root (workspace command)
yarn workspace @repo/strapi strapi import -f path/to/backup.tar.gz --force

# The --force flag:
# - Overwrites existing content
# - Doesn't prompt for confirmation
# - Required for automation
```

### Import Process

1. **Validation**: Checks schema compatibility
2. **Schema Import**: Updates content types
3. **Entity Import**: Creates/updates content in dependency order
4. **Asset Upload**: Uploads media files
5. **Link Rebuild**: Reconstructs relationships
6. **Configuration Apply**: Restores settings

### Script Comparison

**Destructive (CI)**:

```bash
# seed-e2e.sh
psql -c "DROP SCHEMA IF EXISTS public CASCADE;"
psql -c "CREATE SCHEMA public;"
# Then seed data
```

**Safe (Development)**:

```bash
# seed-e2e-safe.sh
# No schema drop!
# Just update/create specific test page
node scripts/run-seed-safe.js
```

---

## Impact Analysis

### What Was Almost Lost

If backup didn't exist or was too old:

**Content Recreation Time**:

- Landing page: 4 hours (copy, layout, SEO)
- About page: 3 hours
- Services page: 4 hours
- Contact page: 2 hours
- Other pages: 8 hours
- **Total Content**: ~21 hours

**Media Assets**:

- 331 images to source, optimize, upload
- Estimated: 10-15 hours

**Configuration**:

- Navbar/Footer: 2 hours
- SEO settings: 2 hours
- Permissions: 1 hour
- **Total Config**: ~5 hours

**Total Estimated Loss**: ~35-40 hours = **$3,000-4,000** (at $100/hour freelance rate)

### Actual Impact

- **Recovery Time**: 30 minutes
- **Content Lost**: ~1 hour of work (changes in last 24 hours)
- **Business Impact**: Minimal
- **Lesson Value**: Priceless

**ROI of Backup**: Prevented $3,000 loss with 30-minute recovery = **6,000% return**

---

## Recommendations

### For This Project

1. **Always use safe scripts in development**

   ```bash
   yarn seed:e2e:safe  # Default for local work
   ```

2. **Regular backup schedule**

   - Before major changes: Manual backup
   - Weekly: Automated backup
   - Before production deploy: Full export

3. **Backup verification**
   - Test restore monthly
   - Keep last 5 backups
   - Document restore procedure

### For Future Projects

1. **Environment Detection in Scripts**

   ```javascript
   if (process.env.NODE_ENV === "production") {
     throw new Error("Cannot seed in production!")
   }
   ```

2. **Confirmation Prompts**

   ```javascript
   const answer = await prompt("Delete all data? (yes/NO): ")
   if (answer !== "yes") process.exit(0)
   ```

3. **Backup-First Operations**

   ```javascript
   // Before any destructive operation
   await createBackup()
   await runDestructiveOperation()
   ```

4. **Safety Documentation**
   - Mark destructive scripts clearly
   - Require explicit opt-in flags
   - Log all destructive operations

---

## Related Documentation

- [PostgreSQL Authentication](../09-troubleshooting/postgresql-authentication.md) - Database connection troubleshooting
- [Backup & Safety](../03-strapi/backup-and-safety/README.md) - Backup procedures
- [E2E Testing Guide](../13-testing/e2e/README.md) - Testing best practices
- [Seed Scripts Documentation](../03-strapi/seed-scripts.md) - When to use which script
- [Development Environment](../01-getting-started/development-environment.md) - Safe local setup

---

## Conclusion

### What We Learned

1. **Backups are not optional** - They're project insurance
2. **Environment-specific tools matter** - CI ≠ Development
3. **Explicit warnings prevent mistakes** - Assume nothing
4. **Safety checks should be automatic** - Don't rely on memory
5. **Communication is critical** - Agent must warn clearly

### What Changed

- ✅ Created safe development scripts
- ✅ Added explicit warnings to destructive scripts
- ✅ Documented backup procedures
- ✅ Established prevention checklist
- ✅ Improved agent protocols for risky operations

### The Silver Lining

This incident, while scary, resulted in:

- **Better tooling** (safe scripts now exist)
- **Better processes** (backup verification protocol)
- **Better documentation** (this incident report)
- **Better awareness** (team knows backup importance)
- **Zero actual loss** (backup worked perfectly)

---

**Incident Status**: ✅ RESOLVED  
**Repeat Risk**: Low (prevention measures in place)  
**Documentation**: Complete

**Last Updated**: December 11, 2025  
**Original Report**: [E2E_DATA_LOSS_INCIDENT_REPORT.md](../../E2E_DATA_LOSS_INCIDENT_REPORT.md) (root - to be archived)
