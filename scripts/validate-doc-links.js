#!/usr/bin/env node

/**
 * Validate Documentation Links
 *
 * Checks all internal documentation links to ensure they point to registered documents.
 * Helps catch broken links before deployment.
 *
 * Usage: node scripts/validate-doc-links.js
 */

const fs = require("fs")
const path = require("path")

const DOCS_DIR = path.join(__dirname, "..", "docs")

/**
 * Convert file path to slug (same logic as filenameToSlug in loader.ts)
 */
function filenameToSlug(filename) {
  return filename.replace(/\.md$/, "").replace(/\//g, "-").toLowerCase()
}

/**
 * Build a set of all valid doc slugs
 */
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
 * Validate links in a markdown file
 */
function validateLinksInFile(filePath, validSlugs) {
  const content = fs.readFileSync(filePath, "utf-8")
  const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, "/")

  const errors = []

  // Match markdown links that look like doc links
  // Pattern: [text](/docs/slug)
  const docLinkRegex = /\[([^\]]+)\]\(\/docs\/([^)]+)\)/g

  let match
  while ((match = docLinkRegex.exec(content)) !== null) {
    const linkText = match[1]
    const slug = match[2]

    if (!validSlugs.has(slug)) {
      errors.push({
        file: relativePath,
        linkText,
        slug,
        fullMatch: match[0],
      })
    }
  }

  return errors
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Building valid slugs set...\n")
  const validSlugs = buildValidSlugsSet()
  console.log(`✅ Found ${validSlugs.size} valid document slugs\n`)

  console.log("🔎 Validating documentation links...\n")

  const allErrors = []

  function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        processDirectory(fullPath)
      } else if (entry.name.endsWith(".md")) {
        const errors = validateLinksInFile(fullPath, validSlugs)
        allErrors.push(...errors)
      }
    }
  }

  processDirectory(DOCS_DIR)

  if (allErrors.length === 0) {
    console.log("✅ All documentation links are valid!\n")
    process.exit(0)
  } else {
    console.log(`❌ Found ${allErrors.length} broken link(s):\n`)

    // Group by file
    const errorsByFile = {}
    for (const error of allErrors) {
      if (!errorsByFile[error.file]) {
        errorsByFile[error.file] = []
      }
      errorsByFile[error.file].push(error)
    }

    for (const [file, errors] of Object.entries(errorsByFile)) {
      console.log(`\n📄 ${file}`)
      for (const error of errors) {
        console.log(`   ❌ [${error.linkText}](/docs/${error.slug})`)
        console.log(`      → Slug "${error.slug}" not found`)
      }
    }

    console.log(`\n\n💡 To fix broken links:`)
    console.log(`   1. Check if the target document exists`)
    console.log(
      `   2. Verify the document is registered in apps/ui/src/lib/docs/loader.ts`
    )
    console.log(
      `   3. Use the correct slug format: remove .md, replace / with -, lowercase\n`
    )

    process.exit(1)
  }
}

main()
