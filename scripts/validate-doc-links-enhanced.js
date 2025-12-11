#!/usr/bin/env node

/**
 * Enhanced Documentation Links Validator
 *
 * Comprehensive validation of all documentation links with:
 * - Detection of broken /docs/ links
 * - Detection of legacy .md file references
 * - Detection of relative .md links
 * - Fuzzy matching suggestions for corrections
 * - Categorized error reporting
 *
 * Usage: node scripts/validate-doc-links-enhanced.js
 */

const fs = require("fs")
const path = require("path")

const DOCS_DIR = path.join(__dirname, "..", "docs")

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

function buildValidSlugsSet() {
  const slugs = new Set()

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
        slugs.add(slug)
      }
    }
  }

  scanDirectory(DOCS_DIR)
  return slugs
}

/**
 * Find similar slugs using fuzzy matching
 */
function findSimilarSlugs(input, validSlugs, maxResults = 3) {
  const allSlugs = Array.from(validSlugs)

  // Calculate similarity scores
  const scored = allSlugs.map((slug) => {
    let score = 0

    // Exact match
    if (slug === input) score += 100

    // Contains input
    if (slug.includes(input.toLowerCase())) score += 50

    // Input contains slug
    if (input.toLowerCase().includes(slug)) score += 30

    // Count matching words
    const inputWords = input.toLowerCase().split("-")
    const slugWords = slug.split("-")
    const matchingWords = inputWords.filter((word) => slugWords.includes(word))
    score += matchingWords.length * 10

    // Prefer shorter slugs
    score -= slug.length * 0.1

    return { slug, score }
  })

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ slug }) => slug)
}

/**
 * Validate all types of links in a markdown file
 */
function validateLinksInFile(filePath, validSlugs) {
  const content = fs.readFileSync(filePath, "utf-8")
  const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, "/")

  const errors = {
    brokenDocLinks: [],
    legacyFileRefs: [],
    relativeMdLinks: [],
    mdExtensionInDocs: [],
  }

  // 1. Check /docs/ links
  const docLinkRegex = /\[([^\]]+)\]\(\/docs\/([^)]+)\)/g
  let match
  while ((match = docLinkRegex.exec(content)) !== null) {
    const linkText = match[1]
    let slug = match[2]

    // Check for .md extension in /docs/ link
    if (slug.endsWith(".md")) {
      const cleanSlug = slug.replace(/\.md$/, "")
      errors.mdExtensionInDocs.push({
        file: relativePath,
        linkText,
        slug,
        suggestion: `/docs/${cleanSlug}`,
        fullMatch: match[0],
      })
      slug = cleanSlug
    }

    if (!validSlugs.has(slug)) {
      const suggestions = findSimilarSlugs(slug, validSlugs)
      errors.brokenDocLinks.push({
        file: relativePath,
        linkText,
        slug,
        suggestions,
        fullMatch: match[0],
      })
    }
  }

  // 2. Check for legacy filename references
  const legacyFileRegex = /\[([^\]]+)\]\(([A-Z_]+\.md)\)/g
  while ((match = legacyFileRegex.exec(content)) !== null) {
    const linkText = match[1]
    const filename = match[2]
    const mappedSlug = LEGACY_FILE_MAP[filename]

    errors.legacyFileRefs.push({
      file: relativePath,
      linkText,
      filename,
      mappedSlug,
      suggestion: mappedSlug ? `/docs/${mappedSlug}` : null,
      fullMatch: match[0],
    })
  }

  // 3. Check for relative .md links
  const relativeMdRegex = /\[([^\]]+)\]\((\.\.?\/[^)]+\.md)\)/g
  while ((match = relativeMdRegex.exec(content)) !== null) {
    const linkText = match[1]
    const relPath = match[2]

    errors.relativeMdLinks.push({
      file: relativePath,
      linkText,
      relPath,
      fullMatch: match[0],
    })
  }

  return errors
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Enhanced Documentation Link Validation\n")
  console.log("Building slug index...")
  const validSlugs = buildValidSlugsSet()
  console.log(`✓ Found ${validSlugs.size} valid documentation slugs\n`)

  const allErrors = {
    brokenDocLinks: [],
    legacyFileRefs: [],
    relativeMdLinks: [],
    mdExtensionInDocs: [],
  }

  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.name.endsWith(".md")) {
        const errors = validateLinksInFile(fullPath, validSlugs)

        allErrors.brokenDocLinks.push(...errors.brokenDocLinks)
        allErrors.legacyFileRefs.push(...errors.legacyFileRefs)
        allErrors.relativeMdLinks.push(...errors.relativeMdLinks)
        allErrors.mdExtensionInDocs.push(...errors.mdExtensionInDocs)
      }
    }
  }

  scanDirectory(DOCS_DIR)

  // Report results
  let hasErrors = false

  if (allErrors.brokenDocLinks.length > 0) {
    hasErrors = true
    console.log(
      `❌ Broken /docs/ Links (${allErrors.brokenDocLinks.length}):\n`
    )
    allErrors.brokenDocLinks.forEach(
      ({ file, linkText, slug, suggestions }) => {
        console.log(`  ${file}`)
        console.log(`    Link: "${linkText}" → /docs/${slug}`)
        if (suggestions.length > 0) {
          console.log(
            `    Suggestions: ${suggestions.map((s) => `/docs/${s}`).join(", ")}`
          )
        }
        console.log()
      }
    )
  }

  if (allErrors.legacyFileRefs.length > 0) {
    hasErrors = true
    console.log(
      `⚠️  Legacy File References (${allErrors.legacyFileRefs.length}):\n`
    )
    allErrors.legacyFileRefs.forEach(
      ({ file, linkText, filename, suggestion }) => {
        console.log(`  ${file}`)
        console.log(`    Link: "${linkText}" → ${filename}`)
        if (suggestion) {
          console.log(`    Should be: ${suggestion}`)
        } else {
          console.log(`    ⚠️  No mapping found - file may not exist`)
        }
        console.log()
      }
    )
  }

  if (allErrors.relativeMdLinks.length > 0) {
    hasErrors = true
    console.log(
      `⚠️  Relative .md Links (${allErrors.relativeMdLinks.length}):\n`
    )
    allErrors.relativeMdLinks.forEach(({ file, linkText, relPath }) => {
      console.log(`  ${file}`)
      console.log(`    Link: "${linkText}" → ${relPath}`)
      console.log(`    Note: Should use /docs/slug format`)
      console.log()
    })
  }

  if (allErrors.mdExtensionInDocs.length > 0) {
    hasErrors = true
    console.log(
      `❌ .md Extension in /docs/ Links (${allErrors.mdExtensionInDocs.length}):\n`
    )
    allErrors.mdExtensionInDocs.forEach(
      ({ file, linkText, slug, suggestion }) => {
        console.log(`  ${file}`)
        console.log(`    Link: "${linkText}" → /docs/${slug}`)
        console.log(`    Should be: ${suggestion}`)
        console.log()
      }
    )
  }

  if (!hasErrors) {
    console.log("✅ All documentation links are valid!")
    process.exit(0)
  } else {
    const total =
      allErrors.brokenDocLinks.length +
      allErrors.legacyFileRefs.length +
      allErrors.relativeMdLinks.length +
      allErrors.mdExtensionInDocs.length

    console.log(
      `\n❌ Found ${total} link issues across ${Object.values(allErrors).filter((arr) => arr.length > 0).length} categories`
    )
    console.log(
      "\nRun 'node scripts/migrate-all-links.js' to fix these automatically"
    )
    process.exit(1)
  }
}

main()
