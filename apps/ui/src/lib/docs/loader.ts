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
  "00-DOCUMENTATION-LINKING-GUIDE.md": {
    title: "Documentation Linking Guide",
    description: "Essential guide for creating internal documentation links",
    category: "reference",
    order: 0,
    readTime: "10 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
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
    subcategory: "atomic-design",
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
    subcategory: "atomic-design",
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
    subcategory: "atomic-design",
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
    subcategory: "atomic-design",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/atomic-design/03-CURRENT-STATE-ANALYSIS.md": {
    title: "Current State Analysis",
    description: "Codebase assessment and technical debt",
    category: "architecture",
    subcategory: "atomic-design",
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
    subcategory: "atomic-design",
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
    subcategory: "atomic-design",
    order: 6,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/atomic-design/05-COMPONENT-INVENTORY.md": {
    title: "Component Inventory",
    description: "Living audit of all components",
    category: "architecture",
    subcategory: "atomic-design",
    order: 7,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "02-architecture/atomic-design/DAY-1-CHECKLIST.md": {
    title: "Day 1 Checklist",
    description: "Step-by-step implementation guide",
    category: "architecture",
    subcategory: "atomic-design",
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
      subcategory: "atomic-design",
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
      subcategory: "atomic-design",
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
  "03-strapi/README.md": {
    title: "Strapi Overview",
    description: "CMS integration overview and getting started",
    category: "strapi",
    order: 0,
    readTime: "5 min",
    status: "published",
    badge: "Start Here",
    audience: "all",
  },
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

  // 03-strapi/backup-and-safety
  "03-strapi/backup-and-safety/README.md": {
    title: "Backup Quick Start",
    description: "Common backup and restore commands",
    category: "strapi",
    subcategory: "backup-and-safety",
    order: 1,
    readTime: "5 min",
    status: "published",
    badge: "Critical",
    audience: "all",
  },
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
  "03-strapi/backup-and-safety/backup-procedures.md": {
    title: "Backup Procedures",
    description: "Detailed backup and restore workflows",
    category: "strapi",
    subcategory: "backup-and-safety",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "03-strapi/backup-and-safety/investigation-summary.md": {
    title: "Investigation Summary",
    description: "Contact messages backup incident overview",
    category: "strapi",
    subcategory: "backup-and-safety",
    order: 4,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "03-strapi/backup-and-safety/investigation-report.md": {
    title: "Full Investigation Report",
    description: "Detailed technical analysis of backup incident",
    category: "strapi",
    subcategory: "backup-and-safety",
    order: 5,
    readTime: "25 min",
    status: "published",
    audience: "developer",
  },

  // 03-strapi/config-sync
  "03-strapi/config-sync/workflow-definitive.md": {
    title: "Config Sync Workflow",
    description: "Definitive guide to import/export workflows",
    category: "strapi",
    subcategory: "config-sync",
    order: 1,
    readTime: "20 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
  },
  "03-strapi/config-sync/simplified.md": {
    title: "Simplified Config Sync",
    description: "Quick reference for common config sync tasks",
    category: "strapi",
    subcategory: "config-sync",
    order: 2,
    readTime: "10 min",
    status: "published",
    audience: "all",
  },
  "03-strapi/config-sync/field-organization.md": {
    title: "Field Organization",
    description: "Best practices for organizing content type fields",
    category: "strapi",
    subcategory: "config-sync",
    order: 3,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "03-strapi/config-sync/common-mistakes.md": {
    title: "Common Config Sync Mistakes",
    description: "Pitfalls to avoid and troubleshooting guide",
    category: "strapi",
    subcategory: "config-sync",
    order: 4,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },

  // 03-strapi/content-modeling
  "03-strapi/content-modeling/00-CONTENT-MODELING-GUIDE.md": {
    title: "Complete Content Modeling Guide",
    description: "Comprehensive guide to content modeling in Strapi",
    category: "strapi",
    subcategory: "content-modeling",
    order: 1,
    readTime: "45 min",
    status: "published",
    badge: "Essential",
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

  // 04-components/patterns
  "04-components/patterns/gradient-system.md": {
    title: "Gradient Text System",
    description: "Flexible gradient text with direction controls",
    category: "components",
    subcategory: "patterns",
    order: 1,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "04-components/patterns/gradient-text.md": {
    title: "Gradient Text Patterns",
    description: "Advanced gradient text techniques",
    category: "components",
    subcategory: "patterns",
    order: 2,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "04-components/patterns/marquee.md": {
    title: "Marquee Component",
    description: "Scrolling text and content marquee",
    category: "components",
    subcategory: "patterns",
    order: 3,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },
  "04-components/patterns/newsletter.md": {
    title: "Newsletter Component",
    description: "Newsletter subscription patterns",
    category: "components",
    subcategory: "patterns",
    order: 4,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "04-components/patterns/badge-usage.md": {
    title: "Badge Usage Patterns",
    description: "Badge component usage guidelines",
    category: "components",
    subcategory: "patterns",
    order: 5,
    readTime: "8 min",
    status: "published",
    audience: "developer",
  },
  "04-components/patterns/gdpr-checkbox.md": {
    title: "GDPR Checkbox Pattern",
    description: "Privacy consent checkbox implementation",
    category: "components",
    subcategory: "patterns",
    order: 6,
    readTime: "8 min",
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

  // 06-workflows/automation
  "06-workflows/automation/quick-ref.md": {
    title: "Automation Quick Reference",
    description: "One-page cheat sheet for automation commands",
    category: "workflows",
    subcategory: "automation",
    order: 1,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "06-workflows/automation/setup.md": {
    title: "Automation Setup",
    description: "Setting up automation tools and scripts",
    category: "workflows",
    subcategory: "automation",
    order: 2,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "06-workflows/automation/strategy.md": {
    title: "Automation Strategy",
    description: "Comprehensive automation strategy guide",
    category: "workflows",
    subcategory: "automation",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },

  // 13 - Testing
  "13-testing/README.md": {
    title: "Testing Strategy & Tools",
    description:
      "Comprehensive testing strategy: Storybook, Chromatic, Vitest, Playwright",
    category: "testing",
    order: 1,
    readTime: "45 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
  },
  "13-testing/storybook/integration.md": {
    title: "Storybook Integration",
    description: "Component isolation and visual regression with Atomic Design",
    category: "testing",
    order: 2,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "13-testing/chromatic/setup.md": {
    title: "Chromatic Visual Regression",
    description: "Automated visual testing in CI/CD",
    category: "testing",
    order: 3,
    readTime: "25 min",
    status: "published",
    audience: "developer",
  },

  // 13-testing/e2e
  "13-testing/e2e/README.md": {
    title: "E2E Testing Guide",
    description: "Comprehensive guide to end-to-end testing",
    category: "testing",
    subcategory: "e2e",
    order: 1,
    readTime: "10 min",
    status: "published",
    badge: "Start Here",
    audience: "developer",
  },
  "13-testing/e2e/test-data-seeding.md": {
    title: "Test Data Seeding",
    description: "Strategies for test data management",
    category: "testing",
    subcategory: "e2e",
    order: 2,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "13-testing/e2e/strapi-seeding-case-study.md": {
    title: "Strapi Seeding Case Study",
    description: "Real-world test data seeding implementation",
    category: "testing",
    subcategory: "e2e",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },
  "13-testing/e2e/CONTACT_FORM_TEST_PLAN.md": {
    title: "Contact Form Test Plan",
    description: "Comprehensive contact form testing strategy",
    category: "testing",
    subcategory: "e2e",
    order: 4,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },
  "13-testing/e2e/TROUBLESHOOTING.md": {
    title: "E2E Testing Troubleshooting",
    description: "Common issues and solutions",
    category: "testing",
    subcategory: "e2e",
    order: 5,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },

  // 13-testing/quick-reference
  "13-testing/quick-reference/e2e-quick-start.md": {
    title: "E2E Quick Start",
    description: "Fast track to E2E testing",
    category: "testing",
    subcategory: "quick-reference",
    order: 1,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "13-testing/quick-reference/e2e-patterns-quick-ref.md": {
    title: "E2E Patterns Reference",
    description: "Common E2E testing patterns",
    category: "testing",
    subcategory: "quick-reference",
    order: 2,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },
  "13-testing/quick-reference/cicd-cheat-sheet.md": {
    title: "CI/CD Cheat Sheet",
    description: "Quick reference for CI/CD commands",
    category: "testing",
    subcategory: "quick-reference",
    order: 3,
    readTime: "8 min",
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

  // 04 - Components (see patterns/ subfolder)

  // 05 - Styling

  // 08 - DevOps
  "08-devops/ci-cd-e2e-testing.md": {
    title: "E2E Testing in CI/CD",
    description: "Automated end-to-end testing pipeline",
    category: "devops",
    order: 2,
    readTime: "25 min",
    status: "published",
    audience: "developer",
  },

  // 08-devops/workflows
  "08-devops/workflows/README.md": {
    title: "DevOps Workflows Overview",
    description: "Complete guide to CI/CD and automation workflows",
    category: "devops",
    subcategory: "workflows",
    order: 1,
    readTime: "10 min",
    status: "published",
    badge: "Start Here",
    audience: "developer",
  },
  "08-devops/workflows/01-ci-workflow.md": {
    title: "CI Workflow",
    description: "Continuous integration pipeline setup",
    category: "devops",
    subcategory: "workflows",
    order: 2,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "08-devops/workflows/02-e2e-workflow.md": {
    title: "E2E Testing Workflow",
    description: "End-to-end testing automation",
    category: "devops",
    subcategory: "workflows",
    order: 3,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },
  "08-devops/workflows/03-lighthouse-workflow.md": {
    title: "Lighthouse CI Workflow",
    description: "Performance testing automation",
    category: "devops",
    subcategory: "workflows",
    order: 4,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "08-devops/workflows/04-visual-regression-workflow.md": {
    title: "Visual Regression Workflow",
    description: "Automated UI testing pipeline",
    category: "devops",
    subcategory: "workflows",
    order: 5,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },
  "08-devops/workflows/05-cache-cleanup-workflow.md": {
    title: "Cache Cleanup Workflow",
    description: "Automated cache management",
    category: "devops",
    subcategory: "workflows",
    order: 6,
    readTime: "8 min",
    status: "published",
    audience: "developer",
  },
  "08-devops/workflows/06-database-backup-workflow.md": {
    title: "Database Backup Workflow",
    description: "Automated database backup procedures",
    category: "devops",
    subcategory: "workflows",
    order: 7,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },

  // 08-devops/performance
  "08-devops/performance/optimization.md": {
    title: "Performance Optimization",
    description: "Application performance optimization techniques",
    category: "devops",
    subcategory: "performance",
    order: 1,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },

  // 09 - Troubleshooting
  "09-troubleshooting/cross-platform-compatibility.md": {
    title: "Cross-Platform Compatibility",
    description: "Windows/Linux compatibility and debugging",
    category: "troubleshooting",
    order: 1,
    readTime: "20 min",
    status: "published",
    audience: "all",
  },
  "09-troubleshooting/backend-health-check.md": {
    title: "Backend Health Check",
    description: "Verifying Strapi backend status",
    category: "troubleshooting",
    order: 2,
    readTime: "10 min",
    status: "published",
    audience: "all",
  },

  // 11 - Recovery (Update existing entries)
  "11-recovery/SESSION-2025-11-22-REVIEW.md": {
    title: "Session Review: Nov 22, 2025",
    description:
      "Complete review of documentation reorganization, test data architecture, and lessons learned",
    category: "recovery",
    order: 1,
    readTime: "30 min",
    status: "published",
    badge: "Session Review",
    audience: "all",
  },
  "11-recovery/RECOVERY-INSTRUCTIONS-2025-11-23.md": {
    title: "Recovery Instructions: Nov 23, 2025",
    description:
      "Start here tomorrow - context restoration, testing workflow, and next steps",
    category: "recovery",
    order: 2,
    readTime: "15 min",
    status: "published",
    badge: "Start Here",
    audience: "all",
  },

  // 12 - Planning (see articles/ subfolder)

  // 12-planning/articles
  "12-planning/articles/README.md": {
    title: "Technical Articles",
    description: "Collection of technical writing and case studies",
    category: "planning",
    subcategory: "articles",
    order: 1,
    readTime: "5 min",
    status: "published",
    audience: "all",
  },
  "12-planning/articles/orchestrated-dev-15sec.md": {
    title: "Orchestrated Development Environment",
    description: "8x faster dev startup through process orchestration",
    category: "planning",
    subcategory: "articles",
    order: 2,
    readTime: "12 min",
    status: "published",
    badge: "Featured",
    audience: "all",
  },
  "12-planning/articles/hybrid-seeding-60x.md": {
    title: "Hybrid Seeding Strategy",
    description: "60x faster database seeding with smart caching",
    category: "planning",
    subcategory: "articles",
    order: 3,
    readTime: "10 min",
    status: "published",
    badge: "Featured",
    audience: "developer",
  },
  "12-planning/articles/visual-regression-chromatic.md": {
    title: "Visual Regression Testing",
    description: "Automated UI testing with Chromatic",
    category: "planning",
    subcategory: "articles",
    order: 4,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },
  "12-planning/articles/enterprise-cicd-solo.md": {
    title: "Enterprise CI/CD Solo",
    description: "Building production CI/CD as solo developer",
    category: "planning",
    subcategory: "articles",
    order: 5,
    readTime: "15 min",
    status: "published",
    audience: "developer",
  },
  "12-planning/articles/performance-budgets-scale.md": {
    title: "Performance Budgets at Scale",
    description: "Maintaining performance across large applications",
    category: "planning",
    subcategory: "articles",
    order: 6,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "12-planning/articles/cross-platform-universal.md": {
    title: "Cross-Platform Universal Code",
    description: "Writing code that runs everywhere",
    category: "planning",
    subcategory: "articles",
    order: 7,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },

  // 14 - Deep Dives
  "14-deep-dives/05-TRANSFORMATION-JOURNEY.md": {
    title: "Transformation Journey",
    description: "Technical deep dive into project evolution",
    category: "deep-dives",
    order: 1,
    readTime: "45 min",
    status: "published",
    badge: "Deep Dive",
    audience: "developer",
  },
  "14-deep-dives/06-PRE-COMMIT-CHECKLIST.md": {
    title: "Pre-Commit Checklist",
    description: "Essential checks before committing code",
    category: "deep-dives",
    order: 2,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },
  "14-deep-dives/07-GIT-WORKFLOW.md": {
    title: "Git Workflow",
    description: "Branch strategy and commit conventions",
    category: "deep-dives",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
  },

  // 14-deep-dives/strapi-5
  "14-deep-dives/strapi-5/01-BEGINNER.md": {
    title: "Strapi 5 Beginner Guide",
    description: "Getting started with Strapi 5",
    category: "deep-dives",
    subcategory: "strapi-5",
    order: 1,
    readTime: "20 min",
    status: "published",
    badge: "Start Here",
    audience: "all",
  },
  "14-deep-dives/strapi-5/02-INTERMEDIATE.md": {
    title: "Strapi 5 Intermediate",
    description: "Advanced Strapi 5 concepts",
    category: "deep-dives",
    subcategory: "strapi-5",
    order: 2,
    readTime: "25 min",
    status: "published",
    audience: "developer",
  },
  "14-deep-dives/strapi-5/03-ADVANCED.md": {
    title: "Strapi 5 Advanced",
    description: "Expert-level Strapi 5 techniques",
    category: "deep-dives",
    subcategory: "strapi-5",
    order: 3,
    readTime: "30 min",
    status: "published",
    audience: "developer",
  },
  "14-deep-dives/strapi-5/04-BEST-PRACTICES.md": {
    title: "Strapi 5 Best Practices",
    description: "Production-ready Strapi 5 patterns",
    category: "deep-dives",
    subcategory: "strapi-5",
    order: 4,
    readTime: "25 min",
    status: "published",
    badge: "Essential",
    audience: "developer",
  },

  // 14-deep-dives/docker
  "14-deep-dives/docker/01-FUNDAMENTALS.md": {
    title: "Docker Fundamentals",
    description: "Docker basics and core concepts",
    category: "deep-dives",
    subcategory: "docker",
    order: 1,
    readTime: "20 min",
    status: "published",
    badge: "Start Here",
    audience: "developer",
  },
  "14-deep-dives/docker/02-PRODUCTION.md": {
    title: "Docker in Production",
    description: "Production Docker deployments",
    category: "deep-dives",
    subcategory: "docker",
    order: 2,
    readTime: "25 min",
    status: "published",
    audience: "developer",
  },

  // 15 - Professional Presence
  "15-professional-presence/CTO-POSITIONING-STRATEGY.md": {
    title: "CTO Positioning Strategy",
    description: "Building technical leadership presence",
    category: "professional-presence",
    order: 1,
    readTime: "30 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/LINKEDIN-CONTENT-CALENDAR.md": {
    title: "LinkedIn Content Calendar",
    description: "Strategic content planning for thought leadership",
    category: "professional-presence",
    order: 2,
    readTime: "20 min",
    status: "published",
    audience: "all",
  },

  // 15-professional-presence/content-calendar
  "15-professional-presence/content-calendar/MASTER-CONTENT-INDEX.md": {
    title: "Master Content Index",
    description: "Complete content calendar overview",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 1,
    readTime: "10 min",
    status: "published",
    badge: "Start Here",
    audience: "all",
  },
  "15-professional-presence/content-calendar/SCHEDULING-WORKFLOW.md": {
    title: "Content Scheduling Workflow",
    description: "Efficient content planning and scheduling",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 2,
    readTime: "15 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/content-calendar/TWITTER-THREADS-PART-1.md": {
    title: "Twitter Threads Part 1",
    description: "Technical Twitter thread content",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 3,
    readTime: "12 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/content-calendar/TWITTER-THREADS-PART-2.md": {
    title: "Twitter Threads Part 2",
    description: "More technical Twitter content",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 4,
    readTime: "12 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/content-calendar/TWITTER-THREADS-PART-3.md": {
    title: "Twitter Threads Part 3",
    description: "Advanced Twitter thread strategies",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 5,
    readTime: "12 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/content-calendar/WEEK-3-LINKEDIN.md": {
    title: "Week 3 LinkedIn Content",
    description: "LinkedIn posts for week 3",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 6,
    readTime: "10 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/content-calendar/WEEK-4-LINKEDIN.md": {
    title: "Week 4 LinkedIn Content",
    description: "LinkedIn posts for week 4",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 7,
    readTime: "10 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/content-calendar/FINAL-DAYS-21-30.md": {
    title: "Final Days 21-30",
    description: "Final push content strategy",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 8,
    readTime: "15 min",
    status: "published",
    audience: "all",
  },
  "15-professional-presence/content-calendar/DAYS-28-30-FINALE.md": {
    title: "Days 28-30 Finale",
    description: "Campaign finale content",
    category: "professional-presence",
    subcategory: "content-calendar",
    order: 9,
    readTime: "12 min",
    status: "published",
    audience: "all",
  },

  // 16 - Platform Vision
  "16-platform-vision/README.md": {
    title: "Platform Vision Overview",
    description: "Strategic vision and business impact",
    category: "platform-vision",
    order: 1,
    readTime: "15 min",
    status: "published",
    badge: "Vision",
    audience: "all",
  },
  "16-platform-vision/01-PLATFORM-VISION.md": {
    title: "Platform Vision Document",
    description: "Comprehensive platform vision and strategy",
    category: "platform-vision",
    order: 2,
    readTime: "45 min",
    status: "published",
    badge: "Strategic",
    audience: "all",
  },
  "16-platform-vision/02-FUTURE-CONSIDERATIONS.md": {
    title: "Future Considerations",
    description: "Roadmap and future enhancements",
    category: "platform-vision",
    order: 3,
    readTime: "30 min",
    status: "published",
    audience: "all",
  },

  // 17 - Learning Lessons
  "17-learning-lessons/README.md": {
    title: "Learning Lessons Overview",
    description: "Project evolution and troubleshooting insights",
    category: "learning-lessons",
    order: 1,
    readTime: "10 min",
    status: "published",
    badge: "Learning",
    audience: "all",
  },
  "17-learning-lessons/troubleshooting-lessons/prettier-import-sorting.md": {
    title: "Prettier Import Sorting",
    description: "Fixing import sorting issues",
    category: "learning-lessons",
    subcategory: "troubleshooting-lessons",
    order: 1,
    readTime: "8 min",
    status: "published",
    audience: "developer",
  },
  "17-learning-lessons/troubleshooting-lessons/fix-newsletter-fields.md": {
    title: "Newsletter Field Fixes",
    description: "Troubleshooting newsletter form fields",
    category: "learning-lessons",
    subcategory: "troubleshooting-lessons",
    order: 2,
    readTime: "10 min",
    status: "published",
    audience: "developer",
  },

  // 17-learning-lessons/learning-history
  "17-learning-lessons/learning-history/documentation-summary.md": {
    title: "Documentation Summary",
    description: "Documentation evolution and lessons",
    category: "learning-lessons",
    subcategory: "learning-history",
    order: 1,
    readTime: "15 min",
    status: "published",
    audience: "all",
  },
  "17-learning-lessons/learning-history/refactor-summary.md": {
    title: "Refactor Summary",
    description: "Major refactoring learnings",
    category: "learning-lessons",
    subcategory: "learning-history",
    order: 2,
    readTime: "12 min",
    status: "published",
    audience: "developer",
  },
  "17-learning-lessons/learning-history/audit-consolidation.md": {
    title: "Audit Consolidation",
    description: "Codebase audit findings and actions",
    category: "learning-lessons",
    subcategory: "learning-history",
    order: 3,
    readTime: "20 min",
    status: "published",
    audience: "developer",
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

/**
 * Get document slug by file path
 * Useful for generating links to specific documents from their file paths
 *
 * @param filePath - Relative path from docs/ folder (e.g., "03-strapi/backup-and-safety/README.md")
 * @returns The generated slug or null if document not found
 *
 * @example
 * getDocumentSlugByPath("03-strapi/backup-and-safety/README.md")
 * // returns "03-strapi-backup-and-safety-readme"
 */
export function getDocumentSlugByPath(filePath: string): string | null {
  // Check if this path exists in our metadata map
  if (DOC_METADATA_MAP[filePath]) {
    return filenameToSlug(filePath)
  }
  return null
}

/**
 * Get document by category and subcategory
 * Useful for finding README or overview documents for subfolder navigation
 *
 * @param category - The category ID
 * @param subcategory - The subcategory name
 * @param preferredTitles - Array of title patterns to prioritize (e.g., ["readme", "overview", "quick start"])
 * @returns The best matching document or null
 */
export function getDocByCategoryAndSubcategory(
  category: DocCategory,
  subcategory: string,
  preferredTitles: string[] = ["readme", "overview", "quick start", "guide"]
): DocContent | null {
  const docs = getAllDocs()

  // Filter documents by category and subcategory
  const matchingDocs = docs.filter(
    (doc) =>
      doc.metadata.category === category &&
      doc.metadata.subcategory === subcategory
  )

  if (matchingDocs.length === 0) {
    return null
  }

  // Try to find a document with preferred title
  for (const preferredTitle of preferredTitles) {
    const match = matchingDocs.find((doc) =>
      doc.metadata.title.toLowerCase().includes(preferredTitle)
    )
    if (match) {
      return match
    }
  }

  // Fallback to first document with lowest order
  return (
    matchingDocs.sort((a, b) => a.metadata.order - b.metadata.order)[0] ?? null
  )
}
