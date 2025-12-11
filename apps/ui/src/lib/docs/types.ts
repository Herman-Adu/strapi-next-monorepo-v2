// Documentation types and constants (safe for Client Components)

export type DocCategory =
  | "getting-started"
  | "architecture"
  | "strapi"
  | "components"
  | "styling"
  | "workflows"
  | "content-management"
  | "devops"
  | "troubleshooting"
  | "reference"
  | "recovery"
  | "planning"
  | "testing"
  | "deep-dives"
  | "professional-presence"
  | "platform-vision"
  | "learning-lessons"

export type DocAudience = "developer" | "content-manager" | "all" | "admin"

export type DocStatus = "published" | "draft" | "coming-soon"

export interface DocMetadata {
  title: string
  description: string
  category: string
  subcategory?: string
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
    title: "🏗️ Architecture",
    description: "System design, patterns, and architectural decisions",
    icon: "code2",
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
    id: "components",
    title: "🧩 Components",
    description: "Component development, workflow, and patterns",
    icon: "box",
    audience: "developer",
  },
  {
    id: "styling",
    title: "🎨 Styling",
    description: "Tailwind CSS, theme system, and design tokens",
    icon: "palette",
    audience: "developer",
  },
  {
    id: "workflows",
    title: "⚙️ Workflows",
    description: "Development workflows and processes",
    icon: "cog",
    audience: "developer",
  },
  {
    id: "content-management",
    title: "📝 Content Management",
    description: "Guides for content creators and editors",
    icon: "file-text",
    audience: "content-manager",
  },
  {
    id: "devops",
    title: "🚀 DevOps & CI/CD",
    description: "Deployment, infrastructure, and automation",
    icon: "server",
    audience: "developer",
  },
  {
    id: "troubleshooting",
    title: "🔧 Troubleshooting",
    description: "Common issues and solutions",
    icon: "wrench",
    audience: "all",
  },
  {
    id: "reference",
    title: "📚 Reference",
    description: "Quick references and technical documentation",
    icon: "book-open",
    audience: "all",
  },
  {
    id: "recovery",
    title: "💾 Recovery",
    description: "Session recovery and context restoration",
    icon: "history",
    audience: "developer",
  },
  {
    id: "planning",
    title: "📋 Planning",
    description: "Project roadmaps and strategic planning",
    icon: "clipboard",
    audience: "developer",
  },
  {
    id: "testing",
    title: "🧪 Testing",
    description: "Testing strategies, E2E, and visual regression",
    icon: "flask",
    audience: "developer",
  },
  {
    id: "deep-dives",
    title: "🔬 Deep Dives",
    description: "Technical deep dives and transformation journeys",
    icon: "microscope",
    audience: "developer",
  },
  {
    id: "professional-presence",
    title: "💼 Professional Presence",
    description: "Career development and thought leadership",
    icon: "briefcase",
    audience: "all",
  },
  {
    id: "platform-vision",
    title: "🌟 Platform Vision",
    description: "Strategic vision and future roadmap",
    icon: "target",
    audience: "all",
  },
  {
    id: "learning-lessons",
    title: "📖 Learning Lessons",
    description: "Project evolution and troubleshooting insights",
    icon: "graduation-cap",
    audience: "all",
  },
]
