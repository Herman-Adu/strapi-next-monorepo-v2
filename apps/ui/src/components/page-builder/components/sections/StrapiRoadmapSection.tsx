import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"

export function StrapiRoadmapSection({
  component,
}: {
  readonly component: Data.Component<"sections.roadmap-section">
}) {
  return (
    <section className="relative z-10 py-20 md:py-28 bg-background">
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {component.heading}
          </h2>
          {component.description && (
            <p className="text-lg text-muted-foreground text-balance">{component.description}</p>
          )}
        </div>

        {component.roadmapItems && component.roadmapItems.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-8 mb-12">
            {component.roadmapItems.map((item, index) => (
              <div key={item.id || index} className="pb-8 border-b border-border last:border-0">
                <StrapiListItem component={item} />
              </div>
            ))}
          </div>
        )}

        {component.footerNotes && component.footerNotes.length > 0 && (
          <div className="text-center space-y-4">
            {component.footerNotes.map((note, index) => (
              <p key={note.id || index} className="text-sm text-muted-foreground">
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
