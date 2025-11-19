import { Data } from "@repo/strapi"

import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"
import { TestimonialCard } from "@/components/page-builder/molecules/TestimonialCard"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/styles"

export function StrapiTestimonialsSection({
  component,
}: {
  readonly component: Data.Component<"sections.testimonials-section">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  const isMarquee = component.layout === "marquee"
  const columns = component.columns || "3"
  const testimonials = component.testimonials || []

  if (testimonials.length === 0) return null

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

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Parent container with uniform gap controls ALL section spacing */}
      <div className={`@container container flex flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden, gap collapses automatically */}
        {component.badge && <SectionBadge badge={component.badge} />}

        {/* Header - spacing property controls ONLY internal spacing (heading→description) */}
        {component.header && <SectionHeader header={component.header} />}

        {/* Testimonials - Marquee Layout */}
        {isMarquee ? (
          <div>
            <Marquee pauseOnHover className="[--duration:40s]">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  showRatings={component.showRatings ?? true}
                  showImages={component.showImages ?? true}
                  className="w-[400px]"
                />
              ))}
            </Marquee>
          </div>
        ) : (
          /* Grid Layout */
          <div
            className={cn(
              "grid gap-6",
              columns === "2" && "grid-cols-1 @2xl:grid-cols-2",
              columns === "3" && "grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3",
              columns === "4" &&
                "grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4"
            )}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                showRatings={component.showRatings ?? true}
                showImages={component.showImages ?? true}
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

StrapiTestimonialsSection.displayName = "StrapiTestimonialsSection"

export default StrapiTestimonialsSection
