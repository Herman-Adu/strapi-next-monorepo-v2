"use client"

import { useState, useEffect } from "react"
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
  Box,
  Palette,
  Server,
  Wrench,
  History,
  Clipboard,
  TestTube,
  Microscope,
  Briefcase,
  Target,
  GraduationCap,
  Shield,
  Settings,
  Layers,
  Workflow,
  Newspaper,
  FlaskConical,
  Zap,
  Container,
  Calendar,
  AlertTriangle,
  Gauge,
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
  strapi: Database,
  components: Box,
  styling: Palette,
  workflows: Cog,
  "content-management": FileText,
  devops: Server,
  troubleshooting: Wrench,
  reference: BookOpen,
  recovery: History,
  planning: Clipboard,
  testing: TestTube,
  "deep-dives": Microscope,
  "professional-presence": Briefcase,
  "platform-vision": Target,
  "learning-lessons": GraduationCap,
}

// Map subcategory IDs to icons
const subcategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "backup-and-safety": Shield,
  "config-sync": Settings,
  "content-modeling": Database,
  patterns: Layers,
  automation: Settings,
  workflows: Workflow,
  articles: Newspaper,
  e2e: FlaskConical,
  "quick-reference": Zap,
  "strapi-5": GraduationCap,
  docker: Container,
  "content-calendar": Calendar,
  "troubleshooting-lessons": AlertTriangle,
  "learning-history": History,
  performance: Gauge,
  scripts: Code2,
  innovations: Zap,
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

  // All categories closed by default to preserve resources
  const [expandedCategories, setExpandedCategories] = useState<DocCategory[]>(
    []
  )
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>(
    []
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  // Load expansion state from localStorage on mount
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem("docs-expanded-categories")
      const savedSubcategories = localStorage.getItem(
        "docs-expanded-subcategories"
      )

      if (savedCategories) {
        setExpandedCategories(JSON.parse(savedCategories))
      }
      if (savedSubcategories) {
        setExpandedSubcategories(JSON.parse(savedSubcategories))
      }
    } catch (error) {
      // localStorage might be disabled, fail gracefully
      console.warn("Failed to load sidebar state from localStorage:", error)
    }
  }, [])

  // Save expansion state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "docs-expanded-categories",
        JSON.stringify(expandedCategories)
      )
    } catch (error) {
      console.warn("Failed to save categories to localStorage:", error)
    }
  }, [expandedCategories])

  useEffect(() => {
    try {
      localStorage.setItem(
        "docs-expanded-subcategories",
        JSON.stringify(expandedSubcategories)
      )
    } catch (error) {
      console.warn("Failed to save subcategories to localStorage:", error)
    }
  }, [expandedSubcategories])

  // Auto-expand category and subcategory containing active document
  useEffect(() => {
    const activeDoc = allDocs.find((doc) => pathname.includes(doc.slug))
    if (activeDoc) {
      const category = activeDoc.metadata.category as DocCategory
      const subcategory = activeDoc.metadata.subcategory

      // Expand category
      setExpandedCategories((prev) => {
        if (!prev.includes(category)) {
          return [...prev, category]
        }
        return prev
      })

      // Expand subcategory if exists
      if (subcategory) {
        const subcategoryKey = `${category}-${subcategory}`
        setExpandedSubcategories((prev) => {
          if (!prev.includes(subcategoryKey)) {
            return [...prev, subcategoryKey]
          }
          return prev
        })
      }
    }
  }, [pathname, allDocs])

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only activate when sidebar area is focused or no input is focused
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // ArrowLeft: Collapse all
      if (e.key === "ArrowLeft" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setExpandedCategories([])
        setExpandedSubcategories([])
      }

      // ArrowRight: Expand current category
      if (e.key === "ArrowRight" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const activeDoc = allDocs.find((doc) => pathname.includes(doc.slug))
        if (activeDoc) {
          const category = activeDoc.metadata.category as DocCategory
          if (!expandedCategories.includes(category)) {
            setExpandedCategories((prev) => [...prev, category])
          }
        }
      }

      // / : Focus search (future enhancement)
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        // TODO: Focus search input when implemented
        const searchInput = document.querySelector(
          "[data-docs-search]"
        ) as HTMLInputElement
        searchInput?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pathname, allDocs, expandedCategories])

  const toggleCategory = (categoryId: DocCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((s) => s !== subcategoryId)
        : [...prev, subcategoryId]
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
                {(() => {
                  // Group documents by subcategory
                  const docsWithSubcategory = categoryDocs.filter(
                    (doc) => doc.metadata.subcategory
                  )
                  const docsWithoutSubcategory = categoryDocs.filter(
                    (doc) => !doc.metadata.subcategory
                  )

                  // Get unique subcategories
                  const subcategories = Array.from(
                    new Set(
                      docsWithSubcategory.map(
                        (doc) => doc.metadata.subcategory!
                      )
                    )
                  ).sort()

                  return (
                    <>
                      {/* Render docs without subcategory first (top-level) */}
                      {docsWithoutSubcategory.map((doc) => {
                        const active = isActive(doc.slug)
                        const isComingSoon =
                          doc.metadata.status === "coming-soon"
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

                      {/* Render subcategories with collapsible sections */}
                      {subcategories.map((subcategory) => {
                        const subcategoryDocs = docsWithSubcategory
                          .filter(
                            (doc) => doc.metadata.subcategory === subcategory
                          )
                          .sort((a, b) => a.metadata.order - b.metadata.order)

                        const subcategoryKey = `${category.id}-${subcategory}`
                        const isSubExpanded =
                          expandedSubcategories.includes(subcategoryKey)

                        // Format subcategory name for display
                        const subcategoryTitle = subcategory
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")

                        // Get icon for this subcategory
                        const SubcategoryIcon =
                          subcategoryIcons[subcategory] || Layers

                        // Find the README document for this subcategory
                        const readmeDoc = subcategoryDocs.find(
                          (doc) =>
                            doc.slug.toLowerCase().endsWith("-readme") ||
                            doc.metadata.title
                              .toLowerCase()
                              .includes("readme") ||
                            doc.metadata.title
                              .toLowerCase()
                              .includes("overview") ||
                            doc.metadata.title
                              .toLowerCase()
                              .includes("quick start")
                        )

                        return (
                          <div key={subcategoryKey} className="mt-2">
                            <div className="flex items-center gap-1">
                              {readmeDoc ? (
                                <Link
                                  href={`/docs/${readmeDoc.slug}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setMobileOpen(false)
                                  }}
                                  className="text-foreground hover:bg-muted/50 flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors"
                                >
                                  <SubcategoryIcon className="h-3 w-3 flex-shrink-0" />
                                  <span className="flex-1 text-left">
                                    {subcategoryTitle}
                                  </span>
                                  <span className="text-muted-foreground text-xs font-normal">
                                    {subcategoryDocs.length}
                                  </span>
                                </Link>
                              ) : (
                                <div className="text-foreground flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold tracking-wide uppercase">
                                  <SubcategoryIcon className="h-3 w-3 flex-shrink-0" />
                                  <span className="flex-1 text-left">
                                    {subcategoryTitle}
                                  </span>
                                  <span className="text-muted-foreground text-xs font-normal">
                                    {subcategoryDocs.length}
                                  </span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleSubcategory(subcategoryKey)
                                }
                                className="hover:bg-muted/50 rounded-md p-1 transition-colors"
                                aria-label={
                                  isSubExpanded ? "Collapse" : "Expand"
                                }
                              >
                                {isSubExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>
                            </div>

                            {isSubExpanded && (
                              <div className="mt-1 space-y-1 pl-2">
                                {subcategoryDocs.map((doc) => {
                                  const active = isActive(doc.slug)
                                  const isComingSoon =
                                    doc.metadata.status === "coming-soon"
                                  const isDraft =
                                    doc.metadata.status === "draft"

                                  return (
                                    <Link
                                      key={doc.slug}
                                      href={
                                        isComingSoon ? "#" : `/docs/${doc.slug}`
                                      }
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
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {doc.metadata.readTime}
                                        </Badge>
                                        {isDraft && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Draft
                                          </Badge>
                                        )}
                                        {isComingSoon && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
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
                    </>
                  )
                })()}
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
