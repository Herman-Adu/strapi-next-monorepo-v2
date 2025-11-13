"use client"

import { Data } from "@repo/strapi"
import { cn } from "@/lib/styles"
import { TextStyle } from "@/components/page-builder/atoms/TextStyle"

interface SectionHeaderProps {
  header?: Data.Component<"shared.section-header">
  className?: string
}

/**
 * Map heading size enum to CSS classes
 */
function getHeadingSizeClass(
  size?: "small" | "medium" | "large" | "xl"
): string {
  switch (size) {
    case "small":
      return "text-2xl sm:text-3xl"
    case "medium":
      return "text-3xl sm:text-4xl"
    case "xl":
      return "text-5xl sm:text-6xl md:text-7xl"
    case "large":
    default:
      return "text-4xl sm:text-5xl md:text-6xl"
  }
}

/**
 * Map spacing enum to CSS classes
 */
function getSpacingClass(spacing?: "compact" | "default" | "spacious"): string {
  switch (spacing) {
    case "compact":
      return "space-y-2"
    case "spacious":
      return "space-y-6"
    case "default":
    default:
      return "space-y-4"
  }
}

/**
 * Reusable header component - STRUCTURE COPIED FROM METRICSSECTION
 * Now uses atomic TextStyle component for gradient/two-tone rendering
 */
export function SectionHeader({ header, className }: SectionHeaderProps) {
  if (!header?.heading) return null

  const {
    heading,
    headingAccent,
    description,
    headingSize = "large",
    textStyle,
    showDivider = false,
    spacing = "default",
  } = header

  // Extract textStyle config
  const headingStyle = textStyle?.textStyle ?? "default"

  const headingSizeClass = getHeadingSizeClass(headingSize ?? undefined)
  const spacingClass = getSpacingClass(spacing ?? undefined)

  const wrapperClasses = cn(spacingClass, "text-left", className)

  // Base heading classes (size + weight + tracking)
  const headingClasses = cn("font-bold tracking-tight", headingSizeClass)

  const descriptionClasses = "text-lg text-muted-foreground"

  // Handle two-tone style (special rendering with accent + heading split)
  if (headingStyle === "two-tone" && headingAccent) {
    return (
      <div className={wrapperClasses}>
        <h2 className={headingClasses}>
          <span className="text-primary">{headingAccent}</span>{" "}
          <span className="text-muted-foreground dark:text-foreground">
            {heading}
          </span>
        </h2>

        {showDivider && (
          <div className="from-primary/60 to-primary mb-8 h-1 w-24 rounded-full bg-gradient-to-r" />
        )}

        {description && <p className={descriptionClasses}>{description}</p>}
      </div>
    )
  }

  // For gradient/default styles, use TextStyle atom
  // Combine headingAccent and heading if both exist
  const fullHeading = headingAccent
    ? `${headingAccent} ${heading}`
    : heading

  return (
    <div className={wrapperClasses}>
      <TextStyle textStyle={textStyle ?? undefined} as="h2" className={headingClasses}>
        {fullHeading}
      </TextStyle>

      {showDivider && (
        <div className="from-primary/60 to-primary mb-8 h-1 w-24 rounded-full bg-gradient-to-r" />
      )}

      {description && <p className={descriptionClasses}>{description}</p>}
    </div>
  )
}
