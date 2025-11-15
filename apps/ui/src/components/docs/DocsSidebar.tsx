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
  CheckCircle2,
  Lightbulb,
  Menu,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsSearch } from "@/components/docs/DocsSearch"
import { cn } from "@/lib/styles"

interface DocItem {
  title: string
  slug: string
  description: string
  readTime: string
  status?: "published" | "draft" | "coming-soon"
  badge?: string
}

interface Category {
  title: string
  icon: React.ReactNode
  items: DocItem[]
}

const categories: Category[] = [
  {
    title: "Getting Started",
    icon: <Rocket className="h-5 w-5" />,
    items: [
      {
        title: "Reading Guide",
        slug: "readme",
        description: "How to use the documentation",
        readTime: "10 min",
        status: "published",
      },
      {
        title: "00-WELCOME",
        slug: "welcome",
        description: "Journey overview",
        readTime: "15 min",
        status: "published",
        badge: "Start Here",
      },
      {
        title: "01-ETHOS",
        slug: "ethos",
        description: "Core principles",
        readTime: "15 min",
        status: "published",
        badge: "Essential",
      },
      {
        title: "02-ATOMIC-DESIGN-PRIMER",
        slug: "atomic-design-primer",
        description: "Methodology deep dive",
        readTime: "15 min",
        status: "published",
      },
    ],
  },
  {
    title: "Architecture",
    icon: <Code2 className="h-5 w-5" />,
    items: [
      {
        title: "03-CURRENT-STATE-ANALYSIS",
        slug: "current-state-analysis",
        description: "Where we are now",
        readTime: "30 min",
        status: "published",
        badge: "Critical",
      },
      {
        title: "04-STRATEGIC-PLAN",
        slug: "strategic-plan",
        description: "10-day roadmap",
        readTime: "15 min",
        status: "published",
        badge: "Essential",
      },
      {
        title: "05-PAGE-THEME-ARCHITECTURE",
        slug: "page-theme-architecture",
        description: "Page & theme system",
        readTime: "15 min",
        status: "published",
        badge: "New",
      },
    ],
  },
  {
    title: "Component Blueprints",
    icon: <Lightbulb className="h-5 w-5" />,
    items: [
      {
        title: "Blueprint Template",
        slug: "blueprint-template",
        description: "Analysis template",
        readTime: "20 min",
        status: "published",
      },
      {
        title: "Clogzilla Hero Example",
        slug: "component-blueprints-clogzilla-hero-carousel-blueprint",
        description: "Hero carousel breakdown",
        readTime: "15 min",
        status: "published",
      },
    ],
  },
  {
    title: "Execution",
    icon: <CheckCircle2 className="h-5 w-5" />,
    items: [
      {
        title: "DAY-1-CHECKLIST",
        slug: "day-1-checklist",
        description: "Day 1 guide",
        readTime: "10 min",
        status: "published",
      },
      {
        title: "06-COMPONENT-INVENTORY",
        slug: "component-inventory",
        description: "Component audit",
        readTime: "TBD",
        status: "coming-soon",
      },
      {
        title: "08-PATTERNS-LIBRARY",
        slug: "patterns-library",
        description: "Reusable solutions",
        readTime: "TBD",
        status: "coming-soon",
      },
    ],
  },
  {
    title: "Full Index",
    icon: <BookOpen className="h-5 w-5" />,
    items: [
      {
        title: "Complete Index",
        slug: "index",
        description: "All documentation",
        readTime: "5 min",
        status: "published",
      },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Getting Started",
    "Architecture",
  ])
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const isActive = (slug: string) => {
    return pathname.includes(slug)
  }

  const sidebarContent = (
    <nav className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.includes(category.title)

        return (
          <div key={category.title} className="space-y-1">
            <button
              type="button"
              onClick={() => toggleCategory(category.title)}
              className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {category.icon}
              <span className="flex-1 text-left">{category.title}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {isExpanded && (
              <div className="border-border ml-4 space-y-1 border-l-2 pl-3">
                {category.items.map((item) => {
                  const active = isActive(item.slug)
                  const isComingSoon = item.status === "coming-soon"

                  return (
                    <Link
                      key={item.slug}
                      href={isComingSoon ? "#" : `/docs/${item.slug}`}
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
                      <div className="flex items-center justify-between gap-2">
                        <span className="line-clamp-1">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p
                        className={cn(
                          "mt-1 line-clamp-1 text-xs",
                          active
                            ? "text-foreground/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </p>
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
            Atomic architecture guide
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
