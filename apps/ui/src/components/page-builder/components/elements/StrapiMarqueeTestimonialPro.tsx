import { Data } from "@repo/strapi"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

export function StrapiMarqueeTestimonialPro({
  component,
  isVertical = false,
}: {
  readonly component: Data.Component<"molecules.marquee-testimonial-pro">
  readonly isVertical?: boolean
}) {
  return (
    <Card
      className={cn(
        "border-border from-card via-card to-card/80 group/card hover:shadow-primary/5 @container relative flex h-full flex-col overflow-hidden bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg lg:p-8",
        isVertical ? "w-full" : "w-[280px] @md:w-[340px] @lg:w-[400px]"
      )}
    >
      {/* Decorative corner accent */}
      <div className="from-primary/10 absolute top-0 right-0 h-24 w-24 bg-gradient-to-br to-transparent" />

      {/* Large decorative quote mark */}
      <div className="absolute top-6 left-6 opacity-10 transition-all duration-300 group-hover/card:scale-110 group-hover/card:opacity-20">
        <svg
          className="text-primary h-20 w-20 rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 12h.008v.008H7.5V12zm0 0a8.25 8.25 0 0 1-7.5-7.5m7.5 7.5v4.5m0-4.5h4.5m-4.5 0h-7.5m7.5-7.5V12m0-7.5h4.5m-4.5 0H3"
          />
        </svg>
      </div>

      <div className="relative flex flex-1 flex-col gap-6 pb-6 lg:pb-8">
        {/* Star rating at top */}
        <div className="relative z-10 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 transition-transform duration-200 ${
                i < (component.rating || 5)
                  ? "fill-amber-400 text-amber-400 group-hover/card:scale-110"
                  : "fill-muted/30 text-muted/30"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {/* Testimonial text */}
        <div className="flex-1">
          <blockquote>
            <p className="text-foreground line-clamp-5 text-base leading-relaxed text-pretty md:line-clamp-4 lg:line-clamp-none">
              &ldquo;{component.quote}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Divider line */}
        <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />

        {/* Author section with avatar */}
        <div className="flex h-[80px] items-center gap-4">
          <Avatar className="ring-background border-primary/20 group-hover/card:border-primary/40 group-hover/card:ring-primary/10 h-14 w-14 flex-shrink-0 border-2 shadow-lg ring-4 transition-all duration-300">
            {component.avatar && (
              <AvatarImage
                src={formatStrapiMediaUrl(component.avatar.url)}
                alt={component.author || "Author"}
                className="h-full w-full object-cover"
              />
            )}
            <AvatarFallback className="from-primary to-primary bg-gradient-to-br text-base font-bold text-white">
              {component.author
                ? component.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col justify-center">
            <h3 className="text-foreground font-bold">{component.author}</h3>
            {component.role && (
              <p className="text-muted-foreground text-sm">{component.role}</p>
            )}
            {component.company && (
              <p className="text-primary text-sm font-semibold">
                {component.company}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent bar - absolutely positioned at bottom */}
      <div className="from-primary/0 via-primary/50 to-primary/0 absolute right-0 bottom-6 left-0 h-1 w-full bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 lg:bottom-8" />
    </Card>
  )
}
StrapiMarqueeTestimonialPro.displayName = "StrapiMarqueeTestimonialPro"

export default StrapiMarqueeTestimonialPro
