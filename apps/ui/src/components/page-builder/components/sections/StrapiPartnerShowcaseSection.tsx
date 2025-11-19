import { Data } from "@repo/strapi"

import { StrapiPartnerCard } from "@/components/page-builder/components/elements/StrapiPartnerCard"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiPartnerShowcaseSection({
  component,
}: {
  readonly component: Data.Component<"sections.partner-showcase-section">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  const partners = component.partners || []
  if (partners.length === 0) return null

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

  const gridColsClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
    "6": "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  }[component.gridColumns || "3"]

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

        {/* Partner Grid - section-specific content */}
        <div className={`grid gap-6 ${gridColsClass}`}>
          {partners.map((partner, index) => (
            <StrapiPartnerCard key={partner.id || index} component={partner} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

StrapiPartnerShowcaseSection.displayName = "StrapiPartnerShowcaseSection"

export default StrapiPartnerShowcaseSection
