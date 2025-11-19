import { Data } from "@repo/strapi"

import { StrapiFeatureCard } from "@/components/page-builder/components/elements/StrapiFeatureCard"
import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiFeatureGridSection({
  component,
}: {
  readonly component: Data.Component<"sections.feature-grid-section">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  const gridColsClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
    "6": "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  }[component.gridColumns || "3"]

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

        {/* Feature Cards Grid - section-specific content */}
        {component.items && component.items.length > 0 && (
          <div className={`grid gap-6 ${gridColsClass}`}>
            {component.items.map((item, index) => (
              <StrapiFeatureCard key={item.id || index} component={item} />
            ))}
          </div>
        )}

        {/* List Items Grid - section-specific content */}
        {component.listItems && component.listItems.length > 0 && (
          <div
            className={`grid gap-8 ${gridColsClass === "md:grid-cols-3" ? "md:grid-cols-2" : gridColsClass} mx-auto max-w-4xl`}
          >
            {component.listItems.map((item, index) => (
              <StrapiListItem key={item.id || index} component={item} />
            ))}
          </div>
        )}

        {/* Footer Note */}
        {component.footerNote && (
          <div className="text-center">
            <p className="text-muted-foreground border-border inline-block rounded-full border px-6 py-2 text-sm">
              {component.footerNote}
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

StrapiFeatureGridSection.displayName = "StrapiFeatureGridSection"

export default StrapiFeatureGridSection
