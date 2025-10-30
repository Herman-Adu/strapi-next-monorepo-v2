import { Check } from "lucide-react"

const workflowPoints = [
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

export function WorkflowSection() {
  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          {/* Left column - Text content */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              A better workflow
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
              impedit perferendis suscipit eaque, iste dolor cupiditate
              blanditiis ratione.
            </p>

            <div className="space-y-6">
              {workflowPoints.map((point, index) => (
                <div key={index} className="flex gap-3">
                  <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="mb-1 font-medium">{point.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Screenshot/mockup */}
          <div className="relative">
            <div className="border-border overflow-hidden rounded-2xl border bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
              <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-gray-950 p-6">
                <div className="text-center text-gray-500">
                  <div className="mb-2 text-sm">Configuration Panel</div>
                  <div className="text-xs opacity-50">
                    Strapi Admin Interface
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
