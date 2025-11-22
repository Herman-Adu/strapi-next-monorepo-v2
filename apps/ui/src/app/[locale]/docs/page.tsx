import { Metadata } from "next"
import Link from "next/link"
import {
  BookOpen,
  Rocket,
  Code2,
  Code,
  Database,
  FileText,
  Cog,
  ArrowRight,
  User,
  Users,
  Shield,
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
import { getAllDocs, DOC_CATEGORIES } from "@/lib/docs/loader"

export const metadata: Metadata = {
  title: "Documentation Hub",
  description:
    "Comprehensive documentation for developers, content managers, and administrators",
}

export default function DocsPage() {
  const allDocs = getAllDocs()

  // Get icons for categories
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

  // Get audience icons
  const audienceIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    developer: Code,
    "content-manager": FileText,
    admin: Shield,
    all: Users,
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 space-y-4">
        <Badge className="mb-2" variant="outline">
          <BookOpen className="mr-1 h-3 w-3" />
          Documentation Hub
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Complete Documentation Library
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Everything you need to build, manage, and deploy our monorepo
          platform. Documentation organized by role and domain for easy
          navigation.
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
            <CardDescription>Total Documents</CardDescription>
            <CardTitle className="text-primary text-3xl">
              {allDocs.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Across {DOC_CATEGORIES.length} categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>For Developers</CardDescription>
            <CardTitle className="text-primary text-3xl">
              {
                allDocs.filter((d) => d.metadata.audience === "developer")
                  .length
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Technical guides & architecture
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>For Content Managers</CardDescription>
            <CardTitle className="text-primary text-3xl">
              {
                allDocs.filter((d) => d.metadata.audience === "content-manager")
                  .length
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Workflows & page creation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>For Everyone</CardDescription>
            <CardTitle className="text-primary text-3xl">
              {allDocs.filter((d) => d.metadata.audience === "all").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Getting started & reference
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Categories */}
      {DOC_CATEGORIES.map((category) => {
        const Icon = categoryIcons[category.id] || BookOpen
        const AudienceIcon = audienceIcons[category.audience] || Users
        const categoryDocs = allDocs
          .filter((doc) => doc.metadata.category === category.id)
          .sort((a, b) => a.metadata.order - b.metadata.order)

        if (categoryDocs.length === 0) return null

        return (
          <section key={category.id} className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="text-primary h-6 w-6" />
                <h2 className="text-3xl font-bold">{category.title}</h2>
              </div>
              <Badge variant="outline" className="gap-1">
                <AudienceIcon className="h-3 w-3" />
                {category.audience === "all"
                  ? "Everyone"
                  : category.audience === "content-manager"
                    ? "Content Manager"
                    : "Developer"}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-6">{category.description}</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryDocs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          {doc.metadata.badge && (
                            <Badge className="mb-2" variant="secondary">
                              {doc.metadata.badge}
                            </Badge>
                          )}
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {doc.metadata.title}
                          </CardTitle>
                        </div>
                        <ArrowRight className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                      </div>
                      <CardDescription>
                        {doc.metadata.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{doc.metadata.readTime}</Badge>
                        {doc.metadata.status === "draft" && (
                          <Badge variant="outline">Draft</Badge>
                        )}
                        {doc.metadata.status === "coming-soon" && (
                          <Badge variant="outline">Coming Soon</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      {/* Role-Based Navigation */}
      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Browse by Role</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Code className="text-primary h-6 w-6" />
                <CardTitle>For Developers</CardTitle>
              </div>
              <CardDescription>
                Technical guides, architecture docs, and developer workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {
                  allDocs.filter((d) => d.metadata.audience === "developer")
                    .length
                }{" "}
                documents covering:
              </p>
              <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-sm">
                <li>Atomic design architecture</li>
                <li>Component development</li>
                <li>TypeScript patterns</li>
                <li>Build & deployment workflows</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <FileText className="text-primary h-6 w-6" />
                <CardTitle>For Content Managers</CardTitle>
              </div>
              <CardDescription>
                Page creation, content workflows, and Strapi guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {
                  allDocs.filter(
                    (d) => d.metadata.audience === "content-manager"
                  ).length
                }{" "}
                documents covering:
              </p>
              <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-sm">
                <li>Page creation workflow</li>
                <li>Component usage in Strapi</li>
                <li>Test data guides</li>
                <li>Content best practices</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Users className="text-primary h-6 w-6" />
                <CardTitle>For Everyone</CardTitle>
              </div>
              <CardDescription>
                Getting started guides and reference materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {allDocs.filter((d) => d.metadata.audience === "all").length}{" "}
                documents covering:
              </p>
              <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-sm">
                <li>Installation & quick start</li>
                <li>Strapi integration basics</li>
                <li>Troubleshooting guides</li>
                <li>Quick reference sheets</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Begin with our installation guide or explore the documentation
            library.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="text-primary bg-white hover:bg-white/90"
            asChild
          >
            <Link href="/docs/00-start-here">
              <Rocket className="mr-2 h-5 w-5" />
              Start Here
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/docs/readme">
              <BookOpen className="mr-2 h-5 w-5" />
              Documentation Hub
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
