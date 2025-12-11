#!/usr/bin/env node

/**
 * Fix Documentation Links
 *
 * Converts file-system relative links in markdown files to proper Next.js URL-based links.
 *
 * Pattern:
 *   FROM: [Link](./file.md) or [Link](../folder/file.md)
 *   TO:   [Link](/docs/generated-slug)
 *
 * Usage: node scripts/fix-doc-links.js
 */

const fs = require("fs")
const path = require("path")

// Import the DOC_METADATA_MAP to get all registered documents
const DOCS_DIR = path.join(__dirname, "..", "docs")

/**
 * Convert file path to slug (same logic as filenameToSlug in loader.ts)
 */
function filenameToSlug(filename) {
  return filename.replace(/\.md$/, "").replace(/\//g, "-").toLowerCase()
}

/**
 * Build a map of file paths to slugs from the docs directory
 */
function buildFilePathToSlugMap() {
  const map = new Map()

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
        map.set(relPath, slug)
      }
    }
  }

  scanDirectory(DOCS_DIR)
  return map
}

/**
 * Resolve a relative link to an absolute file path
 */
function resolveRelativeLink(currentFilePath, relativeLink) {
  const currentDir = path.dirname(currentFilePath)
  const targetPath = path.join(currentDir, relativeLink)
  const normalized = path.normalize(targetPath)

  // Convert to relative from docs root
  const relative = path.relative(DOCS_DIR, normalized)

  // Normalize path separators to forward slashes
  return relative.replace(/\\/g, "/")
}

/**
 * Fix links in a markdown file
 */
function fixLinksInFile(filePath, filePathToSlugMap) {
  const content = fs.readFileSync(filePath, "utf-8")
  const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, "/")

  let modified = false
  let newContent = content

  // Match markdown links with relative paths
  // Pattern: [text](./path.md) or [text](../path/file.md)
  const linkRegex = /\[([^\]]+)\]\((\.\.?\/[^)]+\.md)\)/g

  newContent = newContent.replace(
    linkRegex,
    (match, linkText, relativeLink) => {
      try {
        // Resolve the relative link to absolute file path
        const targetFilePath = resolveRelativeLink(filePath, relativeLink)

        // Look up the slug
        const slug = filePathToSlugMap.get(targetFilePath)

        if (slug) {
          modified = true
          return `[${linkText}](/docs/${slug})`
        } else {
          console.warn(
            `⚠️  No slug found for: ${targetFilePath} (referenced in ${relativePath})`
          )
          return match // Keep original if not found
        }
      } catch (error) {
        console.error(
          `❌ Error processing link in ${relativePath}: ${error.message}`
        )
        return match
      }
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
  console.log("🔍 Building file path to slug map...\n")
  const filePathToSlugMap = buildFilePathToSlugMap()
  console.log(`✅ Found ${filePathToSlugMap.size} markdown files\n`)

  console.log("🔧 Fixing links in documentation files...\n")

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
        const relativePath = path.relative(DOCS_DIR, fullPath)

        if (fixLinksInFile(fullPath, filePathToSlugMap)) {
          filesModified++
          console.log(`✓ Fixed links in: ${relativePath}`)
        }
      }
    }
  }

  processDirectory(DOCS_DIR)

  console.log(`\n📊 Summary:`)
  console.log(`   Files processed: ${filesProcessed}`)
  console.log(`   Files modified:  ${filesModified}`)
  console.log(`   Files unchanged: ${filesProcessed - filesModified}`)
  console.log(`\n✅ Done!\n`)
}

main()
