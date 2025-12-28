# Disaster Recovery Procedures

**Last Updated:** December 28, 2025  
**Tested:** ✅ All procedures tested and verified working

## 🚨 Emergency Quick Reference

**System down? Data lost? Follow these steps:**

### Option 1: Full Restore (Content + Media) - 30 seconds

```powershell
cd apps/strapi
yarn strapi import --file "..\..\backups\strapi-export-LATEST.tar.gz.tar.gz" --force
```

### Option 2: Database Only Restore - 1 minute

```powershell
$env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
psql -h localhost -p 5432 -U postgres -d strapi_dev -f "backups\strapi-LATEST.sql"
```

---

## 📋 Backup Strategy Overview

We maintain **two types of backups** for redundancy:

| Backup Type         | Schedule      | Retention | Size   | Restore Time   |
| ------------------- | ------------- | --------- | ------ | -------------- |
| **PostgreSQL .sql** | Daily 2:00 AM | 7 days    | ~1 MB  | 30-60 seconds  |
| **Strapi .tar.gz**  | Daily 2:05 AM | 7 days    | ~27 MB | 30-120 seconds |

**Why both?**

- **PostgreSQL backup:** Database only, faster for data corruption recovery
- **Strapi export:** Content + media together, portable, full restoration

---

## 🔄 Recovery Scenarios

### Scenario 1: Accidental Content Deletion

**Symptoms:** Deleted pages, missing content, but system running fine

**Solution:** Strapi Import (preserves media files)

**Steps:**

1. Stop making changes (don't save more content)
2. Identify which backup to restore from:
   ```powershell
   Get-ChildItem "backups" -Filter "strapi-export-*.tar.gz" |
   Sort-Object LastWriteTime -Descending |
   Select-Object -First 5 Name, LastWriteTime
   ```
3. Restore from chosen backup:
   ```powershell
   cd apps/strapi
   yarn strapi import --file "..\..\backups\strapi-export-2025-12-28-HHMMSS.tar.gz.tar.gz" --force
   ```
4. Verify: Check http://localhost:1337/admin → Content Manager → Pages
5. **Expected time:** 30-120 seconds

**✅ Tested:** December 28, 2025 - Restored 10 pages + 91 media files in 28 seconds

---

### Scenario 2: Database Corruption

**Symptoms:** Strapi won't start, database errors, connection issues

**Solution:** PostgreSQL Restore

**Steps:**

1. Stop Strapi (if running):

   ```powershell
   # Press Ctrl+C in Strapi terminal
   ```

2. Create backup of corrupted database (optional):

   ```powershell
   $env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
   pg_dump -h localhost -p 5432 -U postgres -d strapi_dev > "backups\CORRUPTED-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').sql"
   ```

3. Drop and recreate database:

   ```powershell
   $env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
   psql -h localhost -p 5432 -U postgres -c "DROP DATABASE strapi_dev;" -c "CREATE DATABASE strapi_dev;"
   ```

4. Restore from backup:

   ```powershell
   psql -h localhost -p 5432 -U postgres -d strapi_dev -f "backups\strapi-2025-12-28-HHMMSS.sql"
   ```

5. Restart Strapi:

   ```powershell
   cd apps/strapi
   yarn dev
   ```

6. **Expected time:** 2-3 minutes

**✅ Tested:** December 28, 2025 - Restored 10 pages + 91 files in 35 seconds

---

### Scenario 3: Complete System Failure

**Symptoms:** Hard drive failure, Windows reinstall, new machine

**Solution:** Full Restoration (requires backup files from cloud/external drive)

**Prerequisites:**

- PostgreSQL 17 installed
- Node.js 18+ installed
- Git repository cloned
- Backup files available

**Steps:**

1. **Setup environment:**

   ```powershell
   cd strapi-next-monorepo-v2
   yarn install
   ```

2. **Configure database:**

   - Copy `apps/strapi/.env.example` to `apps/strapi/.env`
   - Set `DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/strapi_dev`

3. **Create database:**

   ```powershell
   psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE strapi_dev;"
   ```

4. **Restore from Strapi export (RECOMMENDED):**

   ```powershell
   cd apps/strapi
   yarn strapi import --file "..\..\backups\strapi-export-LATEST.tar.gz.tar.gz"
   ```

   **OR restore from PostgreSQL backup:**

   ```powershell
   $env:PGPASSWORD = "YOUR_PASSWORD"
   psql -h localhost -p 5432 -U postgres -d strapi_dev -f "backups\strapi-LATEST.sql"
   ```

5. **Start applications:**

   ```powershell
   # Terminal 1 - Strapi
   cd apps/strapi
   yarn dev

   # Terminal 2 - Next.js
   cd apps/ui
   yarn dev
   ```

6. **Verify:**
   - Strapi: http://localhost:1337/admin
   - Frontend: http://localhost:3000

**Expected time:** 15-30 minutes (including installs)

---

### Scenario 4: Migration to New Server

**Symptoms:** Moving to production, new hosting, server migration

**Solution:** Clean Migration with Strapi Export

**Steps:**

1. **On OLD server - Create fresh backup:**

   ```powershell
   cd apps/strapi
   yarn strapi export --no-encrypt --file "..\..\backups\migration-$(Get-Date -Format 'yyyy-MM-dd').tar.gz"
   ```

2. **Transfer backup to NEW server:**

   - Upload via FTP, SCP, or cloud storage
   - Ensure file integrity (check file size matches)

3. **On NEW server - Setup environment:**

   ```powershell
   git clone https://github.com/Herman-Adu/strapi-next-monorepo-v2.git
   cd strapi-next-monorepo-v2
   yarn install
   ```

4. **Configure NEW database:**

   - Edit `apps/strapi/.env`
   - Create database: `CREATE DATABASE strapi_prod;`

5. **Import on NEW server:**

   ```powershell
   cd apps/strapi
   yarn strapi import --file "..\..\backups\migration-2025-12-28.tar.gz"
   ```

6. **Start and verify NEW server**

**Expected time:** 30-60 minutes (including setup)

---

## 🛠️ Manual Verification Commands

### Check PostgreSQL Connection

```powershell
$env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
psql -h localhost -p 5432 -U postgres -d strapi_dev -c "SELECT version();"
```

### Count Database Records

```powershell
$env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
psql -h localhost -p 5432 -U postgres -d strapi_dev -c "SELECT COUNT(*) FROM pages;" -c "SELECT COUNT(*) FROM files;"
```

### List Recent Backups

```powershell
# PostgreSQL backups
Get-ChildItem "backups" -Filter "strapi-*.sql" |
Sort-Object LastWriteTime -Descending |
Select-Object -First 5 Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}, LastWriteTime

# Strapi exports
Get-ChildItem "backups" -Filter "strapi-export-*.tar.gz" |
Sort-Object LastWriteTime -Descending |
Select-Object -First 5 Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}, LastWriteTime
```

### Check Backup Logs

```powershell
Get-Content "backups\scheduled-backup-log.txt" -Tail 20
```

### Verify Strapi API

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:1337/api/pages" -Method Get
$response.data.Count  # Should show number of pages
```

---

## ⚠️ Common Issues & Solutions

### Issue: "psql: command not found"

**Solution:** Add PostgreSQL to PATH

```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"
```

Or use full path:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d strapi_dev
```

---

### Issue: "Password authentication failed"

**Solution:** Verify password in .env file

```powershell
Get-Content "apps\strapi\.env" | Select-String "DATABASE_PASSWORD"
```

Set environment variable:

```powershell
$env:PGPASSWORD = "YOUR_ACTUAL_PASSWORD"
```

---

### Issue: "Database already exists" during restore

**Solution:** Drop existing database first

```powershell
$env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
psql -h localhost -p 5432 -U postgres -c "DROP DATABASE strapi_dev;" -c "CREATE DATABASE strapi_dev;"
```

---

### Issue: Strapi import fails with "Invalid archive"

**Solution:** Check file integrity

```powershell
# Verify file exists and has correct size (should be ~27 MB)
Get-Item "backups\strapi-export-LATEST.tar.gz.tar.gz" | Select-Object Name, Length, LastWriteTime
```

If corrupted, use alternate backup:

```powershell
Get-ChildItem "backups" -Filter "strapi-export-*.tar.gz" |
Sort-Object LastWriteTime -Descending |
Select-Object -First 5
```

---

### Issue: "Strapi is not running" during import

**Solution:** Start Strapi first

```powershell
cd apps/strapi
yarn dev
# Wait for "Server started on port 1337"
# Then run import in separate terminal
```

---

### Issue: Import completes but pages missing

**Solution:** Check Strapi admin panel filters

- Go to http://localhost:1337/admin
- Content Manager → Page
- Clear all filters (top right)
- Check "Draft" vs "Published" toggle

---

## 📊 Backup Monitoring

### Daily Checklist (2 minutes)

Run this command to verify backups are running:

```powershell
# Check if backups ran in last 24 hours
$PostgresBackup = Get-ChildItem "backups" -Filter "strapi-*.sql" |
                  Sort-Object LastWriteTime -Descending |
                  Select-Object -First 1

$StrapiExport = Get-ChildItem "backups" -Filter "strapi-export-*.tar.gz" |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 1

Write-Host "PostgreSQL Backup: $($PostgresBackup.Name) - $($PostgresBackup.LastWriteTime)"
Write-Host "Strapi Export: $($StrapiExport.Name) - $($StrapiExport.LastWriteTime)"

# Check if backups are recent (within 26 hours to account for schedule)
$CutoffTime = (Get-Date).AddHours(-26)
if ($PostgresBackup.LastWriteTime -lt $CutoffTime) {
    Write-Host "⚠️ WARNING: PostgreSQL backup is older than 26 hours!" -ForegroundColor Red
}
if ($StrapiExport.LastWriteTime -lt $CutoffTime) {
    Write-Host "⚠️ WARNING: Strapi export is older than 26 hours!" -ForegroundColor Red
}
```

### Weekly Maintenance

1. **Test restore on port 5433** (5 minutes):

   ```powershell
   $env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
   psql -h localhost -p 5433 -U postgres -c "DROP DATABASE IF EXISTS strapi_test;" -c "CREATE DATABASE strapi_test;"
   psql -h localhost -p 5433 -U postgres -d strapi_test -f "backups\strapi-LATEST.sql"
   psql -h localhost -p 5433 -U postgres -d strapi_test -c "SELECT COUNT(*) FROM pages;"
   ```

2. **Review logs for errors:**

   ```powershell
   Get-Content "backups\scheduled-backup-log.txt" | Select-String "FAILED|ERROR"
   ```

3. **Check disk space:**
   ```powershell
   Get-PSDrive C | Select-Object Used, Free, @{Name="Free(GB)";Expression={[math]::Round($_.Free/1GB,2)}}
   ```

---

## 🚀 Automation Status

### Scheduled Tasks (Windows Task Scheduler)

**PostgreSQL Backup:**

- **Task Name:** Strapi-Daily-Backup
- **Schedule:** Daily at 2:00 AM
- **Script:** `scripts/scheduled-backup-wrapper.ps1`
- **Status:** ✅ Active and tested

**Strapi Export:**

- **Task Name:** Strapi-Daily-Export
- **Schedule:** Daily at 2:05 AM (after PostgreSQL backup)
- **Script:** `scripts/scheduled-strapi-export.ps1`
- **Requires:** Strapi must be running on port 1337
- **Status:** ✅ Active and tested

### View Task Status

```powershell
Get-ScheduledTask -TaskName "Strapi-Daily-*" |
Select-Object TaskName, State, LastRunTime, LastTaskResult
```

### Manually Trigger Backups

```powershell
# PostgreSQL backup
Start-ScheduledTask -TaskName "Strapi-Daily-Backup"

# Strapi export (ensure Strapi is running first)
Start-ScheduledTask -TaskName "Strapi-Daily-Export"
```

---

## 📞 Emergency Contacts & Resources

### Support Channels

- **Project Repository:** https://github.com/Herman-Adu/strapi-next-monorepo-v2
- **Strapi Documentation:** https://docs.strapi.io/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/17/

### Quick Links

- Strapi Admin: http://localhost:1337/admin
- Frontend: http://localhost:3000
- Backup Scripts: `scripts/` directory
- This Document: `docs/08-devops/disaster-recovery.md`

---

## 🎯 Recovery Success Criteria

After any recovery operation, verify ALL of the following:

### ✅ System Health

- [ ] PostgreSQL service running (port 5432)
- [ ] Strapi starts without errors (port 1337)
- [ ] Next.js frontend loads (port 3000)
- [ ] No errors in Strapi console

### ✅ Data Integrity

- [ ] All pages visible in Strapi admin
- [ ] Page count matches expected (currently 10 total, 5 published)
- [ ] Media files accessible (currently 91 files)
- [ ] Frontend displays pages correctly
- [ ] Images load on frontend

### ✅ Functionality

- [ ] Can create new content in Strapi
- [ ] Can edit existing content
- [ ] Can publish/unpublish pages
- [ ] Frontend fetches content from Strapi API
- [ ] Navigation menu works
- [ ] Contact form submits (if applicable)

### Verification Commands

```powershell
# 1. Check services
Get-Service -Name "postgresql-x64-17" | Select-Object Status
Invoke-RestMethod -Uri "http://localhost:1337/_health" -Method Get

# 2. Check data counts
$env:PGPASSWORD = (Get-Content "apps\strapi\.env" | Select-String "^DATABASE_PASSWORD=").ToString().Split('=')[1]
psql -h localhost -p 5432 -U postgres -d strapi_dev -c "SELECT COUNT(*) as pages FROM pages; SELECT COUNT(*) as files FROM files;"

# 3. Check API
$pages = Invoke-RestMethod -Uri "http://localhost:1337/api/pages" -Method Get
Write-Host "API returned $($pages.data.Count) pages"
```

---

## 📝 Recovery Log Template

After each recovery operation, document what happened:

```markdown
## Recovery Event: [Date/Time]

**Incident:** [What went wrong]

**Recovery Method Used:** [PostgreSQL restore / Strapi import / Full restoration]

**Backup Used:** [Filename and timestamp]

**Steps Taken:**

1. [Step 1]
2. [Step 2]
   ...

**Time to Restore:** [X minutes]

**Data Loss:** [None / Last X hours / etc.]

**Outcome:** [Success / Partial / Failed]

**Lessons Learned:** [What can be improved]
```

---

## 🔐 Security Notes

- **Never commit `.env` files** containing database passwords
- **Encrypt backups** before uploading to cloud storage (future enhancement)
- **Restrict backup directory access** to administrators only
- **Rotate database passwords** quarterly
- **Test restore procedures** monthly to ensure backups are valid

---

## 🎓 Training & Knowledge Transfer

### New Team Members

1. **Read this document fully** (15 minutes)
2. **Watch backup scripts run** (observe scheduled tasks)
3. **Perform test restore** on port 5433 (supervised, 10 minutes)
4. **Simulate failure scenario** (delete test content, restore, verify)
5. **Review backup logs** weekly for first month

### Quarterly Disaster Recovery Drill

**Purpose:** Ensure team can recover system without documentation

**Scenario:** "Production database corrupted at 2 AM, you're on-call"

**Steps:**

1. Identify most recent backup
2. Create backup of corrupted database
3. Restore from backup
4. Verify all systems operational
5. Document time to recovery

**Target:** Complete restoration in under 10 minutes

---

## 📈 Future Enhancements

### Planned Improvements

1. **Multi-location backup storage**

   - Upload to AWS S3 after each backup
   - Use GitHub Actions for off-site redundancy
   - Target: Within 1 month

2. **Email alerts on backup failure**

   - Send notification if scheduled task fails
   - Daily summary email with backup status
   - Target: Within 2 weeks

3. **Automated backup verification**

   - Script tests restore weekly on port 5433
   - Alerts if restore fails or data count mismatch
   - Target: Within 1 month

4. **Encrypted backup storage**

   - GPG encrypt backups before cloud upload
   - Store encryption keys in separate secure location
   - Target: Before production deployment

5. **Point-in-time recovery**
   - Enable PostgreSQL WAL archiving
   - Restore to specific timestamp (e.g., 5 minutes before incident)
   - Target: Production feature

---

**Document Version:** 1.0  
**Last Tested:** December 28, 2025  
**Next Review Date:** January 28, 2026
