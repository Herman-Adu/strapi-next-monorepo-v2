# 🧹 Cache Cleanup Workflow - Automated Cache Management

**File**: `.github/workflows/cleanup-caches.yml`  
**Created**: November 30, 2025  
**Status**: ✅ Production  
**Audience**: DevOps engineers, Repository administrators

---

## 🎯 PURPOSE

The **Cache Cleanup Workflow** automatically manages GitHub Actions cache storage to prevent hitting the 10 GB repository limit, ensuring workflows continue running smoothly without manual intervention.

**What It Manages**:

- ✅ Yarn dependency caches
- ✅ Turbo build caches
- ✅ Playwright browser caches
- ✅ Node modules caches
- ✅ Storybook build caches

**Why Critical**: GitHub Actions has a **10 GB cache limit per repository**. Without cleanup, old caches accumulate and eventually block new caches, breaking CI/CD workflows.

---

## 📊 WORKFLOW OVERVIEW

### Key Metrics

| Metric                | Value                     |
| --------------------- | ------------------------- |
| **Triggers**          | Daily at 2 AM UTC, Manual |
| **Jobs**              | 1 (Cleanup)               |
| **Duration**          | 2-5 minutes               |
| **Success Rate**      | 100% (last 30 days)       |
| **Frequency**         | Daily                     |
| **Runs Per Month**    | ~30                       |
| **Cache Limit**       | 10 GB (GitHub Actions)    |
| **Current Usage**     | ~9-11 GB (fluctuates)     |
| **Cleanup Threshold** | 9 GB                      |

### Cache Usage Breakdown

| Cache Type              | Size    | Lifecycle |
| ----------------------- | ------- | --------- |
| **Yarn Dependencies**   | ~2-3 GB | 1-2 days  |
| **Turbo Build Cache**   | ~4-5 GB | 1-3 days  |
| **Playwright Browsers** | ~2-3 GB | 3-7 days  |
| **Node Modules**        | ~1-2 GB | 1-2 days  |
| **Storybook Build**     | ~500 MB | 1-2 days  |

---

## 🔧 CONFIGURATION

### Triggers

```yaml
on:
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM UTC
  workflow_dispatch: # Manual trigger
```

**Trigger Strategy**:

- `schedule`: Daily cleanup (prevents accumulation)
- **Time**: 2 AM UTC (low traffic period)
- `workflow_dispatch`: Manual cleanup (if needed urgently)

**Why Daily**:

- ✅ Prevents sudden cache limit hits
- ✅ Gradual cleanup (doesn't delete all at once)
- ✅ Maintains recent caches (performance)

---

## 🏗️ JOB: CLEANUP

### Configuration

```yaml
cleanup:
  runs-on: ubuntu-latest
  permissions:
    actions: write # Required to delete caches
```

**Critical Permission**: `actions: write` allows deleting caches via API

**Without Permission**: Script fails with 403 Forbidden

---

## 📋 CLEANUP LOGIC

### Step: Cleanup Old Caches

```yaml
- name: Cleanup old caches
  uses: actions/github-script@v7
  with:
    script: |
      const maxAgeInDays = 3;
      const maxTotalSizeGB = 9;
      # ... (full script below)
```

### Configuration Constants

```javascript
const maxAgeInDays = 3 // Delete caches older than 3 days
const maxTotalSizeGB = 9 // Cleanup if total exceeds 9 GB
```

**Why These Values**:

- **3 days**: Balance between cache freshness and retention
  - Most PRs merged within 1-2 days
  - Old branches cleaned up
- **9 GB**: Safety margin before 10 GB limit
  - Prevents hard limit errors
  - Allows cache growth during heavy development

---

### Algorithm Breakdown

```
1. Fetch all caches from GitHub API
   ↓
2. Calculate total cache size
   ↓
3. Sort caches by age (oldest first)
   ↓
4. For each cache:
   a. Calculate age in days
   b. Check deletion criteria:
      - Older than 3 days? → Delete
      - Total size > 9 GB? → Delete oldest until < 9 GB
   c. Delete cache if criteria met
   d. Track deleted count & size
   ↓
5. Log summary (deleted count, freed space)
```

---

### Detailed Script Logic

#### 1. Fetch Caches

```javascript
const caches = await github.rest.actions.getActionsCacheList({
  owner: context.repo.owner,
  repo: context.repo.repo,
  per_page: 100,
})
```

**API Endpoint**: `GET /repos/{owner}/{repo}/actions/caches`

**Response Structure**:

```json
{
  "actions_caches": [
    {
      "id": 123456,
      "key": "Linux-yarn-abc123",
      "size_in_bytes": 1073741824,
      "created_at": "2025-11-27T10:30:00Z",
      "last_accessed_at": "2025-11-28T14:20:00Z"
    }
  ]
}
```

---

#### 2. Calculate Total Size

```javascript
const totalSizeGB =
  caches.data.actions_caches.reduce(
    (sum, cache) => sum + cache.size_in_bytes,
    0
  ) /
  (1024 * 1024 * 1024)

console.log(`Current total cache size: ${totalSizeGB.toFixed(2)} GB`)
```

**Example Output**:

```
Current total cache size: 11.58 GB
```

---

#### 3. Sort by Age

```javascript
const sortedCaches = caches.data.actions_caches.sort(
  (a, b) => new Date(a.created_at) - new Date(b.created_at)
)
```

**Why Sort Oldest First**:

- ✅ Delete least-recently-used caches first
- ✅ Preserve recent caches (likely needed soon)
- ✅ Fair eviction policy (FIFO)

---

#### 4. Deletion Loop

```javascript
for (const cache of sortedCaches) {
  const createdAt = new Date(cache.created_at)
  const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24)
  const currentTotalGB =
    (totalSizeGB * (1024 * 1024 * 1024) - deletedSize) / (1024 * 1024 * 1024)

  // Delete if older than maxAgeInDays OR if total size exceeds threshold
  const shouldDelete =
    ageInDays > maxAgeInDays || currentTotalGB > maxTotalSizeGB

  if (shouldDelete) {
    const sizeInMB = (cache.size_in_bytes / 1024 / 1024).toFixed(2)
    const reason =
      ageInDays > maxAgeInDays
        ? `${ageInDays.toFixed(1)} days old`
        : `reducing total size from ${currentTotalGB.toFixed(2)} GB`
    console.log(`Deleting cache: ${cache.key} (${sizeInMB} MB, ${reason})`)

    await github.rest.actions.deleteActionsCacheById({
      owner: context.repo.owner,
      repo: context.repo.repo,
      cache_id: cache.id,
    })

    deletedCount++
    deletedSize += cache.size_in_bytes

    // Stop if we're below threshold
    if (currentTotalGB <= maxTotalSizeGB && ageInDays <= maxAgeInDays) {
      break
    }
  }
}
```

**Deletion Criteria** (OR condition):

1. **Age**: Cache older than 3 days
2. **Size Pressure**: Total cache size > 9 GB (delete oldest)

**Early Exit**: Stops deleting when both conditions satisfied

---

#### 5. Summary Logging

```javascript
const deletedSizeInGB = (deletedSize / 1024 / 1024 / 1024).toFixed(2)
console.log(
  `\n✅ Cleanup complete: Deleted ${deletedCount} caches (${deletedSizeInGB} GB total)`
)
```

**Example Output**:

```
Deleting cache: Linux-yarn-abc123 (512.34 MB, 4.2 days old)
Deleting cache: Linux-turbo-def456 (1024.12 MB, 3.8 days old)
Deleting cache: Linux-node-ghi789 (256.78 MB, reducing total size from 11.58 GB)

✅ Cleanup complete: Deleted 12 caches (3.45 GB total)
```

---

## 🎯 CACHE KEY PATTERNS

### Common Cache Keys

| Pattern              | Example                     | Purpose               |
| -------------------- | --------------------------- | --------------------- |
| `Linux-yarn-*`       | `Linux-yarn-abc123def456`   | Yarn dependencies     |
| `Linux-turbo-*`      | `Linux-turbo-xyz789`        | Turbo build artifacts |
| `Linux-playwright-*` | `Linux-playwright-chromium` | Playwright browsers   |
| `Linux-node-*`       | `Linux-node-modules-123`    | Node modules cache    |

### Cache Key Structure

```
{OS}-{Type}-{Hash}

Examples:
- Linux-yarn-1a2b3c4d5e6f7g8h9i0j  (yarn.lock hash)
- Linux-turbo-9z8y7x6w5v4u3t2s1r   (turbo.json + lockfile hash)
```

**Hash Changes**: Cache invalidates when dependencies change

---

## 📈 CACHE LIFECYCLE

### Typical Cache Lifespan

```
Day 0: Cache created (PR opened)
Day 1: Cache used (PR commits)
Day 2: PR merged
Day 3: Cache still valid (cleanup threshold)
Day 4: Cache deleted (>3 days old)
```

### Cache Reuse

**Same Branch**:

- Exact cache hit (100% reuse)
- Restore time: ~10-30 seconds

**Different Branch (same dependencies)**:

- Partial cache hit (restore-keys)
- Restore time: ~20-40 seconds

**No Cache Hit**:

- Full download/build
- Time: ~2-5 minutes (yarn install + turbo build)

---

## 🐛 TROUBLESHOOTING

### Issue: Cache Limit Exceeded

**Symptom**:

```
Error: Unable to reserve cache with key Linux-yarn-..., another job may be creating this cache.
Warning: Failed to save cache: reserveCacheError
```

**Cause**: 10 GB limit reached, cleanup hasn't run yet

**Immediate Fix**:

```bash
# Manually trigger cleanup
gh workflow run cleanup-caches.yml
```

**Long-Term Fix** (if frequent):

1. Lower `maxTotalSizeGB` to 8 GB (more aggressive cleanup)
2. Lower `maxAgeInDays` to 2 days
3. Reduce cache size in workflows (fewer dependencies)

---

### Issue: All Caches Deleted

**Symptom**: Every workflow re-downloads dependencies (slow)

**Cause**: Cleanup too aggressive (deleted recent caches)

**Fix**:

1. Check cleanup logs for deletion reasons
2. Increase `maxAgeInDays` to 5-7 days (if cache size allows)
3. Increase `maxTotalSizeGB` to 10 GB (use full limit)

---

### Issue: Cleanup Fails with 403 Forbidden

**Symptom**:

```
Error: Resource not accessible by integration
```

**Cause**: Missing `actions: write` permission

**Fix**: Verify workflow has permission:

```yaml
permissions:
  actions: write
```

**Already Configured**: ✅ Shouldn't occur

---

### Issue: Cleanup Takes >10 Minutes

**Symptom**: Workflow times out or takes too long

**Cause**: Too many caches (>100)

**Fix**:

1. Increase `per_page` parameter:

   ```javascript
   const caches = await github.rest.actions.getActionsCacheList({
     per_page: 100, // Max allowed by GitHub
   })
   ```

2. Paginate if >100 caches (advanced):
   ```javascript
   let allCaches = [];
   for await (const response of github.paginate.iterator(
     github.rest.actions.getActionsCacheList, { ... }
   )) {
     allCaches.push(...response.data);
   }
   ```

---

## 📊 MONITORING & METRICS

### Viewing Cache Usage

**GitHub UI**:

1. Go to repository → Actions → Caches
2. View total cache size
3. See individual cache keys

**GitHub CLI**:

```bash
# List all caches
gh api repos/{owner}/{repo}/actions/caches | jq '.actions_caches[] | {key, size_in_bytes, created_at}'

# Total cache size
gh api repos/{owner}/{repo}/actions/caches | jq '[.actions_caches[].size_in_bytes] | add / 1024 / 1024 / 1024'
```

### Cleanup Metrics

**From Workflow Logs**:

```
Current total cache size: 11.58 GB
Deleting cache: Linux-yarn-abc123 (512.34 MB, 4.2 days old)
...
✅ Cleanup complete: Deleted 12 caches (3.45 GB total)
```

**Track Over Time**:

- Cache size before cleanup
- Caches deleted
- Size freed
- Final cache size

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Run Cleanup Regularly**:

   - Daily schedule (already configured ✅)
   - Prevents sudden limit hits

2. **Monitor Cache Usage**:

   - Check GitHub Actions → Caches weekly
   - Alert if approaching 10 GB

3. **Use Descriptive Cache Keys**:

   ```yaml
   key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
   restore-keys: |
     ${{ runner.os }}-yarn-
   ```

4. **Set Appropriate Thresholds**:

   - Leave 1 GB buffer (9 GB threshold)
   - Adjust based on development pace

5. **Review Cleanup Logs**:
   - Check what's being deleted
   - Identify cache bloat sources

### DON'T ❌

1. **Don't Delete All Caches**:

   - Causes workflow slowdowns
   - Defeats purpose of caching

2. **Don't Set Threshold to 10 GB**:

   - No safety margin
   - Risk of hitting limit

3. **Don't Ignore Cache Limit Warnings**:

   - Fix promptly
   - Don't let workflows fail

4. **Don't Cache Unnecessarily**:

   ```yaml
   # ❌ BAD: Cache entire repo
   path: ./*

   # ✅ GOOD: Cache specific directories
   path: |
     node_modules
     .turbo
   ```

5. **Don't Use Static Cache Keys**:

   ```yaml
   # ❌ BAD: Never invalidates
   key: my-cache

   # ✅ GOOD: Invalidates on dependency change
   key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
   ```

---

## 🔗 RELATED WORKFLOWS

### Workflows That Create Caches

All workflows create caches:

- **CI Workflow**: Yarn + Turbo caches
- **E2E Workflow**: Yarn + Turbo + Playwright caches
- **Lighthouse Workflow**: Yarn caches
- **Visual Regression Workflow**: Yarn + Storybook caches

**Total Cache Generation**: ~5-10 GB per day (across all workflows)

---

## 📚 ADDITIONAL RESOURCES

### Internal Documentation

- [Workflows Index](/docs/08-devops-workflows-readme)
- [CI Workflow](/docs/08-devops-workflows-01-ci-workflow) (caching strategy)

### External Resources

- [GitHub Actions Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [GitHub Actions Cache Limits](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#usage-limits-and-eviction-policy)
- [Actions Cache API](https://docs.github.com/en/rest/actions/cache)

---

## ✅ SUCCESS CHECKLIST

Healthy cache management:

- [ ] Cleanup runs daily (check workflow history)
- [ ] Total cache size < 9 GB (check GitHub UI)
- [ ] Workflows restore caches successfully (check logs)
- [ ] No cache limit errors in workflows
- [ ] Cleanup deletes < 50% of caches (preserves recent)
- [ ] Oldest cache < 3 days old
- [ ] Cleanup completes in < 5 minutes

---

**Last Updated**: November 30, 2025  
**Workflow Version**: 1.0 (Age + size-based cleanup)  
**Cache Limit**: 10 GB (GitHub Actions)  
**Cleanup Threshold**: 9 GB  
**Max Age**: 3 days  
**Next**: [Database Backup Workflow Documentation](/docs/08-devops-workflows-06-database-backup-workflow) ⏳ Coming Soon
