"use client"

import { Data } from "@repo/strapi"
import { OrbAnimation } from "@/components/page-builder/atoms/OrbAnimation"
import {
  Award,
  CheckCircle,
  Flame,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react"

interface SectionBadgeProps {
  badge?: Data.Component<"shared.section-badge">
}

// Map Lucide icon names to components
const iconMap = {
  Rocket,
  Star,
  Zap,
  TrendingUp,
  Award,
  CheckCircle,
  Sparkles,
  Flame,
}

/**
 * Render badge icon - supports emoji or Lucide icon name
 */
function renderBadgeIcon(
  icon?: string,
  size: "small" | "medium" | "large" = "medium"
) {
  if (!icon) return null

  const iconSizeMap = {
    small: "h-3 w-3",
    medium: "h-4 w-4",
    large: "h-5 w-5",
  }

  const emojiSizeMap = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }

  // If it's a single emoji character, render directly
  if (icon.length <= 2 || /\p{Emoji}/u.test(icon)) {
    return <span className={emojiSizeMap[size]}>{icon}</span>
  }

  // Otherwise, try to find a Lucide icon
  const LucideIcon = iconMap[icon as keyof typeof iconMap]
  if (LucideIcon) {
    return <LucideIcon className={iconSizeMap[size]} />
  }

  return null
}

/**
 * Map badge size enum to CSS classes
 */
function getBadgeClass(size?: "small" | "medium" | "large"): string {
  switch (size) {
    case "small":
      return "gap-1.5 px-2.5 py-1 text-xs"
    case "large":
      return "gap-2.5 px-4 py-2 text-base"
    case "medium":
    default:
      return "gap-2 px-3 py-1.5 text-sm"
  }
}

/**
 * Map alignment enum to flexbox justify classes
 */
function getAlignmentClass(alignment?: "left" | "center" | "right"): string {
  switch (alignment) {
    case "left":
      return "justify-start"
    case "right":
      return "justify-end"
    case "center":
    default:
      return "justify-center"
  }
}

/**
 * Reusable badge component for section headers.
 * Renders a badge with optional icon and orbiting animation.
 *
 * Uses atomic OrbAnimation wrapper to handle animation effects.
 */
export function SectionBadge({ badge }: SectionBadgeProps) {
  if (!badge?.text) return null

  // Respect showBadge toggle (defaults to true)
  const showBadge = badge.showBadge ?? true
  if (!showBadge) return null

  const badgeClass = getBadgeClass(badge.size ?? undefined)
  const alignmentClass = getAlignmentClass(badge.alignment ?? undefined)

  return (
    <OrbAnimation
      orbAnimation={badge.orbAnimation ?? undefined}
      className={`flex items-center ${alignmentClass}`}
    >
      <div
        className={`border-primary/30 bg-primary/5 text-primary dark:border-primary/40 dark:bg-primary/10 relative inline-flex items-center rounded-md border font-medium ${badgeClass}`}
      >
        {renderBadgeIcon(badge.icon ?? undefined, badge.size ?? "medium")}
        <span>{badge.text}</span>
      </div>
    </OrbAnimation>
  )
}
