"use client"

import { Data } from "@repo/strapi"
import { cn } from "@/lib/styles"
import { ReactNode } from "react"

interface TextStyleProps {
  /**
   * The text style configuration from Strapi
   */
  textStyle?: Data.Component<"atoms.text-style">

  /**
   * The content to render with the text style
   */
  children: ReactNode

  /**
   * Additional CSS classes to apply
   */
  className?: string

  /**
   * HTML element to render
   * @default "span"
   */
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
}

/**
 * Get gradient direction CSS for linear gradients
 */
function getGradientDirection(
  direction?: "diagonal" | "horizontal" | "vertical" | "radial"
): string {
  switch (direction) {
    case "horizontal":
      return "to right"
    case "vertical":
      return "to bottom"
    case "radial":
      return "circle"
    case "diagonal":
    default:
      return "135deg" // Bottom-right diagonal
  }
}

/**
 * Build custom gradient inline styles from hex colors
 */
function buildCustomGradientStyle(
  customGradient?: Data.Component<"atoms.gradient-colors">,
  gradientDirection?: "diagonal" | "horizontal" | "vertical" | "radial"
): React.CSSProperties | undefined {
  if (!customGradient) return undefined

  const {
    lightModeStart,
    lightModeMiddle,
    lightModeEnd,
    // darkModeStart, darkModeMiddle, darkModeEnd - TODO: Add dark mode support
  } = customGradient

  // Need at least start and end colors for either mode
  const hasLightMode = lightModeStart && lightModeEnd
  // Dark mode support would go here - keeping variable for future enhancement
  const hasDarkMode = false // TODO: Implement dark mode custom gradients

  if (!hasLightMode && !hasDarkMode) return undefined

  // Build color stops array
  const buildColorStops = (
    start: string,
    middle: string | null | undefined,
    end: string
  ) => {
    if (middle) {
      return `${start}, ${middle}, ${end}`
    }
    return `${start}, ${end}`
  }

  const direction = getGradientDirection(gradientDirection)
  const isRadial = gradientDirection === "radial"

  // For now, use light mode colors (dark mode would require CSS variables or client-side theme detection)
  // TODO: Enhance with proper dark mode support using CSS custom properties
  if (hasLightMode) {
    const colorStops = buildColorStops(
      lightModeStart!,
      lightModeMiddle,
      lightModeEnd!
    )

    const gradientType = isRadial ? "radial-gradient" : "linear-gradient"
    const gradientValue = isRadial
      ? `${gradientType}(${direction}, ${colorStops})`
      : `${gradientType}(${direction}, ${colorStops})`

    return {
      backgroundImage: gradientValue,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundSize: "100%",
    }
  }

  return undefined
}

/**
 * Get CSS class for theme-based gradients (uses CSS variables from globals.css)
 */
function getThemeGradientClass(
  gradientDirection?: "diagonal" | "horizontal" | "vertical" | "radial"
): string {
  // These classes are defined in apps/ui/src/styles/globals.css
  // They use CSS variables that adapt to light/dark mode
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

/**
 * Atomic TextStyle Component
 *
 * Handles text styling with three modes:
 * 1. **default** - Solid color using theme variables
 * 2. **gradient** - Theme-based gradient (CSS classes) OR custom hex gradient (inline styles)
 * 3. **two-tone** - Must be handled by parent component (splits text into two parts)
 *
 * @example
 * // Theme gradient
 * <TextStyle textStyle={textStyle} as="h1" className="text-5xl font-bold">
 *   {heading}
 * </TextStyle>
 *
 * @example
 * // Custom gradient with hex colors
 * <TextStyle
 *   textStyle={{
 *     textStyle: "gradient",
 *     gradientDirection: "diagonal",
 *     customGradient: {
 *       lightModeStart: "#22c55e",
 *       lightModeEnd: "#10b981"
 *     }
 *   }}
 *   as="h2"
 * >
 *   Custom Gradient
 * </TextStyle>
 *
 * @example
 * // Default solid color
 * <TextStyle textStyle={{ textStyle: "default" }} as="p">
 *   Normal text
 * </TextStyle>
 */
export function TextStyle({
  textStyle,
  children,
  className,
  as: Component = "span",
}: TextStyleProps) {
  const style = textStyle?.textStyle ?? "default"
  const direction = textStyle?.gradientDirection ?? "diagonal"
  const customGradient = textStyle?.customGradient

  // Handle gradient style
  if (style === "gradient") {
    // Custom gradient takes precedence over theme gradient
    const customStyle = buildCustomGradientStyle(
      customGradient ?? undefined,
      direction
    )

    if (customStyle) {
      // Use inline styles for custom hex gradients
      return (
        <Component className={className} style={customStyle}>
          {children}
        </Component>
      )
    }

    // Fall back to theme gradient (CSS classes)
    const gradientClass = getThemeGradientClass(direction)
    return (
      <Component className={cn(className, gradientClass)}>{children}</Component>
    )
  }

  // two-tone style should be handled by parent component
  // This atom only handles the wrapper
  if (style === "two-tone") {
    return <Component className={className}>{children}</Component>
  }

  // Default style - solid color
  return (
    <Component className={cn("text-primary dark:text-foreground", className)}>
      {children}
    </Component>
  )
}

TextStyle.displayName = "TextStyle"
export default TextStyle
