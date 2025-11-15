# Tomorrow's Action Items - GitHub Actions Cache Cleanup

## Issue: Cache Storage Limit Exceeded

⚠️ **Current Status**: 11.58 GB of 10 GB cache limit used  
📍 **Location**: https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions/caches

---

## Immediate Actions Required

### 1. Manual Cache Cleanup (5 minutes)

Navigate to: **GitHub → Repository → Actions → Caches**

**Delete these caches** (oldest first):

- `node-cache-Linux-x64-yarn-46f4f65b5bc92df3c7d164fc3c8ca7dd6d2ce8c2c840d0099daefee2e78a755f` (2.4 GB, 3 days old)
- `Linux-turbo-db7258d2e56054dcc4634927cc60c51255f132b4` (500 MB, yesterday)
- Any other caches older than 24 hours

**Keep these caches** (most recent):

- `Linux-turbo-234d6d0ac37da6759e3826de7c55887e595f8f8f` (500 MB, 3 min ago)
- `node-cache-Linux-x64-yarn-05ebb70fa8ca3578231c72d6e...` (2.4 GB, 3 min ago)

---

## Permanent Solutions

### Option A: Automatic Cache Cleanup Workflow (Recommended)

Create `.github/workflows/cleanup-caches.yml`:

```yaml
name: Cleanup old caches

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: "0 2 * * *"
  workflow_dispatch: # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup old caches
        uses: actions/github-script@v7
        with:
          script: |
            const caches = await github.rest.actions.getActionsCacheList({
              owner: context.repo.owner,
              repo: context.repo.repo,
              per_page: 100
            });

            const now = new Date();
            const maxAge = 7; // Keep caches younger than 7 days

            for (const cache of caches.data.actions_caches) {
              const createdAt = new Date(cache.created_at);
              const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
              
              if (ageInDays > maxAge) {
                console.log(`Deleting cache: ${cache.key} (${ageInDays.toFixed(1)} days old)`);
                await github.rest.actions.deleteActionsCacheById({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  cache_id: cache.id
                });
              }
            }
```

**Benefits**:

- ✅ Runs automatically daily
- ✅ Keeps caches under control
- ✅ Can trigger manually via Actions tab

---

### Option B: Reduce Cache Size

#### Current Cache Strategy (Large)

```yaml
# In ci.yml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.yarn/cache
      **/node_modules
    key: node-cache-${{ runner.os }}-${{ runner.arch }}-yarn-${{ hashFiles('**/yarn.lock') }}
```

#### Optimized Strategy (Smaller)

```yaml
# Only cache Yarn cache, not node_modules
- name: Cache Yarn
  uses: actions/cache@v4
  with:
    path: ~/.yarn/cache
    key: yarn-${{ hashFiles('**/yarn.lock') }}
```

**Trade-off**:

- ✅ Reduces cache from 2.4 GB → ~500 MB
- ⚠️ Installs take ~30s longer (acceptable)

---

### Option C: Implement Cache Eviction Strategy

Update `ci.yml` to use versioned cache keys:

```yaml
# Add version prefix to force cache busting
key: v2-node-cache-${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
```

**When to bump version**:

- After major dependency updates
- When cache becomes corrupted
- To force fresh builds

---

## Recommended Approach

### Immediate (Today - Before Sleep ✅)

- [x] Document the issue
- [x] Create action plan

### Tomorrow Morning

1. **Manual cleanup** (5 min)

   - Delete caches older than 3 days
   - Target: Get under 8 GB

2. **Add cleanup workflow** (10 min)

   - Create `.github/workflows/cleanup-caches.yml`
   - Test with manual trigger
   - Verify caches are deleted

3. **Optimize cache strategy** (15 min)

   - Update `ci.yml` to cache only Yarn cache
   - Test build time impact
   - Adjust if needed

4. **Monitor** (Ongoing)
   - Check cache usage weekly
   - Adjust retention policy if needed

---

## Cache Usage Analysis

### Current Caches (6 total)

| Cache                     | Size   | Age    | Keep?    |
| ------------------------- | ------ | ------ | -------- |
| Linux-turbo-234d6d0...    | 500 MB | 3 min  | ✅ Yes   |
| node-cache-...-05ebb70... | 2.4 GB | 3 min  | ✅ Yes   |
| Linux-turbo-7d8c5f5...    | 500 MB | 16 min | ⚠️ Maybe |
| node-cache-...-aaf4c8e... | 2.4 GB | 16 min | ⚠️ Maybe |
| Linux-turbo-db7258d...    | 500 MB | 19 min | ❌ No    |
| node-cache-...-46f4f65... | 2.4 GB | 3 days | ❌ No    |

**Action**: Delete the last 3 caches → Saves ~5.3 GB

---

## Expected Results

### After Manual Cleanup

- Cache usage: ~5-6 GB (under limit)
- Build times: Unchanged (recent caches preserved)
- Immediate relief from warnings

### After Automation

- Cache usage: Stable at 4-6 GB
- No manual intervention needed
- Automatic cleanup every 24 hours

### After Optimization

- Cache usage: ~2-3 GB (sustainable)
- Build times: +30s (acceptable trade-off)
- No more storage warnings

---

## Testing Plan

### Verify Manual Cleanup

```bash
# Trigger new build to verify cache works
git commit --allow-empty -m "test: trigger build to verify cache"
git push origin main
```

### Verify Cleanup Workflow

1. Go to Actions → Cleanup old caches → Run workflow
2. Check logs to see deleted caches
3. Verify cache list is reduced

### Verify Optimized Caching

1. Wait for next build after cache update
2. Check build time (should be ~5-6 min)
3. Verify cache size (should be ~1 GB total)

---

## Monitoring Commands

```bash
# Check cache usage via GitHub CLI (if installed)
gh cache list --repo Herman-Adu/strapi-next-monorepo-v2

# Delete specific cache
gh cache delete <cache-id> --repo Herman-Adu/strapi-next-monorepo-v2

# Delete all caches (nuclear option)
gh cache delete --all --repo Herman-Adu/strapi-next-monorepo-v2
```

---

## References

- [GitHub Actions Cache Documentation](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Cache Limits and Eviction Policy](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#usage-limits-and-eviction-policy)
- [Managing Caches](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#managing-caches)

---

**Created**: November 15, 2025 - Late Night  
**Priority**: HIGH  
**Time Required**: ~30 minutes total  
**Status**: Ready to execute tomorrow morning ☕
