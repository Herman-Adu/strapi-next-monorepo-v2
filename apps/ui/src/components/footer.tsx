import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Ship Faster?</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
              Clone the repository and start building your next enterprise application today
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="https://github.com/notum-cz/strapi-next-monorepo-starter" target="_blank">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent" asChild>
                <Link href="https://conf.strapi.io" target="_blank">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  See Live Example
                </Link>
              </Button>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                  <span className="font-mono text-xs font-bold text-primary-foreground">N</span>
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
                <Link href="https://conf.strapi.io" target="_blank" className="hover:text-foreground transition-colors">
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
