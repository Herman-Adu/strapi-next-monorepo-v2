# ⚡ CI/CD Quick Reference - Essential Commands & Patterns

**Created**: November 30, 2025  
**Status**: ✅ Complete  
**Audience**: All developers  
**Format**: Cheat sheet

---

## 🚀 COMMON WORKFLOWS

### Development

```bash
# Start orchestrated development
yarn dev

# Setup environment files
yarn setup:env

# Commit with conventional commits
./scripts/commit.ps1
```

### Testing

```bash
# Run E2E tests locally
yarn test:e2e

# Run E2E in UI mode (debug)
yarn test:e2e --ui

# Seed E2E test data
yarn seed:e2e

# Reset E2E database
./apps/strapi/scripts/restore-snapshot.sh
```

### CI/CD Operations

```bash
# Trigger workflow manually
gh workflow run <workflow-name>.yml

# List recent workflow runs
gh run list --workflow=<workflow-name>.yml

# View workflow logs
gh run view <run-id> --log

# Download artifacts
gh run download <run-id>

# Cancel running workflow
gh run cancel <run-id>
```

---

## 📊 WORKFLOWS

### Workflow Status

| Workflow       | Trigger       | Duration  | Success Rate |
| -------------- | ------------- | --------- | ------------ |
| **CI**         | Every push/PR | 10-15 min | 98%          |
| **E2E**        | Code changes  | 12-15 min | 95%          |
| **Lighthouse** | UI changes    | 15-20 min | 100%         |
| **Visual**     | UI changes    | 10-15 min | 100%         |
| **Cache**      | Daily 2 AM    | 2-5 min   | 100%         |
| **Backup**     | Daily 2 AM    | 5-10 min  | 98%          |

### Manual Triggers

```bash
# CI workflow
gh workflow run ci.yml

# E2E tests
gh workflow run e2e-tests.yml

# Lighthouse
gh workflow run lighthouse.yml

# Visual regression
gh workflow run visual-regression.yml

# Cache cleanup
gh workflow run cleanup-caches.yml

# Database backup (without S3)
gh workflow run backup.yml -f upload_to_s3=false
```

---

## 🐛 TROUBLESHOOTING

### CI Failures

```bash
# Lint errors
yarn format:fix
yarn lint:fix

# Type errors
yarn typecheck

# Build errors
yarn build

# Cache issues
rm -rf .turbo node_modules
yarn install
```

### E2E Failures

```bash
# Reset database
./apps/strapi/scripts/restore-snapshot.sh

# Clear test artifacts
rm -rf apps/ui/test-results
rm -rf apps/ui/playwright-report

# Re-seed data
yarn seed:e2e

# Run specific test
yarn test:e2e --grep "test name"
```

### Performance Issues

```bash
# Run Lighthouse locally
npm install -g @lhci/cli
lhci autorun

# Analyze bundle
yarn workspace @repo/ui build
# Check .next/analyze

# Check image sizes
find apps/ui/public -type f -size +500k
```

---

## 🔐 SECRETS

### Required GitHub Secrets

```bash
# Database
STRAPI_DATABASE_URL

# AWS (backups)
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BACKUP_BUCKET
AWS_REGION

# Chromatic (visual testing)
CHROMATIC_PROJECT_TOKEN
```

### Set Secrets

```bash
gh secret set SECRET_NAME
# Paste value when prompted
```

---

## 📦 CACHE MANAGEMENT

### View Cache Usage

```bash
# List caches
gh api repos/{owner}/{repo}/actions/caches

# Total cache size (GB)
gh api repos/{owner}/{repo}/actions/caches | \
  jq '[.actions_caches[].size_in_bytes] | add / 1024 / 1024 / 1024'
```

### Manual Cleanup

```bash
# Trigger cleanup workflow
gh workflow run cleanup-caches.yml

# Delete specific cache
gh api -X DELETE repos/{owner}/{repo}/actions/caches/{cache-id}
```

---

## 💾 DATABASE

### Backup

```bash
# Trigger backup workflow
gh workflow run backup.yml

# Local backup
./scripts/backup-database.sh

# Download latest backup
gh run list --workflow=backup.yml --limit 1 --json databaseId -q '.[0].databaseId' | \
  xargs gh run download
```

### Restore

```bash
# From artifact
psql $DATABASE_URL < database-backup-*/strapi_backup_*.sql

# From S3
aws s3 cp s3://strapi-backups/backups/latest.sql .
psql $DATABASE_URL < latest.sql

# From snapshot
./apps/strapi/scripts/restore-snapshot.sh
```

---

## 🎨 VISUAL REGRESSION

### Chromatic Operations

```bash
# Trigger visual regression
gh workflow run visual-regression.yml

# View Chromatic dashboard
# Check PR comment for link

# Accept all changes (locally)
# Use Chromatic UI

# Build Storybook locally
yarn workspace @repo/ui build-storybook
```

---

## ⚡ PERFORMANCE

### Lighthouse

```bash
# Run locally
lhci autorun --config=lighthouserc.json

# Check specific URL
lhci autorun --url=http://localhost:3000/about

# View report
open .lighthouseci/lhr-*.html
```

### Performance Budgets

```json
// lighthouserc.json
{
  "categories:performance": ["error", { "minScore": 0.9 }],
  "categories:accessibility": ["error", { "minScore": 0.95 }]
}
```

---

## 🛠️ SCRIPTS

### Development

```bash
# Orchestrated dev
yarn dev

# Setup env
yarn setup:env

# Generate component
yarn generate:component

# Generate types
yarn generate:types
```

### Database

```bash
# Seed E2E data
yarn seed:e2e

# Create snapshot
./apps/strapi/scripts/snapshot-db.sh

# Restore snapshot
./apps/strapi/scripts/restore-snapshot.sh

# Backup database
./scripts/backup-database.sh
```

### Utilities

```bash
# Kill port (Windows)
./scripts/utils/kill-port.ps1 3000

# Clean workspace
./scripts/utils/rm-all.sh

# Clear Strapi connections
./scripts/utils/clear-strapi-connections.ps1
```

---

## 📈 METRICS

### CI/CD Health

```bash
# Success rate (last 30 days)
gh run list --workflow=ci.yml --limit 100 --json conclusion | \
  jq '[.[] | select(.conclusion == "success")] | length'

# Average duration
gh run list --workflow=ci.yml --limit 20 --json durationMs | \
  jq '[.[].durationMs] | add / length / 1000 / 60'
```

### Cache Metrics

```bash
# Total caches
gh api repos/{owner}/{repo}/actions/caches | jq '.actions_caches | length'

# Cache sizes
gh api repos/{owner}/{repo}/actions/caches | \
  jq '.actions_caches[] | {key, size_mb: (.size_in_bytes / 1024 / 1024 | floor)}'
```

---

## 🔗 QUICK LINKS

### Documentation

- [Workflows Index](../../08-devops/workflows/README.md)
- [Scripts Index](../../08-devops/scripts/README.md)
- [Master Reference](../../08-devops/PHASE-3-MASTER-REFERENCE.md)

### Dashboards

- [GitHub Actions](https://github.com/{owner}/{repo}/actions)
- [Chromatic](https://www.chromatic.com)

---

**Last Updated**: November 30, 2025  
**Workflows**: 6 production  
**Scripts**: 31 automation tools  
**Success Rate**: 98% (CI/CD)
