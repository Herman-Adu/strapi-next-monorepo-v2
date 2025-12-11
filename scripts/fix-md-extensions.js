#!/usr/bin/env node

/**
 * Fix .md Extensions in Links
 *
 * Removes .md extensions from all internal documentation links.
 * This script specifically targets links that end with .md and converts them
 * to proper slug format or removes them if the file doesn't exist.
 *
 * Usage: node scripts/fix-md-extensions.js
 */

const fs = require("fs")
const path = require("path")

const DOCS_DIR = path.join(__dirname, "..", "docs")

/**
 * Convert file path to slug
 */
function filenameToSlug(filename) {
  return filename.replace(/\.md$/, "").replace(/\//g, "-").toLowerCase()
}

/**
 * Build a set of all valid doc slugs
 */
function buildValidSlugsSet() {
  const slugs = new Set()
  const filePathMap = new Map() // slug -> file path

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
        filePathMap.set(slug, relPath)
      }
    }
  }

  scanDirectory(DOCS_DIR)
  return { slugs, filePathMap }
}

/**
 * Fix .md extensions in a markdown file
 */
function fixMdExtensionsInFile(filePath, validSlugs, filePathMap) {
  const content = fs.readFileSync(filePath, "utf-8")
  const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, "/")

  let modified = false
  let newContent = content

  // Pattern 1: [text](./path/file.md) or [text](../path/file.md)
  const relativeWithMdRegex = /\[([^\]]+)\]\((\.\.?\/[^)]+)\.md\)/g

  newContent = newContent.replace(
    relativeWithMdRegex,
    (match, linkText, linkPath) => {
      // These are file-system relative links - they shouldn't exist
      console.warn(`⚠️  File-system link with .md in ${relativePath}: ${match}`)
      console.warn(
        `   → This link was already supposed to be fixed by fix-doc-links.js`
      )
      return match // Keep as-is, will be caught by validate script
    }
  )

  // Pattern 2: [text](/docs/slug.md) - Links that incorrectly include .md
  const docsLinkWithMdRegex = /\[([^\]]+)\]\((\/docs\/[^)]+)\.md\)/g

  newContent = newContent.replace(
    docsLinkWithMdRegex,
    (match, linkText, linkPath) => {
      modified = true
      // Simply remove the .md extension
      const fixedLink = linkPath // Already has /docs/ prefix
      console.log(`✓ Fixed: ${match} → [${linkText}](${fixedLink})`)
      return `[${linkText}](${fixedLink})`
    }
  )

  if (modified) {
    fs.writeFileSync(filePath, newContent, "utf-8")
    return true
  }

  return false
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Building valid slugs set...\n")
  const { slugs: validSlugs, filePathMap } = buildValidSlugsSet()
  console.log(`✅ Found ${validSlugs.size} valid document slugs\n`)

  console.log("🔧 Fixing .md extensions in documentation links...\n")

  let filesProcessed = 0
  let filesModified = 0

  function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        processDirectory(fullPath)
      } else if (entry.name.endsWith(".md")) {
        filesProcessed++

        if (fixMdExtensionsInFile(fullPath, validSlugs, filePathMap)) {
          filesModified++
          const relativePath = path.relative(DOCS_DIR, fullPath)
          console.log(`✓ Modified: ${relativePath}\n`)
        }
      }
    }
  }

  processDirectory(DOCS_DIR)

  console.log(`\n📊 Summary:`)
  console.log(`   Files processed: ${filesProcessed}`)
  console.log(`   Files modified:  ${filesModified}`)
  console.log(`   Files unchanged: ${filesProcessed - filesModified}`)

  if (filesModified > 0) {
    console.log(`\n✅ Fixed ${filesModified} file(s)!`)
    console.log(`\n💡 Next steps:`)
    console.log(`   1. Run: node scripts/validate-doc-links.js`)
    console.log(`   2. Test links in browser`)
    console.log(`   3. Commit changes\n`)
  } else {
    console.log(`\n✅ No .md extensions found in /docs/ links!\n`)
  }
}

main()
