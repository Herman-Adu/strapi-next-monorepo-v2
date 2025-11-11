import { Data } from "@repo/strapi"
import { Quote } from "lucide-react"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

export function StrapiMarqueeTestimonial({
  component,
  isVertical = false,
}: {
  readonly component: Data.Component<"elements.marquee-testimonial">
  readonly isVertical?: boolean
}) {
  return (
    <Card
      className={cn(
        "border-border bg-card group/card @container relative flex h-full min-h-[280px] flex-col overflow-hidden p-6 transition-all hover:shadow-lg",
        isVertical ? "w-full" : "w-[360px] @md:w-[340px] @lg:w-[380px]"
      )}
    >
      {/* Decorative quote icon watermark */}
      <div className="absolute -top-2 -right-2 opacity-5 transition-all duration-300 group-hover/card:scale-105 group-hover/card:opacity-10">
        {/* Glow effect background */}
        <div className="bg-gradient-radial from-primary/20 via-primary/5 absolute inset-0 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover/card:opacity-100" />
        <Quote className="text-primary relative h-32 w-32" strokeWidth={1} />
      </div>

      {/* Rating stars at top */}
      {component.rating && (
        <div className="relative z-10 mb-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 transition-transform duration-200 ${i < component.rating! ? "fill-amber-400 text-amber-400 group-hover/card:scale-110" : "fill-muted text-muted"}`}
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
      )}

      {/* Testimonial quote - flexible height */}
      <blockquote className="text-foreground relative z-10 mb-6 flex-1">
        <p className="text-base leading-relaxed text-pretty">
          &ldquo;{component.quote}&rdquo;
        </p>
      </blockquote>

      {/* Author info at bottom */}
      <div className="relative z-10 flex items-center gap-4">
        <Avatar className="ring-background border-primary/20 group-hover/card:border-primary/40 group-hover/card:ring-primary/10 h-12 w-12 border-2 ring-4 transition-all duration-300">
          {component.avatar && (
            <AvatarImage
              src={formatStrapiMediaUrl(component.avatar.url)}
              alt={component.author || "Author"}
            />
          )}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {component.author
              ? component.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-foreground font-semibold">
            {component.author}
          </span>
          <span className="text-muted-foreground text-sm">
            {component.role}
            {component.company && component.role && " at "}
            {component.company}
          </span>
        </div>
      </div>
    </Card>
  )
}

StrapiMarqueeTestimonial.displayName = "StrapiMarqueeTestimonial"

export default StrapiMarqueeTestimonial
