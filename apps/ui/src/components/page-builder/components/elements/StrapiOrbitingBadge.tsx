"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
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

// Render badge icon - supports emoji or Lucide icon name
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

// Map badge size enum to CSS classes
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

// Map animation speed to duration in seconds
function getAnimationDuration(
  speed?: "extra-slow" | "slow" | "medium" | "fast"
): number {
  switch (speed) {
    case "extra-slow":
      return 10
    case "slow":
      return 5
    case "fast":
      return 1.5
    case "medium":
    default:
      return 3
  }
}

// Map orb size enum to pixel size
function getOrbSize(size?: "small" | "medium" | "large"): number {
  switch (size) {
    case "small":
      return 4
    case "large":
      return 8
    case "medium":
    default:
      return 6
  }
}

// Map border radius enum to CSS class
function getBorderRadiusClass(radius?: "sm" | "md" | "lg" | "full"): string {
  switch (radius) {
    case "sm":
      return "rounded-sm" // 2px
    case "lg":
      return "rounded-lg" // 8px
    case "full":
      return "rounded-full" // pill shape
    case "md":
    default:
      return "rounded-md" // 6px
  }
}

// Map border radius to pixel value for animation path calculation
function getBorderRadiusPixels(
  radius?: "sm" | "md" | "lg" | "full",
  badgeHeight?: number
): number {
  switch (radius) {
    case "sm":
      return 2
    case "lg":
      return 8
    case "full":
      return badgeHeight ? badgeHeight / 2 : 12 // pill shape
    case "md":
    default:
      return 6
  }
}

// Map glow intensity to blur values
function getGlowIntensity(glow?: "subtle" | "normal" | "intense"): {
  blur: number
  opacity: { outer: number; middle: number; inner: number }
} {
  switch (glow) {
    case "subtle":
      return {
        blur: 4,
        opacity: { outer: 0.1, middle: 0.2, inner: 0.3 },
      }
    case "intense":
      return {
        blur: 10,
        opacity: { outer: 0.3, middle: 0.5, inner: 1 },
      }
    case "normal":
    default:
      return {
        blur: 6,
        opacity: { outer: 0.15, middle: 0.3, inner: 0.6 },
      }
  }
}

interface StrapiOrbitingBadgeProps {
  badge?: string
  badgeIcon?: string
  badgeSize?: "small" | "medium" | "large"
  badgeAnimation?: boolean
  badgeAnimationSpeed?: "extra-slow" | "slow" | "medium" | "fast"
  badgeOrbSize?: "small" | "medium" | "large"
  badgeBorderRadius?: "sm" | "md" | "lg" | "full"
  badgeOrbGlow?: "subtle" | "normal" | "intense"
}

export function StrapiOrbitingBadge({
  badge,
  badgeIcon,
  badgeSize = "medium",
  badgeAnimation = false,
  badgeAnimationSpeed = "slow",
  badgeOrbSize = "large",
  badgeBorderRadius = "md",
  badgeOrbGlow = "normal",
}: StrapiOrbitingBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [borderRadius, setBorderRadius] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!badgeRef.current) return

    const updateDimensions = () => {
      const rect = badgeRef.current?.getBoundingClientRect()
      if (rect) {
        setDimensions({ width: rect.width, height: rect.height })
        // Use the border radius from props
        const radiusPixels = getBorderRadiusPixels(
          badgeBorderRadius,
          rect.height
        )
        setBorderRadius(radiusPixels)
        // Mark as ready only when we have valid dimensions
        if (rect.width > 0 && rect.height > 0) {
          setIsReady(true)
        }
      }
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(badgeRef.current)

    window.addEventListener("resize", updateDimensions)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateDimensions)
    }
  }, [badgeBorderRadius])

  const getPathPoints = () => {
    const w = dimensions.width
    const h = dimensions.height
    const r = borderRadius

    // Validate dimensions and radius
    if (
      w === 0 ||
      h === 0 ||
      r < 0 ||
      !isFinite(w) ||
      !isFinite(h) ||
      !isFinite(r)
    ) {
      return []
    }

    const segments = 100
    const points: { x: number; y: number }[] = []

    // Top edge (left to right)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (r > 0 && w > 0 && t <= r / w) {
        // Top-left corner
        const angle = Math.PI + (Math.PI / 2) * (t / (r / w))
        const x = r + r * Math.cos(angle)
        const y = r + r * Math.sin(angle)
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      } else {
        const x = r + (w - 2 * r) * ((t - r / w) / (1 - r / w))
        const y = 0
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      }
    }

    // Right edge (top to bottom)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (r > 0 && h > 0 && t <= r / h) {
        // Top-right corner
        const angle = -Math.PI / 2 + (Math.PI / 2) * (t / (r / h))
        const x = w - r + r * Math.cos(angle)
        const y = r + r * Math.sin(angle)
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      } else {
        const x = w
        const y = r + (h - 2 * r) * ((t - r / h) / (1 - r / h))
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      }
    }

    // Bottom edge (right to left)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (r > 0 && w > 0 && t <= r / w) {
        // Bottom-right corner
        const angle = (Math.PI / 2) * (t / (r / w))
        const x = w - r + r * Math.cos(angle)
        const y = h - r + r * Math.sin(angle)
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      } else {
        const x = w - r - (w - 2 * r) * ((t - r / w) / (1 - r / w))
        const y = h
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      }
    }

    // Left edge (bottom to top)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (r > 0 && h > 0 && t <= r / h) {
        // Bottom-left corner
        const angle = Math.PI / 2 + (Math.PI / 2) * (t / (r / h))
        const x = r + r * Math.cos(angle)
        const y = h - r + r * Math.sin(angle)
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      } else {
        const x = 0
        const y = h - r - (h - 2 * r) * ((t - r / h) / (1 - r / h))
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y })
        }
      }
    }

    return points
  }

  const badgeClass = getBadgeClass(badgeSize)
  const borderRadiusClass = getBorderRadiusClass(badgeBorderRadius)
  const duration = getAnimationDuration(badgeAnimationSpeed)
  const orbSize = getOrbSize(badgeOrbSize)
  const glowIntensity = getGlowIntensity(badgeOrbGlow)

  // Theme-aware colors for orb
  const orbColorLight = "hsl(142 76% 36%)" // Match the badge border green (#16a34a)
  const orbColorDark = "hsl(var(--muted-foreground) / 0.9)" // Bright white/grey for dark theme
  const orbId = `orb-${badge?.replace(/\s/g, "-") || "badge"}`

  // Only calculate path points if we're ready to animate
  const pathPoints =
    badgeAnimation && isReady && dimensions.width > 0 && dimensions.height > 0
      ? getPathPoints()
      : []

  // Ensure all path points have valid coordinates before creating animation arrays
  const validPathPoints = pathPoints.filter(
    (p) => p.x !== undefined && p.y !== undefined && !isNaN(p.x) && !isNaN(p.y)
  )

  // Only render animation if we have valid starting position and animation path
  const canAnimate =
    validPathPoints.length > 0 &&
    validPathPoints[0] !== undefined &&
    typeof validPathPoints[0].x === "number" &&
    typeof validPathPoints[0].y === "number" &&
    !isNaN(validPathPoints[0].x) &&
    !isNaN(validPathPoints[0].y)

  // Only create animation data if we can actually animate
  let startX = 0
  let startY = 0
  let animateX: number[] = []
  let animateY: number[] = []

  if (canAnimate) {
    startX = validPathPoints[0]!.x
    startY = validPathPoints[0]!.y
    // Filter arrays one more time to ensure no undefined values
    animateX = validPathPoints
      .map((p) => p.x)
      .filter((val): val is number => typeof val === "number" && isFinite(val))
    animateY = validPathPoints
      .map((p) => p.y)
      .filter((val): val is number => typeof val === "number" && isFinite(val))
  }

  if (!badge) return null

  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="relative inline-flex">
        <div
          ref={badgeRef}
          className={`border-primary/30 bg-primary/5 text-primary dark:border-primary/40 dark:bg-primary/10 relative inline-flex items-center border font-medium ${badgeClass} ${borderRadiusClass}`}
        >
          {renderBadgeIcon(badgeIcon, badgeSize)}
          <span>{badge}</span>
        </div>

        {canAnimate && animateX.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible motion-reduce:hidden"
            width={dimensions.width}
            height={dimensions.height}
            xmlns="http://www.w3.org/2000/svg"
            style={{ zIndex: 10 }}
          >
            <defs>
              {/* Light theme gradient */}
              <radialGradient id={`${orbId}-gradient-light`}>
                <stop offset="0%" stopColor={orbColorLight} stopOpacity="1" />
                <stop
                  offset="30%"
                  stopColor={orbColorLight}
                  stopOpacity="0.9"
                />
                <stop
                  offset="60%"
                  stopColor={orbColorLight}
                  stopOpacity="0.5"
                />
                <stop offset="100%" stopColor={orbColorLight} stopOpacity="0" />
              </radialGradient>

              {/* Dark theme gradient - bright white */}
              <radialGradient id={`${orbId}-gradient-dark`}>
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="100%" stopColor={orbColorDark} stopOpacity="0" />
              </radialGradient>

              <filter
                id={`${orbId}-glow`}
                x="-400%"
                y="-400%"
                width="800%"
                height="800%"
              >
                <feGaussianBlur
                  stdDeviation={glowIntensity.blur}
                  result="coloredBlur"
                />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Light theme orbs */}
            <g className="dark:hidden">
              {/* Outer glow - light theme */}
              <motion.circle
                r={orbSize * 2.5}
                fill={orbColorLight}
                opacity={glowIntensity.opacity.outer}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{
                  cx: animateX,
                  cy: animateY,
                }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Middle glow - light theme */}
              <motion.circle
                r={orbSize * 1.5}
                fill={orbColorLight}
                opacity={glowIntensity.opacity.middle}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{
                  cx: animateX,
                  cy: animateY,
                }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Core orb - light theme */}
              <motion.circle
                r={orbSize}
                fill={orbColorLight}
                opacity="1"
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{
                  cx: animateX,
                  cy: animateY,
                }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </g>

            {/* Dark theme orbs - bright white */}
            <g className="hidden dark:block">
              {/* Outer glow - dark theme */}
              <motion.circle
                r={orbSize * 2.5}
                fill="#ffffff"
                opacity={glowIntensity.opacity.outer * 1.5}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{
                  cx: animateX,
                  cy: animateY,
                }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Middle glow - dark theme */}
              <motion.circle
                r={orbSize * 1.5}
                fill="#ffffff"
                opacity={glowIntensity.opacity.middle * 1.8}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{
                  cx: animateX,
                  cy: animateY,
                }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Core orb - dark theme */}
              <motion.circle
                r={orbSize}
                fill={`url(#${orbId}-gradient-dark)`}
                opacity="1"
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{
                  cx: animateX,
                  cy: animateY,
                }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  )
}
