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
 * SectionHeader does NOT control spacing between heading and description
 * That spacing is controlled by the parent section's sectionGap (gap-8/12/16)
 * which is derived from background.padding setting
 */

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
 * Generate smart divider styles that match header textStyle
 * Returns both className and inline style for proper gradient rendering
 *
 * Use Cases:
 * 1. Default (solid): theme color gradient (uses Tailwind classes)
 * 2. Gradient: matches custom gradient colors (uses inline styles)
 * 3. Two-tone: REVERSED gradient (uses Tailwind classes)
 */
function getDividerStyles(
  textStyle?: Data.Component<"atoms.text-style"> | null
): { className: string; style?: React.CSSProperties } {
  // Default case: no textStyle or textStyle is "default"
  if (!textStyle || textStyle.textStyle === "default") {
    return {
      className: "bg-gradient-to-r from-primary/60 to-primary",
    }
  }

  // Two-tone: Reversed gradient (white/muted → green)
  if (textStyle.textStyle === "two-tone") {
    return {
      className:
        "bg-gradient-to-r from-muted-foreground/60 dark:from-foreground/60 to-primary",
    }
  }

  // Gradient: Match custom gradient colors using inline styles
  if (textStyle.textStyle === "gradient" && textStyle.customGradient) {
    const { customGradient } = textStyle
    const direction = textStyle.gradientDirection ?? "diagonal"

    // Use custom colors if provided, otherwise fall back to theme
    const lightStart = customGradient.lightModeStart || "#16a34a"
    const lightMiddle = customGradient.lightModeMiddle
    const lightEnd = customGradient.lightModeEnd || "#84cc16"

    // Build the exact same gradient as the heading uses
    const getGradientDirection = (dir: string) => {
      switch (dir) {
        case "horizontal":
          return "to right"
        case "vertical":
          return "to bottom"
        case "radial":
          return "circle"
        case "diagonal":
        default:
          return "135deg"
      }
    }

    const gradDirection = getGradientDirection(direction)

    // Build color stops - REVERSED order to match visual appearance
    // (start color appears on right/bottom, end color on left/top with 135deg)
    const colorStops = lightMiddle
      ? `${lightEnd}, ${lightMiddle}, ${lightStart}`
      : `${lightEnd}, ${lightStart}`

    const isRadial = direction === "radial"
    const gradientType = isRadial ? "radial-gradient" : "linear-gradient"
    const gradientValue = isRadial
      ? `${gradientType}(${gradDirection}, ${colorStops})`
      : `${gradientType}(${gradDirection}, ${colorStops})`

    return {
      className: "", // No Tailwind gradient classes needed
      style: {
        backgroundImage: gradientValue,
      },
    }
  }

  // Fallback to theme gradient
  return {
    className: "bg-gradient-to-r from-primary/60 to-primary",
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
    showHeader = true,
  } = header

  // If showHeader is false, don't render anything
  if (!showHeader) return null

  // Extract textStyle config
  const headingStyle = textStyle?.textStyle ?? "default"

  const headingSizeClass = getHeadingSizeClass(headingSize ?? undefined)
  const alignmentClass = getAlignmentClass(alignment ?? undefined)

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

  // Smart divider styling (matches header textStyle)
  const dividerStyles = getDividerStyles(textStyle)

  // Handle two-tone style (special rendering with accent + heading split)
  if (headingStyle === "two-tone" && headingAccent) {
    return (
      <>
        {/* Heading + Divider group (tight spacing with mt-2) */}
        <div className={cn(alignmentClass, className)}>
          <h2 className={headingClasses}>
            <span className="text-primary">{headingAccent}</span>{" "}
            <span className="text-muted-foreground dark:text-foreground">
              {heading}
            </span>
          </h2>
          {showDivider && (
            <div
              className={cn(
                "mt-2 h-1 w-24 rounded-full",
                dividerStyles.className,
                dividerAlignmentClass
              )}
              style={dividerStyles.style}
            />
          )}
        </div>

        {/* Description - gap controlled by parent section's sectionGap */}
        {description &&
          (descriptionTextStyle ? (
            <TextStyle
              textStyle={descriptionTextStyle}
              as="p"
              className={cn(descriptionClasses, alignmentClass)}
            >
              {description}
            </TextStyle>
          ) : (
            <p className={cn(descriptionClasses, alignmentClass)}>
              {description}
            </p>
          ))}
      </>
    )
  }

  // Build full heading (combine accent + heading for gradient/default)
  const fullHeading = headingAccent ? `${headingAccent} ${heading}` : heading

  return (
    <>
      {/* Heading + Divider group (tight spacing with mt-2) */}
      <div className={cn(alignmentClass, className)}>
        <TextStyle
          textStyle={textStyle ?? undefined}
          as="h2"
          className={headingClasses}
        >
          {fullHeading}
        </TextStyle>

        {showDivider && (
          <div
            className={cn(
              "mt-2 h-1 w-24 rounded-full",
              dividerStyles.className,
              dividerAlignmentClass
            )}
            style={dividerStyles.style}
          />
        )}
      </div>

      {/* Description - gap controlled by parent section's sectionGap */}
      {description &&
        (descriptionTextStyle ? (
          <TextStyle
            textStyle={descriptionTextStyle}
            as="p"
            className={cn(descriptionClasses, alignmentClass)}
          >
            {description}
          </TextStyle>
        ) : (
          <p className={cn(descriptionClasses, alignmentClass)}>
            {description}
          </p>
        ))}
    </>
  )
}
