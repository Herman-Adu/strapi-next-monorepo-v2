# Task 3.2: Scattered Documentation Consolidation Plan

**Branch**: `sprint-5/task-3.2-merge-scattered-docs`  
**Created**: January 1, 2026  
**Status**: IN PROGRESS

---

## Scattered Docs Identified

### Category 1: Testing Documentation (Duplicates)

| Current Location                             | Lines | Target                                 | Action            | Reason                        |
| -------------------------------------------- | ----- | -------------------------------------- | ----------------- | ----------------------------- |
| `apps/ui/E2E_TESTING.md`                     | 239   | `docs/13-testing/MSW-CONSOLIDATION.md` | Merge & Delete    | Duplicate MSW guide           |
| `apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md` | 106   | `docs/13-testing/MSW-CONSOLIDATION.md` | Merge & Delete    | Duplicate MSW architecture    |
| `apps/ui/tests/e2e/README.md`                | TBD   | Keep                                   | Update references | Needed for local test context |
| `apps/ui/tests/integration/README.md`        | TBD   | Keep                                   | Update references | Needed for local test context |

**Merge Strategy**:

- Extract unique content from app-specific docs
- Add to existing `MSW-CONSOLIDATION.md`
- Delete duplicate files
- Update all internal links

---

### Category 2: Migration Documentation (Historical)

| Current Location                  | Lines | Target                       | Action | Reason           |
| --------------------------------- | ----- | ---------------------------- | ------ | ---------------- |
| `apps/strapi/MIGRATION-STEPS.md`  | 140   | `docs/99-archive/migration/` | Move   | Already archived |
| `apps/strapi/README-MIGRATION.md` | TBD   | `docs/99-archive/migration/` | Move   | Already archived |

**Archive Strategy**:

- Create `docs/99-archive/migration/` directory
- Move both files with headers indicating archive status
- Update main Strapi README to point to archive

---

### Category 3: Feature Documentation

| Current Location              | Lines | Target                           | Action | Reason                     |
| ----------------------------- | ----- | -------------------------------- | ------ | -------------------------- |
| `apps/ui/DOCS_HUB_FEATURE.md` | 254   | `docs/15-professional-presence/` | Move   | Portfolio/showcase feature |

**Move Strategy**:

- Feature showcases professional work
- Belongs in professional presence section
- Update cross-references

---

### Category 4: Component Documentation

| Current Location                                         | Target | Action                          | Reason                |
| -------------------------------------------------------- | ------ | ------------------------------- | --------------------- |
| `apps/ui/src/styles/README.md`                           | Keep   | Reference from main docs        | Local context needed  |
| `apps/ui/src/styles/TAILWIND_STYLING_GUIDE.md`           | Keep   | Add to `docs/05-styling/` index | Already comprehensive |
| `apps/ui/src/styles/TYPOGRAPHY_PLUGIN_IMPLEMENTATION.md` | Keep   | Add to `docs/05-styling/` index | Already comprehensive |
| `apps/ui/src/components/molecules/BlogCard/README.md`    | Keep   | Local context                   | Component-specific    |
| `packages/design-system/README.md`                       | Keep   | Package-specific                | Technical setup       |

**Strategy**:

- Keep component/package READMEs (local context)
- Add links from main docs to these resources
- No duplication needed

---

## Consolidation Actions (In Order)

### Action 1: Merge Testing Documentation ✅

**Time Estimate**: 10 minutes

**Steps**:

1. Review `apps/ui/E2E_TESTING.md` for unique content
2. Review `apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md` for unique content
3. Add any missing content to `docs/13-testing/MSW-CONSOLIDATION.md`
4. Delete duplicate files
5. Update cross-references

**Files Modified**:

- `docs/13-testing/MSW-CONSOLIDATION.md` (additions)
- Delete: `apps/ui/E2E_TESTING.md`
- Delete: `apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md`
- Update: `apps/ui/README.md` (remove references)

---

### Action 2: Archive Migration Documentation ✅

**Time Estimate**: 5 minutes

**Steps**:

1. Create `docs/99-archive/migration/` directory
2. Move `apps/strapi/MIGRATION-STEPS.md`
3. Move `apps/strapi/README-MIGRATION.md`
4. Update `apps/strapi/README.md` to reference archive

**Files Modified**:

- Create: `docs/99-archive/migration/` directory
- Move: 2 files
- Update: `apps/strapi/README.md`

---

### Action 3: Move Feature Documentation ✅

**Time Estimate**: 5 minutes

**Steps**:

1. Move `apps/ui/DOCS_HUB_FEATURE.md` to `docs/15-professional-presence/`
2. Update internal links
3. Add to professional presence index

**Files Modified**:

- Move: `apps/ui/DOCS_HUB_FEATURE.md` → `docs/15-professional-presence/DOCS-HUB-FEATURE.md`
- Update: `docs/15-professional-presence/CTO-POSITIONING-STRATEGY.md` (add reference)

---

### Action 4: Update Documentation Index ✅

**Time Estimate**: 5 minutes

**Steps**:

1. Update `docs/05-styling/README.md` (add links to styling guides in apps/ui)
2. Update `docs/13-testing/README.md` (ensure MSW consolidation is referenced)
3. Update root README if needed

**Files Modified**:

- `docs/05-styling/README.md` (add links)
- `docs/13-testing/README.md` (verify references)

---

## Cross-Reference Updates

### Files Needing Link Updates

After moving/deleting files, update references in:

1. `apps/ui/README.md` - Remove E2E_TESTING.md references
2. `apps/strapi/README.md` - Point to archive for migration docs
3. `docs/13-testing/README.md` - Verify MSW consolidation links
4. `docs/15-professional-presence/CTO-POSITIONING-STRATEGY.md` - Add docs hub reference

---

## Validation Checklist

After consolidation:

- [ ] All duplicate content merged
- [ ] No broken internal links
- [ ] Archive directory created
- [ ] Cross-references updated
- [ ] No scattered docs remaining in apps/
- [ ] Local context files preserved (component READMEs)
- [ ] All changes committed with descriptive messages
- [ ] PR created for review

---

## Time Tracking

**Estimated Total**: 25 minutes

- Action 1 (Testing): 10 min
- Action 2 (Archive): 5 min
- Action 3 (Feature): 5 min
- Action 4 (Index): 5 min

**Actual Time**: TBD

---

## Notes

- Keep component-level READMEs (local context valuable)
- Archive historical migration docs (not delete - may need reference)
- Professional presence section perfect for feature showcase docs
- All styling guides comprehensive enough to keep in both locations (main docs + local)

---

_Last Updated: January 1, 2026 - Plan created_
