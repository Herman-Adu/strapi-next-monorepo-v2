#!/usr/bin/env node

/**
 * Mass Documentation Link Migration
 *
 * Automatically fixes all documentation links in the docs/ folder:
 * 1. Converts legacy filename references to /docs/slug format
 * 2. Converts relative .md links to /docs/slug format
 * 3. Removes .md extensions from /docs/ links
 *
 * Usage:
 *   node scripts/migrate-all-links.js          # Dry run (preview changes)
 *   node scripts/migrate-all-links.js --apply  # Apply changes to files
 */

const fs = require("fs")
const path = require("path")

const DOCS_DIR = path.join(__dirname, "..", "docs")
const DRY_RUN = !process.argv.includes("--apply")

// Legacy filename mapping (matches link-utils.ts)
const LEGACY_FILE_MAP = {
  "COMPONENT_WORKFLOW.md": "04-components-workflow",
  "COMPONENT_DEVELOPMENT_GUIDE.md": "04-components-development-guide",
  "COMPONENT_INTEGRATION_GUIDE.md": "04-components-integration-guide",
  "COMPONENT_ARCHITECTURE.md": "02-architecture-component-architecture",
  "COMPONENT_FIELD_ORDER_WORKFLOW.md": "06-workflows-field-order-changes",
  "DEVELOPMENT_GUIDE.md": "01-getting-started-installation",
  "DEVELOPMENT_WORKFLOW.md": "06-workflows-build-commit-push",
  "WORKFLOW_INDEX.md": "06-workflows-build-commit-push",
  "QUICK_REFERENCE.md": "10-reference-quick-reference",
  "QUICK_START.md": "01-getting-started-quick-start",
  "STYLING_GUIDE.md": "05-styling-styling-guide",
  "THEME_SYSTEM_GUIDE.md": "02-architecture-theme-system",
  "SHARED_COMPONENT_GUIDE.md": "04-components-shared-component-guide",
  "SPACING_ARCHITECTURE_GUIDE.md": "02-architecture-spacing-architecture",
  "STRAPI_BEST_PRACTICES.md": "03-strapi-best-practices",
  "CONFIG_SYNC_WORKFLOW_DEFINITIVE.md":
    "03-strapi-config-sync-workflow-definitive",
  "POPULATE_PATTERNS_REFERENCE.md": "04-components-development-guide",
  "AUTOMATION-STRATEGY.md": "06-workflows-automation-strategy",
  "DATABASE_BACKUP_RESTORE.md": "03-strapi-backup-and-safety-backup-procedures",
  "TROUBLESHOOTING_PLAYBOOK.md": "09-troubleshooting-playbook",
  "TEST_DATA_NEW_COMPONENTS.md": "07-content-manager-test-data-readme",
  "POPULATE_TEST_DATA_GUIDE.md": "07-content-manager-test-data-readme",
  "PROJECT_STATUS.md": "10-reference-project-status",
  "BEST_PRACTICE_CHECKLIST.md": "10-reference-quick-reference",
  "PAGE_CREATION_WORKFLOW.md": "07-content-manager-page-creation",
}

function filenameToSlug(filename) {
  return filename.replace(/\.md$/, "").replace(/\//g, "-").toLowerCase()
}

/**
 * Build slug lookup from filesystem
 */
function buildSlugLookup() {
  const lookup = new Map() // filename -> slug

  function scanDirectory(dir, relativePath = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relPath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name

      if (entry.isDirectory()) {
        scanDirectory(fullPath, relPath)
      } else if (entry.name.endsWith(".md")) {
        const slug = filenameToSlug(relPath)
        lookup.set(entry.name, slug)
        lookup.set(relPath, slug)
      }
    }
  }

  scanDirectory(DOCS_DIR)
  return lookup
}

/**
 * Migrate links in file content
 */
function migrateLinksInContent(content, filePath, slugLookup) {
  let newContent = content
  const changes = []

  // 1. Fix legacy filename references
  const legacyFileRegex = /\[([^\]]+)\]\(([A-Z_]+\.md)\)/g
  newContent = newContent.replace(
    legacyFileRegex,
    (fullMatch, linkText, filename) => {
      const mappedSlug = LEGACY_FILE_MAP[filename]
      if (mappedSlug) {
        changes.push({
          type: "legacy-file",
          from: fullMatch,
          to: `[${linkText}](/docs/${mappedSlug})`,
        })
        return `[${linkText}](/docs/${mappedSlug})`
      }
      // If no mapping, leave unchanged (will be caught by validation)
      return fullMatch
    }
  )

  // 2. Fix relative .md links
  const relativeMdRegex = /\[([^\]]+)\]\((\.\.?\/[^)]+\.md)\)/g
  newContent = newContent.replace(
    relativeMdRegex,
    (fullMatch, linkText, relPath) => {
      // Extract filename from relative path
      const filename = relPath.split("/").pop()

      // Try to find slug from lookup
      let slug = slugLookup.get(filename)

      // If not found, try constructing from path
      if (!slug) {
        const cleanPath = relPath
          .replace(/^(\.\.?\/)+/, "")
          .replace(/\.md$/, "")
        slug = cleanPath.replace(/\//g, "-").toLowerCase()
      }

      if (slug) {
        changes.push({
          type: "relative-md",
          from: fullMatch,
          to: `[${linkText}](/docs/${slug})`,
        })
        return `[${linkText}](/docs/${slug})`
      }

      return fullMatch
    }
  )

  // 3. Remove .md extensions from /docs/ links
  const mdExtensionRegex = /\[([^\]]+)\]\(\/docs\/([^)]+)\.md\)/g
  newContent = newContent.replace(
    mdExtensionRegex,
    (fullMatch, linkText, slug) => {
      changes.push({
        type: "md-extension",
        from: fullMatch,
        to: `[${linkText}](/docs/${slug})`,
      })
      return `[${linkText}](/docs/${slug})`
    }
  )

  return { newContent, changes }
}

/**
 * Process a single file
 */
function processFile(filePath, slugLookup, stats) {
  const content = fs.readFileSync(filePath, "utf-8")
  const { newContent, changes } = migrateLinksInContent(
    content,
    filePath,
    slugLookup
  )

  if (changes.length > 0) {
    const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, "/")

    stats.filesChanged++
    stats.totalChanges += changes.length

    console.log(`\n📝 ${relativePath}`)
    changes.forEach(({ type, from, to }) => {
      console.log(`  [${type}] ${from}`)
      console.log(`         → ${to}`)

      if (!stats.changesByType[type]) {
        stats.changesByType[type] = 0
      }
      stats.changesByType[type]++
    })

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, newContent, "utf-8")
      stats.filesWritten++
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log("🔧 Mass Documentation Link Migration\n")

  if (DRY_RUN) {
    console.log("⚠️  DRY RUN MODE - No files will be modified")
    console.log("   Run with --apply flag to apply changes\n")
  } else {
    console.log("✏️  APPLY MODE - Files will be modified\n")
  }

  console.log("Building slug lookup...")
  const slugLookup = buildSlugLookup()
  console.log(`✓ Indexed ${slugLookup.size} document slugs\n`)

  const stats = {
    filesScanned: 0,
    filesChanged: 0,
    filesWritten: 0,
    totalChanges: 0,
    changesByType: {},
  }

  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.name.endsWith(".md")) {
        stats.filesScanned++
        processFile(fullPath, slugLookup, stats)
      }
    }
  }

  console.log("Processing files...\n")
  console.log("─".repeat(80))

  scanDirectory(DOCS_DIR)

  console.log("\n" + "─".repeat(80))
  console.log("\n📊 Migration Summary\n")
  console.log(`  Files scanned:  ${stats.filesScanned}`)
  console.log(`  Files changed:  ${stats.filesChanged}`)
  if (!DRY_RUN) {
    console.log(`  Files written:  ${stats.filesWritten}`)
  }
  console.log(`  Total changes:  ${stats.totalChanges}`)

  if (Object.keys(stats.changesByType).length > 0) {
    console.log("\n  Changes by type:")
    Object.entries(stats.changesByType).forEach(([type, count]) => {
      const typeNames = {
        "legacy-file": "Legacy filename refs",
        "relative-md": "Relative .md links",
        "md-extension": ".md in /docs/ links",
      }
      console.log(`    ${typeNames[type] || type}: ${count}`)
    })
  }

  if (DRY_RUN && stats.totalChanges > 0) {
    console.log("\n💡 To apply these changes, run:")
    console.log("   node scripts/migrate-all-links.js --apply")
  } else if (!DRY_RUN && stats.totalChanges > 0) {
    console.log("\n✅ Migration complete! Files have been updated.")
    console.log("\n📋 Next steps:")
    console.log("   1. Review changes: git diff docs/")
    console.log(
      "   2. Validate links: node scripts/validate-doc-links-enhanced.js"
    )
    console.log("   3. Test in browser: npm run dev")
    console.log(
      "   4. Commit changes: git add docs/ && git commit -m 'fix: migrate all doc links to /docs/slug format'"
    )
  } else if (stats.totalChanges === 0) {
    console.log(
      "\n✅ No changes needed - all links are already in correct format!"
    )
  }

  process.exit(0)
}

main()
