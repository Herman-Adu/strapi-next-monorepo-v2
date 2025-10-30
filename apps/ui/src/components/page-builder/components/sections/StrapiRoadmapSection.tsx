import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"

export function StrapiRoadmapSection({
  component,
}: {
  readonly component: Data.Component<"sections.roadmap-section">
}) {
  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            {component.heading}
          </h2>
          {component.description && (
            <p className="text-muted-foreground text-lg text-balance">
              {component.description}
            </p>
          )}
        </div>

        {component.roadmapItems && component.roadmapItems.length > 0 && (
          <div className="mx-auto mb-12 max-w-2xl space-y-8">
            {component.roadmapItems.map((item, index) => (
              <div
                key={item.id || index}
                className="border-border border-b pb-8 last:border-0"
              >
                <StrapiListItem component={item} />
              </div>
            ))}
          </div>
        )}

        {component.footerNotes && component.footerNotes.length > 0 && (
          <div className="space-y-4 text-center">
            {component.footerNotes.map((note, index) => (
              <p
                key={note.id || index}
                className="text-muted-foreground text-sm"
              >
                {note.text}
              </p>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiRoadmapSection.displayName = "StrapiRoadmapSection"

export default StrapiRoadmapSection
