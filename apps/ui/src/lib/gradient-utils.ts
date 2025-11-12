/**
 * GRADIENT TEXT UTILITY
 * =====================
 * Centralized utility for applying gradient text effects based on Strapi style field.
 *
 * PATTERN:
 * 1. Strapi component has a `headingStyle` or `style` enum field with values:
 *    - "default" | "gradient" | "two-tone"
 *
 * 2. Use this utility to get the appropriate CSS class:
 *    const styleClass = getGradientClass(component.headingStyle, "heading")
 *
 * 3. Combine with other classes using cn():
 *    <h2 className={cn("text-4xl font-bold", styleClass)}>
 *
 * BENEFITS:
 * - Single source of truth for gradient styles
 * - Theme-aware (CSS classes use CSS variables)
 * - Consistent across all components
 * - Easy to extend with new gradient types
 *
 * GRADIENT TYPES:
 * - "heading": Main heading gradient (subtle, bottom-right diagonal)
 * - "subheading": Description/subheading gradient (dramatic, with glow)
 *
 * CSS CLASSES DEFINED IN: apps/ui/src/styles/globals.css
 */

export type GradientStyle = "default" | "gradient" | "two-tone"
export type GradientType = "heading" | "subheading"

/**
 * Get CSS class for gradient text based on style and type
 *
 * @param style - The gradient style from Strapi ("default" | "gradient" | "two-tone")
 * @param type - The type of element ("heading" | "subheading")
 * @returns CSS class string to apply gradient effect
 *
 * @example
 * // For main headings with gradient
 * const headingClass = getGradientClass("gradient", "heading")
 * <h1 className={cn("text-5xl font-bold", headingClass)}>Title</h1>
 *
 * @example
 * // For descriptions/subheadings with dramatic gradient
 * const subheadingClass = getGradientClass("gradient", "subheading")
 * <p className={cn("text-xl", subheadingClass)}>Description</p>
 *
 * @example
 * // With conditional rendering from Strapi
 * <h2 className={cn(
 *   "font-bold",
 *   getGradientClass(component.headingStyle, "heading")
 * )}>
 *   {component.heading}
 * </h2>
 */
export function getGradientClass(
  style?: GradientStyle,
  type: GradientType = "heading"
): string {
  if (style !== "gradient") {
    return ""
  }

  switch (type) {
    case "heading":
      return "gradient-heading"
    case "subheading":
      return "gradient-subheading"
    default:
      return ""
  }
}

/**
 * Get default text color class for non-gradient styles
 *
 * @param style - The style from Strapi
 * @param isDark - Whether to use dark mode colors
 * @returns CSS class string for text color
 *
 * @example
 * <h1 className={cn(
 *   "text-4xl",
 *   getGradientClass(style, "heading") || getDefaultTextClass(style)
 * )}>
 */
export function getDefaultTextClass(
  style?: GradientStyle,
  isDark: boolean = false
): string {
  if (style === "gradient" || style === "two-tone") {
    return ""
  }

  return isDark ? "text-foreground" : "text-primary dark:text-foreground"
}

/**
 * USAGE DOCUMENTATION
 * ===================
 *
 * STEP 1: Define headingStyle in Strapi component JSON
 * {
 *   "headingStyle": {
 *     "type": "enumeration",
 *     "enum": ["default", "gradient", "two-tone"],
 *     "default": "default"
 *   }
 * }
 *
 * STEP 2: Import utility in component
 * import { getGradientClass } from "@/lib/gradient-utils"
 *
 * STEP 3: Apply to element
 * <h1 className={cn(
 *   "text-5xl font-bold tracking-tight",
 *   getGradientClass(component.headingStyle, "heading")
 * )}>
 *   {component.heading}
 * </h1>
 *
 * STEP 4: For fallback to default color when not gradient
 * <h1 className={cn(
 *   "text-5xl font-bold",
 *   getGradientClass(component.headingStyle, "heading"),
 *   !component.headingStyle || component.headingStyle === "default"
 *     ? "text-primary dark:text-foreground"
 *     : ""
 * )}>
 *
 * PATTERN FOR TWO-TONE:
 * if (style === "two-tone") {
 *   return (
 *     <>
 *       <span className="text-primary">{accent}</span>{" "}
 *       <span className="text-muted-foreground dark:text-foreground">{text}</span>
 *     </>
 *   )
 * }
 */
