/**
 * Documentation Link Utilities
 *
 * Handles legacy link transformations and slug normalization for the documentation system.
 * This module ensures backward compatibility with old link formats while enforcing
 * the new /docs/slug pattern.
 *
 * NOTE: This module is used in client components, so it must not depend on Node.js modules.
 */

/**
 * Legacy filename to slug mapping
 * Maps old root-level filenames to their new organized slugs
 */
export const LEGACY_FILE_MAP: Record<string, string> = {
  // Component Documentation
  "COMPONENT_WORKFLOW.md": "04-components-workflow",
  "COMPONENT_DEVELOPMENT_GUIDE.md": "04-components-development-guide",
  "COMPONENT_INTEGRATION_GUIDE.md": "04-components-integration-guide",
  "COMPONENT_ARCHITECTURE.md": "02-architecture-component-architecture",
  "COMPONENT_FIELD_ORDER_WORKFLOW.md": "06-workflows-field-order-changes",

  // Development & Workflow Guides
  "DEVELOPMENT_GUIDE.md": "01-getting-started-installation",
  "DEVELOPMENT_WORKFLOW.md": "06-workflows-build-commit-push",
  "WORKFLOW_INDEX.md": "06-workflows-build-commit-push",

  // Reference & Quick Guides
  "QUICK_REFERENCE.md": "10-reference-quick-reference",
  "QUICK_START.md": "01-getting-started-quick-start",

  // Styling & Theme
  "STYLING_GUIDE.md": "05-styling-styling-guide",
  "THEME_SYSTEM_GUIDE.md": "02-architecture-theme-system",
  "SHARED_COMPONENT_GUIDE.md": "04-components-shared-component-guide",
  "SPACING_ARCHITECTURE_GUIDE.md": "02-architecture-spacing-architecture",

  // Strapi & Configuration
  "STRAPI_BEST_PRACTICES.md": "03-strapi-best-practices",
  "CONFIG_SYNC_WORKFLOW_DEFINITIVE.md":
    "03-strapi-config-sync-workflow-definitive",
  "POPULATE_PATTERNS_REFERENCE.md": "04-components-development-guide",

  // Automation & DevOps
  "AUTOMATION-STRATEGY.md": "06-workflows-automation-strategy",
  "DATABASE_BACKUP_RESTORE.md": "03-strapi-backup-and-safety-backup-procedures",

  // Troubleshooting & Recovery
  "TROUBLESHOOTING_PLAYBOOK.md": "09-troubleshooting-playbook",

  // Testing & Data
  "TEST_DATA_NEW_COMPONENTS.md": "07-content-manager-test-data-readme",
  "POPULATE_TEST_DATA_GUIDE.md": "07-content-manager-test-data-readme",

  // Project Management
  "PROJECT_STATUS.md": "10-reference-project-status",
  "BEST_PRACTICE_CHECKLIST.md": "10-reference-quick-reference",

  // Page Creation
  "PAGE_CREATION_WORKFLOW.md": "07-content-manager-page-creation",
}

/**
 * Normalize a legacy link to the proper /docs/slug format
 *
 * Handles:
 * - Relative .md links: ./file.md, ../folder/file.md
 * - Legacy filenames: COMPONENT_WORKFLOW.md
 * - Already correct /docs/ links
 *
 * @param href - The original link href
 * @returns Normalized link in /docs/slug format, or original if can't transform
 */
export function normalizeLegacyLink(href: string): string {
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
  if (!filenameMatch || !filenameMatch[1]) {
    return href // Not a .md link
  }

  const filename = filenameMatch[1]

  // Check legacy mapping first
  const mappedSlug = LEGACY_FILE_MAP[filename]
  if (mappedSlug) {
    return `/docs/${mappedSlug}`
  }

  // If relative path, try to construct slug
  if (href.startsWith("./") || href.startsWith("../")) {
    // Remove ./ or ../
    let cleanPath = href.replace(/^(\.\.?\/)+/, "")
    // Remove .md
    cleanPath = cleanPath.replace(/\.md$/, "")
    // Replace / with -
    const slug = cleanPath.replace(/\//g, "-").toLowerCase()
    return `/docs/${slug}`
  }

  // Fallback: return original
  return href
}

/**
 * Extract all links from markdown content
 */
export function extractLinksFromMarkdown(content: string): Array<{
  text: string
  href: string
  fullMatch: string
}> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links: Array<{ text: string; href: string; fullMatch: string }> = []

  let match
  while ((match = linkRegex.exec(content)) !== null) {
    if (match[1] && match[2] && match[0]) {
      links.push({
        text: match[1],
        href: match[2],
        fullMatch: match[0],
      })
    }
  }

  return links
}
