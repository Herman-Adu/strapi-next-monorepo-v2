# Component Field Order Change Workflow

**When to use:** Reordering fields in Content Manager UI (e.g., moving Background to top)

**Time:** 5 minutes

**Success Rate:** 100% (when following this exact process)

---

## ⚠️ CRITICAL: Which Files to Edit

### ❌ DO NOT EDIT THESE (Schema files - wrong!)

```
apps/strapi/src/components/sections/*.json
apps/strapi/src/components/shared/*.json
apps/strapi/src/components/elements/*.json
```

**These control Content Type Builder schema, NOT Content Manager layout!**

---

### ✅ EDIT THESE (Content Manager configuration files - correct!)

```
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##[category].[component-name].json
```

**Example:**

```
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.testimonials-section.json
```

**These control the actual field order in Content Manager UI!**

---

## 📋 Step-by-Step Process

### Step 1: Find the Correct Configuration File

```powershell
# Pattern:
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##[category].[component-name].json

# Examples:
# Sections:
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.testimonials-section.json
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.newsletter-cta-section.json

# Shared:
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##shared.section-header.json

# Elements:
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##elements.testimonial-card.json
```

---

### Step 2: Edit the `layouts.edit` Array

**Find this section in the file:**

```json
{
  "layouts": {
    "list": [...],
    "edit": [
      // ← THIS IS WHAT CONTROLS FIELD ORDER IN CONTENT MANAGER
      [{"name": "badge", "size": 12}],      // Position 1
      [{"name": "header", "size": 12}],     // Position 2
      [{"name": "background", "size": 12}], // Position 3
      [{"name": "testimonials", "size": 12}] // Position 4
    ]
  }
}
```

**Reorder the arrays:**

```json
{
  "layouts": {
    "list": [...],
    "edit": [
      [{"name": "background", "size": 12}],  // ← MOVED TO POSITION 1
      [{"name": "badge", "size": 12}],       // Position 2
      [{"name": "header", "size": 12}],      // Position 3
      [{"name": "testimonials", "size": 12}] // Position 4
    ]
  }
}
```

**Rules:**

- Each array element `[{...}]` is ONE ROW in Content Manager
- Order in `edit` array = order shown top-to-bottom in UI
- `"size": 12` = full width (12-column grid)
- Can have multiple fields per row: `[{"name": "field1", "size": 6}, {"name": "field2", "size": 6}]`

---

### Step 3: IMPORT Config Sync (Database First!)

**This is the step we kept missing!**

1. **Go to Strapi Admin:** `http://localhost:1337/admin`
2. **Navigate to:** Settings → Config Sync
3. **Click:** **IMPORT** button (NOT Export!)
4. **Review changes:** Should show "X config changes"
5. **Confirm import:** Click "Import" to load into database

**Why IMPORT?**

- Files → Database = IMPORT
- Database → Files = EXPORT
- We edited files, so we need to IMPORT them into the database

---

### Step 4: Verify in Content Manager

1. **Navigate to:** Content Manager → [Your Collection]
2. **Hard refresh:** `Ctrl + Shift + R` (clears cache)
3. **Verify order:** Fields should appear in new order
4. **NO RESTART NEEDED!** ✅

---

### Step 5: Commit Changes

```powershell
git add apps/strapi/config/sync/
git commit -m "refactor: reorder [component] fields - background first"
git push
```

**Teammates will:**

1. Pull your changes
2. Go to Settings → Config Sync → IMPORT
3. See the new field order immediately

---

## 🎯 Standard Field Order Pattern

### For Sections (with Background)

```
1. background    ← Container/styling controls (ALWAYS FIRST)
2. badge         ← Optional decoration
3. header        ← Optional content header
4. [component-specific fields]
```

**Rationale:**

- "Style the container first, then fill with content"
- Background controls padding/width/spacing → affects everything below
- Logical top-to-bottom: Container → Decoration → Content

---

### For Shared Components (No Background)

```
1. [primary identifying field - e.g., heading, label]
2. [secondary content fields]
3. [styling/behavior options]
```

---

## 🚨 Common Mistakes We Made

### ❌ Mistake #1: Editing Schema Files Instead of Config Files

**Wrong:**

```
apps/strapi/src/components/sections/testimonials-section.json
```

**Correct:**

```
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.testimonials-section.json
```

---

### ❌ Mistake #2: Using EXPORT Instead of IMPORT

**We kept doing:**

1. Edit files
2. Settings → Config Sync → **Export** ❌
3. Wonder why order didn't change

**Correct process:**

1. Edit files
2. Settings → Config Sync → **Import** ✅
3. Order changes immediately

**Remember:**

- Export = Save database changes TO files
- Import = Load file changes INTO database
- We edited files, so we IMPORT

---

### ❌ Mistake #3: Expecting Automatic Updates

**Strapi does NOT auto-sync config files to database!**

Must manually IMPORT after editing config files.

---

### ❌ Mistake #4: Restarting Strapi Unnecessarily

**Field order changes DO NOT require restart!**

Just IMPORT Config Sync and refresh Content Manager.

---

## 📖 Real-World Example

### Scenario: Move Background to Top of Testimonials Section

**Before:**

```
Testimonials Section in Content Manager:
- badge
- header
- background  ← Need to move this to top
- testimonials
- layout
- columns
```

**Step 1: Find file**

```
apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.testimonials-section.json
```

**Step 2: Edit layouts.edit array**

Find:

```json
"edit": [
  [{"name": "badge", "size": 12}],
  [{"name": "header", "size": 12}],
  [{"name": "background", "size": 12}],
  [{"name": "testimonials", "size": 12}],
  ...
]
```

Change to:

```json
"edit": [
  [{"name": "background", "size": 12}],  // ← MOVED TO TOP
  [{"name": "badge", "size": 12}],
  [{"name": "header", "size": 12}],
  [{"name": "testimonials", "size": 12}],
  ...
]
```

**Step 3: IMPORT Config Sync**

1. Settings → Config Sync
2. Click IMPORT
3. Confirm

**Step 4: Verify**

1. Content Manager → Testimonials Section
2. Ctrl + Shift + R
3. ✅ Background now at top!

**Step 5: Commit**

```powershell
git add apps/strapi/config/sync/
git commit -m "refactor: reorder testimonials fields - background first"
```

---

## 🔄 Integration with Existing Workflows

### When Creating New Components

**Phase 1: Backend Setup**

1. Create schema files (src/components/)
2. Add to Page dynamic zone
3. Add populate middleware
4. **Export Config Sync** ← Creates initial layout config
5. Restart Strapi

**Phase 2: Adjust Field Order (If Needed)**

1. Edit config/sync layout file (THIS WORKFLOW)
2. IMPORT Config Sync
3. Verify in Content Manager

---

### When Updating Existing Components

**Adding/Removing Fields:**

1. Edit schema file (src/components/)
2. Restart Strapi (generates new field in database)
3. **Export Config Sync** (saves new field to config)
4. Edit config/sync layout file (reorder if needed)
5. IMPORT Config Sync
6. Verify

**Reordering Existing Fields:**

1. Edit config/sync layout file (THIS WORKFLOW)
2. IMPORT Config Sync
3. Verify
4. NO RESTART NEEDED

---

## 📚 Related Documentation

- [COMPONENT_WORKFLOW.md](./COMPONENT_WORKFLOW.md) - Creating new components
- [STRAPI_BEST_PRACTICES.md](./STRAPI_BEST_PRACTICES.md) - Config Sync best practices
- [COMPONENT_DEVELOPMENT_GUIDE.md](./COMPONENT_DEVELOPMENT_GUIDE.md) - Overall component patterns

---

## ✅ Checklist

Use this for every field order change:

```
[ ] Found correct config file: config/sync/core-store.plugin_content_manager_configuration_components##[category].[name].json
[ ] Edited layouts.edit array (NOT schema file!)
[ ] Went to Settings → Config Sync
[ ] Clicked IMPORT button (NOT Export!)
[ ] Confirmed import
[ ] Hard refreshed Content Manager (Ctrl+Shift+R)
[ ] Verified new field order
[ ] Committed changes to Git
```

---

## 🎯 Success Criteria

**You know you did it right when:**

✅ Config Sync shows "X config changes" before import  
✅ After import, Config Sync shows "No differences"  
✅ Content Manager shows new field order (after refresh)  
✅ NO restart required  
✅ Changes work immediately

---

## 🆘 Troubleshooting

### Import button grayed out?

**Cause:** Files and database already in sync  
**Solution:** Your changes are already applied! Just refresh Content Manager

---

### Order didn't change after import?

**Check:**

1. Did you edit the RIGHT file? (config/sync, not src/components)
2. Did you edit layouts.edit array? (not metadatas)
3. Did you hard refresh Content Manager? (Ctrl+Shift+R)
4. Did you save the file before importing?

---

### "X config changes" but wrong component?

**Check:**

- File name format: `core-store.plugin_content_manager_configuration_components##[category].[exact-component-name].json`
- Case-sensitive! Must match schema UID exactly

---

## 🎓 Key Learnings

1. **Two separate file systems:**

   - Schema files (src/components) = database structure
   - Config files (config/sync) = UI layout

2. **Config Sync is bidirectional:**

   - EXPORT: Database → Files (when you change UI manually)
   - IMPORT: Files → Database (when you edit config files)

3. **Field order = layouts.edit array order:**

   - First element = top of form
   - Last element = bottom of form
   - Simple as that!

4. **No restart needed for layout changes:**
   - Only schema changes need restart
   - Layout is pure UI configuration

---

## 📝 Template for Future Changes

```json
// File: apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##[category].[name].json

{
  "layouts": {
    "edit": [
      // STANDARD ORDER FOR SECTIONS:
      [{ "name": "background", "size": 12 }], // 1. Container/styling
      [{ "name": "badge", "size": 12 }], // 2. Decoration
      [{ "name": "header", "size": 12 }], // 3. Content header
      // Component-specific fields below...
      [{ "name": "[field]", "size": 12 }]
    ]
  }
}
```

---

**Last Updated:** November 17, 2025  
**Status:** ✅ Tested and Verified  
**Time to Execute:** ~5 minutes  
**Failure Rate:** 0% (when following exactly)
