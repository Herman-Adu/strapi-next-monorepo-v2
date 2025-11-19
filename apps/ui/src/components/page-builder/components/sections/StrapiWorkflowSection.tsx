import { Data } from "@repo/strapi"

import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiWorkflowSection({
  component,
}: {
  readonly component: Data.Component<"sections.workflow-section">
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

        {/* Two-column layout: workflow points + image */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Column - Workflow Points */}
          <div>
            {component.workflowPoints &&
              component.workflowPoints.length > 0 && (
                <div className="space-y-6">
                  {component.workflowPoints.map((point, index) => (
                    <StrapiListItem key={point.id || index} component={point} />
                  ))}
                </div>
              )}
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            {component.image?.media ? (
              <StrapiBasicImage
                component={component.image}
                className="rounded-lg shadow-lg"
                forcedSizes={{ height: 400 }}
              />
            ) : (
              <div className="bg-muted flex h-96 w-full items-center justify-center rounded-lg">
                <p className="text-muted-foreground">Screenshot placeholder</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

StrapiWorkflowSection.displayName = "StrapiWorkflowSection"

export default StrapiWorkflowSection
