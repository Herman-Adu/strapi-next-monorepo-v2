import { Data } from "@repo/strapi"

import { TestimonialCard } from "@/components/page-builder/molecules/TestimonialCard"

/**
 * StrapiTestimonialCard - Strapi wrapper for TestimonialCard molecule
 *
 * Connects Strapi testimonial-card data to the reusable TestimonialCard component.
 * Supports ratings, author images, and featured testimonials.
 *
 * @example
 * <StrapiTestimonialCard
 *   component={testimonialData}
 *   showRatings={true}
 *   showImages={true}
 * />
 */
export function StrapiTestimonialCard({
  component,
  showRatings = true,
  showImages = true,
  className,
}: {
  readonly component: Data.Component<"molecules.testimonial-card">
  readonly showRatings?: boolean
  readonly showImages?: boolean
  readonly className?: string
}) {
  return (
    <TestimonialCard
      testimonial={component}
      showRatings={showRatings}
      showImages={showImages}
      className={className}
    />
  )
}

StrapiTestimonialCard.displayName = "StrapiTestimonialCard"

export default StrapiTestimonialCard
