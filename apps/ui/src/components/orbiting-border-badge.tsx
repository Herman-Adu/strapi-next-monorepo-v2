"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

import type React from "react"

import { cn } from "@/lib/styles"

interface OrbitingBorderBadgeProps {
  children: React.ReactNode
  className?: string
  orbColor?: string
  orbSize?: number
  duration?: number
  borderRadius?: number
}

export function OrbitingBorderBadge({
  children,
  className,
  orbColor = "rgb(59, 130, 246)", // blue-500
  orbSize = 6,
  duration = 3,
  borderRadius = 12,
}: OrbitingBorderBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!badgeRef.current) return

    const updateDimensions = () => {
      const rect = badgeRef.current?.getBoundingClientRect()
      if (rect) {
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [children])

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

  const pathPoints = getPathPoints()

  // Ensure all path points have valid coordinates
  const validPathPoints = pathPoints.filter(
    (p) => p.x !== undefined && p.y !== undefined && !isNaN(p.x) && !isNaN(p.y)
  )

  // Only render animation if we have valid data
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
    // Filter arrays to ensure no undefined values
    animateX = validPathPoints
      .map((p) => p.x)
      .filter((val): val is number => typeof val === "number" && isFinite(val))
    animateY = validPathPoints
      .map((p) => p.y)
      .filter((val): val is number => typeof val === "number" && isFinite(val))
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        ref={badgeRef}
        className="bg-secondary/50 border-border relative border px-4 py-2 backdrop-blur-sm"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <span className="text-foreground text-sm font-medium">{children}</span>
      </div>

      {canAnimate && animateX.length > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={dimensions.width}
          height={dimensions.height}
          xmlns="http://www.w3.org/2000/svg"
          style={{ zIndex: 10 }}
        >
          <defs>
            <radialGradient id={`orb-gradient-${orbColor}`}>
              <stop offset="0%" stopColor={orbColor} stopOpacity="1" />
              <stop offset="30%" stopColor={orbColor} stopOpacity="0.9" />
              <stop offset="60%" stopColor={orbColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={orbColor} stopOpacity="0" />
            </radialGradient>

            <filter
              id={`glow-${orbColor}`}
              x="-200%"
              y="-200%"
              width="400%"
              height="400%"
            >
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.circle
            r={orbSize * 2.5}
            fill={orbColor}
            opacity="0.15"
            filter={`url(#glow-${orbColor})`}
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

          <motion.circle
            r={orbSize * 1.5}
            fill={orbColor}
            opacity="0.3"
            filter={`url(#glow-${orbColor})`}
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

          <motion.circle
            r={orbSize}
            fill={`url(#orb-gradient-${orbColor})`}
            filter={`url(#glow-${orbColor})`}
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
        </svg>
      )}
    </div>
  )
}
