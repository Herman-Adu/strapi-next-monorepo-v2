import Link from "next/link"
import { Calendar, Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="cta-gradient relative z-10 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Ready to ship faster?
          </h2>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg text-balance">
            MIT Licence • Maintained by Notum (official Strapi Partner) • No
            email wall, clone freely, give feedback.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                Clone the Starter
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
                Schedule a Call for StrapiConf →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
