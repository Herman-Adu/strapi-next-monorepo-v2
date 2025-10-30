import { Check } from "lucide-react"

const benefits = [
  {
    title: "Save 4–6 weeks of boilerplate",
    description: "Skip the yak-shaving and focus on building your unique features.",
  },
  {
    title: "Unify CMS strategy",
    description: "Marketing and engineering work in the same tool for better collaboration.",
  },
  {
    title: "Scale safely",
    description: "Handles 2x traffic spikes without code surgery or emergency fixes.",
  },
  {
    title: "No vendor lock",
    description: "Clean architecture, open standards, MIT licence for complete freedom.",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="relative z-10 py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Why CTOs Clone It</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Strategic advantages that make this starter the choice of technical leaders.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-balance leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
