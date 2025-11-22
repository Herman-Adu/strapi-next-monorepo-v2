// Documentation types and constants (safe for Client Components)

export type DocCategory =
  | "getting-started"
  | "architecture"
  | "developer"
  | "strapi"
  | "content-management"
  | "workflows"
  | "reference"

export type DocAudience = "developer" | "content-manager" | "all" | "admin"

export type DocStatus = "published" | "draft" | "coming-soon"

export interface DocMetadata {
  title: string
  description: string
  category: string
  slug: string
  order: number
  readTime: string
  status?: DocStatus
  badge?: string
  audience?: DocAudience
  filePath?: string
}

export interface DocContent {
  metadata: DocMetadata
  content: string
  slug: string
}

export interface CategoryInfo {
  id: DocCategory
  title: string
  description: string
  icon: string
  audience: DocAudience
}

// Category definitions (safe to import in Client Components)
export const DOC_CATEGORIES: CategoryInfo[] = [
  {
    id: "getting-started",
    title: "🚀 Getting Started",
    description: "Quick start guides and setup instructions",
    icon: "rocket",
    audience: "all",
  },
  {
    id: "architecture",
    title: "🏗️ Architecture & Planning",
    description: "System design, patterns, and architectural decisions",
    icon: "code2",
    audience: "developer",
  },
  {
    id: "developer",
    title: "💻 Developer Guides",
    description: "Component development, workflows, and best practices",
    icon: "code",
    audience: "developer",
  },
  {
    id: "strapi",
    title: "📦 Strapi & Backend",
    description: "CMS integration, content types, and backend setup",
    icon: "database",
    audience: "all",
  },
  {
    id: "content-management",
    title: "📝 Content Management",
    description: "Guides for content creators and editors",
    icon: "file-text",
    audience: "content-manager",
  },
  {
    id: "workflows",
    title: "⚙️ Workflows & DevOps",
    description: "CI/CD, deployment, and automation",
    icon: "cog",
    audience: "developer",
  },
  {
    id: "reference",
    title: "📚 Reference",
    description: "Quick references and technical documentation",
    icon: "book-open",
    audience: "all",
  },
]
