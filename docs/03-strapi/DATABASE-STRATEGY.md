# Database Strategy

**Last Updated**: January 1, 2026
**Status**: ✅ Production-Ready (PostgreSQL Primary)

---

## 🎯 Executive Summary

This project uses **PostgreSQL as the primary database** for both development and production environments. SQLite support remains available for unit testing and legacy compatibility, but all active development should use PostgreSQL.

**Quick Facts:**

- **Primary Database**: PostgreSQL 14+ (development, staging, production)
- **Testing Database**: SQLite (unit tests, CI environment only)
- **Migration Status**: ✅ Completed (November 2025)
- **Production Database**: PostgreSQL on Heroku/Render
- **Backup Strategy**: Dual-layer (Strapi export + PostgreSQL dump)

---

## 📋 Current Database Architecture

### Environment Configuration

```plaintext
┌─────────────────────────────────────────────────────────┐
│                    Database Strategy                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Development    →  PostgreSQL (local)                    │
│  Staging        →  PostgreSQL (cloud)                    │
│  Production     →  PostgreSQL (cloud)                    │
│  CI/Testing     →  SQLite (ephemeral)                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Database Configuration (`apps/strapi/config/database.ts`)

```typescript
export default ({ env }) => {
  const client = env("DATABASE_CLIENT", "postgres") // PostgreSQL default

  const connections = {
    postgres: {
      connection: {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "strapi_dev"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        ssl: env.bool("DATABASE_SSL", false),
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, "..", "..", ".tmp/data.db"),
      },
      useNullAsDefault: true,
    },
  }

  return {
    connection: {
      client,
      ...connections[client],
    },
  }
}
```

### Environment Variables (`.env`)

**Development (PostgreSQL):**

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_dev
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false
```

**Production (PostgreSQL with SSL):**

```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
```

**Testing (SQLite - CI only):**

```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/test.db
```

---

## 🚀 PostgreSQL as Primary Database

### Why PostgreSQL?

**Advantages over SQLite:**

1. **Production-Ready**: PostgreSQL is designed for production workloads
2. **Concurrent Access**: No database locking issues (unlike SQLite)
3. **Advanced Features**: Full-text search, JSON operations, advanced indexing
4. **Scalability**: Handles large datasets and high traffic
5. **Data Integrity**: ACID compliance with robust transaction support
6. **Backup & Recovery**: Industry-standard tools (pg_dump, pg_restore)
7. **Development Parity**: Same database in development and production

**SQLite Limitations:**

- ❌ Single-writer concurrency (database locks)
- ❌ Limited production scalability
- ❌ No remote access capabilities
- ❌ File-based (backup complexity)
- ⚠️ Not recommended for production use

### PostgreSQL Setup (First Time)

**1. Install PostgreSQL:**

- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql@14`
- **Linux**: `sudo apt-get install postgresql-14`

**2. Create Database & User:**

```sql
-- Connect to PostgreSQL as postgres user
psql -U postgres

-- Create user
CREATE USER strapi_user WITH PASSWORD 'your_secure_password';

-- Create database
CREATE DATABASE strapi_dev OWNER strapi_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE strapi_dev TO strapi_user;

-- Connect to database and grant schema privileges
\c strapi_dev
GRANT ALL ON SCHEMA public TO strapi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO strapi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO strapi_user;
```

**3. Verify Connection:**

```powershell
# Test connection
psql -U strapi_user -d strapi_dev -h localhost

# Should see:
# strapi_dev=>
```

**4. Update `.env`:**

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_dev
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false
```

**5. Start Strapi:**

```powershell
# From workspace root
yarn workspace @repo/strapi dev

# Strapi will automatically:
# 1. Connect to PostgreSQL
# 2. Run migrations
# 3. Create tables
# 4. Sync schema
```

---

## 🔄 Migration from SQLite (Historical Reference)

> **Note**: This section is historical. All active projects should already be using PostgreSQL.

### Migration Status: ✅ COMPLETED (November 2025)

The project successfully migrated from SQLite to PostgreSQL in November 2025. All production and development environments now use PostgreSQL.

### Migration Process (For Reference)

If you need to migrate data from SQLite to PostgreSQL:

**1. Backup SQLite Database:**

```powershell
Copy-Item "apps/strapi/.tmp/data.db" -Destination "backups/sqlite-backup.db"
```

**2. Export from SQLite:**

```powershell
# Temporarily use SQLite
$env:DATABASE_CLIENT="sqlite"
yarn workspace @repo/strapi strapi export -- --file backups/sqlite-export.tar.gz --no-encrypt
```

**3. Switch to PostgreSQL:**

```powershell
# Update .env to PostgreSQL settings
# See "PostgreSQL Setup" section above
```

**4. Import to PostgreSQL:**

```powershell
# Start with clean PostgreSQL database
yarn workspace @repo/strapi strapi import -- --file backups/sqlite-export.tar.gz --force
```

**5. Verify Migration:**

- Check all content types in Strapi admin
- Verify media files in `public/uploads/`
- Test API endpoints
- Check user accounts and permissions

### Migration Documentation

See archived migration documents:

- [`apps/strapi/MIGRATION-STEPS.md`](/docs/99-archive-migration-migration-steps) - Detailed migration steps
- [`apps/strapi/README-MIGRATION.md`](/docs/99-archive-migration-readme-migration) - Migration guide

---

## 💾 Backup & Restore Strategy

### Dual-Layer Backup Approach

**Layer 1: Strapi Export** (Portable, version-agnostic)
**Layer 2: PostgreSQL Dump** (Complete database snapshot)

### Method 1: Strapi Export (Recommended for Development)

**Create Backup:**

```powershell
# From workspace root
yarn workspace @repo/strapi strapi export -- --file backups/strapi-export-$(Get-Date -Format 'yyyy-MM-dd-HHmm').tar.gz --no-encrypt

# Includes:
# - All content types and entries
# - Media files
# - Configuration
# - User accounts
```

**Restore Backup:**

```powershell
# Import data (prompts for conflicts)
yarn workspace @repo/strapi strapi import -- --file backups/strapi-export-2025-11-12-1430.tar.gz

# Force overwrite (destructive)
yarn workspace @repo/strapi strapi import -- --file backups/strapi-export-2025-11-12-1430.tar.gz --force
```

### Method 2: PostgreSQL Dump (Production-Ready)

**Create Database Backup:**

```powershell
# Dump database (custom format)
pg_dump -h localhost -U strapi_user -d strapi_dev -F c -f backups/strapi-db-$(Get-Date -Format 'yyyy-MM-dd').dump

# OR plain SQL format
pg_dump -h localhost -U strapi_user -d strapi_dev > backups/strapi-db-$(Get-Date -Format 'yyyy-MM-dd').sql
```

**Restore Database:**

```powershell
# Drop and recreate database
psql -U postgres -c "DROP DATABASE strapi_dev;"
psql -U postgres -c "CREATE DATABASE strapi_dev OWNER strapi_user;"

# Restore from custom format
pg_restore -h localhost -U strapi_user -d strapi_dev backups/strapi-db-2025-11-12.dump

# OR restore from SQL format
psql -U strapi_user -d strapi_dev < backups/strapi-db-2025-11-12.sql
```

### Backup Media Files

```powershell
# Compress uploads folder
Compress-Archive -Path "apps/strapi/public/uploads/*" -DestinationPath "backups/media-$(Get-Date -Format 'yyyy-MM-dd').zip"

# Restore media
Expand-Archive -Path "backups/media-2025-11-12.zip" -DestinationPath "apps/strapi/public/uploads" -Force
```

### Automated Backup Scripts

Use provided PowerShell scripts:

```powershell
# Create backup (Strapi export + PostgreSQL dump + media)
.\scripts\backup-database.ps1

# Backups saved to: backups/<timestamp>/
```

---

## 🧪 Testing with SQLite

### When to Use SQLite

- ✅ Unit tests (fast, ephemeral databases)
- ✅ CI environment (GitHub Actions)
- ✅ Quick local experiments
- ❌ Development (use PostgreSQL for dev/prod parity)
- ❌ Production (never use SQLite in production)

### SQLite Configuration for Tests

```env
# .env.test
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/test.db
```

**Run Tests with SQLite:**

```powershell
# Unit tests use SQLite by default
yarn workspace @repo/strapi test
```

**CI Configuration (`.github/workflows`):**

```yaml
- name: Run Strapi tests
  env:
    DATABASE_CLIENT: sqlite
    DATABASE_FILENAME: .tmp/test.db
  run: yarn workspace @repo/strapi test
```

---

## 🚨 Troubleshooting

### PostgreSQL Connection Issues

**Problem**: `FATAL: password authentication failed for user "strapi_user"`

**Solution**: See [PostgreSQL Authentication Guide](/docs/09-troubleshooting-postgresql-authentication)

**Quick Fix:**

```sql
-- Reset password
ALTER USER strapi_user WITH PASSWORD 'new_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE strapi_dev TO strapi_user;
```

### Database Lock Errors (SQLite)

**Problem**: `database is locked` error

**Solution**: Stop Strapi server before backup/restore operations

```powershell
# Stop server (Ctrl+C)
# Wait for clean shutdown
# Then perform operation
```

### Schema Sync Issues

**Problem**: Strapi shows component/content type errors

**Solution**:

1. Stop Strapi server
2. Delete `.cache/` folder
3. Restart Strapi (schema will re-sync)

```powershell
Remove-Item -Recurse -Force "apps/strapi/.cache"
yarn workspace @repo/strapi dev
```

### Migration Rollback

**Problem**: Need to revert to SQLite temporarily

**Solution**:

1. Backup current PostgreSQL database
2. Update `.env` to use SQLite
3. Import previous SQLite export

```powershell
# Backup PostgreSQL first
pg_dump -U strapi_user -d strapi_dev > backups/postgres-backup.sql

# Switch .env to SQLite
$env:DATABASE_CLIENT="sqlite"

# Import old SQLite data
yarn workspace @repo/strapi strapi import -- --file backups/sqlite-export.tar.gz --force
```

---

## 📚 Related Documentation

### Database Configuration

- [Strapi Configuration](/docs/readme) - Main Strapi documentation
- [PostgreSQL Authentication](/docs/09-troubleshooting-postgresql-authentication) - Auth troubleshooting
- [Backup & Safety](/docs/readme) - Backup procedures

### Migration Guides

- [Migration Steps](/docs/99-archive-migration-migration-steps) - Detailed SQLite to PostgreSQL migration
- [Migration README](/docs/99-archive-migration-readme-migration) - Migration overview

### Development Workflows

- [Development Environment](/docs/01-getting-started-development-environment) - Setup guide
- [Backend Health Check](/docs/09-troubleshooting-backend-health-check) - Strapi health checks

---

## ✅ Best Practices

### Development Workflow

1. **Use PostgreSQL for Development**

   - Ensures dev/prod parity
   - Avoids SQLite-specific issues
   - Same SQL dialect as production

2. **Regular Backups**

   - Daily exports during active development
   - Weekly PostgreSQL dumps
   - Always backup before schema changes

3. **Stop Strapi Before Operations**

   - Backups, imports, schema changes
   - Prevents database locks and corruption
   - Wait for clean shutdown

4. **Use Version Control for Config**

   - Commit `config/` changes
   - Use Config Sync for content types
   - Document schema changes in PRs

5. **Test with PostgreSQL**
   - Don't rely on SQLite-specific behavior
   - Test migrations in PostgreSQL
   - Use staging environment for validation

### Production Workflow

1. **Automated Backups**

   - Schedule daily PostgreSQL dumps
   - Keep 30 days of backups
   - Store backups off-site (S3, Backblaze)

2. **Zero-Downtime Deployments**

   - Export data before major updates
   - Test migrations in staging first
   - Have rollback plan ready

3. **Monitor Database Performance**

   - Track query performance
   - Monitor connection pool usage
   - Set up alerts for errors

4. **Security**
   - Use SSL for production connections
   - Rotate database passwords regularly
   - Limit database user privileges
   - Never commit `.env` files

---

## 🎯 Quick Reference

### Common Commands

```powershell
# Start Strapi (PostgreSQL)
yarn workspace @repo/strapi dev

# Create backup
yarn workspace @repo/strapi strapi export -- --file backups/backup.tar.gz --no-encrypt

# Restore backup
yarn workspace @repo/strapi strapi import -- --file backups/backup.tar.gz --force

# PostgreSQL dump
pg_dump -U strapi_user -d strapi_dev > backup.sql

# PostgreSQL restore
psql -U strapi_user -d strapi_dev < backup.sql

# Check PostgreSQL connection
psql -U strapi_user -d strapi_dev -h localhost

# List databases
psql -U postgres -c "\l"

# List tables in database
psql -U strapi_user -d strapi_dev -c "\dt"
```

### Environment Variables Cheat Sheet

```env
# PostgreSQL (Development)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_dev
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

# PostgreSQL (Production)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:pass@host:5432/db
DATABASE_SSL=true

# SQLite (Testing only)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/test.db
```

---

## 📅 Historical Context

### Migration Timeline

- **Before November 2025**: SQLite for development, PostgreSQL for production (split approach)
- **November 2025**: Migrated to PostgreSQL for all environments
- **Current (January 2026)**: PostgreSQL primary, SQLite for testing only

### Lessons Learned

1. **SQLite database locks** caused issues during development
2. **Dev/prod parity** reduced deployment surprises
3. **PostgreSQL advanced features** enabled better performance
4. **Concurrent access** improved developer experience
5. **Backup strategy** evolved to dual-layer approach

---

**Summary**: Use PostgreSQL for all development and production. SQLite is available for unit tests only. Follow backup best practices and always stop Strapi before database operations.
