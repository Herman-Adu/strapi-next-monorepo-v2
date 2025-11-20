import { cn } from "@/lib/styles"

export interface GlassmorphismCardProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  glowEffect?: boolean
  variant?: "rounded-xl" | "rounded-sm"
}

/**
 * GlassmorphismCard - Reusable glassmorphic card component
 *
 * A modern card design with glassmorphism effects including:
 * - Gradient background (primary/5 → background → background)
 * - Border with subtle primary color
 * - Hover states with smooth transitions
 * - Optional animated glow effect
 * - Responsive padding sizes
 *
 * @example
 * ```tsx
 * <GlassmorphismCard size="md" glowEffect>
 *   <p>Your content here</p>
 * </GlassmorphismCard>
 * ```
 */
export function GlassmorphismCard({
  children,
  className,
  size = "md",
  glowEffect = true,
  variant = "rounded-xl",
}: Readonly<GlassmorphismCardProps>) {
  // Padding sizes based on current usage patterns
  const sizeClasses = {
    sm: "p-3.5", // Used in GDPR checkboxes
    md: "p-6", // Used in benefit cards
    lg: "p-8", // Future expansion
  } as const

  return (
    <div
      className={cn(
        // Base glassmorphic styles
        "group relative overflow-hidden border-2 shadow-sm transition-all duration-300",
        // Background color - consistent across themes
        "bg-white/80 backdrop-blur-sm",
        // Gradient overlay
        "from-primary/5 via-background to-background bg-gradient-to-br",
        // Border colors - theme primary green
        "border-primary/20 hover:border-primary/70",
        // Shadow with hover states
        "hover:shadow-primary/5 hover:shadow-md",
        // Variant (border radius)
        variant,
        // Size (padding)
        sizeClasses[size],
        // Custom className override
        className
      )}
    >
      {/* Animated glow effect */}
      {glowEffect && (
        <div
          className={cn(
            "absolute top-0 right-0 h-24 w-24 blur-2xl transition-all duration-300",
            "bg-primary/5 group-hover:bg-primary/10"
          )}
          aria-hidden="true"
        />
      )}

      {/* Content wrapper with relative positioning */}
      <div className="relative">{children}</div>
    </div>
  )
}

GlassmorphismCard.displayName = "GlassmorphismCard"
