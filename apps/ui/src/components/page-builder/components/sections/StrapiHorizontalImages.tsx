import { Data } from "@repo/strapi"

import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"

export function StrapiHorizontalImages({
  component,
}: {
  readonly component: Data.Component<"sections.horizontal-images">
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

  // Horizontal spacing for images
  const imageSpacing = `gap-${component.spacing ?? 4}`

  // Image border radius
  const radiusClass = component.imageRadius
    ? `rounded-${component.imageRadius}`
    : ""

  return (
    <SectionWrapper background={backgroundConfig}>
      <div className={`@container container flex flex-col ${sectionGap}`}>
        {component.badge && <SectionBadge badge={component.badge} />}
        {component.header && <SectionHeader header={component.header} />}

        {/* Horizontal scrolling images */}
        {component.images && component.images.length > 0 && (
          <div className="no-scrollbar flex max-w-full overflow-x-auto">
            <div className={`flex ${imageSpacing}`}>
              {component.images.map((image, index) => (
                <StrapiImageWithLink
                  key={image.id || index}
                  component={image}
                  imageProps={{
                    className: `${radiusClass} ${component.fixedImageHeight || component.fixedImageWidth ? "object-cover" : ""}`,
                    forcedSizes: {
                      width: component.fixedImageWidth,
                      height: component.fixedImageHeight,
                    },
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

StrapiHorizontalImages.displayName = "StrapiHorizontalImages"

export default StrapiHorizontalImages
