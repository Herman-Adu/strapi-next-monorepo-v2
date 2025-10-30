import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Calendar } from "lucide-react"

export function Hero() {
  return (
    <section className="relative z-10 py-24 md:py-32 lg:py-40 hero-gradient">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-8 text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            Official Strapi Partner
          </Badge>

          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Strapi + Next.js Starter —<br />
            Production-ready on Day 1
          </h1>

          <p className="mb-10 text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Real code, real traction. Clone it, run docker compose up, ship faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-base px-8 h-12 rounded-lg" asChild>
              <Link href="https://github.com/notum-cz/strapi-next-monorepo-starter" target="_blank">
                <Github className="mr-2 h-5 w-5" />
                Get the code on GitHub
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 rounded-lg bg-background/50 backdrop-blur-sm"
              asChild
            >
              <Link href="https://conf.strapi.io" target="_blank">
                <Calendar className="mr-2 h-5 w-5" />
                Book a 15-min call for StrapiConf 2025
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Built and battle-tested by Notum, Official Strapi Partner</p>
        </div>
      </div>
    </section>
  )
}
