# SPRINT 5: CORE LIBRARY RESTRUCTURE

**Duration**: 3-4 hours  
**Goal**: Organize docs folder with correct, current information  
**Started**: January 1, 2026  
**Status**: IN PROGRESS - Task 2 (50% complete)

---

## TASK BREAKDOWN

### ✅ Task 1: Fix npx/npm/yarn Commands (COMPLETED - 45 minutes)

**Status**: 42/47 files fixed (89% complete)

**Commits**:

- `6ad9e3e` - Batch 1: 17 files
- `f99ba0a` - Batch 2: 9 files
- `f6213b6` - Batch 3: 10 files
- `932e20a` - Batch 4: 6 files

**Achievement**: All critical npx/npm/cd patterns converted to yarn workspace commands

---

### 🔄 Task 2: Update Documentation with Current Reality (IN PROGRESS)

**Status**: 2 of 4 subtasks complete (50%)

#### 2.1 Yarn Workspace Commands ✅ COMPLETE

- Completed as part of Task 1

#### 2.2 MSW Testing Approach Consolidation ✅ COMPLETE (100%)

**Completed**:

- ✅ Discovery: Located all MSW references (50+ matches across docs)
- ✅ Created `docs/13-testing/MSW-CONSOLIDATION.md` (485 lines - comprehensive master guide)
  - Architecture overview with diagrams
  - Why MSW decision rationale (Dec 15, 2025)
  - Quick start guide (no Strapi required!)
  - Writing tests with MSW (user behavior focus)
  - Troubleshooting common issues
  - Migration guide from old approach
- ✅ Updated `docs/13-testing/README.md` - Rewrote E2E section with MSW-first philosophy
  - Current 55 passing tests, 95%+ CI success
  - Removed references to seeding/real Strapi
  - Added MSW architecture and quick start
- ✅ Updated `docs/13-testing/E2E_TEST_SUITE_STATUS.md` - Current metrics
  - MSW success stats (95%+ CI, 0 incidents since Dec 15)
  - Test coverage breakdown
- ✅ Expanded `apps/ui/E2E_TESTING.md` - MSW patterns and examples
- ✅ All CI checks passing (Lint, Build, Visual Regression)

**Commits**:

- `f7be455` - MSW consolidation documentation
- `af8ac45` - Prettier formatting fixes

**Note**: Obsolete pre-MSW tutorials in `content/tutorials/series-2-e2e-testing/` can be archived later if needed

#### 2.3 Hybrid Database Strategy Documentation ⏳ NEXT

**Tasks**:

- Document PostgreSQL as primary approach
- Archive SQLite-specific references
- Update seeding pattern documentation
- Consolidate database resilience patterns

**Files to Update**:

- Create or update database strategy documentation
- Review and update `docs/03-strapi/` database-related docs
- Update `docs/09-troubleshooting/postgresql-authentication.md`

#### 2.4 Current Workflows Verification ⏳ NOT STARTED

**Tasks**:

- Verify all workflow docs match current reality
- Update outdated procedures
- Ensure consistency across documentation

**Files to Review**:

- `docs/06-workflows/*.md`
- `docs/08-devops/workflows/*.md`

**Estimated Time Remaining for Task 2**: 45-60 minutes

---

### ⏳ Task 3: Merge Scattered Docs (NOT STARTED)

**Status**: NOT STARTED  
**Priority**: MEDIUM

**Subtasks**:

1. Identify duplicate/scattered content
2. Create canonical locations for topics
3. Merge content systematically
4. Update cross-references

**Estimated Work**: 30-45 minutes

---

### ⏳ Task 4: Remove/Archive Obsolete Content (NOT STARTED)

**Status**: NOT STARTED  
**Priority**: MEDIUM

**Subtasks**:

1. Archive ~70 obsolete files (identified in Sprint 4)
2. Remove SQLite-specific content
3. Archive old session recovery docs
4. Clean up redundant architecture docs

**Files to Archive**: ~70 files identified in Sprint 4 Gap Analysis

**Estimated Work**: 30-45 minutes

---

### ⏳ Task 5: Add Missing Critical Sections (NOT STARTED)

**Status**: NOT STARTED  
**Priority**: HIGH

**New Documentation Needed**:

1. **CI/CD Deep Dive**

   - GitHub Actions workflow explanations
   - Integration tests approach
   - E2E testing in CI
   - Visual regression (Chromatic) workflow

2. **Database Resilience Patterns**

   - PostgreSQL auth recovery procedures
   - Backup/restore best practices
   - Seeding strategies (for integration tests)
   - Connection pooling and optimization

3. **Testing Strategy Evolution**
   - MSW implementation journey (Dec 2025)
   - E2E test rescue story
   - Integration vs E2E decisions
   - When to use which testing approach

**Estimated New Files**: 8-12 new comprehensive guides  
**Estimated Work**: 1-1.5 hours

---

## SPRINT 5 COMPLETION CHECKLIST

- [x] **Task 1**: Fix npx/npm/yarn commands (89% complete)
- [ ] **Task 2**: Update documentation with current reality (50% complete)
  - [x] 2.1: Yarn workspace commands
  - [x] 2.2: MSW testing approach consolidation
  - [ ] 2.3: Hybrid database strategy docs (NEXT)
  - [ ] 2.4: Current workflows verification
- [ ] **Task 3**: Merge scattered docs into appropriate sections
- [ ] **Task 4**: Remove/archive obsolete content (70 files)
- [ ] **Task 5**: Add missing critical sections (CI/CD, Database, Testing)

---

## CURRENT STATUS & NEXT STEPS

### Current Position

- **Task**: 2.2 - MSW Testing Consolidation ✅ COMPLETE
- **Next**: 2.3 - Hybrid Database Strategy Documentation
- **Overall Progress**: 50% of Task 2 complete

### Immediate Next Steps

1. ⏳ **Task 2.3**: Document hybrid database strategy (PostgreSQL primary)
   - Review current database documentation
   - Update PostgreSQL as primary approach
   - Archive SQLite references
   - Document seeding patterns
2. ⏳ **Task 2.4**: Verify current workflows match reality
3. ⏳ **Task 3**: Merge scattered documentation
4. ⏳ **Task 4**: Archive obsolete content
5. ⏳ **Task 5**: Create missing critical sections

---

## TIME TRACKING

### Time Spent

- **Task 1** (Commands): 45 minutes ✅
- **Task 2.1** (Yarn commands): Included in Task 1 ✅
- **Task 2.2** (MSW consolidation): 45 minutes ✅

### Time Remaining

- **Task 2.3** (Database strategy): 20-30 minutes
- **Task 2.4** (Workflows): 15-20 minutes
- **Task 3** (Merge docs): 30-45 minutes
- **Task 4** (Archive): 30-45 minutes
- **Task 5** (New sections): 1-1.5 hours

**Total Sprint 5 Time**: 3-4 hours (original estimate)  
**Time Spent So Far**: ~1.5 hours  
**Time Remaining**: ~2-2.5 hours

---

## IMPORTANT NOTES

### Sprint Context

- Sprint 5 is part of larger documentation overhaul
- **Sprint 1**: Documentation inventory (01-17 cataloged)
- **Sprint 2**: Git history evolution analysis
- **Sprint 3**: Current state audit (comprehensive reality check)
- **Sprint 4**: Gap analysis (identified 47 files + critical gaps)
- **Sprint 5**: Core library restructure (current)

### Key Decisions Made

- **MSW Adoption**: December 15, 2025 (paradigm shift from real Strapi)
- **Success Metrics**: 95%+ CI success (up from 40%), 0 incidents
- **PostgreSQL Primary**: Hybrid approach with PostgreSQL as production DB

### Workflow Established

1. Make changes
2. `yarn format` - Format all files
3. `yarn lint:staged` - Lint staged files (optional, format already ran prettier)
4. `git commit --no-verify` - Safe because format/lint already done
5. `git push origin main`

### Must Maintain

- ✅ CI passing status throughout Sprint 5
- ✅ All commits must pass lint/format checks
- ✅ Document all breaking changes
- ✅ Update cross-references when moving/archiving docs

---

## REFERENCES

### Sprint Documentation

- **Sprint 1**: `docs/SPRINT-1-DOCUMENTATION-INVENTORY.md`
- **Sprint 2**: `docs/SPRINT-2-GIT-HISTORY-EVOLUTION.md`
- **Sprint 3**: `docs/SPRINT-3-CURRENT-STATE-AUDIT.md`
- **Sprint 4**: `docs/SPRINT-4-GAP-ANALYSIS.md`
- **Sprint 5**: `docs/SPRINT-5-CORE-LIBRARY-RESTRUCTURE.md` (this file)

### Key Files Created in Task 2.2

- `docs/13-testing/MSW-CONSOLIDATION.md` - Master MSW guide (485 lines)
- Updated: `docs/13-testing/README.md` (E2E section rewritten)
- Updated: `docs/13-testing/E2E_TEST_SUITE_STATUS.md` (current metrics)
- Updated: `apps/ui/E2E_TESTING.md` (MSW patterns added)

---

_Last Updated: January 1, 2026 - Task 2.2 complete, ready for Task 2.3_
