import { Data } from "@repo/strapi"

import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiFinalCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.final-cta-section">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  // SPACING ARCHITECTURE - Background padding controls vertical spacing
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
      <div className={`@container container flex flex-col ${sectionGap}`}>
        {component.badge && <SectionBadge badge={component.badge} />}
        {component.header && <SectionHeader header={component.header} />}

        {/* CTA Buttons */}
        {component.ctaButtons && component.ctaButtons.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {component.ctaButtons.map((button, index) => (
              <StrapiIconButton
                key={button.id || index}
                component={button}
                className={`h-12 rounded-lg px-8 text-base ${index === 1 ? "bg-background/50 backdrop-blur-sm" : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

StrapiFinalCTASection.displayName = "StrapiFinalCTASection"

export default StrapiFinalCTASection
