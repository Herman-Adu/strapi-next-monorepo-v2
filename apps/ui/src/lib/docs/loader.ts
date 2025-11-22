import fs from "fs"
import path from "path"
import type {
  DocMetadata,
  DocContent,
  DocCategory,
  CategoryInfo,
} from "./types"

export { DOC_CATEGORIES } from "./types"
export type { DocMetadata, DocContent, DocCategory, CategoryInfo }

// Path to docs directory (relative to monorepo root)
// process.cwd() is apps/ui, so we go up 2 levels to monorepo root
const DOCS_ROOT = "docs"
const DOCS_DIR = path.join(process.cwd(), "..", "..", DOCS_ROOT)

/**
 * Comprehensive documentation map organized by folder
 * Maps relative file paths from docs/ root to metadata
 */
export const DOC_METADATA_MAP: Record<string, Omit<DocMetadata, "slug">> = {
  // 00 - START HERE & Main Docs
  "00-START-HERE.md": {
    title: "Documentation Navigation",
    description: "Main entry point with role-based navigation",
    category: "getting-started",
    order: 0,
    readTime: "5 min",
    status: "published",
    badge: "Start Here",
    audience: "all",
  },
  "README.md": {
    title: "Documentation Hub",
    description: "Overview of all documentation categories",
    category: "reference",
    order: 0,
    readTime: "10 min",
    status: "published",
    audience: "all",
  },

  // 01 - Getting Started
  "01-getting-started/installation.md": {
    title: "Installation Guide",
    description: "Setup and configuration for local development",
    category: "getting-started",
    order: 1,
    readTime: "15 min",
    status: "published",
    audience: "all",
  },
  "01-getting-started/quick-start.md": {
    title: "Quick Start",
    description: "Fastest path to a working environment",
    category: "getting-started",
    order: 2,
    readTime: "10 min",
    status: "published",
    audience: "all",
  },
  "01-getting-started/project-structure.md": {
    title: "Project Structure",
    description: "Understanding the monorepo organization",
    category: "getting-started",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "01-getting-started/development-environment.md": {
    title: "Development Environment",
    description: "Setting up your dev tools and workflow",
    category: "getting-started",
    order: 4,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },

  // 02 - Architecture (Atomic Design Journey)
  "02-architecture/atomic-design/README.md": {
    title: "Atomic Architecture Guide",
    description: "Complete guide to atomic design transformation",
    category: "architecture",
    order: 0,
    readTime: "10 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
  },
  "02-architecture/atomic-design/00-WELCOME.md": {
    title: "Welcome to Atomic Journey",
    description: "Journey overview and motivation",
    category: "architecture",
    order: 1,
    readTime: "15 min",
    status: "published",
    badge: "Start Here",
    audience: "developer",
  },
  "02-architecture/atomic-design/01-ETHOS.md": {
    title: "Design Ethos",
    description: "Core principles and commitments",
    category: "architecture",
    order: 2,
    readTime: "15 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
  },
  "02-architecture/atomic-design/02-ATOMIC-DESIGN-PRIMER.md": {
    title: "Atomic Design Primer",
    description: "Methodology deep dive and fundamentals",
    category: "architecture",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/atomic-design/03-CURRENT-STATE-ANALYSIS.md": {
    title: "Current State Analysis",
    description: "Codebase assessment and technical debt",
    category: "architecture",
    order: 4,
    readTime: "30 min",
    status: "published",
    badge: "Critical",
    audience: "developer",
  },
  "02-architecture/atomic-design/04-STRATEGIC-PLAN.md": {
    title: "Strategic Implementation Plan",
    description: "10-day transformation roadmap",
    category: "architecture",
    order: 5,
    readTime: "20 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
  },
  "02-architecture/atomic-design/05-PAGE-THEME-ARCHITECTURE.md": {
    title: "Page & Theme Architecture",
    description: "Theming system and page-level design",
    category: "architecture",
    order: 6,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/atomic-design/05-COMPONENT-INVENTORY.md": {
    title: "Component Inventory",
    description: "Living audit of all components",
    category: "architecture",
    order: 7,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/atomic-design/DAY-1-CHECKLIST.md": {
    title: "Day 1 Checklist",
    description: "Step-by-step implementation guide",
    category: "architecture",
    order: 8,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/atomic-design/component-blueprints/00-BLUEPRINT-TEMPLATE.md":
    {
      title: "Component Blueprint Template",
      description: "Template for analyzing new components",
      category: "architecture",
      order: 9,
      readTime: "15 min",
      status: "published",
      audience: "developer",
    },
  "02-architecture/atomic-design/component-blueprints/01-clogzilla-hero-carousel-blueprint.md":
    {
      title: "Hero Carousel Blueprint",
      description: "Example component breakdown",
      category: "architecture",
      order: 10,
      readTime: "20 min",
      status: "published",
      audience: "developer",
    },

  // 02 - Other Architecture
  "02-architecture/component-architecture.md": {
    title: "Component Architecture",
    description: "Component hierarchy and patterns",
    category: "developer",
    order: 1,
    readTime: "25 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/theme-system.md": {
    title: "Theme System",
    description: "Global theming and customization",
    category: "developer",
    order: 2,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/spacing-architecture.md": {
    title: "Spacing Architecture",
    description: "Spacing system and layout patterns",
    category: "developer",
    order: 3,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },

  // 03 - Strapi
  "03-strapi/integration.md": {
    title: "Strapi Integration",
    description: "Connecting Next.js with Strapi CMS",
    category: "strapi",
    order: 1,
    readTime: "20 min",
    status: "published",
    audience: "all",
  },
  "03-strapi/best-practices.md": {
    title: "Strapi Best Practices",
    description: "Content modeling and workflow patterns",
    category: "strapi",
    order: 2,
    readTime: "25 min",
    status: "published",
    audience: "all",
  },
  "03-strapi/middleware-populate-patterns.md": {
    title: "Middleware & Population Patterns",
    description: "Advanced data fetching techniques",
    category: "strapi",
    order: 3,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "03-strapi/database-backup.md": {
    title: "Database Backup",
    description: "Backup and restore procedures",
    category: "strapi",
    order: 4,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },

  // 04 - Components
  "04-components/workflow.md": {
    title: "Component Workflow",
    description: "Creating and updating components",
    category: "developer",
    order: 4,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "04-components/development-guide.md": {
    title: "Component Development Guide",
    description: "Patterns and best practices",
    category: "developer",
    order: 5,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "04-components/typescript-patterns.md": {
    title: "TypeScript Patterns",
    description: "Type-safe component development",
    category: "developer",
    order: 6,
    readTime: "25 min",
    status: "published",
    badge: "New",
    audience: "developer",
  },
  "04-components/refactoring-playbook.md": {
    title: "Refactoring Playbook",
    description: "Systematic refactoring strategies",
    category: "developer",
    order: 7,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },

  // 05 - Styling
  "05-styling/styling-guide.md": {
    title: "Styling Guide",
    description: "Tailwind CSS and design system",
    category: "developer",
    order: 8,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "05-styling/theme-colors.md": {
    title: "Theme Colors",
    description: "Color system and palettes",
    category: "developer",
    order: 9,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },

  // 06 - Workflows
  "06-workflows/build-commit-push.md": {
    title: "Build → Commit → Push",
    description: "Essential development workflow",
    category: "workflows",
    order: 1,
    readTime: "15 min",
    status: "published",
    badge: "PARAMOUNT",
    audience: "developer",
  },
  "06-workflows/component-deletion.md": {
    title: "Component Deletion",
    description: "Safe component removal process",
    category: "workflows",
    order: 2,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "06-workflows/page-creation.md": {
    title: "Page Creation Workflow",
    description: "Creating new pages in Strapi",
    category: "content-management",
    order: 1,
    readTime: "15 min",
    status: "published",
    audience: "content-manager",
  },

  // 13 - Testing
  "13-testing/README.md": {
    title: "Testing Strategy & Tools",
    description:
      "Comprehensive testing strategy: Storybook, Chromatic, Vitest, Playwright",
    category: "developer",
    order: 10,
    readTime: "45 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
  },
  "13-testing/storybook/integration.md": {
    title: "Storybook Integration",
    description: "Component isolation and visual regression with Atomic Design",
    category: "developer",
    order: 11,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "13-testing/chromatic/setup.md": {
    title: "Chromatic Visual Regression",
    description: "Automated visual testing in CI/CD",
    category: "developer",
    order: 12,
    readTime: "25 min",
    status: "published",
    audience: "developer",
  },

  // 07 - Content Manager - Test Data Library
  "07-content-manager/test-data/README.md": {
    title: "Test Data Library",
    description:
      "Organized test content for all components across 4 business scenarios",
    category: "content-management",
    order: 2,
    readTime: "8 min",
    status: "published",
    badge: "Essential",
    audience: "content-manager",
  },

  // Test Data - Molecules
  "07-content-manager/test-data/molecules/testimonial-card.md": {
    title: "Testimonial Card Test Data",
    description: "Customer testimonials for 4 use cases",
    category: "content-management",
    order: 3,
    readTime: "10 min",
    status: "published",
    audience: "content-manager",
  },
  "07-content-manager/test-data/molecules/feature-card.md": {
    title: "Feature Card Test Data",
    description: "Service/feature highlights for 4 use cases",
    category: "content-management",
    order: 4,
    readTime: "12 min",
    status: "published",
    audience: "content-manager",
  },
  "07-content-manager/test-data/molecules/blog-card.md": {
    title: "Blog Card Test Data",
    description: "Blog post examples for 4 use cases",
    category: "content-management",
    order: 5,
    readTime: "10 min",
    status: "published",
    audience: "content-manager",
  },

  // Test Data - Sections
  "07-content-manager/test-data/sections/benefits.md": {
    title: "Benefits Section Test Data",
    description: "Value proposition content for 4 use cases",
    category: "content-management",
    order: 6,
    readTime: "15 min",
    status: "published",
    audience: "content-manager",
  },
  "07-content-manager/test-data/sections/metrics.md": {
    title: "Metrics Section Test Data",
    description: "Statistics and achievements for 4 use cases",
    category: "content-management",
    order: 7,
    readTime: "10 min",
    status: "published",
    audience: "content-manager",
  },
  "07-content-manager/test-data/sections/tech-stack.md": {
    title: "Tech Stack Section Test Data",
    description: "Technology/partner logos for 4 use cases",
    category: "content-management",
    order: 8,
    readTime: "12 min",
    status: "published",
    audience: "content-manager",
  },
  "07-content-manager/test-data/sections/partners.md": {
    title: "Partners Section Test Data",
    description: "Client/partner showcase for 4 use cases",
    category: "content-management",
    order: 9,
    readTime: "12 min",
    status: "published",
    audience: "content-manager",
  },

  // 09 - Troubleshooting
  "09-troubleshooting/playbook.md": {
    title: "Troubleshooting Playbook",
    description: "Common issues and solutions",
    category: "reference",
    order: 1,
    readTime: "20 min",
    status: "published",
    audience: "all",
  },

  // 10 - Reference
  "10-reference/quick-reference.md": {
    title: "Quick Reference",
    description: "Cheat sheet and common commands",
    category: "reference",
    order: 2,
    readTime: "10 min",
    status: "published",
    audience: "all",
  },
  "10-reference/project-status.md": {
    title: "Project Status",
    description: "Current implementation status",
    category: "reference",
    order: 3,
    readTime: "5 min",
    status: "published",
    audience: "all",
  },

  // 11 - Recovery & Session Reviews
  "11-recovery/SESSION-2025-11-22-REVIEW.md": {
    title: "Session Review: Nov 22, 2025",
    description:
      "Complete review of documentation reorganization, test data architecture, and lessons learned",
    category: "reference",
    order: 4,
    readTime: "30 min",
    status: "published",
    badge: "Session Review",
    audience: "all",
  },
  "11-recovery/RECOVERY-INSTRUCTIONS-2025-11-23.md": {
    title: "Recovery Instructions: Nov 23, 2025",
    description:
      "Start here tomorrow - context restoration, testing workflow, and next steps",
    category: "reference",
    order: 5,
    readTime: "15 min",
    status: "published",
    badge: "Start Here",
    audience: "all",
  },
  "07-content-manager/TEST-DATA-UPDATE.md": {
    title: "Test Data Update Summary",
    description:
      "Overview of test data reorganization with quick links and usage guide",
    category: "content-management",
    order: 10,
    readTime: "10 min",
    status: "published",
    audience: "content-manager",
  },
}

/**
 * Convert relative file path to slug
 * Examples:
 *   "README.md" -> "readme"
 *   "01-getting-started/installation.md" -> "01-getting-started-installation"
 *   "02-architecture/atomic-design/00-WELCOME.md" -> "02-architecture-atomic-design-00-welcome"
 */
export function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/\//g, "-").toLowerCase()
}

/**
 * Get all available documentation files
 */
export function getAllDocs(): DocContent[] {
  const docs: DocContent[] = []

  // Check if docs directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Docs directory not found at: ${DOCS_DIR}`)
    console.error(`Current working directory: ${process.cwd()}`)
    return docs
  }

  // Read all markdown files from the docs directory
  Object.entries(DOC_METADATA_MAP).forEach(([filename, metadata]) => {
    const filePath = path.join(DOCS_DIR, filename)

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8")
      const slug = filenameToSlug(filename)

      docs.push({
        metadata: {
          ...metadata,
          slug,
        },
        content,
        slug,
      })
    } else {
      console.warn(`File not found: ${filePath}`)
    }
  })

  console.log(`Loaded ${docs.length} documentation files`)
  return docs
}

/**
 * Get a specific document by slug
 */
export function getDocBySlug(slug: string): DocContent | null {
  const docs = getAllDocs()
  return docs.find((doc) => doc.slug === slug) || null
}

/**
 * Get all documents in a specific category
 */
export function getDocsByCategory(category: DocCategory): DocContent[] {
  const docs = getAllDocs()
  return docs
    .filter((doc) => doc.metadata.category === category)
    .sort((a, b) => a.metadata.order - b.metadata.order)
}

/**
 * Get document navigation (prev/next)
 */
export function getDocNavigation(slug: string) {
  const docs = getAllDocs()
  const currentIndex = docs.findIndex((doc) => doc.slug === slug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex > 0 ? docs[currentIndex - 1] : null,
    next: currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null,
  }
}

/**
 * Search documents by query
 */
export function searchDocs(query: string): DocContent[] {
  const docs = getAllDocs()
  const lowerQuery = query.toLowerCase()

  return docs.filter(
    (doc) =>
      doc.metadata.title.toLowerCase().includes(lowerQuery) ||
      doc.metadata.description.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery)
  )
}
