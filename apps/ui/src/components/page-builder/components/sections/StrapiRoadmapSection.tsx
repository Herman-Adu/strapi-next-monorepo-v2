import { Data } from "@repo/strapi"

import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiRoadmapSection({
  component,
}: {
  readonly component: Data.Component<"sections.roadmap-section">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  // SPACING ARCHITECTURE (follows SPACING_ARCHITECTURE_GUIDE.md)
  // Background padding controls section-level vertical spacing (Badge → Header → Content)
  const backgroundPadding = backgroundConfig.padding ?? "default"

  const sectionGap = (
    {
      none: "gap-4",
      compact: "gap-8",
      default: "gap-12",
      spacious: "gap-16",
    } as const
  )[backgroundPadding]

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Uniform spacing architecture:
          - Badge→Header gap = Header→Content gap (both controlled by sectionGap from background.padding)
          - SectionHeader just renders content - parent's gap controls all vertical spacing */}
      <div className={`@container container flex flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden */}
        {component.badge && <SectionBadge badge={component.badge} />}

        {/* Header - returns fragment with heading+divider and description as separate children */}
        {component.header && <SectionHeader header={component.header} />}

        {/* Roadmap Items - section-specific content */}
        {component.roadmapItems && component.roadmapItems.length > 0 && (
          <div className="mx-auto max-w-2xl space-y-8">
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

        {/* Footer Notes */}
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
      </div>
    </SectionWrapper>
  )
}

StrapiRoadmapSection.displayName = "StrapiRoadmapSection"

export default StrapiRoadmapSection
