import { BookOpen, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  return (
    <section className="cta-gradient relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 md:grid-cols-2">
            {/* Left column */}
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Subscribe to our newsletter
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Nostrud amet eu ullamco nisi aute in ad minim nostrud
                adipisicing velit quis. Duis tempor incididunt dolore.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="rounded-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  LinkedIn newsletter
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/50 rounded-lg backdrop-blur-sm"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Book a slot
                </Button>
              </div>
            </div>

            {/* Right column - Benefits */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="mb-2 font-semibold">Weekly articles</h3>
                <p className="text-muted-foreground text-sm">
                  Non labore consequat cupidatat laborum magna. Eiusmod non
                  irure cupidatat duis commodo amet.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">No spam</h3>
                <p className="text-muted-foreground text-sm">
                  Officia excepteur ullamco ut sint duis proident non
                  adipiscing. Voluptate incididunt anim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
