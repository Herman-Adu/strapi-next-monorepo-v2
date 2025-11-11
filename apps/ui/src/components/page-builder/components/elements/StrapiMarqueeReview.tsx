import Image from "next/image"
import { Data } from "@repo/strapi"
import { Star } from "lucide-react"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import { Card } from "@/components/ui/card"

export function StrapiMarqueeReview({
  component,
  isVertical = false,
}: {
  readonly component: Data.Component<"elements.marquee-review">
  readonly isVertical?: boolean
}) {
  return (
    <Card
      className={cn(
        "group border-border/50 from-card via-card to-card/50 hover:border-border/70 dark:from-card/90 dark:via-card/70 dark:to-card/50 @container relative flex h-full min-h-[200px] flex-col overflow-hidden border-2 bg-gradient-to-br p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        isVertical ? "w-full" : "w-[320px] @md:w-[300px] @lg:w-[340px]"
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header with Avatar, Name, Username, and Rating - Fixed height section */}
      <div className="relative z-10 mb-3 flex h-10 items-start gap-3">
        {component.avatar ? (
          <Image
            src={formatStrapiMediaUrl(component.avatar.url)}
            alt={component.name || "User"}
            width={40}
            height={40}
            className="ring-primary/20 group-hover:ring-primary/50 h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 transition-all duration-300"
          />
        ) : (
          <div className="ring-primary/20 group-hover:ring-primary/50 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 ring-2 transition-all duration-300">
            <span className="text-sm font-semibold text-white">
              {component.name ? component.name.charAt(0).toUpperCase() : "?"}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate leading-tight font-semibold">
            {component.name}
          </p>
          {component.username && (
            <p className="text-foreground/70 truncate text-sm leading-tight">
              {component.username}
            </p>
          )}
        </div>
      </div>

      {/* Rating - Fixed height section */}
      <div className="relative z-10 mb-3 flex h-4 gap-0.5">
        {component.rating ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                i < component.rating!
                  ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                  : "fill-muted/20 text-muted/20"
              }`}
            />
          ))
        ) : (
          <div className="h-4" />
        )}
      </div>

      {/* Review body - Flexible height section */}
      <p className="text-foreground/80 relative z-10 flex-1 text-sm leading-relaxed">
        {component.body}
      </p>
    </Card>
  )
}

StrapiMarqueeReview.displayName = "StrapiMarqueeReview"

export default StrapiMarqueeReview
