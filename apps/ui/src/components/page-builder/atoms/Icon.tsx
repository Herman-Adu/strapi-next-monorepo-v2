import { Data } from "@repo/strapi"
import * as LucideIcons from "lucide-react"

import { cn } from "@/lib/styles"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

/**
 * Unified Icon Atom Component
 *
 * @description
 * Universal icon system supporting three modes:
 * 1. Lucide Icons - Dynamic import from lucide-react library
 * 2. Emoji - Direct emoji character rendering
 * 3. Custom Image - Upload custom SVG/PNG icons
 *
 * @remarks
 * This component provides consistency across ALL page-builder components
 * that need icon display (ContactMethod, IconButton, ListItem, Badge, etc.)
 *
 * @example
 * ```tsx
 * // Lucide icon
 * <Icon iconType="lucide" lucideName="Mail" size="md" />
 *
 * // Emoji
 * <Icon iconType="emoji" emoji="📞" size="lg" />
 *
 * // Custom upload
 * <Icon iconType="custom" customImage={imageComponent} size="sm" />
 * ```
 */

export interface IconProps {
  /** Icon display mode */
  iconType: "lucide" | "emoji" | "custom"

  /** Lucide icon name (e.g., 'Mail', 'Phone', 'MapPin') */
  lucideName?: string

  /** Emoji character (e.g., 📞, ✉️, ⏰) */
  emoji?: string

  /** Custom uploaded image component */
  customImage?: Data.Component<"utilities.basic-image"> | null

  /** Icon size preset */
  size?: "sm" | "md" | "lg" | "xl"

  /** Additional CSS classes */
  className?: string
}

/**
 * Size mapping for both Lucide icons and emoji
 */
const sizeClasses = {
  sm: {
    lucide: "h-4 w-4",
    emoji: "text-sm",
  },
  md: {
    lucide: "h-5 w-5",
    emoji: "text-base",
  },
  lg: {
    lucide: "h-6 w-6",
    emoji: "text-2xl",
  },
  xl: {
    lucide: "h-8 w-8",
    emoji: "text-3xl",
  },
} as const

/**
 * Icon Atom - Universal icon rendering component
 */
export function Icon({
  iconType,
  lucideName,
  emoji,
  customImage,
  size = "md",
  className,
}: IconProps) {
  // Mode 1: Custom uploaded image
  if (iconType === "custom" && customImage) {
    return (
      <StrapiBasicImage
        component={customImage}
        className={cn("h-full w-full object-contain", className)}
        hideWhenMissing
      />
    )
  }

  // Mode 2: Emoji character
  if (iconType === "emoji" && emoji) {
    return (
      <span
        className={cn(sizeClasses[size].emoji, className)}
        role="img"
        aria-label={emoji}
      >
        {emoji}
      </span>
    )
  }

  // Mode 3: Lucide icon (dynamic import)
  if (iconType === "lucide" && lucideName) {
    // Convert kebab-case to PascalCase for Lucide icon names
    // e.g., "arrow-right" → "ArrowRight", "map-pin" → "MapPin"
    const pascalName = lucideName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")

    const LucideIcon = LucideIcons[
      pascalName as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>

    if (LucideIcon) {
      return <LucideIcon className={cn(sizeClasses[size].lucide, className)} />
    }

    // Fallback: Try original name (already PascalCase)
    const FallbackIcon = LucideIcons[
      lucideName as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>

    if (FallbackIcon) {
      return (
        <FallbackIcon className={cn(sizeClasses[size].lucide, className)} />
      )
    }

    // Icon not found - log warning in development
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Icon Atom] Lucide icon "${lucideName}" (tried "${pascalName}") not found. Check https://lucide.dev/icons/`
      )
    }
  }

  // No valid icon provided
  return null
}

Icon.displayName = "Icon"

export default Icon
