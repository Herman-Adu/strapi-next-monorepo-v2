import { Check } from "lucide-react"

const workflowPoints = [
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

export function WorkflowSection() {
  return (
    <section className="relative z-10 py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left column - Text content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">A better workflow</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
              dolor cupiditate blanditiis ratione.
            </p>

            <div className="space-y-6">
              {workflowPoints.map((point, index) => (
                <div key={index} className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">{point.title}</p>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Screenshot/mockup */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8">
              <div className="bg-gray-950 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-sm mb-2">Configuration Panel</div>
                  <div className="text-xs opacity-50">Strapi Admin Interface</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
