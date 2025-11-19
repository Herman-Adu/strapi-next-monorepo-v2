# Config Sync Workflow - Definitive Guide

> **CRITICAL UNDERSTANDING**: Import and Export are directional operations between **Database** and **Filesystem**

---

## 🎯 Core Concept

Config Sync manages **two sources of truth**:

1. **Database** - Live data in Strapi's database (field layouts, content type configs, etc.)
2. **Filesystem** - JSON files in `apps/strapi/config/sync/`

### Direction Flow

```
┌──────────────┐         EXPORT          ┌──────────────┐
│              │  ───────────────────►   │              │
│   DATABASE   │                         │  FILESYSTEM  │
│              │  ◄───────────────────   │              │
└──────────────┘         IMPORT          └──────────────┘
```

---

## 📤 EXPORT: Database → Filesystem

**When to use**: You made changes in Strapi Admin UI and want to save them as JSON files

### Common Scenarios:

1. ✅ **Created new component** via Content-Type Builder
2. ✅ **Reorganized fields** in Content Manager layout
3. ✅ **Added/modified fields** through Admin UI
4. ✅ **Changed admin roles/permissions** in Settings
5. ✅ **Modified i18n locales** in Settings

### Process:

```powershell
# 1. Make changes in Strapi Admin UI
# 2. Go to Settings → Config Sync → Interface tab
# 3. Click "Export" button
# 4. Review what will be exported
# 5. Confirm export
# 6. Files are written to apps/strapi/config/sync/
# 7. Commit to Git
```

### What Gets Exported:

- Content type schemas
- Component schemas
- **Content Manager field layouts** (this is what we need for field organization!)
- Admin roles
- User permissions roles
- i18n locales
- Plugin settings

### Example:

```
Scenario: You reorganized Newsletter CTA fields in Content Manager

1. Edit field layout in Strapi Admin → Content Manager → Configure View
2. Drag heading and headingAccent next to each other
3. Save layout
4. Settings → Config Sync → Export
5. Result: apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.newsletter-cta-section.json updated
6. git add config/sync/*.json
7. git commit -m "feat: reorganize Newsletter CTA field layout"
```

---

## 📥 IMPORT: Filesystem → Database

**When to use**: You have JSON files (edited manually or from Git) and want to apply them to the database

### Common Scenarios:

1. ✅ **Pulled changes from Git** - teammate edited Config Sync files
2. ✅ **Manually edited JSON files** - changed schema or field layout by hand
3. ✅ **Fresh Strapi installation** - need to sync filesystem config into new database
4. ✅ **Deployment** - new environment needs to match filesystem config
5. ✅ **After schema changes** - modified component JSON files directly

### Process:

```powershell
# 1. Edit JSON files in apps/strapi/config/sync/ (or pull from Git)
# 2. Go to Settings → Config Sync → Interface tab
# 3. Review "Different" status items (filesystem ≠ database)
# 4. Click "Import" button
# 5. Confirm import
# 6. Database is updated to match filesystem
# 7. Rebuild Strapi Admin (if Content Manager layouts changed)
```

### What Gets Imported:

- Overwrites database with filesystem JSON content
- Updates Content Manager field layouts
- Applies schema changes
- Updates roles, permissions, locales, etc.

### Example:

```
Scenario: You manually edited newsletter-cta-section Config Sync JSON to reorganize fields

1. Edit: apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.newsletter-cta-section.json
2. Reorganize field layout (heading + headingAccent side-by-side)
3. Save file
4. Strapi Admin → Settings → Config Sync → Import
5. Confirm import
6. Database updated with new field layout
7. yarn build (rebuild admin UI)
8. Restart Strapi
9. Hard refresh browser
10. Content Manager shows new field layout ✅
```

---

## ⚠️ CRITICAL: When Import Changes Don't Show Up

### The Missing Step: Admin Rebuild

**Problem**: Imported Config Sync changes but fields still appear in old order

**Root Cause**: Content Manager field layouts are **cached in the admin build**

**Solution**: REBUILD the Strapi Admin after Import

```powershell
# From repository root
yarn build

# Or from apps/strapi
yarn build

# What this does:
# 1. Deletes .strapi/ cache directory
# 2. Deletes dist/ build directory
# 3. Compiles TypeScript
# 4. Rebuilds admin panel UI with new layouts
```

### Complete Workflow for Manual Config Sync Edits:

```
1. Edit JSON file (filesystem)
   ↓
2. Import in Strapi Admin (database update)
   ↓
3. Rebuild admin (yarn build) ← CRITICAL STEP!
   ↓
4. Restart Strapi (yarn dev)
   ↓
5. Hard refresh browser (Ctrl+Shift+R)
   ↓
6. Changes visible ✅
```

**Without Step 3**: Changes are in database but admin UI doesn't reflect them!

---

## 🔍 Status Indicators in Config Sync UI

### "Different"

- **Meaning**: Filesystem and database have different content
- **Action Needed**: Decide which direction to sync
  - Import = Trust filesystem (overwrite database)
  - Export = Trust database (overwrite filesystem)

### "Only in DB"

- **Meaning**: Config exists in database but no JSON file in filesystem
- **Common Cause**: Created content type/component in Admin UI but never exported
- **Action**: Export to create filesystem JSON file

### "Only in Sync Dir"

- **Meaning**: JSON file exists in filesystem but not in database
- **Common Cause**: Pulled changes from Git or manually added JSON file
- **Action**: Import to add to database

### "No differences"

- **Meaning**: Filesystem and database are in sync ✅
- **Action**: None needed

---

## 📋 Decision Tree

### I made changes in Strapi Admin UI

```
Changes in UI → Want to save as files → EXPORT
```

**Example**: Created component, rearranged fields, changed permissions

### I edited JSON files manually (or pulled from Git)

```
Changes in filesystem → Want to apply to database → IMPORT → REBUILD → RESTART
```

**Example**: Teammate pushed Config Sync changes, manual field layout edit

### I don't know which is correct

```
1. Check git diff on JSON files
2. If filesystem is newer/correct → IMPORT
3. If database is newer/correct → EXPORT
```

---

## 🎭 Real-World Scenarios

### Scenario 1: New Component Created in Admin

```
1. Content-Type Builder → Create component
2. Add fields
3. Save component
4. Strapi restarts
5. Settings → Config Sync → See "Only in DB" status
6. Click "Export" → Filesystem gets JSON file
7. git add + commit
```

**Why Export?**: Database has the new component, filesystem doesn't

---

### Scenario 2: Manual Field Layout Edit (Our Current Situation!)

```
1. Edit: config/sync/core-store.plugin_content_manager...json
2. Reorganize layout array (heading + headingAccent side-by-side)
3. git add + commit (filesystem is source of truth)
4. Settings → Config Sync → See "Different" status
5. Click "Import" → Database updated
6. yarn build → Admin UI rebuilt ← CRITICAL!
7. yarn dev → Restart Strapi
8. Ctrl+Shift+R → Hard refresh browser
9. Content Manager shows new layout ✅
```

**Why Import?**: Filesystem is correct (we edited it), database is outdated

---

### Scenario 3: Pulled Changes from Git

```
1. git pull origin main
2. Teammate added new component schemas
3. Settings → Config Sync → Multiple "Only in Sync Dir" items
4. Click "Import" → Database gets new schemas
5. Restart Strapi → Types regenerated
6. Done ✅
```

**Why Import?**: Filesystem has new content (from Git), database doesn't

---

### Scenario 4: Fresh Deployment/New Environment

```
1. Clone repository
2. Install dependencies
3. Create database
4. Start Strapi
5. Settings → Config Sync → Everything "Only in Sync Dir"
6. Click "Import" → Database populated from filesystem
7. Database now matches repository ✅
```

**Why Import?**: Filesystem (Git) is source of truth, database is empty

---

## ⚙️ Windows PowerShell Commands

### Check Status (CLI)

```powershell
# From apps/strapi
yarn cs diff

# Shows differences between database and filesystem
```

### Import (CLI)

```powershell
# From apps/strapi
yarn cs import

# Applies filesystem → database
```

### Export (CLI)

```powershell
# From apps/strapi
yarn cs export

# Applies database → filesystem
```

### Rebuild Admin (Always After Import for Field Layouts!)

```powershell
# From repository root
yarn build

# Deletes cache, rebuilds admin UI
```

---

## 🧪 Testing Our Fix

### Current Situation:

- ✅ Edited newsletter-cta-section JSON (filesystem)
- ✅ Exported all Config Sync (database → filesystem for OTHER components)
- ✅ Rebuilt admin: `yarn build`
- ⏳ Need to restart Strapi
- ⏳ Need to test field layout

### Expected Result:

After restart + hard refresh:

- Heading and Heading Accent fields side-by-side ✅
- Heading Text Style immediately below ✅
- All fields in logical groups ✅

### If It Still Doesn't Work:

**Double-check**:

1. Import was done (not just Export)
2. Rebuild was done: `yarn build` (not just restart)
3. Hard refresh browser: Ctrl + Shift + R (Windows)

**Nuclear Option** (if still broken):

```powershell
# From apps/strapi
Remove-Item -Recurse -Force .strapi, dist
yarn build
yarn dev
```

This forces complete cache deletion and rebuild.

---

## 📝 Summary

### Import = Filesystem → Database

**Use when**: You edited JSON files (or pulled from Git) and need to apply them to the database

### Export = Database → Filesystem

**Use when**: You made changes in Strapi Admin UI and need to save them as JSON files

### Critical Steps for Field Layout Changes:

1. **Edit** JSON file (or make changes in UI)
2. **Import** (if edited JSON) or **Export** (if edited in UI)
3. **Rebuild** admin: `yarn build` ← ALWAYS for field layouts!
4. **Restart** Strapi: `yarn dev`
5. **Refresh** browser: Ctrl + Shift + R

### Remember:

- ❌ Edit JSON + Restart = Changes won't show (missing Import + Rebuild!)
- ❌ Import + Restart = Changes won't show (missing Rebuild!)
- ✅ Edit JSON + Import + Rebuild + Restart = Changes show!

---

## 🔗 Official Documentation

- [Config Sync Plugin](https://www.npmjs.com/package/strapi-plugin-config-sync)
- [PluginPal Docs](https://docs.pluginpal.io/config-sync)
- [CLI Reference](https://docs.pluginpal.io/config-sync/cli)
- [Admin GUI Reference](https://docs.pluginpal.io/config-sync/admin-gui)

---

## 🎯 Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  Import vs Export - Quick Cheat Sheet                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  EXPORT                    IMPORT                       │
│  Database → Filesystem     Filesystem → Database        │
│                                                         │
│  When:                     When:                        │
│  • Created in Admin UI     • Edited JSON manually       │
│  • Changed in UI           • Pulled from Git            │
│  • Want to save as JSON    • Fresh environment          │
│                                                         │
│  After:                    After:                       │
│  • Commit JSON files       • Rebuild admin (yarn build) │
│  • Push to Git             • Restart Strapi             │
│                            • Hard refresh browser       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
