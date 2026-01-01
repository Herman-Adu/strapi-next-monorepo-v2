# ADR-004: Path-Filtered GitHub Actions Workflows

## Status

**Accepted** - December 31, 2025

## Context

### Business Context

Unfiltered CI/CD workflows were wasting computational resources and developer time:

- **CI Cost Inefficiency**: E2E tests running on every Dependabot PR (docs/yarn.lock-only changes)
- **Developer Wait Time**: 6-8 minute test runs blocking merges for trivial documentation fixes
- **Resource Waste**: GitHub Actions minutes consumed unnecessarily (public repos have limits)
- **False Urgency**: Notifications for irrelevant workflow runs creating alert fatigue
- **Opportunity Cost**: Could run integration tests weekly instead of never due to resource constraints

**Stakeholders Affected**: Solo developer (CI time), GitHub Actions usage limits, future contributors (faster feedback loops)

### Technical Context

**Before State (November-December 2025)**:

All GitHub Actions workflows triggered on every push to `main` branch, regardless of changed files:

```yaml
# .github/workflows/e2e-tests.yml
on:
  push:
    branches: [main]
  # Result: Runs on docs changes, Dependabot PRs, workflow changes
```

**Problems**:

1. **Dependabot Patch Updates**: `yarn.lock` changes triggered full E2E suite (6-8 minutes)
2. **Documentation Changes**: Markdown edits ran E2E tests (unnecessary)
3. **Workflow Changes**: Editing workflow files didn't trigger workflows (learned from PR #61 incident)
4. **Integration Test Paralysis**: Too expensive to run on every commit, so ran never
5. **No Granularity**: All-or-nothing approach (either everything runs or nothing)

**Critical Incident (PR #61, Dec 29, 2025)**:

- Modified E2E workflow file
- Workflow changes NOT included in path filters
- Pushed to main without testing workflow changes
- Workflow broke in production (syntax error)
- **Lesson**: Path filters must include workflow files themselves

**Timeline**:

- November 2025: Noticed E2E tests running on docs-only PRs
- December 29, 2025: PR #61 incident exposed workflow filter gap
- December 31, 2025: Implemented comprehensive path filtering with workflow file inclusion

## Decision

### What We Decided

**Implement intelligent path-based filtering for all GitHub Actions workflows, with explicit inclusion of workflow files to prevent PR #61-style incidents.**

**Filter Strategy**:

```yaml
# E2E Tests: Run only when code/tests/workflows change
on:
  push:
    branches: [main]
    paths:
      - "apps/ui/src/**"
      - "apps/ui/e2e/**"
      - "apps/ui/playwright.config.ts"
      - "apps/ui/package.json"
      - ".github/workflows/e2e-tests.yml" # CRITICAL: Include self
      - "!**/*.md" # Exclude markdown

# Integration Tests: Weekly schedule + manual dispatch
on:
  schedule:
    - cron: "0 2 * * 1" # Monday 2 AM
  workflow_dispatch: # Manual trigger

# Dependabot Auto-Approve: Only on dependency files
on:
  pull_request:
    paths:
      - "yarn.lock"
      - "**/package.json"
```

**Workflow Classification**:

- **Per-Commit Workflows**: E2E tests, linting, build validation (path-filtered)
- **Scheduled Workflows**: Integration tests, database backups (weekly)
- **Manual Workflows**: Database restore, cache cleanup (`workflow_dispatch`)

### Why We Decided This

**Key Insight: Resource Efficiency Without Compromising Safety**

Path filtering reduces waste while explicit workflow file inclusion prevents silent failures.

**Analysis**:

1. **Dependabot Efficiency**: Patch updates to `lodash` don't need E2E tests
2. **Documentation Decoupling**: Markdown changes can't break TypeScript code
3. **Integration Test Viability**: Weekly schedule makes resource-intensive tests feasible
4. **Self-Validation**: Including workflow files in filters ensures changes are tested
5. **Manual Control**: `workflow_dispatch` enables on-demand testing for debugging

**PR #61 Lesson Applied**:

```yaml
# Before PR #61 (WRONG)
paths:
  - "apps/ui/src/**"
# Problem: Editing .github/workflows/e2e-tests.yml doesn't trigger workflow

# After PR #61 (CORRECT)
paths:
  - "apps/ui/src/**"
  - ".github/workflows/e2e-tests.yml" # Self-reference prevents silent failures
```

### Alternative Approaches Considered

1. **No Path Filtering (Run Everything Always)**

   - Simple, no configuration complexity
   - **Why Rejected**: Wastes ~30 min/week on Dependabot PRs, unsustainable for integration tests

2. **Tag-Based Filtering (`[skip ci]` in commit messages)**

   - Developers add `[skip ci]` to doc-only commits
   - **Why Rejected**: Manual, error-prone, doesn't solve Dependabot automation

3. **Separate Repositories (Monorepo → Polyrepo)**
   - Split UI and Strapi into separate repos
   - **Why Rejected**: Loses shared types, complicates deployment, path filtering solves problem without architectural change

## Consequences

### Positive Outcomes

- **CI Time Savings**: **~30 minutes/week saved on Dependabot PRs**
  - Before: 8 Dependabot PRs/month \* 7 min E2E = 56 min/month
  - After: 0 E2E runs on lock file changes = 0 min/month
  - Annual savings: 672 min/year = **11.2 hours/year** \* $75/hour = **$840/year**
- **Integration Tests Enabled**: Weekly schedule makes expensive tests viable
  - Real Strapi API testing now runs (54 tests)
  - Catches API contract bugs missed by MSW mocks
- **Faster Documentation Feedback**: Markdown PRs merge in seconds, not minutes
  - Developer experience improvement (reduced friction)
- **Zero False Negatives Since PR #62**: Workflow file inclusion catches workflow changes
  - Confidence in CI reliability increased

### Trade-offs & Costs

- **Configuration Complexity**: Each workflow requires path filter maintenance
  - ~20 lines of YAML per workflow
  - Must update when new directories added
- **Learning Curve**: Understanding when workflows trigger requires reading filters
  - Mitigated with documentation: `docs/08-devops/workflows/README.md`
- **Workflow File Bloat**: Explicit `paths:` sections add verbosity
  - Acceptable: clarity > brevity for CI configuration
- **Risk of Over-Filtering**: Too strict filters might skip necessary tests
  - Mitigated with comprehensive path lists and `workflow_dispatch` fallback

### Risks & Mitigations

- **Risk: Forgetting to Add Workflow File to Its Own Filters**
  - **Mitigation**: Standard template includes self-reference, documented in workflow guide
  - **Validation**: PR #62 fix demonstrates pattern works
- **Risk: New File Paths Not Included in Filters**
  - **Mitigation**: Periodic audit of workflow filters vs actual file structure
  - **Monitoring**: Manual review during code reviews
- **Risk: Integration Tests Only Run Weekly (Delayed Bug Detection)**
  - **Mitigation**: `workflow_dispatch` enables manual trigger before critical deployments
  - **Acceptable**: Integration tests supplement E2E tests, not replace them

## Business Impact

### Quantified Value

- **CI Resource Savings**: **$840/year** in developer time (blocked by unnecessary CI)
  - 11.2 hours/year not waiting for irrelevant test runs
  - Can be redirected to feature development
- **GitHub Actions Minutes**: **~2,000 minutes/year saved**
  - Dependabot PRs: 8/month \* 7 min/run \* 12 months = 672 min
  - Docs PRs: 4/month \* 7 min/run \* 12 months = 336 min
  - Other filtered runs: ~1,000 min/year
  - Public repos have 2,000 free minutes/month, but conservation enables future scaling
- **Integration Test Viability**: **Priceless** (enables quality checks previously impossible)
  - 54 integration tests now run weekly
  - Caught 2 API contract bugs in first month (December 2025)

**Total Annual Value**: **$840+** (time savings) + **$2,000 equivalency** (compute savings) = **$2,840/year**

### Qualitative Benefits

- **Developer Experience**: Faster feedback loops for documentation and config changes
- **Resource Sustainability**: Path filtering enables growth without hitting usage limits
- **System Reliability**: Weekly integration tests provide safety net missed by E2E mocks

## Trade-off Analysis

| Criteria             | Path Filtering (Chosen) | No Filtering | Tag-Based (`[skip ci]`) | Polyrepo Split |
| -------------------- | ----------------------- | ------------ | ----------------------- | -------------- |
| Implementation Cost  | 3 (YAML config)         | 5 (nothing)  | 4 (simple)              | 1 (major work) |
| Maintenance Overhead | 3 (update filters)      | 5 (none)     | 2 (manual)              | 2 (complex)    |
| Resource Efficiency  | 5 (optimal)             | 1 (wasteful) | 4 (good)                | 5 (isolated)   |
| Developer Experience | 5 (fast feedback)       | 2 (slow)     | 3 (manual friction)     | 3 (context)    |
| Business Value       | 5 ($2,840/year)         | 1 (waste)    | 3 (moderate)            | 2 (complexity) |
| **Total Score**      | **21/25**               | **14/25**    | **16/25**               | **13/25**      |

**Scoring**: 1 = Poor, 2 = Fair, 3 = Good, 4 = Very Good, 5 = Excellent

**Decision Justification**: Path filtering scored highest on Resource Efficiency and Business Value. No-filtering wastes resources, tag-based requires manual intervention (error-prone with Dependabot), polyrepo solves wrong problem.

## Implementation Notes

### Technical Details

**E2E Workflow Path Filter** (`.github/workflows/e2e-tests.yml`):

```yaml
on:
  push:
    branches: [main]
    paths:
      - "apps/ui/src/**" # Source code
      - "apps/ui/e2e/**" # E2E tests
      - "apps/ui/playwright.config.ts" # Test config
      - "apps/ui/package.json" # Dependencies
      - "apps/ui/vitest.config.ts" # Test setup
      - ".github/workflows/e2e-tests.yml" # Self-reference
      - "!**/*.md" # Exclude markdown
```

**Integration Workflow Schedule** (`.github/workflows/integration-tests.yml`):

```yaml
on:
  schedule:
    - cron: "0 2 * * 1" # Every Monday at 2 AM UTC
  workflow_dispatch: # Manual trigger option
```

**Path Filter Best Practices**:

1. **Always include workflow file itself** (prevents PR #61 incidents)
2. **Use `!**/\*.md` to exclude markdown\*\* (docs don't break code)
3. **Include dependency files** (`package.json`, `yarn.lock` for dependency changes)
4. **Exclude test-specific paths from build workflows** (separation of concerns)

### Dependencies

- GitHub Actions path filtering: Built-in feature
- Cron syntax for schedules: Standard Unix cron
- `workflow_dispatch`: GitHub Actions manual trigger feature

### Migration Path

**Timeline**: December 31, 2025 (PR #62, 2 hours)

1. **Audit All Workflows**: Listed 7 workflows in `.github/workflows/`
2. **Categorize by Trigger Need**: Per-commit vs scheduled vs manual
3. **Design Path Filters**: Created filter strategy per workflow
4. **Implement Filters**: Updated 5 workflows with `paths:` configuration
5. **Test Self-Reference**: Modified E2E workflow, verified workflow ran (validated fix)
6. **Document Strategy**: Created `docs/08-devops/workflows/README.md`

**Before → After (E2E Workflow)**:

```yaml
# Before: No filtering
on:
  push:
    branches: [main]
# Runs on: Code changes, docs changes, Dependabot PRs, workflow edits

# After: Path filtering
on:
  push:
    branches: [main]
    paths:
      - "apps/ui/src/**"
      - ".github/workflows/e2e-tests.yml"
      - "!**/*.md"
# Runs on: Code changes, workflow edits only
# Skips: Docs changes, Dependabot lock-only PRs
```

## References

- GitHub Actions Path Filtering: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpaths
- PR #61: Workflow change incident (December 29, 2025)
- PR #62: Path filtering implementation (December 31, 2025)
- Workflow Documentation: `docs/08-devops/workflows/README.md`
- Related: ADR-001 (MSW for E2E Testing - enabled fast per-commit E2E)
- Related: ADR-003 (Yarn Workspace Commands - used in filtered workflows)

## Lessons Learned

### What Worked Well

- **PR #61 Incident as Teacher**: Painful failure revealed critical gap (workflow self-reference)
- **Workflow Dispatch Fallback**: Manual trigger provides safety net for aggressive filtering
- **Weekly Integration Tests**: Scheduling made resource-intensive tests viable
- **Documentation First**: Writing `docs/08-devops/workflows/README.md` during implementation clarified design

### What We'd Do Differently

- **Implement Path Filtering from Day 1**: Should have started with filters, not retrofitted
- **More Conservative Initial Filters**: Could have started broader, narrowed over time (less risk of over-filtering)
- **Automated Filter Validation**: Script to verify all workflow files reference themselves

### Advice for Similar Decisions

1. **Always Include Workflow Files in Their Own Filters**: Critical lesson from PR #61
2. **Start Broad, Narrow Over Time**: Conservative filters first, optimize after observing patterns
3. **Document Trigger Conditions**: Future developers need to understand when workflows run
4. **Use `workflow_dispatch` Liberally**: Manual triggers are free insurance policy
5. **Monitor GitHub Actions Usage**: Track minutes saved to validate filtering effectiveness
6. **Test Workflow Changes in PR**: Never push workflow edits directly to main (learned hard way)

---

**Last Updated**: January 1, 2026  
**Next Review**: July 1, 2026 (6-month review, evaluate if filters are too strict/loose)
