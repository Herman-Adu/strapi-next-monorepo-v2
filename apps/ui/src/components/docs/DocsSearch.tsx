"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SearchResult {
  title: string
  description: string
  category: string
  slug: string
  readTime: string
  badge?: string
}

// Mock search results - in production, this would call searchDocs() from loader
const mockSearch = (query: string): SearchResult[] => {
  if (!query) return []

  const allDocs: SearchResult[] = [
    {
      title: "00-WELCOME",
      description: "Journey overview & motivation",
      category: "getting-started",
      slug: "welcome",
      readTime: "15 min",
      badge: "Start Here",
    },
    {
      title: "01-ETHOS",
      description: "Core principles & commitments",
      category: "getting-started",
      slug: "ethos",
      readTime: "15 min",
      badge: "Essential",
    },
    {
      title: "02-ATOMIC-DESIGN-PRIMER",
      description: "Methodology deep dive",
      category: "getting-started",
      slug: "atomic-design-primer",
      readTime: "15 min",
    },
    {
      title: "03-CURRENT-STATE-ANALYSIS",
      description: "Where we are now",
      category: "architecture",
      slug: "current-state-analysis",
      readTime: "30 min",
      badge: "Critical",
    },
    {
      title: "04-STRATEGIC-PLAN",
      description: "10-day transformation roadmap",
      category: "architecture",
      slug: "strategic-plan",
      readTime: "15 min",
      badge: "Essential",
    },
    {
      title: "05-PAGE-THEME-ARCHITECTURE",
      description: "Page & theme level system",
      category: "architecture",
      slug: "page-theme-architecture",
      readTime: "15 min",
      badge: "New",
    },
    {
      title: "Blueprint Template",
      description: "Component analysis template",
      category: "blueprints",
      slug: "blueprint-template",
      readTime: "20 min",
    },
    {
      title: "Clogzilla Hero Example",
      description: "Complete hero carousel breakdown",
      category: "blueprints",
      slug: "component-blueprints-clogzilla-hero-carousel-blueprint",
      readTime: "15 min",
    },
    {
      title: "DAY-1-CHECKLIST",
      description: "Step-by-step Day 1 guide",
      category: "execution",
      slug: "day-1-checklist",
      readTime: "10 min",
    },
  ]

  const lowerQuery = query.toLowerCase()
  return allDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery)
  )
}

export function DocsSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = mockSearch(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query])

  const handleSelect = (slug: string) => {
    setOpen(false)
    setQuery("")
    router.push(`/docs/${slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-muted-foreground relative w-full justify-start gap-2 pr-12 lg:w-64"
        >
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline">Search documentation...</span>
          <span className="lg:hidden">Search...</span>
          <kbd className="bg-muted pointer-events-none absolute top-1/2 right-2 hidden h-6 -translate-y-1/2 items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium opacity-100 select-none sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Documentation</DialogTitle>
          <DialogDescription>
            Search through all documentation pages
          </DialogDescription>
        </DialogHeader>

        <div className="border-b p-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              ref={inputRef}
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 pl-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4">
          {!query && (
            <div className="text-muted-foreground py-12 text-center text-sm">
              <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>Start typing to search documentation...</p>
              <p className="mt-1 text-xs">
                Try searching for &quot;atomic&quot;, &quot;blueprint&quot;, or
                &quot;day 1&quot;
              </p>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-muted-foreground py-12 text-center text-sm">
              <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No results found for &quot;{query}&quot;</p>
              <p className="mt-1 text-xs">Try a different search term</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground mb-3 text-sm">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              {results.map((result) => (
                <button
                  type="button"
                  key={result.slug}
                  onClick={() => handleSelect(result.slug)}
                  className="hover:bg-muted border-border w-full rounded-lg border p-3 text-left transition-colors"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="text-foreground font-medium">
                      {result.title}
                    </h3>
                    <div className="flex shrink-0 gap-2">
                      {result.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {result.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    {result.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground capitalize">
                      {result.category}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {result.readTime}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
