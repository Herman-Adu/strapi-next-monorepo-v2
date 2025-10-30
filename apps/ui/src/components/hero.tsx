import Link from "next/link"
import { Calendar, Github } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="hero-gradient relative z-10 py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 mb-8 px-4 py-1.5 text-sm"
          >
            Official Strapi Partner
          </Badge>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Strapi + Next.js Starter —<br />
            Production-ready on Day 1
          </h1>

          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg text-balance md:text-xl">
            Real code, real traction. Clone it, run docker compose up, ship
            faster.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-lg px-8 text-base"
              asChild
            >
              <Link
                href="https://github.com/notum-cz/strapi-next-monorepo-starter"
                target="_blank"
              >
                <Github className="mr-2 h-5 w-5" />
                Get the code on GitHub
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-background/50 h-12 rounded-lg px-8 text-base backdrop-blur-sm"
              asChild
            >
              <Link href="https://conf.strapi.io" target="_blank">
                <Calendar className="mr-2 h-5 w-5" />
                Book a 15-min call for StrapiConf 2025
              </Link>
            </Button>
          </div>

          <p className="text-muted-foreground text-sm">
            Built and battle-tested by Notum, Official Strapi Partner
          </p>
        </div>
      </div>
    </section>
  )
}
