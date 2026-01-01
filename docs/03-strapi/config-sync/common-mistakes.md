# Common Config Sync Mistakes & Solutions

> Learn from our mistakes so you don't repeat them!

**Last Updated:** December 8, 2025  
**Related Workflows:** [Simplified Config Sync](/docs/03-strapi-config-sync-simplified) | [Definitive Workflow](/docs/03-strapi-config-sync-workflow-definitive)  
**Archive Reference:** [Newsletter Field Order Fix](/docs/17-learning-lessons-troubleshooting-lessons-fix-newsletter-fields)

---

## 🚨 Mistake #1: Export vs Import Confusion

### The Problem

**What we did:** Used EXPORT (database → filesystem) after manually editing JSON files

**What we needed:** IMPORT (filesystem → database) to apply our JSON edits

**Result:** Manual edits were **overwritten** by the database (which had the old wrong data)

### The Story

We edited field layout in the JSON config file directly, then ran Config Sync EXPORT thinking it would "apply" our changes. Instead, EXPORT overwrote our JSON edits with the database values!

**See full story:** [Newsletter Field Order Fix](/docs/17-learning-lessons-troubleshooting-lessons-fix-newsletter-fields) (complete with our confusion and solution)

### The Solution

**Golden Rule:**

```
Manual JSON Edit → IMPORT (filesystem → database)
Database Change  → EXPORT (database → filesystem)
```

**Step-by-step:**

1. Edit JSON file manually
2. Go to Admin UI → Settings → Config Sync
3. Click **"Import"** (NOT Export!)
4. Rebuild admin: `yarn workspace @repo/strapi build`
5. Restart Strapi
6. Verify changes in browser

---

## 🔴 Mistake #2: Forgetting to Rebuild Admin UI

### The Problem

After importing config changes, the admin UI still shows old field layout.

### Why It Happens

Content Manager field layouts are **cached in the admin build**. Importing config updates the database, but the UI won't reflect changes until rebuilt.

### The Solution

**Always rebuild after config import:**

```powershell
yarn workspace @repo/strapi build
yarn workspace @repo/strapi dev  # Or restart if already running
```

**Production:**

```bash
# Heroku automatically rebuilds on deploy
git push heroku main
```

---

## ⚠️ Mistake #3: Not Exporting After Database Changes

### The Problem

Made changes in Strapi admin UI but forgot to export. Next developer pulls code and has outdated config.

### The Solution

**After EVERY admin UI change:**

1. Make change in Strapi admin
2. Settings → Config Sync → **Export**
3. Commit the updated JSON files
4. Push to git

**Set up a reminder:**

```bash
# Add to pre-commit hook or CI
git diff --name-only | grep "config/sync/"
# If empty, warn developer to run export
```

---

## 🐛 Mistake #4: Config Drift Between Environments

### The Problem

Local environment has different config than staging/production. Changes work locally but break in deployment.

### The Solution

**Deployment workflow:**

```bash
# Before deploying
1. Export local config (if you made changes)
2. Commit config/sync/ changes
3. Push to git
4. Deploy
5. In production: Import config
6. Rebuild production (automatic on Heroku)
```

**Check for drift:**

```bash
# In Strapi admin (both environments)
Settings → Config Sync → Compare tab
# Should show "All synced"
```

---

## 🔧 Mistake #5: Editing Wrong Config File

### The Problem

Multiple config files exist:

- `config/sync/core-store.plugin_content_manager_configuration_*.json` (Content Manager layouts)
- `src/components/*/*.json` (Component schemas)
- `src/api/*/content-types/*/schema.json` (Content type schemas)

Editing the wrong one has no effect!

### The Solution

**What to edit where:**

| Change Type                            | File Location                          | After Edit                  |
| -------------------------------------- | -------------------------------------- | --------------------------- |
| Field **layout/order** in admin        | `config/sync/core-store.plugin_*.json` | IMPORT + rebuild            |
| Field **schema** (type, required, etc) | `src/components/` or `src/api/`        | Restart Strapi (auto-syncs) |
| New component/content type             | `src/components/` or `src/api/`        | Restart + EXPORT            |

**Tip:** If unsure, make the change in admin UI first, then EXPORT to see which file changes.

---

## ✅ Best Practices Checklist

### Before Manual JSON Edits

- [ ] Understand Export vs Import direction
- [ ] Know which file to edit
- [ ] Have backup (git commit current state)
- [ ] Strapi server running (for import)

### After Manual JSON Edits

- [ ] IMPORT config (database ← filesystem)
- [ ] Rebuild admin UI (`yarn workspace @repo/strapi build`)
- [ ] Restart Strapi
- [ ] Test in browser
- [ ] Commit changes to git

### After Admin UI Changes

- [ ] EXPORT config (database → filesystem)
- [ ] Verify JSON files updated in git diff
- [ ] Commit config/sync/ changes
- [ ] Push to shared repository
- [ ] Other developers: Pull + IMPORT + rebuild

### Before Deployment

- [ ] Export local config if changed
- [ ] Commit all config files
- [ ] Test in staging first
- [ ] Import config in production
- [ ] Verify production config matches

---

## 🎓 Learning Resources

**Archive Documents (Full Stories):**

- [Newsletter Field Order Fix](/docs/17-learning-lessons-troubleshooting-lessons-fix-newsletter-fields) - Export vs Import confusion
- [Newsletter Field Organization](/docs/03-strapi-config-sync-field-organization) - Field layout best practices

**Current Workflows:**

- [Simplified Config Sync](/docs/03-strapi-config-sync-simplified) - Quick reference
- [Definitive Workflow](/docs/03-strapi-config-sync-workflow-definitive) - Complete guide

**Related:**

- [Troubleshooting Playbook](/docs/09-troubleshooting-playbook) - General debugging
- [Backup Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines) - Before any database changes

---

## 💡 Key Takeaways

1. **Manual JSON Edit = IMPORT** (filesystem → database)
2. **Admin UI Change = EXPORT** (database → filesystem)
3. **Always rebuild** admin UI after import
4. **Always commit** config files after export
5. **Test thoroughly** before production deployment

---

**Remember:** Everyone makes these mistakes. The difference is documenting them so the next person doesn't! 📝
