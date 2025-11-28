import { ReactNode } from "react"
import { cn } from "@/lib/styles"

/**
 * Reusable two-column layout component with flexible column positioning.
 *
 * @description
 * Server Component that provides a responsive 2-column grid layout with the ability
 * to swap column positions via the `position` prop. Uses CSS order utilities for
 * performance (no JavaScript, no re-renders).
 *
 * @example
 * ```tsx
 * // Default: left content on left, right content on right
 * <TwoColumnLayout
 *   leftColumn={<ContactDetails />}
 *   rightColumn={<ContactForm />}
 * />
 *
 * // Swapped: left content on right, right content on left (desktop only)
 * <TwoColumnLayout
 *   position="right"
 *   leftColumn={<ContactDetails />}
 *   rightColumn={<ContactForm />}
 * />
 *
 * // Match heights: columns stretch to equal height on desktop
 * <TwoColumnLayout
 *   matchHeights
 *   leftColumn={<ContactDetails />}
 *   rightColumn={<ContactForm />}
 * />
 * ```
 *
 * @remarks
 * - Mobile: Always stacks vertically (left column appears first)
 * - Desktop (lg+): Columns display side-by-side
 * - When position="right", columns swap using CSS order utilities
 * - When matchHeights=true, columns stretch to equal height (requires child elements to use h-full)
 * - Gaps are responsive: 3rem (mobile) → 4rem (desktop)
 */
interface TwoColumnLayoutProps {
  /** Content for the left column (appears first on mobile) */
  leftColumn: ReactNode
  /** Content for the right column (appears second on mobile) */
  rightColumn: ReactNode
  /**
   * Position of the left column on desktop
   * - "left" (default): left content stays left, right content stays right
   * - "right": left content moves right, right content moves left
   */
  position?: "left" | "right"
  /** Additional CSS classes for the grid container */
  className?: string
  /** Gap size between columns - defaults to responsive (3rem mobile, 4rem desktop) */
  gap?: "sm" | "md" | "lg"
  /**
   * Match column heights on desktop (lg+)
   * - When true, both columns stretch to equal height via grid-rows-1 and items-stretch
   * - Requires child content to use h-full for proper filling
   * - Default: false (columns size to their content)
   */
  matchHeights?: boolean
}

export function TwoColumnLayout({
  leftColumn,
  rightColumn,
  position = "left",
  className,
  gap = "md",
  matchHeights = false,
}: TwoColumnLayoutProps) {
  // Map gap sizes to Tailwind classes
  const gapClasses = {
    sm: "gap-8 lg:gap-12", // 2rem → 3rem
    md: "gap-12 lg:gap-16", // 3rem → 4rem (default)
    lg: "gap-16 lg:gap-20", // 4rem → 5rem
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2",
        gapClasses[gap],
        // Height matching: forces columns to equal height on desktop
        matchHeights && "lg:grid-rows-1 lg:items-stretch",
        className
      )}
    >
      {/* Left Column - order changes based on position prop */}
      <div
        className={cn(
          "flex flex-col justify-center",
          position === "right" && "lg:order-2"
        )}
      >
        {leftColumn}
      </div>

      {/* Right Column - order changes based on position prop */}
      <div
        className={cn(
          "flex flex-col justify-center",
          position === "right" && "lg:order-1"
        )}
      >
        {rightColumn}
      </div>
    </div>
  )
}

TwoColumnLayout.displayName = "TwoColumnLayout"
