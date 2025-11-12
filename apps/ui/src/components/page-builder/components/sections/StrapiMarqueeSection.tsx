import { Data } from "@repo/strapi"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { Marquee } from "@/components/ui/marquee"

import { StrapiMarqueeLogo } from "../elements/StrapiMarqueeLogo"
import { StrapiMarqueeReview } from "../elements/StrapiMarqueeReview"
import { StrapiMarqueeTestimonial } from "../elements/StrapiMarqueeTestimonial"
import { StrapiMarqueeTestimonialPro } from "../elements/StrapiMarqueeTestimonialPro"

export function StrapiMarqueeSection({
  component,
}: {
  readonly component: Data.Component<"sections.marquee-section">
}) {
  // Determine which items to render based on displayType and variant.
  const items =
    component.displayType === "logos"
      ? component.logos
      : component.displayType === "testimonials"
        ? component.testimonialVariant === "pro"
          ? component.testimonialsPro
          : component.testimonials
        : component.reviews

  if (!items || items.length === 0) return null

  // Enforce responsive row limits: max 3 desktop, 2 tablet, 1 mobile
  // Constrain rows to max 3 for safety
  const configuredRows = Math.min(component.rows || 1, 3)

  // Distribute items across rows if multiple rows configured
  const itemsPerRow = Math.ceil(items.length / configuredRows)
  const rows = Array.from({ length: configuredRows }, (_, rowIndex) =>
    items.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
  )

  // Render the appropriate component based on displayType and variant
  const renderItem = (item: any, index: number) => {
    const isVertical = component.orientation === "vertical"

    switch (component.displayType) {
      case "logos":
        return (
          <StrapiMarqueeLogo
            key={index}
            component={item}
            isVertical={isVertical}
          />
        )
      case "testimonials":
        return component.testimonialVariant === "pro" ? (
          <StrapiMarqueeTestimonialPro
            key={index}
            component={item}
            isVertical={isVertical}
          />
        ) : (
          <StrapiMarqueeTestimonial
            key={index}
            component={item}
            isVertical={isVertical}
          />
        )
      case "reviews":
        return (
          <StrapiMarqueeReview
            key={index}
            component={item}
            isVertical={isVertical}
          />
        )
      default:
        return null
    }
  }

  // Determine background style classes
  const backgroundStyle = component.backgroundStyle || "solid"
  const sectionClasses = {
    solid: "bg-background",
    transparent: "",
    muted: "bg-muted/30",
    bordered: "",
  }[backgroundStyle]

  const isBordered = backgroundStyle === "bordered"

  return (
    <section className={`relative z-10 py-16 md:py-20 ${sectionClasses}`}>
      {/* Gradient background for transparent style */}
      {backgroundStyle === "transparent" && (
        <div className="cta-gradient absolute inset-0" />
      )}
      <Container
        className={`@container mx-auto px-4 sm:px-6 ${backgroundStyle === "transparent" ? "relative" : ""}`}
      >
        {/* Bordered container wrapper */}
        <div
          className={cn({
            "border-primary/20 from-primary/5 shadow-primary/10 mx-auto flex min-h-[300px] max-w-7xl items-center rounded-2xl border-2 bg-gradient-to-br to-transparent p-8 shadow-lg @2xl:p-12 @4xl:p-16":
              isBordered,
          })}
        >
          <div className="w-full space-y-8 @2xl:space-y-12">
            {/* Optional Badge */}
            {component.badgeText && (
              <div className="mb-8 flex justify-center">
                <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
                  {component.badgeIcon && (
                    <span className="text-lg">{component.badgeIcon}</span>
                  )}
                  {component.badgeText}
                </span>
              </div>
            )}

            {/* Heading and Description */}
            {(component.heading || component.description) && (
              <div
                className={cn("mx-auto max-w-3xl text-center", {
                  "mb-8 @2xl:mb-12": isBordered,
                  "mb-16": !isBordered,
                })}
              >
                {component.heading && (
                  <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                    {component.heading}
                  </h2>
                )}
                {component.description && (
                  <p className="text-muted-foreground text-lg text-balance">
                    {component.description}
                  </p>
                )}
              </div>
            )}

            {/* Marquee Rows - Responsive: show all on desktop, limit on smaller screens */}
            <div className="@container mx-auto w-full max-w-7xl">
              <div
                className={cn({
                  "space-y-4": component.orientation !== "vertical",
                  "flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6":
                    component.orientation === "vertical",
                })}
              >
                {rows.map((rowItems, rowIndex) => {
                  // Responsive row visibility for vertical orientation:
                  // Mobile (<768px): Show only row 0 (1 column)
                  // Tablet (768-1023px): Show rows 0-1 (2 columns)
                  // Desktop (1024px+): Show all rows (up to 3 columns)
                  const hideOnMobile =
                    component.orientation === "vertical" && rowIndex >= 1
                  const hideOnTablet =
                    component.orientation === "vertical" && rowIndex >= 2

                  const responsiveClasses = cn({
                    "hidden md:block": hideOnMobile && !hideOnTablet,
                    "hidden lg:block": hideOnTablet,
                  })

                  // Calculate row-specific settings
                  const isReversed = component.alternateDirection
                    ? rowIndex % 2 !== 0
                    : (component.reverse ?? false)

                  const rowDuration = component.varySpeed
                    ? (component.duration ?? 40) + rowIndex * 10 // Vary speed by 10s per row for clearer difference
                    : (component.duration ?? 40)

                  return (
                    <div
                      key={rowIndex}
                      className={cn(responsiveClasses, "w-full", {
                        "max-w-[420px] min-w-0 md:flex-1":
                          component.orientation === "vertical",
                      })}
                    >
                      <Marquee
                        reverse={isReversed}
                        pauseOnHover={component.pauseOnHover ?? false}
                        vertical={component.orientation === "vertical"}
                        fade={component.showFade ?? false}
                        style={
                          {
                            "--duration": `${rowDuration}s`,
                            "--gap": component.gap || "1.5rem",
                          } as React.CSSProperties
                        }
                        className={cn({
                          "h-[500px] px-2 py-8 md:h-[600px]":
                            component.orientation === "vertical",
                          "px-8 py-2": component.orientation !== "vertical",
                        })}
                      >
                        {rowItems.map((item, index) => renderItem(item, index))}
                      </Marquee>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiMarqueeSection.displayName = "StrapiMarqueeSection"

export default StrapiMarqueeSection
