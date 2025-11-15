import { Metadata } from "next"
import Link from "next/link"
import {
  BookOpen,
  Compass,
  FileText,
  Rocket,
  Target,
  Layers,
  Code2,
  Users,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DocsSearch } from "@/components/docs/DocsSearch"

export const metadata: Metadata = {
  title: "Documentation Hub",
  description:
    "Comprehensive documentation for atomic architecture transformation",
}

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 space-y-4">
        <Badge className="mb-2" variant="outline">
          <BookOpen className="mr-1 h-3 w-3" />
          Documentation Hub
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Atomic Architecture Documentation
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Your comprehensive guide to building scalable, maintainable components
          using atomic design principles. Start here to master our development
          methodology.
        </p>

        {/* Search Bar */}
        <div className="pt-4">
          <DocsSearch />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-12 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reading Time</CardDescription>
            <CardTitle className="text-primary text-3xl">2-3 hrs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Full onboarding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Documentation</CardDescription>
            <CardTitle className="text-primary text-3xl">11</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Core documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Journey Duration</CardDescription>
            <CardTitle className="text-primary text-3xl">10 days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Transformation plan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Atomic Levels</CardDescription>
            <CardTitle className="text-primary text-3xl">5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Component hierarchy</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Rocket className="text-primary h-6 w-6" />
          <h2 className="text-3xl font-bold">Getting Started</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/docs/welcome" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Compass className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>00-WELCOME</CardTitle>
                <CardDescription>Journey overview & motivation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Start your transformation journey. Understand the vision,
                  success metrics, and what lies ahead.
                </p>
                <Badge variant="secondary">15 min read</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/ethos" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Target className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>01-ETHOS</CardTitle>
                <CardDescription>Core principles & commitments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  The five pillars that guide every decision. Our non-negotiable
                  philosophy: &ldquo;Prepare well, or be prepared to
                  fail.&rdquo;
                </p>
                <Badge variant="secondary">15 min read</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/atomic-design-primer" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Layers className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>02-ATOMIC-DESIGN-PRIMER</CardTitle>
                <CardDescription>Methodology deep dive</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Master atomic design: atoms, molecules, organisms, sections,
                  and pages. Decision trees and examples.
                </p>
                <Badge variant="secondary">15 min read</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Code2 className="text-primary h-6 w-6" />
          <h2 className="text-3xl font-bold">Architecture & Planning</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/docs/current-state-analysis" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <FileText className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>03-CURRENT-STATE-ANALYSIS</CardTitle>
                <CardDescription>Where we are now</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Honest assessment of current problems, technical debt
                  inventory, and specific issues to address.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">30 min read</Badge>
                  <Badge variant="outline">Critical</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/strategic-plan" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Rocket className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>04-STRATEGIC-PLAN</CardTitle>
                <CardDescription>10-day transformation roadmap</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Day-by-day plan with deliverables, checkpoints, and success
                  metrics. Your blueprint for execution.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">15 min read</Badge>
                  <Badge variant="outline">Essential</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/page-theme-architecture" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Layers className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>05-PAGE-THEME-ARCHITECTURE</CardTitle>
                <CardDescription>Page & theme level system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Campaign theming, seasonal backgrounds, and the extended
                  hierarchy: Global → Page → Sections.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">15 min read</Badge>
                  <Badge variant="outline">New</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/blueprint-template" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Lightbulb className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>Component Blueprints</CardTitle>
                <CardDescription>
                  Pre-implementation analysis system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Systematic breakdown template and Clogzilla hero example.
                  Analyze before you build.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">35 min read</Badge>
                  <Badge variant="outline">Framework</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Execution Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <CheckCircle2 className="text-primary h-6 w-6" />
          <h2 className="text-3xl font-bold">Execution & Reference</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/docs/day-1-checklist" className="group">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <CheckCircle2 className="text-primary h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle>DAY-1-CHECKLIST</CardTitle>
                <CardDescription>Step-by-step Day 1 guide</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Complete audit setup, component inventory, and gap analysis.
                </p>
                <Badge variant="secondary">10 min read</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/component-inventory" className="group">
            <Card className="border-dashed">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <FileText className="text-muted-foreground h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="text-muted-foreground">
                  06-COMPONENT-INVENTORY
                </CardTitle>
                <CardDescription>Create on Day 1</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Living audit of all components with atomic level assignments.
                </p>
                <Badge variant="outline">Coming Soon</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/patterns-library" className="group">
            <Card className="border-dashed">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Code2 className="text-muted-foreground h-8 w-8" />
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="text-muted-foreground">
                  08-PATTERNS-LIBRARY
                </CardTitle>
                <CardDescription>Create on Day 8</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">
                  Reusable solutions catalog and best practices.
                </p>
                <Badge variant="outline">Coming Soon</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Future Considerations */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Users className="text-primary h-6 w-6" />
          <h2 className="text-3xl font-bold">Future Considerations</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-dashed">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <Users className="text-muted-foreground h-8 w-8" />
                <Badge variant="outline">Planned</Badge>
              </div>
              <CardTitle className="text-muted-foreground">
                Content Manager Onboarding
              </CardTitle>
              <CardDescription>Interactive component gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Visual examples, design settings showcase, and best practices
                for content managers building pages in Strapi.
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <Lightbulb className="text-muted-foreground h-8 w-8" />
                <Badge variant="outline">Planned</Badge>
              </div>
              <CardTitle className="text-muted-foreground">
                Component Playground
              </CardTitle>
              <CardDescription>Live component testing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Interactive playground to test component settings, preview
                designs, and experiment with configurations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl">Ready to Begin?</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Start with the Welcome document to understand the journey ahead.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="text-primary bg-white hover:bg-white/90"
            asChild
          >
            <Link href="/docs/welcome">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Reading
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/docs/index">
              <FileText className="mr-2 h-5 w-5" />
              Full Index
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Commitment Footer */}
      <div className="border-border/50 bg-muted/50 mt-12 rounded-lg border p-6 text-center">
        <p className="text-foreground mb-2 text-xl font-semibold">
          &ldquo;Prepare well, or be prepared to fail.&rdquo;
        </p>
        <p className="text-muted-foreground">
          We&apos;re preparing well. Let&apos;s succeed together. 🚀
        </p>
      </div>
    </div>
  )
}
