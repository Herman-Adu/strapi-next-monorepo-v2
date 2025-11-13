"use client"

import { Data } from "@repo/strapi"
import { ReactNode, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface OrbAnimationProps {
  /**
   * The orb animation configuration from Strapi
   */
  orbAnimation?: Data.Component<"atoms.orb-animation">

  /**
   * The content to wrap with the orb animation
   */
  children: ReactNode

  /**
   * Additional CSS classes to apply to the wrapper
   */
  className?: string
}

/**
 * Map animation speed to duration in seconds
 */
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

/**
 * Map orb size enum to pixel size
 */
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

/**
 * Calculate glow intensity from blur value (0-100)
 * Returns blur amount and opacity values for orb layers
 */
function calculateGlowIntensity(blur?: number): {
  blur: number
  opacity: { outer: number; middle: number; inner: number }
} {
  // Default to 50 if not provided
  const blurValue = blur ?? 50

  // Map 0-100 range to blur values (2-12)
  const blurAmount = 2 + (blurValue / 100) * 10

  // Map 0-100 range to opacity values
  const opacityMultiplier = blurValue / 100

  return {
    blur: blurAmount,
    opacity: {
      outer: 0.1 + opacityMultiplier * 0.2, // 0.1 - 0.3
      middle: 0.2 + opacityMultiplier * 0.3, // 0.2 - 0.5
      inner: 0.3 + opacityMultiplier * 0.7, // 0.3 - 1.0
    },
  }
}

/**
 * Get border radius in pixels from the child element
 * This is calculated from the actual rendered element
 */
function getBorderRadiusFromElement(element: HTMLElement): number {
  const computedStyle = window.getComputedStyle(element)
  const borderRadius = computedStyle.borderRadius

  // Parse the border-radius value (e.g., "6px" -> 6)
  const radiusMatch = borderRadius.match(/^(\d+(?:\.\d+)?)px/)
  if (radiusMatch && radiusMatch[1]) {
    return parseFloat(radiusMatch[1])
  }

  // Fallback to 6px (md) if we can't parse
  return 6
}

/**
 * Calculate the animation path points around the perimeter of the element
 * Respects border radius for smooth corners
 */
function calculatePathPoints(
  width: number,
  height: number,
  borderRadius: number
): { x: number; y: number }[] {
  // Validate dimensions and radius
  if (
    width === 0 ||
    height === 0 ||
    borderRadius < 0 ||
    !isFinite(width) ||
    !isFinite(height) ||
    !isFinite(borderRadius)
  ) {
    return []
  }

  const segments = 100
  const points: { x: number; y: number }[] = []
  const r = Math.min(borderRadius, Math.min(width, height) / 2) // Cap radius to half the smallest dimension

  // Top edge (left to right)
  for (let i = 0; i <= segments / 4; i++) {
    const t = i / (segments / 4)
    if (r > 0 && width > 0 && t <= r / width) {
      // Top-left corner
      const angle = Math.PI + (Math.PI / 2) * (t / (r / width))
      const x = r + r * Math.cos(angle)
      const y = r + r * Math.sin(angle)
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    } else {
      const x = r + (width - 2 * r) * ((t - r / width) / (1 - r / width))
      const y = 0
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    }
  }

  // Right edge (top to bottom)
  for (let i = 0; i <= segments / 4; i++) {
    const t = i / (segments / 4)
    if (r > 0 && height > 0 && t <= r / height) {
      // Top-right corner
      const angle = -Math.PI / 2 + (Math.PI / 2) * (t / (r / height))
      const x = width - r + r * Math.cos(angle)
      const y = r + r * Math.sin(angle)
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    } else {
      const x = width
      const y = r + (height - 2 * r) * ((t - r / height) / (1 - r / height))
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    }
  }

  // Bottom edge (right to left)
  for (let i = 0; i <= segments / 4; i++) {
    const t = i / (segments / 4)
    if (r > 0 && width > 0 && t <= r / width) {
      // Bottom-right corner
      const angle = (Math.PI / 2) * (t / (r / width))
      const x = width - r + r * Math.cos(angle)
      const y = height - r + r * Math.sin(angle)
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    } else {
      const x = width - r - (width - 2 * r) * ((t - r / width) / (1 - r / width))
      const y = height
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    }
  }

  // Left edge (bottom to top)
  for (let i = 0; i <= segments / 4; i++) {
    const t = i / (segments / 4)
    if (r > 0 && height > 0 && t <= r / height) {
      // Bottom-left corner
      const angle = Math.PI / 2 + (Math.PI / 2) * (t / (r / height))
      const x = r + r * Math.cos(angle)
      const y = height - r + r * Math.sin(angle)
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    } else {
      const x = 0
      const y = height - r - (height - 2 * r) * ((t - r / height) / (1 - r / height))
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y })
      }
    }
  }

  return points
}

/**
 * Atomic OrbAnimation Component
 *
 * Wraps any children with an orbiting light animation effect that follows
 * the perimeter of the element. Animation respects border radius and adapts
 * to element dimensions.
 *
 * **Configuration:**
 * - `enabled`: Toggle animation on/off (default: false)
 * - `speed`: Animation duration (extra-slow/slow/medium/fast)
 * - `size`: Orb size in pixels (small/medium/large)
 * - `color`: Optional hex color (defaults to theme colors: green light, white dark)
 * - `blur`: Glow intensity 0-100 (default: 50)
 *
 * **Theme Color Defaults:**
 * - Light mode: `#16a34a` (green) - matches primary color
 * - Dark mode: `#ffffff` (white) with high opacity
 *
 * @example
 * // Basic usage with theme colors
 * <OrbAnimation orbAnimation={{ enabled: true, speed: "slow", size: "medium" }}>
 *   <div className="rounded-md px-3 py-1.5">Badge</div>
 * </OrbAnimation>
 *
 * @example
 * // Custom color with fast speed
 * <OrbAnimation
 *   orbAnimation={{
 *     enabled: true,
 *     speed: "fast",
 *     size: "large",
 *     color: "#22c55e",
 *     blur: 75
 *   }}
 * >
 *   <button>Click me</button>
 * </OrbAnimation>
 *
 * @example
 * // Disabled (returns children unchanged)
 * <OrbAnimation orbAnimation={{ enabled: false }}>
 *   <div>No animation</div>
 * </OrbAnimation>
 */
export function OrbAnimation({
  orbAnimation,
  children,
  className,
}: OrbAnimationProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [borderRadius, setBorderRadius] = useState(0)
  const [isReady, setIsReady] = useState(false)

  // If animation is disabled, return children unchanged
  const enabled = orbAnimation?.enabled ?? false
  if (!enabled) {
    return <>{children}</>
  }

  const speed = orbAnimation?.speed ?? "slow"
  const size = orbAnimation?.size ?? "medium"
  const customColor = orbAnimation?.color ?? undefined
  const blur = orbAnimation?.blur ?? 50

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!wrapperRef.current) return

    const childElement = wrapperRef.current.firstElementChild as HTMLElement
    if (!childElement) return

    const updateDimensions = () => {
      const rect = childElement.getBoundingClientRect()
      if (rect) {
        setDimensions({ width: rect.width, height: rect.height })
        const radiusPixels = getBorderRadiusFromElement(childElement)
        setBorderRadius(radiusPixels)

        // Mark as ready only when we have valid dimensions
        if (rect.width > 0 && rect.height > 0) {
          setIsReady(true)
        }
      }
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(childElement)

    window.addEventListener("resize", updateDimensions)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  const duration = getAnimationDuration(speed)
  const orbSize = getOrbSize(size)
  const glowIntensity = calculateGlowIntensity(blur)

  // Orb colors: Use custom color if provided, otherwise use theme defaults
  const orbColorLight = customColor || "hsl(142 76% 36%)" // #16a34a green
  const orbColorDark = customColor || "#ffffff" // White

  // Calculate animation path
  const pathPoints =
    isReady && dimensions.width > 0 && dimensions.height > 0
      ? calculatePathPoints(dimensions.width, dimensions.height, borderRadius)
      : []

  // Validate path points
  const validPathPoints = pathPoints.filter(
    (p) => p.x !== undefined && p.y !== undefined && !isNaN(p.x) && !isNaN(p.y)
  )

  // Check if we can animate
  const canAnimate =
    validPathPoints.length > 0 &&
    validPathPoints[0] !== undefined &&
    typeof validPathPoints[0].x === "number" &&
    typeof validPathPoints[0].y === "number" &&
    !isNaN(validPathPoints[0].x) &&
    !isNaN(validPathPoints[0].y)

  // Animation data
  let startX = 0
  let startY = 0
  let animateX: number[] = []
  let animateY: number[] = []

  if (canAnimate) {
    startX = validPathPoints[0]!.x
    startY = validPathPoints[0]!.y
    animateX = validPathPoints
      .map((p) => p.x)
      .filter((val): val is number => typeof val === "number" && isFinite(val))
    animateY = validPathPoints
      .map((p) => p.y)
      .filter((val): val is number => typeof val === "number" && isFinite(val))
  }

  // Generate unique ID for SVG filters
  const orbId = `orb-${Math.random().toString(36).substring(7)}`

  return (
    <div ref={wrapperRef} className={className}>
      <div className="relative inline-flex">
        {children}

        {canAnimate && animateX.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible motion-reduce:hidden"
            width={dimensions.width}
            height={dimensions.height}
            xmlns="http://www.w3.org/2000/svg"
            style={{ zIndex: 10 }}
          >
            <defs>
              {/* Glow filter */}
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
              {/* Outer glow */}
              <motion.circle
                r={orbSize * 2.5}
                fill={orbColorLight}
                opacity={glowIntensity.opacity.outer}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{ cx: animateX, cy: animateY }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Middle glow */}
              <motion.circle
                r={orbSize * 1.5}
                fill={orbColorLight}
                opacity={glowIntensity.opacity.middle}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{ cx: animateX, cy: animateY }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Core orb */}
              <motion.circle
                r={orbSize}
                fill={orbColorLight}
                opacity="1"
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{ cx: animateX, cy: animateY }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </g>

            {/* Dark theme orbs */}
            <g className="hidden dark:block">
              {/* Outer glow */}
              <motion.circle
                r={orbSize * 2.5}
                fill={orbColorDark}
                opacity={glowIntensity.opacity.outer * 1.5}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{ cx: animateX, cy: animateY }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Middle glow */}
              <motion.circle
                r={orbSize * 1.5}
                fill={orbColorDark}
                opacity={glowIntensity.opacity.middle * 1.8}
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{ cx: animateX, cy: animateY }}
                transition={{
                  duration: duration,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              {/* Core orb */}
              <motion.circle
                r={orbSize}
                fill={orbColorDark}
                opacity="1"
                filter={`url(#${orbId}-glow)`}
                initial={{ cx: startX, cy: startY }}
                animate={{ cx: animateX, cy: animateY }}
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

OrbAnimation.displayName = "OrbAnimation"
export default OrbAnimation
