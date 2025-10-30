import { Circle } from "lucide-react"

const roadmapItems = [
  {
    title: "Strapi v5 stable upgrade guide",
    description: "Comprehensive guide for upgrading to the stable release of Strapi v5.",
  },
  {
    title: "Preview-mode plugin",
    description: "Advanced preview functionality for content editors to see changes before publishing.",
  },
  {
    title: "Storybook slice library",
    description: "Component library for consistent UI development across projects.",
  },
]

export function RoadmapSection() {
  return (
    <section className="relative z-10 py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Roadmap & Community</h2>
          <p className="text-lg text-muted-foreground text-balance">Where we're headed and how you can contribute.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8 mb-12">
          {roadmapItems.map((item, index) => (
            <div key={index} className="flex gap-4 pb-8 border-b border-border last:border-0">
              <div className="flex-shrink-0 mt-1">
                <Circle className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            ⭐ Stars drive priority. Smash :star: on GitHub if this saves you time.
          </p>
          <p className="text-sm text-muted-foreground">
            Have an edge-case? Open an issue — we respond within 24h on weekdays.
          </p>
        </div>
      </div>
    </section>
  )
}
