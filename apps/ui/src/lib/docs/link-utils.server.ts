/**
 * Server-side Link Utilities
 *
 * This module contains utilities that depend on Node.js modules
 * and should only be used in server-side contexts (scripts, validation, etc.)
 */

import { DOC_METADATA_MAP, filenameToSlug } from "./loader"
import { LEGACY_FILE_MAP } from "./link-utils"

/**
 * Check if a slug exists in the documentation system
 */
export function isValidSlug(slug: string): boolean {
  return Object.keys(DOC_METADATA_MAP).some(
    (filePath) => filenameToSlug(filePath) === slug
  )
}

/**
 * Get all valid slugs (for autocomplete, validation, etc.)
 */
export function getAllValidSlugs(): string[] {
  return Object.keys(DOC_METADATA_MAP).map(filenameToSlug)
}

/**
 * Find the closest matching slug using fuzzy matching
 * Useful for suggesting corrections to broken links
 */
export function findSimilarSlug(input: string): string | null {
  const allSlugs = getAllValidSlugs()

  // Simple fuzzy matching: check if any slug contains the input
  const matches = allSlugs.filter(
    (slug) =>
      slug.includes(input.toLowerCase()) || input.toLowerCase().includes(slug)
  )

  if (matches.length > 0) {
    // Return shortest match (likely most specific)
    return matches.sort((a, b) => a.length - b.length)[0] ?? null
  }

  return null
}

/**
 * Normalize a legacy link with full validation against DOC_METADATA_MAP
 * This version can verify slugs exist - use in server-side code only
 */
export function normalizeLegacyLinkServer(href: string): string {
  // Already correct format
  if (href.startsWith("/docs/") && !href.endsWith(".md")) {
    return href
  }

  // Remove /docs/ prefix if present and has .md
  if (href.startsWith("/docs/") && href.endsWith(".md")) {
    return href.replace(".md", "")
  }

  // Extract filename from relative path
  const filenameMatch = href.match(/([^/]+\.md)$/)
  if (!filenameMatch) {
    return href // Not a .md link
  }

  const filename = filenameMatch[1]
  if (!filename) {
    return href // No filename found
  }

  // Check legacy mapping first
  if (LEGACY_FILE_MAP[filename]) {
    return `/docs/${LEGACY_FILE_MAP[filename]}`
  }

  // Try to find in DOC_METADATA_MAP
  for (const [filePath] of Object.entries(DOC_METADATA_MAP)) {
    if (filePath.endsWith(filename)) {
      const slug = filenameToSlug(filePath)
      return `/docs/${slug}`
    }
  }

  // If relative path, try to construct slug
  if (href.startsWith("./") || href.startsWith("../")) {
    // Remove ./ or ../
    let cleanPath = href.replace(/^(\.\.?\/)+/, "")
    // Remove .md
    cleanPath = cleanPath.replace(/\.md$/, "")
    // Replace / with -
    const slug = cleanPath.replace(/\//g, "-").toLowerCase()

    // Verify this slug exists
    const exists = Object.keys(DOC_METADATA_MAP).some(
      (filePath) => filenameToSlug(filePath) === slug
    )

    if (exists) {
      return `/docs/${slug}`
    }
  }

  // Fallback: return original
  return href
}
