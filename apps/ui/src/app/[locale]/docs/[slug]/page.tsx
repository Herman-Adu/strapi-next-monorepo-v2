import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react"

import { getDocBySlug, getAllDocs, getDocNavigation } from "@/lib/docs/loader"
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer"
import { DocsSidebar } from "@/components/docs/DocsSidebar"
import { ReadingProgress } from "@/components/docs/ReadingProgress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DocsPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    return {
      title: "Document Not Found",
    }
  }

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
  }
}

export default async function DocPage({ params }: DocsPageProps) {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  const navigation = getDocNavigation(slug)

  return (
    <div className="flex min-h-screen">
      <ReadingProgress />
      <DocsSidebar />

      <main className="flex-1 px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Documentation
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">
              {doc.metadata.title}
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {doc.metadata.badge && (
                <Badge variant="outline">{doc.metadata.badge}</Badge>
              )}
              {doc.metadata.status === "coming-soon" && (
                <Badge variant="secondary">Coming Soon</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {doc.metadata.title}
            </h1>

            <p className="text-muted-foreground text-lg">
              {doc.metadata.description}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{doc.metadata.readTime} read</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="capitalize">{doc.metadata.category}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-12">
            <MarkdownRenderer content={doc.content} />
          </div>

          {/* Navigation */}
          {(navigation.prev || navigation.next) && (
            <div className="border-border mt-12 grid gap-4 border-t pt-8 md:grid-cols-2">
              {navigation.prev ? (
                <Link href={`/docs/${navigation.prev.slug}`}>
                  <Card className="group h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </div>
                      <CardTitle className="group-hover:text-primary text-lg transition-colors">
                        {navigation.prev.metadata.title}
                      </CardTitle>
                      <CardDescription>
                        {navigation.prev.metadata.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <div />
              )}

              {navigation.next ? (
                <Link href={`/docs/${navigation.next.slug}`}>
                  <Card className="group h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="text-muted-foreground mb-2 flex items-center justify-end gap-2 text-sm">
                        <span>Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <CardTitle className="group-hover:text-primary text-lg transition-colors">
                        {navigation.next.metadata.title}
                      </CardTitle>
                      <CardDescription>
                        {navigation.next.metadata.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* Back to Hub */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/docs">
                <BookOpen className="mr-2 h-4 w-4" />
                Back to Documentation Hub
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
