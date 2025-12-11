# 🛠️ Scripts Ecosystem - Development & DevOps Automation

**Created**: November 30, 2025  
**Status**: ✅ Production  
**Audience**: Developers, DevOps engineers

---

## 🎯 OVERVIEW

This document catalogs the **31 scripts** (~2,000 lines of code) that automate development workflows, database management, deployment, and DevOps tasks across the monorepo.

**Script Languages**:

- **Bash** (18 scripts): Cross-platform compatible, CI/CD focused
- **PowerShell** (4 scripts): Windows development support
- **Node.js** (9 scripts): JavaScript ecosystem automation

**Total Impact**: Saves ~20-30 hours/week across team

---

## 📊 SCRIPTS BY CATEGORY

### 1. Development Workflow (5 scripts)

| Script                  | Language   | Purpose                               | Usage                     |
| ----------------------- | ---------- | ------------------------------------- | ------------------------- |
| `dev-orchestrated.js`   | Node.js    | Start Strapi + UI with orchestration  | `yarn dev`                |
| `setup-env.js`          | Node.js    | Initialize environment files          | `yarn setup:env`          |
| `commit.ps1`            | PowerShell | Interactive conventional commits      | `./scripts/commit.ps1`    |
| `generate-component.js` | Node.js    | Scaffold new shared components        | `yarn generate:component` |
| `generate-types.js`     | Node.js    | Generate TypeScript types from Strapi | `yarn generate:types`     |

**Key Innovation**: Orchestrated development script (15-second startup vs 2-minute manual)

---

### 2. Database Management (11 scripts)

#### Backup & Restore

| Script                | Language   | Purpose                           | Usage                                 |
| --------------------- | ---------- | --------------------------------- | ------------------------------------- |
| `backup-database.sh`  | Bash       | Automated database backup (CI/CD) | GitHub Actions                        |
| `backup-database.ps1` | PowerShell | Local database backup (Windows)   | `./scripts/backup-database.ps1`       |
| `db-backup.sh`        | Bash       | Strapi-specific backup            | `./apps/strapi/scripts/db-backup.sh`  |
| `db-restore.sh`       | Bash       | Restore from backup               | `./apps/strapi/scripts/db-restore.sh` |

#### Seeding & Snapshots

| Script                | Language   | Purpose                        | Usage                                       |
| --------------------- | ---------- | ------------------------------ | ------------------------------------------- |
| `seed-e2e-data.sh`    | Bash       | Hybrid E2E test data seeding   | CI/CD E2E workflow                          |
| `seed-e2e-data.ps1`   | PowerShell | Windows E2E seeding            | Local E2E testing                           |
| `run-seed.js`         | Node.js    | Content seeding via Strapi API | `yarn seed`                                 |
| `snapshot-db.sh`      | Bash       | Create SQL snapshot            | `./apps/strapi/scripts/snapshot-db.sh`      |
| `restore-snapshot.sh` | Bash       | Restore from SQL snapshot      | `./apps/strapi/scripts/restore-snapshot.sh` |

#### Migration

| Script                   | Language | Purpose                          | Usage              |
| ------------------------ | -------- | -------------------------------- | ------------------ |
| `migrate-from-sqlite.sh` | Bash     | SQLite → PostgreSQL migration    | One-time migration |
| `migrate-from-docker.sh` | Bash     | Docker SQLite → Local PostgreSQL | Development setup  |

---

### 3. Deployment & CI/CD (4 scripts)

| Script                       | Language | Purpose                           | Usage                   |
| ---------------------------- | -------- | --------------------------------- | ----------------------- |
| `heroku/heroku-postbuild.sh` | Bash     | Heroku deployment build           | Heroku build process    |
| `check-strapi-built.sh`      | Bash     | Verify Strapi build before deploy | CI/CD validation        |
| `strapi-export.sh`           | Bash     | Export Strapi content             | Deployment prep         |
| `strapi-import.sh`           | Bash     | Import Strapi content             | Deployment finalization |

---

### 4. Utility Scripts (7 scripts)

| Script                               | Language   | Purpose                           | Usage                                |
| ------------------------------------ | ---------- | --------------------------------- | ------------------------------------ |
| `find-data.sh`                       | Bash       | Query database for content        | `./apps/strapi/scripts/find-data.sh` |
| `check-elements-usage.js`            | Node.js    | Analyze component usage           | `yarn check:usage`                   |
| `list-docker-containers.sh`          | Bash       | Docker container management       | Development debugging                |
| `utils/kill-port.ps1`                | PowerShell | Kill process on specific port     | Port conflict resolution             |
| `utils/clear-strapi-connections.ps1` | PowerShell | Clear Strapi database connections | Connection leak fixes                |
| `utils/rm-all.sh`                    | Bash       | Clean node_modules + caches       | Fresh install                        |
| `utils/rm-modules.sh`                | Bash       | Remove node_modules only          | Dependency reset                     |

---

## 🚀 MOST IMPACTFUL SCRIPTS

### 1. Orchestrated Development (`dev-orchestrated.js`)

**Impact**: Reduces startup from 2 minutes → 15 seconds

**What It Does**:

1. Starts Strapi server
2. Waits for health check
3. Generates TypeScript types
4. Starts Next.js UI
5. Opens browser automatically

**Usage**:

```bash
yarn dev
```

**Innovation Highlights**:

- Concurrent server startup
- Health check polling
- Automatic browser launch
- Error handling & recovery

**See**: [Orchestrated Development Deep-Dive](/docs/01-orchestrated-dev) ⏳

---

### 2. Hybrid E2E Seeding (`seed-e2e-data.sh`)

**Impact**: Reduces E2E test data seeding from 5+ minutes → 30 seconds

**What It Does**:

1. Creates admin user via Strapi API
2. Imports 60 components via SQL snapshot
3. Validates data integrity

**Usage**:

```bash
# CI/CD (GitHub Actions)
./apps/strapi/scripts/seed-e2e-data.sh

# Local development
yarn seed:e2e
```

**Innovation Highlights**:

- Hybrid approach (API + SQL)
- 60x faster than API-only
- Idempotent (safe to re-run)

**See**: [Hybrid Seeding Innovation](/docs/innovations-hybrid-seeding) ⏳

---

### 3. Database Backup (`backup-database.sh`)

**Impact**: Automated daily backups, disaster recovery ready

**What It Does**:

1. Dumps PostgreSQL database
2. Compresses backup
3. Uploads to AWS S3
4. Cleans old backups

**Usage**:

```bash
# CI/CD (GitHub Actions)
./scripts/backup-database.sh

# Local backup
UPLOAD_TO_S3=false ./scripts/backup-database.sh
```

**Innovation Highlights**:

- Automated in GitHub Actions
- S3 integration
- Retention policy (7 days local, 30 days S3)

**See**: [Database Backup Workflow](/docs/08-devops-workflows-06-database-backup-workflow) ✅

---

### 4. Environment Setup (`setup-env.js`)

**Impact**: Eliminates manual .env file configuration

**What It Does**:

1. Detects missing .env files
2. Copies from .env.example
3. Generates random secrets
4. Validates required variables

**Usage**:

```bash
yarn setup:env
```

**Innovation Highlights**:

- Onboarding automation
- Cross-platform (Node.js)
- Safe defaults

**See**: [Database Setup Script](/docs/03-database-scripts) ⏳

---

### 5. Commit Helper (`commit.ps1`)

**Impact**: Enforces conventional commits, prevents errors

**What It Does**:

1. Stages all changes
2. Prompts for commit type
3. Prompts for scope
4. Prompts for message
5. Generates conventional commit
6. Runs commitlint validation

**Usage**:

```powershell
./scripts/commit.ps1
```

**Example Flow**:

```
Select commit type:
1. feat
2. fix
3. docs
→ 1

Enter scope (optional): auth
Enter message: add login functionality

Generated commit:
feat(auth): add login functionality

Proceed? [Y/n] Y
```

**Innovation Highlights**:

- Interactive prompts
- Validation before commit
- Prevents invalid commits

---

## 🔍 SCRIPT DETAILS BY LOCATION

### Root Scripts (`scripts/`)

#### Development

- **`dev-orchestrated.js`** (200 lines)

  - Orchestrates Strapi + UI startup
  - Health checks, type generation
  - Browser auto-launch

- **`setup-env.js`** (150 lines)

  - Environment file initialization
  - Secret generation
  - Validation

- **`commit.ps1`** (100 lines)
  - Interactive conventional commits
  - PowerShell-based

#### Database

- **`backup-database.sh`** (80 lines)

  - CI/CD automated backup
  - S3 upload integration
  - Used by GitHub Actions

- **`backup-database.ps1`** (90 lines)

  - Windows local backup
  - PowerShell variant

- **`backup-strapi.ps1`** (120 lines)
  - Legacy backup script
  - Strapi-specific

#### Code Generation

- **`generate-component.js`** (250 lines)

  - Scaffold shared components
  - TypeScript types
  - Storybook stories

- **`generate-types.js`** (100 lines)
  - Extract Strapi types
  - Generate TypeScript definitions

#### Analysis

- **`check-elements-usage.js`** (180 lines)
  - Analyze component usage
  - Identify unused components
  - Generate report

---

### Strapi Scripts (`apps/strapi/scripts/`)

#### Database Backup & Restore

- **`db-backup.sh`** (60 lines)

  - Local PostgreSQL backup
  - Timestamped files

- **`db-restore.sh`** (50 lines)
  - Restore from backup file
  - Validation checks

#### Seeding

- **`seed-e2e-data.sh`** (120 lines)

  - Hybrid E2E seeding (API + SQL)
  - Admin user creation
  - SQL snapshot import

- **`seed-e2e-data.ps1`** (130 lines)

  - Windows variant
  - PowerShell-based

- **`run-seed.js`** (200 lines)
  - API-based content seeding
  - 60 shared components
  - Page creation

#### Snapshots

- **`snapshot-db.sh`** (70 lines)

  - Create SQL snapshot
  - E2E test data preservation

- **`restore-snapshot.sh`** (60 lines)
  - Restore from SQL snapshot
  - Fast E2E data reset

#### Migration

- **`migrate-from-sqlite.sh`** (90 lines)

  - SQLite → PostgreSQL migration
  - Data transformation
  - One-time use

- **`migrate-from-docker.sh`** (100 lines)

  - Docker SQLite → Local PostgreSQL
  - Development setup

- **`migrate-from-docker-sqlite.sh`** (80 lines)

  - Legacy migration script

- **`quick-migrate.sh`** (40 lines)
  - Fast migration wrapper

#### Import/Export

- **`strapi-export.sh`** (50 lines)

  - Export Strapi content
  - JSON format

- **`strapi-import.sh`** (50 lines)
  - Import Strapi content
  - Idempotent

#### Utilities

- **`find-data.sh`** (30 lines)

  - Query database via psql
  - Content search

- **`check-strapi-built.sh`** (20 lines)

  - Verify build artifacts exist
  - CI/CD validation

- **`list-docker-containers.sh`** (15 lines)
  - Docker container listing
  - Development aid

---

### Utility Scripts (`scripts/utils/`)

- **`kill-port.ps1`** (40 lines)

  - Kill process on specific port (Windows)
  - Port conflict resolution

- **`clear-strapi-connections.ps1`** (50 lines)

  - Clear Strapi database connections (Windows)
  - Connection leak fixes

- **`rm-all.sh`** (25 lines)

  - Remove node_modules + caches
  - Fresh install prep

- **`rm-modules.sh`** (15 lines)
  - Remove node_modules only
  - Faster reset

---

## 🎯 CROSS-PLATFORM STRATEGY

### Platform Support Matrix

| Script Type      | Windows           | macOS/Linux        | CI/CD     |
| ---------------- | ----------------- | ------------------ | --------- |
| **Bash Scripts** | ✅ (WSL/Git Bash) | ✅ Native          | ✅ Ubuntu |
| **PowerShell**   | ✅ Native         | ❌ (pwsh possible) | ❌        |
| **Node.js**      | ✅                | ✅                 | ✅        |

### Cross-Platform Patterns

**1. Dual Implementation** (Bash + PowerShell):

- Example: `seed-e2e-data.sh` + `seed-e2e-data.ps1`
- Why: Full platform support
- Trade-off: Duplicate maintenance

**2. Node.js Universal**:

- Example: `dev-orchestrated.js`, `setup-env.js`
- Why: Single codebase, all platforms
- Trade-off: Node.js dependency

**3. Bash with WSL**:

- Example: Most CI/CD scripts
- Why: CI/CD compatibility
- Trade-off: Windows users need WSL/Git Bash

---

## 📈 SCRIPT METRICS

### Lines of Code

| Language       | Scripts | Total Lines | Average   |
| -------------- | ------- | ----------- | --------- |
| **Bash**       | 18      | ~1,200      | 67 lines  |
| **PowerShell** | 4       | ~400        | 100 lines |
| **Node.js**    | 9       | ~1,200      | 133 lines |
| **Total**      | 31      | ~2,800      | 90 lines  |

### Complexity

| Complexity                | Scripts | Examples                                   |
| ------------------------- | ------- | ------------------------------------------ |
| **Simple** (< 50 lines)   | 12      | find-data.sh, kill-port.ps1                |
| **Medium** (50-150 lines) | 14      | backup-database.sh, setup-env.js           |
| **Complex** (> 150 lines) | 5       | dev-orchestrated.js, generate-component.js |

### Execution Frequency

| Frequency             | Scripts | Usage                                                       |
| --------------------- | ------- | ----------------------------------------------------------- |
| **Every Dev Session** | 3       | dev-orchestrated.js, setup-env.js                           |
| **Every Commit**      | 1       | commit.ps1                                                  |
| **Every CI Run**      | 4       | backup-database.sh, seed-e2e-data.sh, check-strapi-built.sh |
| **As Needed**         | 23      | Migration, utilities, debugging                             |

---

## 🐛 COMMON TROUBLESHOOTING

### Issue: Bash Script Fails on Windows

**Symptom**: `./script.sh: command not found`

**Solution**:

```bash
# Use Git Bash (recommended)
bash ./script.sh

# Or install WSL
wsl bash ./script.sh
```

---

### Issue: PowerShell Execution Policy Error

**Symptom**: `cannot be loaded because running scripts is disabled`

**Solution**:

```powershell
# Set execution policy (one-time)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run script
./scripts/commit.ps1
```

---

### Issue: Node.js Script Fails with Module Not Found

**Symptom**: `Cannot find module 'dotenv'`

**Solution**:

```bash
# Install dependencies
yarn install

# Run script
yarn dev
```

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Use Yarn Scripts Over Direct Execution**:

   ```bash
   # ✅ GOOD: Use package.json scripts
   yarn dev
   yarn seed:e2e

   # ❌ BAD: Direct script execution
   node scripts/dev-orchestrated.js
   ./apps/strapi/scripts/seed-e2e-data.sh
   ```

2. **Check Script Prerequisites**:

   ```bash
   # Before running database scripts
   which psql  # PostgreSQL client
   which pg_dump  # Backup utility
   ```

3. **Use Cross-Platform Scripts When Possible**:

   - Prefer Node.js for new scripts
   - Use Bash for CI/CD

4. **Add Scripts to Package.json**:

   ```json
   {
     "scripts": {
       "my:script": "node scripts/my-script.js"
     }
   }
   ```

5. **Document Script Usage**:
   - Add comments in script files
   - Update this index when adding scripts

### DON'T ❌

1. **Don't Hardcode Paths**:

   ```bash
   # ❌ BAD
   cd /Users/myname/project

   # ✅ GOOD
   cd "$(dirname "$0")/.."
   ```

2. **Don't Ignore Exit Codes**:

   ```bash
   # ✅ GOOD: Exit on error
   set -e
   ```

3. **Don't Mix Line Endings**:

   - Git attributes configured (LF only)
   - `.editorconfig` enforced

4. **Don't Commit Secrets in Scripts**:

   - Use environment variables
   - Reference .env files

5. **Don't Duplicate Logic**:
   - Extract common functions
   - Reuse across scripts

---

## 🔗 RELATED DOCUMENTATION

### Deep-Dive Guides

- [Orchestrated Development Script](/docs/01-orchestrated-dev) ⏳
- [Hybrid Seeding Script](/docs/02-hybrid-seeding) ⏳
- [Database Scripts](/docs/03-database-scripts) ⏳
- [Utility Scripts](/docs/04-utility-scripts) ⏳

### Workflow Integration

- [E2E Workflow](/docs/08-devops-workflows-02-e2e-workflow) (uses seed-e2e-data.sh)
- [Database Backup Workflow](/docs/08-devops-workflows-06-database-backup-workflow) (uses backup-database.sh)

### Innovations

- [Orchestrated Development Innovation](/docs/innovations-orchestrated-dev) ⏳
- [Hybrid Seeding Innovation](/docs/innovations-hybrid-seeding) ⏳
- [Cross-Platform Scripts Innovation](/docs/innovations-cross-platform) ⏳

---

## ✅ QUICK REFERENCE

### Most Common Scripts

```bash
# Development
yarn dev                  # Start orchestrated development
yarn setup:env            # Initialize environment files

# Database
yarn seed:e2e             # Seed E2E test data
./scripts/backup-database.sh  # Backup database

# Code Generation
yarn generate:component   # Generate shared component
yarn generate:types       # Generate TypeScript types

# Utilities
yarn clean                # Clean node_modules + caches
./scripts/utils/kill-port.ps1 3000  # Kill port (Windows)

# Commits
./scripts/commit.ps1      # Interactive conventional commit
```

---

**Last Updated**: November 30, 2025  
**Total Scripts**: 31  
**Total Lines**: ~2,800  
**Languages**: Bash (18), PowerShell (4), Node.js (9)  
**Key Innovations**: Orchestrated dev, Hybrid seeding, Cross-platform compatibility
