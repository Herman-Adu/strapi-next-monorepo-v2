# PostgreSQL Authentication Fix for Strapi

## Problem

Password authentication failed for strapi_user because PostgreSQL is using `scram-sha-256` authentication method, but the user password was encrypted with MD5.

## Solution

Change PostgreSQL authentication method to `md5` for localhost connections.

## Steps

### 1. Open pg_hba.conf in Administrator Mode

```powershell
# Open Notepad as Administrator
Start-Process notepad "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" -Verb RunAs
```

### 2. Find These Lines (around line 82-83)

```
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

### 3. Change to MD5

Replace with:

```
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

### 4. Save and Close Notepad

### 5. Restart PostgreSQL Service

```powershell
Restart-Service postgresql-x64-17
```

### 6. Verify Service Restarted

```powershell
Get-Service postgresql-x64-17
```

### 7. Test Strapi Connection

```powershell
cd apps\strapi
yarn dev
```

## Alternative: Recreate User with SCRAM-SHA-256

If you prefer to keep scram-sha-256 (more secure), recreate the user:

```sql
-- In pgAdmin or psql connected to strapi_dev database

-- Step 1: Revoke privileges and reassign ownership
REVOKE ALL PRIVILEGES ON DATABASE strapi_dev FROM strapi_user;
REASSIGN OWNED BY strapi_user TO postgres;
DROP OWNED BY strapi_user;

-- Step 2: Disconnect from strapi_dev, connect to postgres database
-- Then drop the user
DROP USER strapi_user;

-- Step 3: Recreate user with scram-sha-256 (default)
CREATE USER strapi_user WITH PASSWORD 'your_password';
ALTER USER strapi_user WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE strapi_dev TO strapi_user;
```

**Simpler Alternative: Drop and recreate the entire database**

```sql
-- In pgAdmin connected to postgres database (not strapi_dev)
DROP DATABASE strapi_dev;
DROP USER strapi_user;

-- Recreate both
CREATE USER strapi_user WITH PASSWORD 'your_password';
ALTER USER strapi_user WITH SUPERUSER;
CREATE DATABASE strapi_dev OWNER strapi_user;
```

**Note**: This will use scram-sha-256 encryption by default in PostgreSQL 17.

## Recommendation

Use MD5 for local development (easier), use scram-sha-256 for production (more secure).
