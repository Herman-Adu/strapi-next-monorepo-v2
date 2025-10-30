import { Circle } from "lucide-react"

const roadmapItems = [
  {
    title: "Strapi v5 stable upgrade guide",
    description:
      "Comprehensive guide for upgrading to the stable release of Strapi v5.",
  },
  {
    title: "Preview-mode plugin",
    description:
      "Advanced preview functionality for content editors to see changes before publishing.",
  },
  {
    title: "Storybook slice library",
    description:
      "Component library for consistent UI development across projects.",
  },
]

export function RoadmapSection() {
  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Roadmap & Community
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            Where we&apos;re headed and how you can contribute.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-2xl space-y-8">
          {roadmapItems.map((item, index) => (
            <div
              key={index}
              className="border-border flex gap-4 border-b pb-8 last:border-0"
            >
              <div className="mt-1 flex-shrink-0">
                <Circle className="text-muted-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            ⭐ Stars drive priority. Smash :star: on GitHub if this saves you
            time.
          </p>
          <p className="text-muted-foreground text-sm">
            Have an edge-case? Open an issue — we respond within 24h on
            weekdays.
          </p>
        </div>
      </div>
    </section>
  )
}
