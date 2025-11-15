import fs from "fs"
import path from "path"

export interface DocMetadata {
  title: string
  description: string
  category: string
  slug: string
  order: number
  readTime: string
  status?: "published" | "draft" | "coming-soon"
  badge?: string
}

export interface DocContent {
  metadata: DocMetadata
  content: string
  slug: string
}

// Path to docs directory (relative to monorepo root)
// process.cwd() is apps/ui, so we go up 2 levels to monorepo root
const DOCS_DIR = path.join(
  process.cwd(),
  "..",
  "..",
  "docs",
  "atomic-architecture"
)

/**
 * Document categories and their metadata
 */
export const DOC_CATEGORIES = {
  "getting-started": {
    title: "Getting Started",
    description: "Foundation and core principles",
    icon: "Rocket",
  },
  architecture: {
    title: "Architecture & Planning",
    description: "System design and strategy",
    icon: "Code2",
  },
  execution: {
    title: "Execution & Reference",
    description: "Implementation guides",
    icon: "CheckCircle2",
  },
  blueprints: {
    title: "Component Blueprints",
    description: "Pre-implementation analysis",
    icon: "Lightbulb",
  },
  future: {
    title: "Future Considerations",
    description: "Planned features and improvements",
    icon: "Users",
  },
} as const

export type DocCategory = keyof typeof DOC_CATEGORIES

/**
 * Mapping of markdown files to their metadata
 */
export const DOC_METADATA_MAP: Record<string, Omit<DocMetadata, "slug">> = {
  "README.md": {
    title: "Reading Guide",
    description: "How to use the documentation",
    category: "getting-started",
    order: 0,
    readTime: "10 min",
    status: "published",
  },
  "INDEX.md": {
    title: "Full Index",
    description: "Complete documentation index",
    category: "getting-started",
    order: 0.5,
    readTime: "5 min",
    status: "published",
  },
  "00-WELCOME.md": {
    title: "00-WELCOME",
    description: "Journey overview & motivation",
    category: "getting-started",
    order: 1,
    readTime: "15 min",
    status: "published",
    badge: "Start Here",
  },
  "01-ETHOS.md": {
    title: "01-ETHOS",
    description: "Core principles & commitments",
    category: "getting-started",
    order: 2,
    readTime: "15 min",
    status: "published",
    badge: "Essential",
  },
  "02-ATOMIC-DESIGN-PRIMER.md": {
    title: "02-ATOMIC-DESIGN-PRIMER",
    description: "Methodology deep dive",
    category: "getting-started",
    order: 3,
    readTime: "15 min",
    status: "published",
  },
  "03-CURRENT-STATE-ANALYSIS.md": {
    title: "03-CURRENT-STATE-ANALYSIS",
    description: "Where we are now",
    category: "architecture",
    order: 1,
    readTime: "30 min",
    status: "published",
    badge: "Critical",
  },
  "04-STRATEGIC-PLAN.md": {
    title: "04-STRATEGIC-PLAN",
    description: "10-day transformation roadmap",
    category: "architecture",
    order: 2,
    readTime: "15 min",
    status: "published",
    badge: "Essential",
  },
  "05-PAGE-THEME-ARCHITECTURE.md": {
    title: "05-PAGE-THEME-ARCHITECTURE",
    description: "Page & theme level system",
    category: "architecture",
    order: 3,
    readTime: "15 min",
    status: "published",
    badge: "New",
  },
  "DAY-1-CHECKLIST.md": {
    title: "DAY-1-CHECKLIST",
    description: "Step-by-step Day 1 guide",
    category: "execution",
    order: 1,
    readTime: "10 min",
    status: "published",
  },
  "component-blueprints/00-BLUEPRINT-TEMPLATE.md": {
    title: "Blueprint Template",
    description: "Component analysis template",
    category: "blueprints",
    order: 1,
    readTime: "20 min",
    status: "published",
  },
  "component-blueprints/01-clogzilla-hero-carousel-blueprint.md": {
    title: "Clogzilla Hero Example",
    description: "Complete hero carousel breakdown",
    category: "blueprints",
    order: 2,
    readTime: "15 min",
    status: "published",
  },
  "06-COMPONENT-INVENTORY.md": {
    title: "06-COMPONENT-INVENTORY",
    description: "Living component audit",
    category: "execution",
    order: 2,
    readTime: "TBD",
    status: "coming-soon",
  },
  "07-NEWSLETTER-DESIGN.md": {
    title: "07-NEWSLETTER-DESIGN",
    description: "Reference implementation",
    category: "execution",
    order: 3,
    readTime: "TBD",
    status: "coming-soon",
  },
  "08-PATTERNS-LIBRARY.md": {
    title: "08-PATTERNS-LIBRARY",
    description: "Reusable solutions catalog",
    category: "execution",
    order: 4,
    readTime: "TBD",
    status: "coming-soon",
  },
}

/**
 * Convert filename to slug
 */
export function filenameToSlug(filename: string): string {
  return filename
    .replace(".md", "")
    .replace(/\//g, "-")
    .toLowerCase()
    .replace(/^[0-9]+-/, "") // Remove leading numbers like "00-", "01-"
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
