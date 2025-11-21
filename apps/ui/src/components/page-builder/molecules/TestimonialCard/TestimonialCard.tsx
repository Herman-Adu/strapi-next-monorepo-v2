import { Data } from "@repo/strapi"
import { Quote, Star } from "lucide-react"

import { cn } from "@/lib/styles"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

/**
 * TestimonialCard - Reusable testimonial card component
 *
 * Displays customer testimonials with optional ratings, author images, and featured badge.
 * Designed to work in both grid and marquee layouts.
 *
 * @example
 * // In a grid layout
 * <TestimonialCard
 *   testimonial={testimonialData}
 *   showRatings={true}
 *   showImages={true}
 * />
 *
 * @example
 * // In a marquee with fixed width
 * <TestimonialCard
 *   testimonial={testimonialData}
 *   showRatings={false}
 *   className="w-[400px]"
 * />
 */

export interface TestimonialCardProps {
  /** Testimonial data from Strapi */
  testimonial: Data.Component<"molecules.testimonial-card">
  /** Whether to show star ratings */
  showRatings?: boolean
  /** Whether to show author images */
  showImages?: boolean
  /** Additional CSS classes */
  className?: string
}

export function TestimonialCard({
  testimonial,
  showRatings = true,
  showImages = true,
  className,
}: Readonly<TestimonialCardProps>) {
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
