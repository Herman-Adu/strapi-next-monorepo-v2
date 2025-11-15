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
 * Map spacing enum to CSS classes for internal spacing
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
    descriptionTextStyle,
    alignment = "center",
    showDivider = false,
    spacing = "default",
    showHeader = true,
  } = header

  // If showHeader is false, don't render anything
  if (!showHeader) return null

  // Extract textStyle config
  const headingStyle = textStyle?.textStyle ?? "default"

  const headingSizeClass = getHeadingSizeClass(headingSize ?? undefined)
  const spacingClass = getSpacingClass(spacing ?? undefined)
  const alignmentClass = getAlignmentClass(alignment ?? undefined)

  const wrapperClasses = cn(spacingClass, alignmentClass, className)

  // Base heading classes (size + weight + tracking)
  const headingClasses = cn("font-bold tracking-tight", headingSizeClass)

  const descriptionClasses = "text-lg text-muted-foreground"

  // Divider alignment classes
  const dividerAlignmentClass =
    alignment === "right"
      ? "ml-auto"
      : alignment === "left"
        ? "mr-auto"
        : "mx-auto" // center

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
        {/* {showDivider && (
        <div
          className={cn(
            "from-primary/60 to-primary h-1 w-24 rounded-full bg-gradient-to-r",
            dividerAlignmentClass
          )}
        />
      )} */}{" "}
        {description &&
          (descriptionTextStyle ? (
            <TextStyle
              textStyle={descriptionTextStyle}
              as="p"
              className={descriptionClasses}
            >
              {description}
            </TextStyle>
          ) : (
            <p className={descriptionClasses}>{description}</p>
          ))}
      </div>
    )
  }

  // Build full heading (combine accent + heading for gradient/default)
  const fullHeading = headingAccent ? `${headingAccent} ${heading}` : heading

  return (
    <div className={wrapperClasses}>
      <TextStyle
        textStyle={textStyle ?? undefined}
        as="h2"
        className={headingClasses}
      >
        {fullHeading}
      </TextStyle>

      {/* {showDivider && (
        <div
          className={cn(
            "from-primary/60 to-primary h-1 w-24 rounded-full bg-gradient-to-r",
            dividerAlignmentClass
          )}
        />
      )} */}

      {description &&
        (descriptionTextStyle ? (
          <TextStyle
            textStyle={descriptionTextStyle}
            as="p"
            className={descriptionClasses}
          >
            {description}
          </TextStyle>
        ) : (
          <p className={descriptionClasses}>{description}</p>
        ))}
    </div>
  )
}
