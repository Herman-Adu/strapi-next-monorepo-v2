import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Calendar } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="relative z-10 py-24 md:py-32 cta-gradient">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">Ready to ship faster?</h2>
          <p className="text-lg text-muted-foreground mb-10 text-balance max-w-2xl mx-auto">
            MIT Licence • Maintained by Notum (official Strapi Partner) • No email wall, clone freely, give feedback.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-base px-8 h-12 rounded-lg" asChild>
              <Link href="https://github.com/notum-cz/strapi-next-monorepo-starter" target="_blank">
                <Github className="mr-2 h-5 w-5" />
                Clone the Starter
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
                Schedule a Call for StrapiConf →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
