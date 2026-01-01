<!-- ARCHIVE STATUS: Learning Resource -->
<!-- VALUE: Config Sync workflow lessons (Export vs Import confusion) -->
<!-- DATE ARCHIVED: December 2025 -->
<!-- REASON: Common Config Sync mistake with clear resolution steps -->
<!-- SEE ALSO: docs/03-strapi/config-sync/ -->

# Fix Newsletter Field Order - Action Plan

## 🚨 What Went Wrong

**We did**: EXPORT (database → filesystem)  
**We needed**: IMPORT (filesystem → database)

**Result**: Our manual JSON edits were **overwritten** by the database (which had the old wrong layout)

---

## ✅ Status

- [x] JSON file edited AGAIN with correct layout (badge/background at top)
- [ ] IMPORT to apply filesystem → database
- [ ] Rebuild admin UI
- [ ] Restart Strapi
- [ ] Test in browser

---

## 🎯 Correct Workflow (Do These Steps NOW)

### Step 1: Start Strapi (if not running)

```powershell
cd apps/strapi
yarn dev
```

Wait for: `[2025-11-14 XX:XX:XX] info: ✔ Server started`

---

### Step 2: IMPORT Config Sync (filesystem → database)

**CRITICAL**: We use IMPORT because we edited the JSON file manually!

1. **Open browser**: http://localhost:1337/admin
2. **Navigate**: Settings (⚙️) → Config Sync → Interface tab
3. **You'll see**: "1 config change" or "Different" status for newsletter-cta-section
4. **Click**: **"Import" button** (NOT Export!)
5. **Confirm** the import dialog
6. **Result**: Database now has our correct field layout from JSON file ✅

---

### Step 3: Rebuild Strapi Admin (CRITICAL!)

**Why**: Content Manager field layouts are cached in the admin build

```powershell
# From repository root (C:\Users\herma\source\repository\strapi-next-monorepo-v2)
yarn build
```

**Expected output**:

```
✔ Deleting .strapi and dist folders
✔ Building admin panel...
✔ Compilation successful in 28.98s
```

**Takes**: ~30 seconds

---

### Step 4: Restart Strapi Dev Server

```powershell
# Stop current server (Ctrl+C in terminal)
# Then restart:
yarn workspace @repo/strapi dev
```

**Wait for**: Server started message

---

### Step 5: Hard Refresh Browser

**Windows**: Ctrl + Shift + R  
**Mac**: Cmd + Shift + R

**Why**: Clears browser cache of old admin UI

---

### Step 6: Test Field Layout

1. **Content Manager** → **Newsletter CTA Section**
2. **Expected Order**:

   ```
   ┌─────────────────────────────────────────┐
   │ Badge (50%)          | Background (50%) │ ← Section Chrome
   ├─────────────────────────────────────────┤
   │ Section Header (100%)                   │ ← Section Header
   ├─────────────────────────────────────────┤
   │ Heading (50%)        | Heading Accent   │ ← Two-tone support!
   ├─────────────────────────────────────────┤
   │ Heading Text Style (100%)               │ ← Right below heading
   ├─────────────────────────────────────────┤
   │ Description (100%)                      │
   │ Benefits (100%)                         │
   │ Input Placeholder (50%) | Button Text   │
   │ GDPR Label (100%)                       │
   │ GDPR Link (100%)                        │
   │ CTA Buttons (100%)                      │
   └─────────────────────────────────────────┘
   ```

3. **Test workflow**:
   - Set "Heading Text Style" to "two-tone"
   - Enter "Heading Accent": "Subscribe to our"
   - Enter "Heading": "Newsletter"
   - See them side-by-side (easy to understand relationship)

---

## 📋 Quick Command Sequence

```powershell
# 1. Start Strapi (if stopped)
yarn workspace @repo/strapi dev

# 2. Open browser → Settings → Config Sync → IMPORT (NOT Export!)

# 3. Rebuild admin (from root)
yarn build

# 4. Restart Strapi
yarn workspace @repo/strapi dev

# 5. Hard refresh browser (Ctrl+Shift+R)

# 6. Test: Content Manager → Newsletter CTA Section
```

---

## 🎓 Key Learnings

### Import vs Export - Never Confuse Again!

```
IMPORT = Filesystem → Database
  Use when: Edited JSON files manually (or pulled from Git)

EXPORT = Database → Filesystem
  Use when: Made changes in Strapi Admin UI
```

### Our Situation:

- ✅ We edited JSON file (filesystem)
- ❌ We did EXPORT (overwrote our edits!)
- ✅ We re-edited JSON file
- ✅ Now we do IMPORT (apply our edits to database)
- ✅ Then REBUILD (update admin UI)

---

## 🔗 Reference

See [CONFIG_SYNC_WORKFLOW_DEFINITIVE.md](/docs/config_sync_workflow_definitive) for complete import/export documentation.

---

## ✅ Success Criteria

- [x] Strapi running on port 1337
- [ ] Import completed (no errors in Strapi logs)
- [ ] Admin rebuild successful (no TypeScript errors)
- [ ] Browser hard refreshed
- [ ] Badge and Background at TOP of form
- [ ] Heading and Heading Accent side-by-side
- [ ] Heading Text Style immediately below heading
- [ ] All fields in logical groups

**When all checkboxes are complete → Field organization is FIXED!** 🎉
