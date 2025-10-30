import { Check } from "lucide-react"

const benefits = [
  {
    title: "Save 4–6 weeks of boilerplate",
    description:
      "Skip the yak-shaving and focus on building your unique features.",
  },
  {
    title: "Unify CMS strategy",
    description:
      "Marketing and engineering work in the same tool for better collaboration.",
  },
  {
    title: "Scale safely",
    description:
      "Handles 2x traffic spikes without code surgery or emergency fixes.",
  },
  {
    title: "No vendor lock",
    description:
      "Clean architecture, open standards, MIT licence for complete freedom.",
  },
]

export function Benefits() {
  return (
    <section
      id="benefits"
      className="bg-background relative z-10 py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Why CTOs Clone It
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            Strategic advantages that make this starter the choice of technical
            leaders.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Check className="text-primary h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
