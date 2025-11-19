import { Data } from "@repo/strapi"

import { StrapiFeatureCard } from "@/components/page-builder/components/elements/StrapiFeatureCard"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiBenefitsSection({
  component,
}: {
  readonly component: Data.Component<"sections.benefits-section">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  const benefits = component.benefits || []
  if (benefits.length === 0) return null

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

        {/* Benefits Grid - section-specific content */}
        <div className={`grid gap-6 ${gridColsClass}`}>
          {benefits.map((benefit, index) => (
            <StrapiFeatureCard key={benefit.id || index} component={benefit} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

StrapiBenefitsSection.displayName = "StrapiBenefitsSection"

export default StrapiBenefitsSection
