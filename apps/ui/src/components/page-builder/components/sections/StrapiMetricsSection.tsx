import { Data } from "@repo/strapi"

import { StrapiStatCard } from "@/components/page-builder/components/elements/StrapiStatCard"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiMetricsSection({
  component,
}: {
  readonly component: Data.Component<"sections.metrics-section">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  const metrics = component.metrics || []
  const gridColumns = component.gridColumns || "4"

  if (metrics.length === 0) return null

  // SPACING ARCHITECTURE (follows SPACING_ARCHITECTURE_GUIDE.md)
  // Background padding controls section-level gaps (Badge → Header → Content)
  // Header spacing controls ONLY internal spacing (Heading → Description)
  const backgroundPadding = backgroundConfig?.padding ?? "default"

  const sectionGap = {
    none: "gap-4", // 16px - minimal section separation
    compact: "gap-8", // 32px - compact section separation
    default: "gap-12", // 48px - balanced section separation
    spacious: "gap-16", // 64px - generous section separation
  }[backgroundPadding]

  // Grid column configuration
  const gridColsClass =
    {
      "2": "@2xl:grid-cols-2",
      "3": "@2xl:grid-cols-3",
      "4": "@2xl:grid-cols-4",
      "6": "@2xl:grid-cols-6",
    }[gridColumns] || "@2xl:grid-cols-4"

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Parent container with uniform gap controls ALL section spacing */}
      <div className={`@container container flex flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden, gap collapses automatically */}
        {component.badge && <SectionBadge badge={component.badge} />}

        {/* Header - spacing property controls ONLY internal spacing (heading→description) */}
        {component.header && <SectionHeader header={component.header} />}

        {/* Metrics Grid */}
        <div
          className={`grid gap-6 @sm:grid-cols-2 @lg:gap-8 @xl:gap-12 ${gridColsClass}`}
        >
          {metrics.map((metric, index) => (
            <StrapiStatCard key={metric.id || index} component={metric} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

StrapiMetricsSection.displayName = "StrapiMetricsSection"

export default StrapiMetricsSection
