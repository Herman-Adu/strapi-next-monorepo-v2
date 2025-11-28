import { Data } from "@repo/strapi"

import { ContactDetails } from "@/components/page-builder/components/molecules/ContactDetails"
import { ContactFormCard } from "@/components/page-builder/components/molecules/ContactFormCard"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
  TwoColumnLayout,
} from "@/components/page-builder/shared"

/**
 * StrapiContactSection - Server Component
 *
 * @description
 * Contact section with 2-column layout: contact details (left) and form (right).
 * Supports flexible column positioning via detailsPosition prop.
 *
 * @remarks
 * - Server Component (no state, no hooks)
 * - Interactive form isolated in ContactFormCard (Client Component)
 * - Uses TwoColumnLayout helper for reusable column swapping
 * - Follows atomic architecture: Background → Badge → Header → Content
 */
export function StrapiContactSection({
  component,
}: {
  readonly component: Data.Component<"sections.contact-section">
}) {
  // SPACING ARCHITECTURE (see SPACING_ARCHITECTURE_GUIDE.md)
  // Background component controls:
  // 1. Section-level padding (none|compact|default|spacious)
  // 2. Container style (full|boxed|bordered|none)
  // This padding maps to internal section gaps (Badge → Header → Content)
  // Empty object allows SectionWrapper to use all defaults
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  // Map background padding to section gaps
  // Background padding controls section-level vertical spacing (Badge → Header → Content)
  const backgroundPadding = backgroundConfig.padding ?? "default"

  const sectionGap = (
    {
      none: "gap-4",
      compact: "gap-8", // Section separation gap (matches background padding)
      default: "gap-12", // Section separation gap (matches background padding)
      spacious: "gap-16", // Section separation gap (matches background padding)
    } as const
  )[backgroundPadding]

  const contactFormData = component.contactForm
  const contactDetailsData = component.contactDetails
  const detailsPosition = component.detailsPosition || "left"

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Uniform spacing architecture:
          - Badge→Header gap = Header→Content gap (both controlled by sectionGap from background.padding)
          - SectionHeader just renders content - parent's gap controls all vertical spacing */}
      <div className={`flex w-full flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden */}
        <SectionBadge badge={component.badge ?? undefined} />

        {/* Main Section Header - appears above 2-column layout */}
        {component.header && (
          <SectionHeader header={component.header} className="mb-0" />
        )}

        {/* 2-Column Layout with Flexible Direction */}
        {contactDetailsData && (
          <TwoColumnLayout
            position={detailsPosition}
            matchHeights
            leftColumn={<ContactDetails details={contactDetailsData} />}
            rightColumn={<ContactFormCard contactFormData={contactFormData} />}
          />
        )}
      </div>
    </SectionWrapper>
  )
}

StrapiContactSection.displayName = "StrapiContactSection"

export default StrapiContactSection
