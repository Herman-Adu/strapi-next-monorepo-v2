import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiOrbitingBadge } from "@/components/page-builder/components/elements/StrapiOrbitingBadge"
import { StrapiStatCard } from "@/components/page-builder/components/elements/StrapiStatCard"

// Map background style enum to CSS classes
function getBackgroundClass(
  style?: "transparent" | "muted" | "theme-subtle" | "theme-muted"
): string {
  switch (style) {
    case "muted":
      return "bg-muted/50"
    case "theme-subtle":
      return "bg-gradient-to-br from-primary/[0.03] to-primary/[0.05] dark:bg-transparent"
    case "theme-muted":
      return "bg-primary/10 dark:bg-primary/5"
    case "transparent":
    default:
      return ""
  }
}

// Map heading style enum to CSS classes
function getHeadingClass(style?: "default" | "gradient" | "two-tone"): string {
  switch (style) {
    case "gradient":
      return "bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent"
    case "two-tone":
      return "" // Don't apply base color - handled in renderHeading
    case "default":
    default:
      return "text-muted-foreground dark:text-foreground" // Softer grey for light, normal for dark
  }
}

// Map container style enum to CSS classes
function getContainerClass(style?: "default" | "bordered"): string {
  switch (style) {
    case "bordered":
      return "mx-auto max-w-7xl rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-12 shadow-lg shadow-primary/10 @2xl:p-16 @4xl:p-24"
    case "default":
    default:
      return "mx-auto max-w-7xl"
  }
}

// Split heading for two-tone effect
function renderHeading(
  heading: string,
  headingAccent?: string,
  style?: "default" | "gradient" | "two-tone"
) {
  if (style === "two-tone" && headingAccent) {
    return (
      <>
        <span className="text-primary">{headingAccent}</span>{" "}
        <span className="text-muted-foreground dark:text-foreground">
          {heading}
        </span>
      </>
    )
  }
  return heading
}

export function StrapiMetricsSection({
  component,
}: {
  readonly component: Data.Component<"sections.metrics-section">
}) {
  const backgroundClass = getBackgroundClass(
    component.backgroundStyle ?? undefined
  )
  const headingClass = getHeadingClass(component.headingStyle ?? undefined)
  const containerClass = getContainerClass(
    component.containerStyle ?? undefined
  )

  return (
    <section className={`relative z-10 py-20 md:py-28 ${backgroundClass}`}>
      <Container className="mx-auto px-4">
        <div className={`text-center ${containerClass}`}>
          <StrapiOrbitingBadge
            badge={component.badge ?? undefined}
            badgeIcon={component.badgeIcon ?? undefined}
            badgeSize={component.badgeSize ?? "medium"}
            badgeAnimation={component.badgeAnimation ?? false}
            badgeAnimationSpeed={component.badgeAnimationSpeed ?? "slow"}
            badgeOrbSize={component.badgeOrbSize ?? "large"}
            badgeBorderRadius={component.badgeBorderRadius ?? "md"}
            badgeOrbGlow={component.badgeOrbGlow ?? "normal"}
          />
          <h2
            className={`mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl ${headingClass}`}
          >
            {renderHeading(
              component.heading ?? "",
              component.headingAccent ?? undefined,
              component.headingStyle ?? undefined
            )}
          </h2>
          {component.description && (
            <p className="from-muted-foreground/80 via-primary/70 to-muted-foreground/80 dark:from-foreground/90 dark:via-primary dark:to-foreground/90 mb-12 bg-gradient-to-r bg-clip-text text-xl font-semibold text-balance text-transparent drop-shadow-[0_2px_12px_hsl(var(--primary)/0.4)] filter md:text-2xl dark:drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
              {component.description}
            </p>
          )}

          {component.metrics && component.metrics.length > 0 && (
            <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {component.metrics.map((metric, index) => (
                <StrapiStatCard key={metric.id || index} component={metric} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiMetricsSection.displayName = "StrapiMetricsSection"

export default StrapiMetricsSection
