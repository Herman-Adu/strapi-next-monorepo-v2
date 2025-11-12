"use client"

import { Data } from "@repo/strapi"
import { cn } from "@/lib/styles"

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
 * Map heading style enum to CSS classes with gradient direction support
 */
function getHeadingStyleClass(
  style?: "default" | "gradient" | "two-tone",
  gradientDirection?: "diagonal" | "horizontal" | "vertical" | "radial"
): string {
  if (style === "gradient") {
    // Use CSS classes from globals.css for theme-specific gradients
    // Dark mode: Bright emerald (#22c55e) → Subtle (10% opacity)
    // Light mode: Will be refined separately
    switch (gradientDirection) {
      case "horizontal":
        return "gradient-heading-horizontal"
      case "vertical":
        return "gradient-heading-vertical"
      case "radial":
        return "gradient-heading-radial"
      case "diagonal":
      default:
        return "gradient-heading-diagonal"
    }
  }

  if (style === "two-tone") {
    return "" // Handled in renderHeading
  }

  // Default style - flat color
  return "text-primary dark:text-foreground"
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
 * Render heading with optional two-tone styling - COPIED FROM METRICSSECTION
 */
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

  // For flat/gradient styles, combine headingAccent and heading if both exist
  if (headingAccent) {
    return `${headingAccent} ${heading}`
  }

  return heading
}

/**
 * Reusable header component - STRUCTURE COPIED FROM METRICSSECTION
 */
export function SectionHeader({ header, className }: SectionHeaderProps) {
  if (!header?.heading) return null

  const {
    heading,
    headingAccent,
    description,
    headingSize = "large",
    headingStyle = "default",
    gradientDirection = "diagonal",
    showDivider = false,
    spacing = "default",
  } = header

  const headingSizeClass = getHeadingSizeClass(headingSize ?? undefined)
  const headingStyleClass = getHeadingStyleClass(
    headingStyle ?? undefined,
    gradientDirection ?? undefined
  )
  const spacingClass = getSpacingClass(spacing ?? undefined)

  const wrapperClasses = cn(spacingClass, "text-left", className)

  // EXACT SAME PATTERN AS METRICSSECTION LINE 94-96
  const headingClasses = cn(
    "font-bold tracking-tight",
    headingSizeClass,
    headingStyleClass
  )

  const descriptionClasses = "text-lg text-muted-foreground"

  return (
    <div className={wrapperClasses}>
      {/* EXACT SAME PATTERN AS METRICSSECTION h2 */}
      <h2 className={headingClasses}>
        {renderHeading(
          heading,
          headingAccent ?? undefined,
          headingStyle ?? undefined
        )}
      </h2>

      {showDivider && (
        <div className="from-primary/60 to-primary mb-8 h-1 w-24 rounded-full bg-gradient-to-r" />
      )}

      {description && <p className={descriptionClasses}>{description}</p>}
    </div>
  )
}
