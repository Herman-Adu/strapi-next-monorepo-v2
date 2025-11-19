# Workflow Index & Request Pattern Matching

**Purpose:** AI-driven workflow selection based on user request patterns

**Last Updated:** November 18, 2025

---

## 🎯 How This Works

When you make a request, I will:

1. **Analyze your request** against the pattern library below
2. **Identify matching workflows** from the decision tree
3. **Present a plan** with specific workflow references for your approval
4. **Create a todo list** that starts with "Review [Workflow Name]"
5. **Execute systematically** following the approved workflows

---

## 📚 Request Pattern → Workflow Mapping

### 🏗️ Component & Schema Operations

#### Pattern: "Create new [component/section]"

**Keywords:** create, new, add, build, component, section, element, shared

**Workflows Required:**

1. **Primary:** `COMPONENT_DEVELOPMENT_GUIDE.md` - Full component creation
2. **Supporting:** `COMPONENT_WORKFLOW.md` - Step-by-step process
3. **Validation:** `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` - Export/sync validation

**Example Requests:**

- "Create a new testimonials section"
- "Add a hero banner component"
- "Build a pricing table element"

---

#### Pattern: "Reorder fields/components"

**Keywords:** reorder, order, move, rearrange, position, layout, UI order, field order

**Workflows Required:**

1. **Primary:** `COMPONENT_FIELD_ORDER_WORKFLOW.md` - Field reordering process
2. **Critical:** Edit `config/sync/core-store.plugin_content_manager_configuration_components##*.json`
3. **Validation:** Import Config Sync (NOT Export!)

**Example Requests:**

- "Move background to top"
- "Reorder benefits section fields"
- "Change the order of fields in content manager"

**Common Mistake to Avoid:**

- ❌ Editing schema files (`src/components/*.json`)
- ✅ Edit config sync files (`config/sync/core-store.plugin_content_manager_configuration_components##*.json`)

---

#### Pattern: "Refactor to atomic architecture"

**Keywords:** refactor, atomic, atomic architecture, badge, header, background, shared components

**Workflows Required:**

1. **Primary:** `SHARED_COMPONENT_GUIDE.md` - Atomic architecture patterns
2. **Schema:** Update component schema (add badge/header/background)
3. **Populate:** Update populate middleware with Pattern 5
4. **Frontend:** Refactor to SectionWrapper pattern
5. **Layout:** `COMPONENT_FIELD_ORDER_WORKFLOW.md` - Set correct field order
6. **Validation:** `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` - Export changes

**Example Requests:**

- "Refactor benefits section to atomic architecture"
- "Add badge, header, background to testimonials"
- "Make this section follow the atomic pattern"

---

#### Pattern: "Delete/remove component"

**Keywords:** delete, remove, clean, cleanup, deprecate, archive, unused, legacy

**Workflows Required:**

1. **Primary:** `COMPONENT_DELETION_WORKFLOW.md` - Complete deletion process
2. **Safety:** Database backup FIRST
3. **Critical:** Remove from dynamic zone BEFORE deleting schema
4. **Validation:** Build → Test → Verify no references

**Example Requests:**

- "Remove old testimonials component"
- "Delete unused hero section"
- "Clean up legacy components"
- "Prepare template for client (remove demo components)"

**Common Mistake to Avoid:**

- ❌ Deleting schema files first (causes errors)
- ✅ Remove from dynamic zone → Remove from populate → Then delete schema

---

### 🎨 Styling & Design

#### Pattern: "Add/modify gradient/styling"

**Keywords:** gradient, color, style, theme, styling, CSS, Tailwind

**Workflows Required:**

1. **Primary:** `TAILWIND_V4_GRADIENT_GUIDE.md` - Gradient implementation
2. **Supporting:** `STYLING_GUIDE.md` - General styling patterns
3. **Theme:** `THEME_SYSTEM_GUIDE.md` - Theme integration

**Example Requests:**

- "Add gradient background to hero"
- "Style the heading with gradient text"
- "Change button colors"

---

#### Pattern: "Fix spacing/layout issues"

**Keywords:** spacing, gap, padding, margin, layout, alignment, responsive

**Workflows Required:**

1. **Primary:** `SPACING_ARCHITECTURE_GUIDE.md` - Spacing system rules
2. **Component:** Check SectionWrapper implementation
3. **Validation:** Verify sectionGap pattern

**Example Requests:**

- "Fix spacing between badge and header"
- "Reduce gap in benefits grid"
- "Adjust section padding"

---

### 🔧 Configuration & Sync

#### Pattern: "Config sync issues"

**Keywords:** config sync, export, import, sync, differences, out of sync

**Workflows Required:**

1. **Primary:** `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` - Complete sync guide
2. **Direction:** Import (files → DB) vs Export (DB → files)
3. **Validation:** Check for "No differences" after sync

**Example Requests:**

- "Export config sync"
- "Database and files out of sync"
- "How do I sync changes?"

**Decision Tree:**

- **Made changes in Strapi UI?** → EXPORT (DB → Files)
- **Edited config files manually?** → IMPORT (Files → DB)
- **Pulled from Git?** → IMPORT (Files → DB)
- **Want to share with team?** → EXPORT, then commit

---

### 📄 Content & Pages

#### Pattern: "Create/edit page"

**Keywords:** page, create page, edit page, fullpath, slug, breadcrumb

**Workflows Required:**

1. **Primary:** `docs/PAGE_CREATION_WORKFLOW.md` - Page creation process
2. **Critical:** Recalculate fullPath after publishing
3. **Navigation:** Update navbar/footer if needed

**Example Requests:**

- "Create a new landing page"
- "Add sections to existing page"
- "Page not showing on frontend"

---

### 🔄 Development Workflow

#### Pattern: "Build/deploy/commit workflow"

**Keywords:** build, commit, push, deploy, production, staging

**Workflows Required:**

1. **Primary:** `DEVELOPMENT_WORKFLOW.md` - Full dev cycle
2. **Rule:** Always build before commit
3. **Process:** Build → Test → Commit → Push

**Example Requests:**

- "Ready to commit changes"
- "How do I deploy?"
- "Build is failing"

---

## 🔍 Multi-Workflow Scenarios

### Scenario: "Add new section to landing page"

**Workflows Required (in order):**

1. `COMPONENT_DEVELOPMENT_GUIDE.md` - Create the section component
2. `COMPONENT_FIELD_ORDER_WORKFLOW.md` - Set correct field order
3. `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` - Export component schema
4. `docs/PAGE_CREATION_WORKFLOW.md` - Add section to page
5. `DEVELOPMENT_WORKFLOW.md` - Build, test, commit

---

### Scenario: "Refactor existing section to atomic architecture"

**Workflows Required (in order):**

1. `SHARED_COMPONENT_GUIDE.md` - Understand atomic pattern
2. Edit schema file (`src/components/sections/*.json`)
3. Update populate middleware (`apps/strapi/src/documentMiddlewares/page.ts`)
4. Update frontend component (use SectionWrapper pattern)
5. `COMPONENT_FIELD_ORDER_WORKFLOW.md` - Reorder fields (background → badge → header)
6. `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` - Export schema + Import layout

---

### Scenario: "Remove component completely (client template prep)"

**Workflows Required (in order):**

1. `COMPONENT_DELETION_WORKFLOW.md` - **PRIMARY WORKFLOW**
2. **Phase 0:** Backup database + Audit usage + Document files
3. **Phase 1:** Remove from dynamic zone → Remove from populate → Delete schema → Regenerate types
4. **Phase 2:** Remove from component map → Delete frontend files
5. **Phase 3:** Delete content (Strapi UI) → Delete config sync files → Export sync
6. **Phase 4:** Build Strapi → Build Frontend → Test → Commit → Push

**Critical Steps:**

- ⚠️ Backup database FIRST (can't undo data loss)
- ⚠️ Remove from dynamic zone BEFORE deleting schema
- ⚠️ Build must pass before commit (green tick workflow)
- ⚠️ Commit after EACH component deletion (separate commits)

---

### Scenario: "Component fields in wrong order"

**Workflows Required (in order):**

1. `COMPONENT_FIELD_ORDER_WORKFLOW.md` - **PRIMARY WORKFLOW**
2. Find file: `config/sync/core-store.plugin_content_manager_configuration_components##[category].[name].json`
3. Edit `layouts.edit` array
4. **IMPORT** Config Sync (Files → Database)
5. Hard refresh Content Manager (Ctrl+Shift+R)

---

## 🚨 Critical Workflow Rules

### Rule 1: Schema vs Layout Files

**Schema Files** (`src/components/*.json`):

- Control database structure
- Define field types, relationships
- Changes require Strapi restart
- Modified when adding/removing fields

**Layout Files** (`config/sync/core-store.plugin_content_manager_configuration_components##*.json`):

- Control UI field order in Content Manager
- NO restart required
- Modified when reordering existing fields

**Workflow Decision:**

- **Adding/removing fields?** → Edit schema → Restart → Export
- **Reordering fields?** → Edit layout config → Import → Refresh

---

### Rule 2: Config Sync Direction

**EXPORT (Database → Files):**

- After making changes in Strapi UI
- After using Content Type Builder
- Before committing to share with team

**IMPORT (Files → Database):**

- After manually editing config files
- After pulling from Git
- After editing layout/field order

**Mnemonic:** "Edit files? IMPORT. Edit UI? EXPORT."

---

### Rule 3: Atomic Architecture Pattern

**Universal Order:**

```
1. background    (Container/styling - ALWAYS FIRST)
2. badge         (Optional decoration)
3. header        (Heading + description)
4. [content]     (Section-specific fields)
```

**Files to Update:**

1. Schema: `src/components/sections/*.json` (add components)
2. Populate: `apps/strapi/src/documentMiddlewares/page.ts` (Pattern 5)
3. Frontend: `apps/ui/src/components/page-builder/components/sections/*.tsx` (SectionWrapper)
4. Layout: `config/sync/core-store.plugin_content_manager_configuration_components##*.json` (field order)

---

## 🤖 AI Todo List Template

### For Component Field Reordering:

```markdown
## Todo List

1. ✅ Review `COMPONENT_FIELD_ORDER_WORKFLOW.md`
2. ⏳ Locate config files: `config/sync/core-store.plugin_content_manager_configuration_components##*.json`
3. ⏳ Edit `layouts.edit` array (background → badge → header → content)
4. ⏳ IMPORT Config Sync in Strapi UI
5. ⏳ Verify field order in Content Manager
6. ⏳ Commit changes to Git
```

---

### For Atomic Architecture Refactoring:

```markdown
## Todo List

1. ✅ Review `SHARED_COMPONENT_GUIDE.md`
2. ⏳ Update schema: Add badge/header/background components
3. ⏳ Update populate middleware: Add Pattern 5 deep populate
4. ⏳ Update frontend: Refactor to SectionWrapper pattern
5. ⏳ Review `COMPONENT_FIELD_ORDER_WORKFLOW.md`
6. ⏳ Reorder fields: background → badge → header → content
7. ⏳ Export schema changes (Config Sync)
8. ⏳ Import layout changes (Config Sync)
9. ⏳ Test in Content Manager
10. ⏳ Build and verify frontend
11. ⏳ Commit changes to Git
```

---

### For New Component Creation:

```markdown
## Todo List

## 📊 Workflow Priority Matrix

| Request Type               | Primary Workflow                     | Time      | Complexity | Reversible?    |
| -------------------------- | ------------------------------------ | --------- | ---------- | -------------- |
| Reorder fields             | `COMPONENT_FIELD_ORDER_WORKFLOW.md`  | 5min      | Low        | ✅ Yes         |
| Add gradient/styling       | `TAILWIND_V4_GRADIENT_GUIDE.md`      | 10min     | Low        | ✅ Yes         |
| Config sync issue          | `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` | 5min      | Low        | ✅ Yes         |
| Fix spacing                | `SPACING_ARCHITECTURE_GUIDE.md`      | 10min     | Medium     | ✅ Yes         |
| Refactor to atomic         | `SHARED_COMPONENT_GUIDE.md`          | 30min     | Medium     | ✅ Yes         |
| **Delete component**       | **`COMPONENT_DELETION_WORKFLOW.md`** | **50min** | **High**   | **⚠️ Partial** |
| Create new component       | `COMPONENT_DEVELOPMENT_GUIDE.md`     | 45min     | High       | ✅ Yes         |
| Create page + add sections | `PAGE_CREATION_WORKFLOW.md` + others | 60min     | High       | ✅ Yes         |
| Build/deploy/commit        | `DEVELOPMENT_WORKFLOW.md`            | 15min     | Medium     | ✅ Yes         |

--- ⏳ Test in Content Manager 14. ⏳ Test on frontend 15. ⏳ Build and commit
```

---

## 📊 Workflow Priority Matrix

| Request Type               | Primary Workflow                     | Time  | Complexity |
| -------------------------- | ------------------------------------ | ----- | ---------- |
| Reorder fields             | `COMPONENT_FIELD_ORDER_WORKFLOW.md`  | 5min  | Low        |
| Add gradient/styling       | `TAILWIND_V4_GRADIENT_GUIDE.md`      | 10min | Low        |
| Config sync issue          | `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md` | 5min  | Low        |
| Fix spacing                | `SPACING_ARCHITECTURE_GUIDE.md`      | 10min | Medium     |
| Refactor to atomic         | `SHARED_COMPONENT_GUIDE.md`          | 30min | Medium     |
| Create new component       | `COMPONENT_DEVELOPMENT_GUIDE.md`     | 45min | High       |
| Create page + add sections | `PAGE_CREATION_WORKFLOW.md` + others | 60min | High       |
| Build/deploy/commit        | `DEVELOPMENT_WORKFLOW.md`            | 15min | Medium     |

---

## 🎓 Learning from Past Mistakes

### Mistake 1: Editing Schema Files Instead of Layout Files

**What Happened:** Edited `src/components/*.json` to reorder fields

**Why It Failed:** Schema files control structure, not UI order

**Correct Approach:** Edit `config/sync/core-store.plugin_content_manager_configuration_components##*.json`

**Workflow:** `COMPONENT_FIELD_ORDER_WORKFLOW.md`

---

### Mistake 2: Using EXPORT Instead of IMPORT

**What Happened:** Made file edits, then clicked EXPORT in Config Sync

**Why It Failed:** EXPORT overwrites files with database values (opposite direction)

**Correct Approach:** File edits → IMPORT (loads files into database)

**Workflow:** `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md`

---

### Mistake 3: Forgetting Populate Middleware

**What Happened:** Added components to schema but they didn't render

**Why It Failed:** Strapi doesn't auto-populate nested components

**Correct Approach:** Add deep populate to `apps/strapi/src/documentMiddlewares/page.ts`

**Workflow:** `COMPONENT_DEVELOPMENT_GUIDE.md` (Step 6: Populate Middleware)

---

### Mistake 4: No Restart After Schema Changes

**What Happened:** Added new component, didn't restart, component not found

**Why It Failed:** Strapi only loads schemas on startup

**Correct Approach:** Schema changes → Restart Strapi → Export Config Sync

**Workflow:** `COMPONENT_WORKFLOW.md` (Step 3: Restart Strapi)

---

### Mistake 5: Deleting Schema Before Removing from Dynamic Zone

## 🔮 Future Workflow Additions

**Planned Workflows:**

- ~~`COMPONENT_DELETION_WORKFLOW.md`~~ ✅ **COMPLETED** - Safe component removal
- `DATABASE_MIGRATION_WORKFLOW.md` - Schema changes with data preservation
- `THEME_CUSTOMIZATION_WORKFLOW.md` - Advanced theme modifications
- `PERFORMANCE_OPTIMIZATION_WORKFLOW.md` - Build and runtime optimization
- `TESTING_WORKFLOW.md` - Systematic testing integration (Storybook, Vitest, Playwright, Chromatic)

---

---

## 🔮 Future Workflow Additions

**Planned Workflows:**

- `COMPONENT_DELETION_WORKFLOW.md` - Safe component removal
- `DATABASE_MIGRATION_WORKFLOW.md` - Schema changes with data preservation
- `THEME_CUSTOMIZATION_WORKFLOW.md` - Advanced theme modifications
- `PERFORMANCE_OPTIMIZATION_WORKFLOW.md` - Build and runtime optimization

---

## 🤝 Usage Agreement

**AI Pledge:**

1. **Before starting any task:** Analyze request → Identify workflows → Present plan
2. **Create todo list:** Always start with "Review [Workflow Name]"
3. **Follow workflows precisely:** No shortcuts, no assumptions
4. **Validate at checkpoints:** Config Sync status, build success, no errors
5. **Learn from mistakes:** Update this index when patterns emerge

**User Pledge:**

1. **Review the plan:** Approve workflows before execution
2. **Provide feedback:** "This workflow didn't fit" helps improve the system
3. **Update workflows:** Add new patterns as project evolves

---

## 📞 Quick Reference

**Most Common Request → Workflow:**

- Reorder fields → `COMPONENT_FIELD_ORDER_WORKFLOW.md`
- New component → `COMPONENT_DEVELOPMENT_GUIDE.md`
- **Delete component → `COMPONENT_DELETION_WORKFLOW.md`** ⭐ NEW
- Atomic refactor → `SHARED_COMPONENT_GUIDE.md` + Field Order Workflow
- Styling → `TAILWIND_V4_GRADIENT_GUIDE.md` + `STYLING_GUIDE.md`
- Config sync → `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md`
- Build/commit → `DEVELOPMENT_WORKFLOW.md`

**Emergency Workflows:**

- Build failing → `DEVELOPMENT_WORKFLOW.md` + check errors
- Component not rendering → Check populate middleware
- Fields wrong order → `COMPONENT_FIELD_ORDER_WORKFLOW.md`
- Database out of sync → `CONFIG_SYNC_WORKFLOW_DEFINITIVE.md`
- **"Unknown component" errors → `COMPONENT_DELETION_WORKFLOW.md` (Emergency Rollback)** ⭐ NEW

---

---

**Last Updated:** November 18, 2025  
**Version:** 1.0  
**Status:** ✅ Active - AI-Driven Workflow Selection Enabled
