import { Check } from "lucide-react"

const lessons = [
  {
    title: "Schema before screens",
    description: "Content model decisions cost 10x to undo later. We prioritize solid data architecture.",
  },
  {
    title: "Editor experience = adoption",
    description: "Sane field grouping and naming = less training and higher team adoption.",
  },
  {
    title: "SEO from day one",
    description: "Slug rules, structured data, and image CDN wired before launch for better visibility.",
  },
  {
    title: "Single source of truth",
    description: "One unified CMS beats five disconnected instances every time for consistency.",
  },
]

export function LessonsSection() {
  return (
    <section className="relative z-10 py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Lessons Baked-in</h2>
          <p className="text-lg text-muted-foreground text-balance">
            What We Learned the Hard Way (So You Don't Have To)
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-12">
          {lessons.map((lesson, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                <p className="text-muted-foreground text-balance leading-relaxed">{lesson.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground border border-border rounded-full px-6 py-2 inline-block">
            These guardrails are wired into the template so you don't step on the same rakes.
          </p>
        </div>
      </div>
    </section>
  )
}
