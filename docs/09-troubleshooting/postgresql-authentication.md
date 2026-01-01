# PostgreSQL Authentication Troubleshooting

> **Quick Fix**: Change `scram-sha-256` to `md5` in `pg_hba.conf` for local development, or recreate user with proper encryption.

---

## Common Issue: Password Authentication Failed

**Symptom**: `password authentication failed for user "strapi_user"`

**Root Cause**: Mismatch between PostgreSQL's authentication method and the user's password encryption.

- PostgreSQL 17+ defaults to `scram-sha-256` encryption
- User password may be encrypted with older `md5` method
- Authentication method in `pg_hba.conf` must match password encryption

---

## Solution 1: Change Authentication Method to MD5 (Quick Fix)

### When to Use

- **Development environments** where security is less critical
- **Fast resolution** needed to unblock work
- **Temporary fix** while planning production security

### Steps

#### 1. Open pg_hba.conf as Administrator

**Windows**:

```powershell
Start-Process notepad "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" -Verb RunAs
```

**macOS/Linux**:

```bash
sudo nano /var/lib/postgresql/data/pg_hba.conf
# or
sudo nano /etc/postgresql/17/main/pg_hba.conf
```

#### 2. Find IPv4/IPv6 Local Connections

Look for these lines (typically around line 82-83):

```conf
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256
```

#### 3. Change to MD5

Replace with:

```conf
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```

#### 4. Save and Restart PostgreSQL

**Windows**:

```powershell
Restart-Service postgresql-x64-17
Get-Service postgresql-x64-17  # Verify running
```

**macOS**:

```bash
brew services restart postgresql@17
```

**Linux**:

```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql  # Verify running
```

#### 5. Test Connection

```powershell
cd apps/strapi
yarn dev
```

**Expected**: Strapi connects successfully to database.

---

## Solution 2: Recreate User with SCRAM-SHA-256 (Secure)

### When to Use

- **Production environments** requiring stronger security
- **Long-term solution** with modern encryption
- **Preferred method** for new projects

### Steps

#### 1. Connect to PostgreSQL

**Using pgAdmin**:

- Open pgAdmin
- Connect to `strapi_dev` database
- Open Query Tool

**Using psql**:

```bash
psql -U postgres -d strapi_dev
```

#### 2. Cleanup Existing User

```sql
-- Revoke all privileges
REVOKE ALL PRIVILEGES ON DATABASE strapi_dev FROM strapi_user;

-- Reassign ownership of objects
REASSIGN OWNED BY strapi_user TO postgres;

-- Drop owned objects
DROP OWNED BY strapi_user;
```

#### 3. Switch to postgres Database

**In pgAdmin**: Disconnect from `strapi_dev`, connect to `postgres` database

**In psql**:

```sql
\c postgres
```

#### 4. Drop and Recreate User

```sql
-- Drop the old user
DROP USER IF EXISTS strapi_user;

-- Create new user with scram-sha-256 (default in PostgreSQL 17+)
CREATE USER strapi_user WITH PASSWORD 'your_secure_password';
ALTER USER strapi_user WITH SUPERUSER;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE strapi_dev TO strapi_user;
```

#### 5. Update Strapi .env

Ensure password matches in `apps/strapi/.env`:

```env
DATABASE_PASSWORD=your_secure_password
```

#### 6. Test Connection

```bash
cd apps/strapi
yarn dev
```

---

## Solution 3: Fresh Database Setup (Nuclear Option)

### When to Use

- **Development environment** can be reset
- **Fastest solution** when data is not critical
- **Clean slate** for testing

### Steps

#### 1. Connect to postgres Database

```bash
psql -U postgres
```

#### 2. Drop Everything

```sql
-- Drop database (disconnects all sessions)
DROP DATABASE IF EXISTS strapi_dev;

-- Drop user
DROP USER IF EXISTS strapi_user;
```

#### 3. Recreate from Scratch

```sql
-- Create user
CREATE USER strapi_user WITH PASSWORD 'your_password';
ALTER USER strapi_user WITH SUPERUSER;

-- Create database
CREATE DATABASE strapi_dev OWNER strapi_user;
```

#### 4. Run Strapi Migrations

```bash
cd apps/strapi
yarn dev  # Strapi will create tables automatically
```

#### 5. Restore Data (if needed)

```bash
# If you have a backup
yarn strapi:restore
```

---

## Understanding Authentication Methods

### MD5 (Legacy)

- **Security**: Weaker encryption (vulnerable to rainbow table attacks)
- **Compatibility**: Works with older PostgreSQL versions
- **Use Case**: Development environments, legacy systems

### SCRAM-SHA-256 (Modern)

- **Security**: Strong encryption (resistant to rainbow tables)
- **Default**: PostgreSQL 10+ default, required in 17+
- **Use Case**: Production environments, new projects

### Recommendation Matrix

| Environment          | Method        | Rationale                      |
| -------------------- | ------------- | ------------------------------ |
| Development (Local)  | MD5           | Fast setup, less friction      |
| Development (Shared) | SCRAM-SHA-256 | Team alignment with production |
| Staging              | SCRAM-SHA-256 | Mirror production security     |
| Production           | SCRAM-SHA-256 | Maximum security               |

---

## Prevention Checklist

### For New Projects

- [ ] Use PostgreSQL 17+ default settings (scram-sha-256)
- [ ] Document password encryption method in README
- [ ] Include pg_hba.conf configuration in setup docs
- [ ] Add database setup script to automate user creation

### For Existing Projects

- [ ] Audit current authentication method
- [ ] Plan migration to scram-sha-256 if using MD5
- [ ] Test authentication on all environments
- [ ] Document workarounds for common issues

### For Team Environments

- [ ] Standardize pg_hba.conf settings across team
- [ ] Include PostgreSQL version in project requirements
- [ ] Add troubleshooting guide to onboarding docs
- [ ] Create database setup script for consistency

---

## Related Issues

### "peer authentication failed"

**Cause**: PostgreSQL trying to use OS user authentication instead of password.

**Fix**: Change authentication method from `peer` to `md5` or `scram-sha-256` in pg_hba.conf.

### "FATAL: no pg_hba.conf entry"

**Cause**: No matching rule in pg_hba.conf for your connection.

**Fix**: Add entry for your IP address and authentication method.

### "Connection refused"

**Cause**: PostgreSQL service not running.

**Fix**:

```bash
# Windows
Start-Service postgresql-x64-17

# macOS
brew services start postgresql@17

# Linux
sudo systemctl start postgresql
```

---

## See Also

- [Installation Guide](/docs/01-getting-started-installation) - PostgreSQL setup instructions
- [Strapi Configuration](/docs/03-strapi-configuration) - Database connection settings
- [Development Environment](/docs/01-getting-started-development-environment) - Environment variables setup
- [Backup & Safety](/docs/readme) - Database backup procedures

---

## Troubleshooting Checklist

If authentication still failing after trying solutions above:

- [ ] Verify PostgreSQL service is running
- [ ] Check PostgreSQL version (`psql --version`)
- [ ] Confirm pg_hba.conf changes saved
- [ ] Verify PostgreSQL service restarted after config changes
- [ ] Check .env file has correct password
- [ ] Test direct connection with psql: `psql -U strapi_user -d strapi_dev`
- [ ] Review PostgreSQL logs for detailed error messages
- [ ] Verify user exists: `psql -U postgres -c "\du"`
- [ ] Check database exists: `psql -U postgres -c "\l"`

---

**Last Updated**: December 11, 2025  
**Related Incident**: [POSTGRES_AUTH_FIX.md](/docs/postgres_auth_fix) (root - to be archived)
