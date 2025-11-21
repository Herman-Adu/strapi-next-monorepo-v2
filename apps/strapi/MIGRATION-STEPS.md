# SQLite to PostgreSQL Migration - Manual Steps

## Prerequisites ✅

- [x] PostgreSQL installed and running
- [x] Database `strapi_dev` created in pgAdmin
- [x] User `strapi_user` with password `Icec00lzaduDev02`
- [x] SQLite database exists at `.tmp/data.db`
- [x] `.env` configured for PostgreSQL

## Migration Steps

### Option A: Using Script (Recommended)

```bash
# Make script executable (Git Bash or WSL)
chmod +x scripts/quick-migrate.sh

# Run migration
./scripts/quick-migrate.sh
```

### Option B: Manual Migration (If scripts fail)

#### Step 1: Backup SQLite Database

```bash
mkdir -p .tmp/backups
cp .tmp/data.db .tmp/backups/data-backup.db
```

#### Step 2: Export from SQLite

Create temporary `.env.sqlite`:

```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
HOST=0.0.0.0
PORT=1337
APP_KEYS=l8ftzyp2hNmEtNXBYU5hhQ==,lH7EcVVZxIoTFRorjrV9Vw==,jxWii7EjavRgJ4jYPZ60hA==,FlZM4tyij/HDFcKZhsmlXQ==
API_TOKEN_SALT=usReW/cYjLHmpLEoRnWf+g==
ADMIN_JWT_SECRET=Xw39b/xXxEHW1x1WMM6ugQ==
JWT_SECRET=ShuOcfjTi/RwcchWEIKYKA==
```

Export data:

```bash
# Rename .env files
mv .env .env.postgres
mv .env.sqlite .env

# Export
npm run strapi export -- --file exports/migration.tar.gz.enc

# Restore PostgreSQL .env
mv .env .env.sqlite
mv .env.postgres .env
```

#### Step 3: Import to PostgreSQL

```bash
npm run strapi import -- --file exports/migration.tar.gz.enc --force
```

#### Step 4: Verify

```bash
npm run develop
```

Visit http://localhost:1337/admin and check:

- ✅ Content types exist
- ✅ Content entries are present
- ✅ Media files are accessible
- ✅ Users and permissions are intact

## Troubleshooting

### Export fails with "Database connection error"

- Make sure `.env` points to SQLite during export
- Check that `.tmp/data.db` exists and is not corrupted

### Import fails with "Connection timeout"

- Verify PostgreSQL is running (check pgAdmin)
- Verify connection settings in `.env`
- Try increasing `DATABASE_CONNECTION_TIMEOUT=120000`

### "Module not found" error

- Run `npm install` first
- Make sure you're in the correct directory

### Media files missing after import

- Media files are included in Strapi export
- Check `public/uploads` folder
- Verify file permissions

## What Gets Migrated

✅ Content Types (schemas)
✅ Content Entries (data)
✅ Media Files (uploads)
✅ Users & Permissions
✅ API Tokens
✅ Plugin Configurations

## Post-Migration

1. **Keep SQLite backup**: Don't delete `.tmp/backups/data-backup.db` yet
2. **Test thoroughly**: Click through admin panel
3. **Test API**: Verify API endpoints work
4. **When confident**: Remove `.tmp/data.db` (old database)

## Rollback (If needed)

To go back to SQLite:

```bash
# Restore .env for SQLite
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Restore backup
cp .tmp/backups/data-backup.db .tmp/data.db

# Start Strapi
npm run develop
```
