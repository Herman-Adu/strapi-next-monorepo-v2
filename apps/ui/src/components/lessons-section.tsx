import { Check } from "lucide-react"

const lessons = [
  {
    title: "Schema before screens",
    description:
      "Content model decisions cost 10x to undo later. We prioritize solid data architecture.",
  },
  {
    title: "Editor experience = adoption",
    description:
      "Sane field grouping and naming = less training and higher team adoption.",
  },
  {
    title: "SEO from day one",
    description:
      "Slug rules, structured data, and image CDN wired before launch for better visibility.",
  },
  {
    title: "Single source of truth",
    description:
      "One unified CMS beats five disconnected instances every time for consistency.",
  },
]

export function LessonsSection() {
  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Lessons Baked-in
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            What We Learned the Hard Way (So You Don&apos;t Have To)
          </p>
        </div>

        <div className="mx-auto mb-12 grid max-w-4xl gap-8 md:grid-cols-2">
          {lessons.map((lesson, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Check className="text-primary h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">{lesson.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  {lesson.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground border-border inline-block rounded-full border px-6 py-2 text-sm">
            These guardrails are wired into the template so you don&apos;t step
            on the same rakes.
          </p>
        </div>
      </div>
    </section>
  )
}
