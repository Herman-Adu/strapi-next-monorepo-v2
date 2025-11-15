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
 * Supports both light and dark mode using CSS custom properties
 */
function buildCustomGradientStyle(
  customGradient?: Data.Component<"atoms.gradient-colors">,
  gradientDirection?: "diagonal" | "horizontal" | "vertical" | "radial"
): { style: React.CSSProperties; className?: string } | undefined {
  if (!customGradient) return undefined

  const {
    lightModeStart,
    lightModeMiddle,
    lightModeEnd,
    darkModeStart,
    darkModeMiddle,
    darkModeEnd,
  } = customGradient

  // Need at least start and end colors for light mode
  const hasLightMode = lightModeStart && lightModeEnd
  const hasDarkMode = darkModeStart && darkModeEnd

  if (!hasLightMode) return undefined

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

  // If we have both light and dark mode colors, use CSS custom properties
  if (hasLightMode && hasDarkMode) {
    const lightColorStops = buildColorStops(
      lightModeStart!,
      lightModeMiddle,
      lightModeEnd!
    )
    const darkColorStops = buildColorStops(
      darkModeStart!,
      darkModeMiddle,
      darkModeEnd!
    )

    const gradientType = isRadial ? "radial-gradient" : "linear-gradient"
    const lightGradient = isRadial
      ? `${gradientType}(${direction}, ${lightColorStops})`
      : `${gradientType}(${direction}, ${lightColorStops})`
    const darkGradient = isRadial
      ? `${gradientType}(${direction}, ${darkColorStops})`
      : `${gradientType}(${direction}, ${darkColorStops})`

    return {
      style: {
        ["--gradient-light" as string]: lightGradient,
        ["--gradient-dark" as string]: darkGradient,
        backgroundImage: "var(--gradient-light)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundSize: "100%",
      } as React.CSSProperties,
      // Use a marker class that we can style with CSS
      className: "custom-gradient-dark-mode",
    }
  }

  // Light mode only - use inline styles
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
      style: {
        backgroundImage: gradientValue,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundSize: "100%",
      },
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
 * 2. **gradient** - Theme-based gradient (CSS classes) OR custom hex gradient (inline styles with dark mode support)
 * 3. **two-tone** - Must be handled by parent component (splits text into two parts)
 *
 * @example
 * // Theme gradient
 * <TextStyle textStyle={textStyle} as="h1" className="text-5xl font-bold">
 *   {heading}
 * </TextStyle>
 *
 * @example
 * // Custom gradient with hex colors (light + dark mode)
 * <TextStyle
 *   textStyle={{
 *     textStyle: "gradient",
 *     gradientDirection: "diagonal",
 *     customGradient: {
 *       lightModeStart: "#22c55e",
 *       lightModeEnd: "#10b981",
 *       darkModeStart: "#ffa630",
 *       darkModeEnd: "#ff6347"
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

  // Handle gradient style
  if (style === "gradient") {
    // Custom gradient takes precedence over theme gradient
    const customGradient = buildCustomGradientStyle(
      textStyle?.customGradient ?? undefined,
      direction
    )

    if (customGradient) {
      // Use inline styles for custom hex gradients (with dark mode support)
      return (
        <Component
          className={cn(className, customGradient.className)}
          style={customGradient.style}
        >
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
