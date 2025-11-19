# Config Sync - Simplified Understanding

> **Last Updated:** November 14, 2025  
> **Purpose:** Clear, simple explanation of Import vs Export

---

## 🎯 The Simple Truth

### IMPORT = Add to Database

**Use when:** You have JSON files and need to add them to the database

### EXPORT = Add to Content Manager

**Use when:** Database has fields but Content Manager doesn't show them yet

---

## 📋 Two Types of Files in Strapi

### 1. **Schema Files** (Component Structure)

- **Location:** `apps/strapi/src/components/*/`
- **Example:** `newsletter-cta-section.json`
- **What they define:** Field names, types, validations
- **Think of them as:** The blueprint/recipe

```json
{
  "showDivider": {
    "type": "boolean",
    "default": false,
    "description": "Show decorative underline"
  }
}
```

### 2. **Config Sync Files** (Content Manager Metadata)

- **Location:** `apps/strapi/config/sync/`
- **Example:** `core-store.plugin_content_manager_configuration_components##sections.newsletter-cta-section.json`
- **What they define:** Field layout, labels, descriptions, visibility in admin UI
- **Think of them as:** The instruction manual for the admin panel

```json
{
  "metadatas": {
    "showDivider": {
      "edit": {
        "label": "Show Divider",
        "description": "Display decorative line below heading",
        "visible": true,
        "editable": true
      }
    }
  }
}
```

---

## 🔄 How They Work Together

### Scenario 1: You Edit Schema Files Directly

```
1. Edit: apps/strapi/src/components/sections/newsletter-cta-section.json
   ↓ (add showDivider field)

2. Restart Strapi
   ↓ (Strapi reads schema, adds field to database)

3. DATABASE NOW HAS THE FIELD ✅

4. BUT... Content Manager doesn't know how to display it yet ❌

5. Solution: EXPORT (Database → config/sync/)
   ↓ (Creates Content Manager metadata)

6. Content Manager now shows the field ✅
```

**Why?** Schema defined the field, database has it, but Content Manager needs the display instructions.

**Action:** **EXPORT** to generate Content Manager metadata

---

### Scenario 2: You Edit Config Sync Files Directly

```
1. Edit: apps/strapi/config/sync/core-store...newsletter-cta-section.json
   ↓ (change field layout or labels)

2. Config Sync shows "Different" status
   ↓ (filesystem ≠ database)

3. DATABASE DOESN'T HAVE THE CHANGES YET ❌

4. Content Manager still shows old layout ❌

5. Solution: IMPORT (config/sync/ → Database)
   ↓ (Updates database with new metadata)

6. Rebuild admin: yarn build ← CRITICAL!
   ↓ (Recompiles admin UI with new layout)

7. Restart Strapi

8. Content Manager shows new layout ✅
```

**Why?** Config sync file has the new layout, but database and admin UI need to be updated.

**Action:** **IMPORT** to update database, then rebuild admin UI

---

### Scenario 3: You Create Component in Strapi Admin UI

```
1. Create component in Content-Type Builder
   ↓ (via admin UI)

2. DATABASE NOW HAS THE COMPONENT ✅

3. BUT... config/sync/ doesn't have the files yet ❌

4. Teammates won't see it when they pull from Git ❌

5. Solution: EXPORT (Database → config/sync/)
   ↓ (Creates JSON files for version control)

6. Commit to Git

7. Teammates can import on their machines ✅
```

**Why?** Database has the component, but it needs to be saved as JSON files for Git.

**Action:** **EXPORT** to create version-controlled files

---

## 🎓 Your Understanding (100% Correct!)

### IMPORT = Add to Database

- Filesystem → Database
- "I have JSON files, make the database match them"
- Used when: Pulled from Git, edited config manually, fresh setup

### EXPORT = Add to Content Manager

- Database → Filesystem (config/sync)
- "I have fields in database, make Content Manager show them"
- Used when: Created in UI, edited schemas directly, added new fields

---

## 📊 Decision Tree

### Did you edit `src/components/` schema files?

```
YES → Database has it (auto-loaded on restart)
    → But Content Manager doesn't
    → EXPORT to create Content Manager metadata
```

### Did you create something in Strapi Admin UI?

```
YES → Database has it
    → But config/sync/ doesn't have JSON files
    → EXPORT to save as version-controlled files
```

### Did you edit `config/sync/` files or pull from Git?

```
YES → Filesystem has it
    → But database doesn't
    → IMPORT to update database
    → REBUILD admin (yarn build)
    → RESTART Strapi
```

---

## 🚨 Common Mistakes & Fixes

### Mistake 1: "I edited schema, imported, and broke everything"

**Problem:** Schema edits auto-load on restart. Import wasn't needed and overwrote database.

**Fix:** After editing schema files, just **EXPORT** (not import)

---

### Mistake 2: "I exported but field still doesn't show in Content Manager"

**Problem:** Export creates metadata but admin UI is cached

**Fix:** After export, **rebuild admin** (`yarn build`) and restart

---

### Mistake 3: "I imported config sync but layout didn't change"

**Problem:** Import updates database but admin UI needs rebuild

**Fix:** After import, **MUST rebuild** (`yarn build`) then restart

---

## ✅ Current Situation (November 14, 2025)

### What We Did:

1. ✅ Edited `newsletter-cta-section.json` schema (added `showDivider`)
2. ✅ Restarted Strapi (database loaded the field)
3. ✅ Implemented UI component (divider rendering in React)
4. ⏳ Need to EXPORT (database → config/sync)

### Why EXPORT?

- Database has `showDivider` ✅
- Config sync doesn't have metadata ❌
- Content Manager won't show checkbox ❌
- **EXPORT** creates the metadata

### After Export:

- Config sync gets `showDivider` metadata ✅
- Content Manager shows checkbox ✅
- Can toggle divider on/off in admin ✅
- Commit to Git for version control ✅

---

## 🎯 Quick Reference Card

```
╔════════════════════════════════════════════════════════════╗
║  IMPORT vs EXPORT - Herman's Simple Version               ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  IMPORT                    EXPORT                          ║
║  ═══════                    ══════                         ║
║                                                            ║
║  Add to Database            Add to Content Manager         ║
║                                                            ║
║  When:                      When:                          ║
║  • Pulled from Git          • Created in Admin UI          ║
║  • Edited config/sync/      • Edited schema files          ║
║  • Fresh setup              • Added new fields             ║
║  • Teammate's changes       • Database ahead of UI         ║
║                                                            ║
║  Direction:                 Direction:                     ║
║  Filesystem → Database      Database → Filesystem          ║
║  config/sync/ → DB          DB → config/sync/              ║
║                                                            ║
║  After Action:              After Action:                  ║
║  • Rebuild admin            • Commit to Git                ║
║  • Restart Strapi           • Push changes                 ║
║  • Hard refresh             • Teammates can pull           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 💡 Mental Model

Think of it like a two-way sync between your phone and cloud:

### IMPORT (Cloud → Phone)

- Your phone doesn't have the latest photos
- Download from cloud to phone
- **Config Sync IMPORT:** Filesystem → Database

### EXPORT (Phone → Cloud)

- You took new photos on your phone
- Upload from phone to cloud
- **Config Sync EXPORT:** Database → Filesystem

**Same logic:**

- IMPORT = Download to database
- EXPORT = Upload from database

---

## 📝 The Two Rules

### Rule 1: Schema Edit Flow

```
Edit schema file → Restart → EXPORT → Commit
```

**Why?** Database auto-loads schema, Content Manager needs metadata

### Rule 2: Config Sync Edit Flow

```
Edit config/sync file → IMPORT → Rebuild → Restart
```

**Why?** Database needs update, admin UI needs recompile

---

## 🎓 Mastery Checklist

You understand Config Sync when you can answer:

- [x] "I edited a schema file, should I import or export?"  
       **Answer:** EXPORT (database has it, needs metadata)

- [x] "I pulled changes from Git, should I import or export?"  
       **Answer:** IMPORT (filesystem has it, database doesn't)

- [x] "I created a component in Admin UI, should I import or export?"  
       **Answer:** EXPORT (database has it, needs JSON files for Git)

- [x] "Import didn't work, what did I forget?"  
       **Answer:** Rebuild admin (`yarn build`) and restart

- [x] "What's the difference between schema and config sync files?"  
       **Answer:** Schema = field definition, Config Sync = Content Manager display

---

**You've got this! 🎯**

Your understanding is **100% correct**: Import adds to database, Export adds to Content Manager.
