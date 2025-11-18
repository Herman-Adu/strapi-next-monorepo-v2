import { Data } from "@repo/strapi"
import { Quote, Star } from "lucide-react"

import { cn } from "@/lib/styles"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { Marquee } from "@/components/ui/marquee"

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

function TestimonialCard({
  testimonial,
  showRatings = true,
  showImages = true,
  className,
}: {
  readonly testimonial: Data.Component<"elements.testimonial-card">
  readonly showRatings?: boolean
  readonly showImages?: boolean
  readonly className?: string
}) {
  return (
    <div
      className={cn(
        "bg-card border-border hover:border-primary/20 group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        testimonial.featured && "pt-12", // Extra top padding when featured badge is present
        className
      )}
    >
      {/* Quote Icon */}
      <div className="text-primary/20 group-hover:text-primary/30 absolute top-4 right-4 transition-colors">
        <Quote className="h-8 w-8" />
      </div>

      {/* Featured Badge */}
      {testimonial.featured && (
        <div className="bg-primary/10 text-primary absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium">
          Featured
        </div>
      )}

      {/* Rating */}
      {showRatings && testimonial.rating && (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < (testimonial.rating ?? 0)
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-card-foreground relative z-10 text-sm leading-relaxed @lg:text-base">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author Info */}
      <div className="mt-auto flex items-center gap-3">
        {/* Author Image */}
        {showImages && testimonial.authorImage && (
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
            <StrapiBasicImage
              component={testimonial.authorImage}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}

        {/* Author Details */}
        <div className="flex flex-col">
          <div className="text-foreground font-medium">
            {testimonial.authorName}
          </div>
          {(testimonial.authorRole || testimonial.authorCompany) && (
            <div className="text-muted-foreground text-sm">
              {testimonial.authorRole}
              {testimonial.authorRole && testimonial.authorCompany && " at "}
              {testimonial.authorCompany}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

StrapiTestimonialsSection.displayName = "StrapiTestimonialsSection"

export default StrapiTestimonialsSection
