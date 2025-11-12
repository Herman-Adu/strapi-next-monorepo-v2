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
 * Map heading style enum to CSS classes
 */
function getHeadingStyleClass(
  style?: "default" | "gradient" | "two-tone"
): string {
  switch (style) {
    case "gradient":
      return "bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent"
    case "two-tone":
      return "" // Handled in renderHeading
    case "default":
    default:
      return "text-muted-foreground dark:text-foreground"
  }
}

/**
 * Map alignment enum to CSS classes
 */
function getAlignmentClass(alignment?: "left" | "center" | "right"): string {
  switch (alignment) {
    case "left":
      return "text-left"
    case "right":
      return "text-right"
    case "center":
    default:
      return "text-center"
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
 * Render heading with optional two-tone styling
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
  return heading
}

/**
 * Reusable header component combining heading, description, and styling options.
 * Supports gradient text, two-tone styles, alignment, and optional dividers.
 */
export function SectionHeader({ header, className }: SectionHeaderProps) {
  if (!header?.heading) return null

  const {
    heading,
    headingAccent,
    description,
    headingSize = "large",
    headingStyle = "default",
    alignment = "center",
    showDivider = false,
    spacing = "default",
  } = header

  const headingSizeClass = getHeadingSizeClass(headingSize ?? undefined)
  const headingStyleClass = getHeadingStyleClass(headingStyle ?? undefined)
  const alignmentClass = getAlignmentClass(alignment ?? undefined)
  const spacingClass = getSpacingClass(spacing ?? undefined)

  const wrapperClasses = cn(
    "mb-12 md:mb-16",
    spacingClass,
    alignmentClass,
    className
  )

  const headingClasses = cn(
    "font-bold tracking-tight",
    headingSizeClass,
    headingStyleClass
  )

  const descriptionClasses = cn(
    "mx-auto max-w-2xl text-lg text-muted-foreground",
    alignment === "center" ? "mx-auto" : "",
    alignment === "left" ? "mr-auto" : "",
    alignment === "right" ? "ml-auto" : ""
  )

  return (
    <div className={wrapperClasses}>
      <h2 className={headingClasses}>
        {renderHeading(
          heading,
          headingAccent ?? undefined,
          headingStyle ?? undefined
        )}
      </h2>

      {showDivider && (
        <div
          className={cn(
            "from-primary/60 to-primary mx-auto h-1 w-24 rounded-full bg-gradient-to-r",
            alignment === "left" && "mx-0",
            alignment === "right" && "mr-0 ml-auto"
          )}
        />
      )}

      {description && <p className={descriptionClasses}>{description}</p>}
    </div>
  )
}
