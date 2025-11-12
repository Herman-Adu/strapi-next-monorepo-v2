"use client"

import { Data } from "@repo/strapi"
import type { ReactNode } from "react"
import { cn } from "@/lib/styles"

interface SectionWrapperProps {
  background?: Data.Component<"shared.section-background">
  children: ReactNode
  className?: string
}

/**
 * Map background style enum to CSS classes
 */
function getBackgroundClass(
  style?:
    | "solid"
    | "transparent"
    | "muted"
    | "bordered"
    | "theme-subtle"
    | "theme-muted"
    | "theme-pastel"
): string {
  switch (style) {
    case "solid":
      return "bg-background"
    case "muted":
      return "bg-muted/50"
    case "theme-subtle":
      return "bg-gradient-to-br from-primary/[0.03] to-primary/[0.05] dark:bg-transparent"
    case "theme-muted":
      return "bg-primary/10 dark:bg-primary/5"
    case "theme-pastel":
      return "theme-pastel-bg"
    case "bordered":
      return "border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg shadow-primary/10"
    case "transparent":
    default:
      return ""
  }
}

/**
 * Map container width enum to CSS classes
 */
function getContainerWidthClass(
  width?: "default" | "narrow" | "wide" | "full"
): string {
  switch (width) {
    case "narrow":
      return "max-w-4xl"
    case "wide":
      return "max-w-screen-2xl"
    case "full":
      return "w-full"
    case "default":
    default:
      return "max-w-7xl"
  }
}

/**
 * Map padding enum to CSS classes
 */
function getPaddingClass(
  padding?: "default" | "compact" | "spacious" | "none"
): string {
  switch (padding) {
    case "compact":
      return "py-8 md:py-12"
    case "spacious":
      return "py-24 md:py-32"
    case "none":
      return ""
    case "default":
    default:
      return "py-16 md:py-24"
  }
}

/**
 * Map padding enum to container inner padding classes
 */
function getContainerPaddingClass(
  padding?: "default" | "compact" | "spacious" | "none"
): string {
  switch (padding) {
    case "compact":
      return "p-6 @2xl:p-8 @4xl:p-10"
    case "spacious":
      return "p-12 @2xl:p-16 @4xl:p-24"
    case "none":
      return "p-0"
    case "default":
    default:
      return "p-8 @2xl:p-12 @4xl:p-16"
  }
}

/**
 * Map container style enum to wrapper styling
 */
function getContainerClass(
  style?: "default" | "bordered",
  padding?: "default" | "compact" | "spacious" | "none"
): string {
  const paddingClass = getContainerPaddingClass(padding)

  switch (style) {
    case "bordered":
      return `mx-auto flex min-h-[400px] items-center rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg shadow-primary/10 ${paddingClass}`
    case "default":
    default:
      return "mx-auto"
  }
}

/**
 * Reusable wrapper component for section background and container styling.
 * Handles background styles, container widths, padding, and optional gradient effects.
 */
export function SectionWrapper({
  background,
  children,
  className,
}: SectionWrapperProps) {
  // Default values
  const backgroundStyle = background?.backgroundStyle ?? "solid"
  const containerStyle = background?.containerStyle ?? "default"
  const containerWidth = background?.containerWidth ?? "default"
  const padding = background?.padding ?? "default"
  const hasGradient = background?.gradient ?? false

  // Build CSS classes
  const backgroundClass = getBackgroundClass(backgroundStyle)
  const paddingClass = getPaddingClass(padding)
  const containerClass = getContainerClass(containerStyle, padding)
  const widthClass = getContainerWidthClass(containerWidth)

  // Section wrapper classes
  const sectionClasses = cn(
    "relative z-10",
    paddingClass,
    backgroundClass,
    className
  )

  // Container wrapper classes
  const containerClasses = cn(
    "@container px-4 sm:px-6",
    widthClass,
    containerClass
  )

  return (
    <section className={sectionClasses}>
      {/* Optional gradient background overlay */}
      {hasGradient && backgroundStyle === "transparent" && (
        <div className="bg-grid-primary/5 pointer-events-none absolute inset-0" />
      )}

      <div className={containerClasses}>{children}</div>
    </section>
  )
}
