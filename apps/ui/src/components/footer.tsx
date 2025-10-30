import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-border/50 relative z-10 border-t py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">
              Ready to Ship Faster?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed text-balance">
              Clone the repository and start building your next enterprise
              application today
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 text-base" asChild>
                <Link
                  href="https://github.com/notum-cz/strapi-next-monorepo-starter"
                  target="_blank"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent px-8 text-base"
                asChild
              >
                <Link href="https://conf.strapi.io" target="_blank">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  See Live Example
                </Link>
              </Button>
            </div>
          </div>

          <div className="border-border/50 border-t pt-8">
            <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
              <div className="flex items-center gap-2">
                <div className="bg-primary flex h-6 w-6 items-center justify-center rounded">
                  <span className="text-primary-foreground font-mono text-xs font-bold">
                    N
                  </span>
                </div>
                <span>© 2025 NOTUM Technologies. All rights reserved.</span>
              </div>

              <div className="flex gap-6">
                <Link
                  href="https://github.com/notum-cz/strapi-next-monorepo-starter"
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
                <Link
                  href="https://conf.strapi.io"
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  StrapiConf 2025
                </Link>
                <Link
                  href="https://github.com/notum-cz"
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
