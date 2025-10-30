import { Button } from "@/components/ui/button"
import { Heart, BookOpen } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="relative z-10 py-20 md:py-28 cta-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left column */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to our newsletter</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt
                dolore.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  LinkedIn newsletter
                </Button>
                <Button size="lg" variant="outline" className="rounded-lg bg-background/50 backdrop-blur-sm">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Book a slot
                </Button>
              </div>
            </div>

            {/* Right column - Benefits */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Weekly articles</h3>
                <p className="text-sm text-muted-foreground">
                  Non labore consequat cupidatat laborum magna. Eiusmod non irure cupidatat duis commodo amet.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">No spam</h3>
                <p className="text-sm text-muted-foreground">
                  Officia excepteur ullamco ut sint duis proident non adipiscing. Voluptate incididunt anim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
