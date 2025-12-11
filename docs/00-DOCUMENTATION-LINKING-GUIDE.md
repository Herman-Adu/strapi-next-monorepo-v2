# Documentation Linking Guide

> **Essential reading for anyone creating or editing documentation**

## 🎯 Quick Reference

### ✅ Correct Link Format

Use absolute links with the `/docs/` prefix and the generated slug:

```
/docs/generated-slug
```

### ❌ Incorrect Link Formats (DO NOT USE)

```markdown
[Link](/docs/file) <!-- File-system relative -->
[Link](/docs/folder-file) <!-- Parent directory -->
[Link](file.md) <!-- Same directory -->
```

## 🔍 How to Find the Correct Slug

### Method 1: Use the Slug Generator Pattern

Follow this algorithm:

1. Start with the file path **relative to the `docs/` folder**
2. Remove the `.md` extension
3. Replace all `/` (forward slashes) with `-` (hyphens)
4. Convert to lowercase

**Examples:**

| File Path                                          | Generated Slug                                  |
| -------------------------------------------------- | ----------------------------------------------- |
| `README.md`                                        | `readme`                                        |
| `00-START-HERE.md`                                 | `00-start-here`                                 |
| `01-getting-started/installation.md`               | `01-getting-started-installation`               |
| `03-strapi/backup-and-safety/README.md`            | `03-strapi-backup-and-safety-readme`            |
| `03-strapi/backup-and-safety/safety-guidelines.md` | `03-strapi-backup-and-safety-safety-guidelines` |
| `14-deep-dives/strapi-5/01-BEGINNER.md`            | `14-deep-dives-strapi-5-01-beginner`            |

### Method 2: Check the Loader

Look in `apps/ui/src/lib/docs/loader.ts` → `DOC_METADATA_MAP` to find the registered file path, then apply the algorithm above.

### Method 3: Use the Validation Script

```powershell
node scripts/validate-doc-links.js
```

This will show you all broken links and suggest fixes.

## 📝 Writing Links

### Internal Documentation Links

**Always use absolute `/docs/` links:**

```markdown
<!-- ✅ CORRECT -->

For more details, see [Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines).

Check the [Installation Guide](/docs/01-getting-started-installation) to get started.

Read the [Docker Fundamentals](/docs/14-deep-dives-docker-01-fundamentals) guide.
```

### Links to Other Sections

**Use descriptive navigation instead of broken relative links:**

```markdown
<!-- ❌ WRONG -->

See Config Sync folder for more details.

<!-- ✅ CORRECT -->

See documents in **Strapi & Backend** category → **Config Sync** section.
```

### External Links

External links work normally:

```markdown
[Next.js Documentation](https://nextjs.org/docs)
[Strapi Documentation](https://docs.strapi.io)
```

## 🛠️ Tools & Scripts

### Validate All Links

```powershell
node scripts/validate-doc-links.js
```

Returns exit code 0 if all links are valid, 1 if broken links found.

### Fix File-System Links (Experimental)

```powershell
node scripts/fix-doc-links.js
```

**Warning:** This script attempts to convert `./` and `../` links automatically. Always review changes before committing!

## 📋 Checklist for New Documentation

When creating or editing documentation:

- [ ] Use `/docs/slug` format for all internal links
- [ ] Calculate slug using the pattern above
- [ ] Verify target document exists
- [ ] Run validation script before committing
- [ ] Test links in the browser

## 🎓 Why This Matters

### The Problem with File-System Links

```markdown
[Link](/docs/03-strapi-backup-and-safety-safety-guidelines)
```

- ✅ Works in GitHub
- ✅ Works in VS Code preview
- ❌ **Does NOT work** in the Next.js application
- ❌ Generates 404 errors

### The Next.js Routing System

Our docs use Next.js **dynamic routing** with the pattern:

```
/docs/[slug]/page.tsx
```

The `[slug]` parameter is matched against **generated slugs**, not file paths.

**Flow:**

```
User clicks link
    ↓
/docs/03-strapi-backup-and-safety-safety-guidelines
    ↓
Next.js extracts slug: "03-strapi-backup-and-safety-safety-guidelines"
    ↓
getDocBySlug() searches DOC_METADATA_MAP
    ↓
Finds: "03-strapi/backup-and-safety/safety-guidelines.md"
    ↓
Renders document ✅
```

## 🔧 Common Issues & Solutions

### Issue: "This page could not be found (404)"

**Cause:** Link uses file-system format or incorrect slug

**Solution:** Convert to proper `/docs/slug` format

**Example Fix:**

```markdown
<!-- ❌ BROKEN -->

[Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines)

<!-- ✅ FIXED -->

[Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines)
```

### Issue: Slug generation confusion

**Remember:** The slug is based on the **file path from `docs/` folder**, not the category ID.

```
File: docs/03-strapi/backup-and-safety/safety-guidelines.md
       └─────────────────────────────────┬─────────────────────┘
                                         │
                         Remove .md, replace / with -, lowercase
                                         ↓
Slug: 03-strapi-backup-and-safety-safety-guidelines
      └──────────┬───────┘
         Includes folder prefix (03-strapi, not just "strapi")
```

### Issue: Document not found even with correct slug

**Cause:** Document not registered in `DOC_METADATA_MAP`

**Solution:** Add entry to `apps/ui/src/lib/docs/loader.ts`:

```typescript
export const DOC_METADATA_MAP: Record<string, Omit<DocMetadata, "slug">> = {
  // ... other entries

  "03-strapi/backup-and-safety/safety-guidelines.md": {
    title: "Data Safety Guidelines",
    description: "Comprehensive backup safety protocols",
    category: "strapi",
    subcategory: "backup-and-safety",
    order: 2,
    readTime: "15 min",
    status: "published",
    badge: "Critical",
    audience: "all",
  },
}
```

## 🚀 Best Practices

1. **Always validate** before pushing

   ```powershell
   node scripts/validate-doc-links.js
   ```

2. **Use descriptive link text**

   ```markdown
   <!-- ❌ Poor -->

   Click [here](/docs/03-strapi-backup-and-safety-safety-guidelines).

   <!-- ✅ Good -->

   Review the [Data Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines) before proceeding.
   ```

3. **Group related links**

   ```markdown
   **Config Sync Resources:**

   - [Simplified Workflow](/docs/03-strapi-config-sync-simplified)
   - [Definitive Guide](/docs/03-strapi-config-sync-workflow-definitive)
   - [Common Mistakes](/docs/03-strapi-config-sync-common-mistakes)
   ```

4. **Test in browser** - Don't just rely on VS Code preview

5. **Keep links stable** - Avoid renaming files without updating all references

## 📚 Related Documentation

- [Documentation Hub](/docs/readme) - Main documentation index
- **Getting Started** category - All setup guides
- **Reference** category - Technical references

---

**Questions?** Check the [Troubleshooting](/docs/09-troubleshooting-playbook) guide or ask the team!
