"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Rocket,
  Code2,
  Code,
  Database,
  FileText,
  Cog,
  Menu,
  X,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsSearch } from "@/components/docs/DocsSearch"
import { cn } from "@/lib/styles"
import {
  DOC_CATEGORIES,
  type DocCategory,
  type DocContent,
} from "@/lib/docs/types"

// Map category IDs to icons
const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "getting-started": Rocket,
  architecture: Code2,
  developer: Code,
  strapi: Database,
  "content-management": FileText,
  workflows: Cog,
  reference: BookOpen,
}

// Map audience to icons
const audienceIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  developer: Code,
  "content-manager": FileText,
  admin: User,
  all: BookOpen,
}

interface DocsSidebarClientProps {
  allDocs: DocContent[]
}

export function DocsSidebarClient({ allDocs }: DocsSidebarClientProps) {
  const pathname = usePathname()

  // Expand getting-started and architecture by default
  const [expandedCategories, setExpandedCategories] = useState<DocCategory[]>([
    "getting-started",
    "architecture",
  ])
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCategory = (categoryId: DocCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const isActive = (slug: string) => {
    return pathname.includes(slug)
  }

  const sidebarContent = (
    <nav className="space-y-1">
      {DOC_CATEGORIES.map((category) => {
        const Icon = categoryIcons[category.id] || BookOpen
        const AudienceIcon = audienceIcons[category.audience] || BookOpen
        const isExpanded = expandedCategories.includes(category.id)
        const categoryDocs = allDocs
          .filter((doc) => doc.metadata.category === category.id)
          .sort((a, b) => a.metadata.order - b.metadata.order)

        // Skip empty categories
        if (categoryDocs.length === 0) return null

        return (
          <div key={category.id} className="space-y-1">
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">{category.title}</span>
              <AudienceIcon className="text-muted-foreground h-3 w-3 flex-shrink-0" />
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="border-border ml-4 space-y-1 border-l-2 pl-3">
                {categoryDocs.map((doc) => {
                  const active = isActive(doc.slug)
                  const isComingSoon = doc.metadata.status === "coming-soon"
                  const isDraft = doc.metadata.status === "draft"

                  return (
                    <Link
                      key={doc.slug}
                      href={isComingSoon ? "#" : `/docs/${doc.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-md border-l-4 px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/20 border-primary text-foreground font-semibold shadow-sm"
                          : isComingSoon
                            ? "text-muted-foreground cursor-not-allowed border-transparent opacity-60"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="line-clamp-2 flex-1">
                          {doc.metadata.title}
                        </span>
                        {doc.metadata.badge && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-xs"
                          >
                            {doc.metadata.badge}
                          </Badge>
                        )}
                      </div>
                      <p
                        className={cn(
                          "mt-1 line-clamp-2 text-xs",
                          active
                            ? "text-foreground/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {doc.metadata.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.metadata.readTime}
                        </Badge>
                        {isDraft && (
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        )}
                        {isComingSoon && (
                          <Badge variant="outline" className="text-xs">
                            Soon
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-20 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setMobileOpen(false)
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-background fixed top-0 left-0 z-40 h-screen w-72 overflow-y-auto border-r p-6 pt-24 transition-transform lg:sticky lg:top-0 lg:block lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="text-primary h-5 w-5" />
            Documentation
          </h2>
          <p className="text-muted-foreground text-sm">
            {allDocs.length} documents across {DOC_CATEGORIES.length} categories
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <DocsSearch />
        </div>

        {sidebarContent}

        {/* Quick Links */}
        <div className="border-border mt-8 space-y-3 border-t pt-6">
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <BookOpen className="h-4 w-4" />
            Back to Hub
          </Link>
        </div>
      </aside>
    </>
  )
}
