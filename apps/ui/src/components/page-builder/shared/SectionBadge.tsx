"use client"

import { Data } from "@repo/strapi"
import { StrapiOrbitingBadge } from "../components/elements/StrapiOrbitingBadge"

interface SectionBadgeProps {
  badge?: Data.Component<"shared.section-badge">
}

/**
 * Reusable badge component for section headers.
 * Renders a badge with optional icon and animation based on Strapi shared component data.
 */
export function SectionBadge({ badge }: SectionBadgeProps) {
  if (!badge?.text) return null

  return (
    <StrapiOrbitingBadge
      badge={badge.text}
      badgeIcon={badge.icon ?? undefined}
      badgeSize={badge.size ?? undefined}
      badgeAnimation={badge.animation ?? undefined}
      badgeAnimationSpeed={badge.animationSpeed ?? undefined}
      badgeOrbSize={badge.orbSize ?? undefined}
      badgeBorderRadius="md"
      badgeOrbGlow="normal"
    />
  )
}
