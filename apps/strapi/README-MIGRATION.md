# Database Migration Guide

## Prerequisites

- PostgreSQL installed and running
- Access to source database (production/staging)
- Strapi CLI access

## Migration Methods

### Method 1: Using Strapi Data Transfer (Recommended)

This method transfers content types, entries, media files, and configurations.

#### From Production to Local

1. **On Production/Source Environment:**

   ```bash
   npm run strapi export -- --file strapi-export.tar.gz --no-encrypt
   ```

2. **Download the export file to local**

3. **On Local Environment:**
   ```bash
   npm run strapi import -- --file strapi-export.tar.gz --force
   ```

Or use the provided scripts:

```bash
# On production
./scripts/strapi-export.sh

# Transfer file to local, then:
./scripts/strapi-import.sh exports/strapi-export-YYYYMMDD_HHMMSS.tar.gz
```

### Method 2: Direct Database Transfer

Use this for database-only migration without media files.

#### Backup from Production

```bash
# SSH into production server
pg_dump -h localhost -U strapi_user -d strapi_prod > strapi-backup.sql

# Or use the script
./scripts/db-backup.sh production
```

#### Restore to Local

```bash
# Transfer the SQL file to local machine, then:
./scripts/db-restore.sh strapi-backup.sql
```

### Method 3: Remote Database Connection (Development Only)

Temporarily connect local Strapi to remote database:

1. Update `.env`:

   ```env
   DATABASE_HOST=your-production-host.com
   DATABASE_NAME=strapi_prod
   DATABASE_USERNAME=strapi_user
   DATABASE_PASSWORD=your-prod-password
   DATABASE_SSL=true
   ```

2. Start Strapi to sync schema
3. Export data using Method 1
4. Restore `.env` to local settings
5. Import data

## Important Notes

- **Media Files**: Strapi transfer includes media; database backup doesn't
- **Secrets**: Never commit production credentials
- **Testing**: Always test migrations on a copy first
- **Plugins**: Ensure same plugin versions on both environments

## Troubleshooting

**Connection timeout:**

```env
DATABASE_CONNECTION_TIMEOUT=120000
```

**SSL issues:**

```env
DATABASE_SSL=true
# Or for self-signed certificates:
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

**Large datasets:**
Use `pg_dump` with compression:

```bash
pg_dump -h host -U user -d database | gzip > backup.sql.gz
gunzip -c backup.sql.gz | psql -h localhost -U strapi_user -d strapi_dev
```
