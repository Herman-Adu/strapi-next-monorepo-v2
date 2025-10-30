import Link from "next/link"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-border/50 bg-background/80 relative z-10 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
              <span className="text-primary-foreground font-mono text-sm font-bold">
                N
              </span>
            </div>
            <span className="text-lg font-semibold">NOTUM</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Benefits
            </Link>
            <Link
              href="https://github.com/notum-cz/strapi-next-monorepo-starter"
              target="_blank"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href="https://github.com/notum-cz/strapi-next-monorepo-starter"
                target="_blank"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
