# 🚨 DATA SAFETY GUIDELINES - MUST READ BEFORE ANY DATABASE OPERATION

**Created**: December 8, 2025  
**Priority**: CRITICAL - Production Safety  
**Applies To**: ALL database scripts, backup/restore operations, data migrations

---

## ⚠️ CORE PRINCIPLE

> **"NEVER run a database script without understanding what it does and having a verified backup."**

We learned this the hard way. Don't repeat our mistakes.

---

## 🛡️ MANDATORY PRE-FLIGHT CHECKLIST

Before running **ANY** script that touches the database, verify ALL of these:

### 1. ✅ **Understand the Script**

- [ ] Read the entire script
- [ ] Understand what it does (create, read, update, delete?)
- [ ] Know if it's destructive (drops tables, deletes data, overwrites content?)
- [ ] Check if it has safety guards (confirmations, dry-run mode, backups?)

### 2. ✅ **Verify Current Backup**

- [ ] Backup exists and is recent (< 24 hours old)
- [ ] Backup size is reasonable (not 0 bytes, not suspiciously small)
- [ ] Verify backup contents with: `.\scripts\verify-backup.ps1 -BackupFile "path/to/backup.tar.gz"`
- [ ] Backup includes critical data (pages, contact messages, subscribers, media)

### 3. ✅ **Create Fresh Backup**

**ALWAYS create a safety backup before destructive operations:**

```powershell
# Create timestamped backup with verification
.\scripts\backup-strapi-safe.ps1 -MilestoneName "pre-operation-$(Get-Date -Format 'yyyyMMdd-HHmm')"
```

### 4. ✅ **Stop Strapi Server**

**CRITICAL**: Strapi MUST be stopped before:

- Creating backups
- Restoring backups
- Running migrations
- Modifying schemas
- Importing data

```powershell
# In Strapi terminal, press Ctrl+C
# Wait for "Strapi server stopped" message
```

### 5. ✅ **Know the Environment**

- [ ] Am I in development, staging, or production?
- [ ] Is this SQLite (local) or PostgreSQL (production)?
- [ ] Do I have database credentials/access?
- [ ] What's the impact if this fails?

### 6. ✅ **Test in Safe Environment First**

- [ ] Never test on production data first
- [ ] Create a test copy of the database
- [ ] Verify the operation works as expected
- [ ] Document any issues or unexpected behavior

---

## 🚫 DANGEROUS OPERATIONS - EXTRA CAUTION

These operations are **DESTRUCTIVE** and require extra care:

### Database Drops

```powershell
# ❌ NEVER run without backup
DROP DATABASE strapi_db;

# ❌ NEVER run without backup
yarn workspace @repo/strapi strapi seed:reset
```

### Force Imports (Overwrites Existing Data)

```powershell
# ⚠️ --force flag OVERWRITES all existing content
yarn workspace @repo/strapi strapi import -- --file backup.tar.gz --force

# ✅ ALWAYS create backup first
.\scripts\backup-strapi-safe.ps1 -MilestoneName "pre-import-safety"
yarn workspace @repo/strapi strapi import -- --file backup.tar.gz --force
```

### Schema Changes

```powershell
# ⚠️ Can break existing data
# Changing field types, removing fields, etc.

# ✅ ALWAYS:
1. Create backup
2. Export current data
3. Make schema change
4. Test thoroughly
5. Verify data integrity
```

### Bulk Deletions

```powershell
# ❌ Deleting many records at once
await strapi.db.query('api::page.page').deleteMany({});

# ✅ ALWAYS verify what will be deleted first
const pages = await strapi.db.query('api::page.page').findMany({});
console.log(`About to delete ${pages.length} pages`);
// Manually confirm before proceeding
```

---

## ✅ SAFE SCRIPTS WE CREATED

These scripts have built-in safety checks:

### 1. **Backup with Verification** (RECOMMENDED)

```powershell
# Safe backup script with pre-flight checks
.\scripts\backup-strapi-safe.ps1 -MilestoneName "my-milestone"

# What it does:
- ✅ Checks if Strapi is running (warns if yes)
- ✅ Verifies database exists
- ✅ Creates backup with timestamp
- ✅ Automatically verifies backup contents
- ✅ Generates README with restore instructions
- ✅ No destructive operations
```

### 2. **Backup Verification** (ANALYSIS ONLY)

```powershell
# Read-only analysis of backup contents
.\scripts\verify-backup.ps1 -BackupFile "backups/path/to/backup.tar.gz"

# What it does:
- ✅ Extracts to temp directory
- ✅ Lists all collection types in backup
- ✅ Shows record counts per collection
- ✅ Warns if critical collections are empty
- ✅ Cleans up temp files automatically
- ✅ NO DATABASE CHANGES
```

### 3. **Original Backup Script** (USE WITH CAUTION)

```powershell
# Original backup script (no verification)
.\scripts\backup-strapi.ps1 -MilestoneName "milestone-name"

# ⚠️ Limitations:
- No pre-flight checks
- No automatic verification
- No safety confirmations
- Recommendation: Use backup-strapi-safe.ps1 instead
```

---

## 📋 PRODUCTION DEPLOYMENT CHECKLIST

Before going to production with this system:

### Pre-Launch:

- [ ] Set up automated daily backups
- [ ] Test complete backup/restore cycle
- [ ] Verify all critical collections in backups (Contact Messages, Subscribers, Pages)
- [ ] Set up backup verification alerts
- [ ] Document disaster recovery procedures
- [ ] Train team on backup/restore process
- [ ] Set up backup storage (S3, cloud storage, external drive)

### Dual Backup Strategy (RECOMMENDED):

```powershell
# Layer 1: Strapi Export (portable, includes media)
yarn strapi export --file strapi-backup.tar.gz --no-encrypt

# Layer 2: PostgreSQL Dump (complete database)
pg_dump -Fc -h localhost -U strapi_user -d strapi_db -f db-backup.dump

# Both formats ensure maximum data safety
```

### Backup Retention Policy:

- **Daily**: Keep last 7 days
- **Weekly**: Keep last 4 weeks
- **Monthly**: Keep last 12 months
- **Before Deployments**: Keep indefinitely

---

## 🔧 RECOVERY PROCEDURES

### If Something Goes Wrong:

1. **STOP IMMEDIATELY**

   - Don't make it worse by running more commands
   - Document what happened
   - Check if backup exists

2. **Assess the Damage**

   - What data is affected?
   - Is the database corrupted?
   - Can we rollback?

3. **Restore from Backup**

   ```powershell
   # 1. Stop Strapi
   Ctrl+C in Strapi terminal

   # 2. Verify backup
   .\scripts\verify-backup.ps1 -BackupFile "path/to/backup.tar.gz"

   # 3. Import backup
   yarn workspace @repo/strapi strapi import -- --file ../../path/to/backup.tar.gz --force

   # 4. Rebuild
   yarn workspace @repo/strapi build

   # 5. Restart
   yarn workspace @repo/strapi develop
   ```

4. **Verify Restoration**
   - Check critical content (pages, contact messages, media)
   - Test user-facing features
   - Verify admin panel functionality

---

## 📚 LESSONS LEARNED

From our December 2025 incident:

### What Went Wrong:

1. Used CI/CD seed script in development environment
2. Script had `deleteMany()` without confirmation
3. No safety backup before running
4. Lost several hours of content creation

### What We Changed:

1. ✅ Created safe backup scripts with pre-flight checks
2. ✅ Added verification tools to examine backup contents
3. ✅ Documented all dangerous operations
4. ✅ Implemented mandatory backup-before-operation policy
5. ✅ Added confirmation prompts to destructive scripts

### Golden Rules We Follow Now:

1. **"Backup before EVERY destructive operation"**
2. **"Verify backups actually contain expected data"**
3. **"Test scripts on copies first, never on production"**
4. **"Stop Strapi server before database operations"**
5. **"Document what each script does BEFORE running it"**

---

## 📞 INCIDENT RESPONSE

If you accidentally delete/corrupt data:

### Immediate Actions:

1. **STOP**: Don't run any more commands
2. **BREATHE**: Stay calm, we have backups
3. **VERIFY**: Check most recent backup exists
4. **RESTORE**: Follow recovery procedures above
5. **DOCUMENT**: Write down what happened for post-mortem

### Post-Incident:

1. Review what went wrong
2. Update safety procedures
3. Add safeguards to prevent recurrence
4. Share learnings with team

---

## ✅ QUICK REFERENCE

### Before ANY Database Operation:

```powershell
# 1. Create safety backup
.\scripts\backup-strapi-safe.ps1 -MilestoneName "safety-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# 2. Stop Strapi (Ctrl+C in terminal)

# 3. Run your operation

# 4. Verify everything worked

# 5. Create post-operation backup if needed
```

### Emergency Restore:

```powershell
# Find latest backup
Get-ChildItem backups/milestones -Recurse -Filter "*.tar.gz" | Sort-Object LastWriteTime -Descending | Select-Object -First 5

# Verify backup
.\scripts\verify-backup.ps1 -BackupFile "path/to/backup.tar.gz"

# Restore (destructive!)
yarn workspace @repo/strapi strapi import -- --file ../../path/to/backup.tar.gz --force
```

---

## 📖 Related Documentation

- `investigation-report.md` - Why Contact Messages weren't in Dec 3 backup
- `backup-procedures.md` - Complete backup/restore guide
- `../../../E2E_DATA_LOSS_INCIDENT_REPORT.md` - Full incident report from December 2025
- `../../../scripts/backup-strapi-safe.ps1` - Safe backup script source code
- `../../../scripts/verify-backup.ps1` - Verification script source code

---

## 🎯 REMEMBER

**Data loss is preventable. Every time.**

The few minutes spent creating and verifying a backup can save hours or days of recovery work.

When in doubt:

1. Create a backup
2. Verify the backup
3. THEN proceed with caution

---

**Last Updated**: December 8, 2025  
**Status**: Living Document - Update with new learnings
