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

    if (w === 0 || h === 0) return []

    const segments = 100
    const points: { x: number; y: number }[] = []

    // Top edge (left to right)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (t <= r / w) {
        // Top-left corner
        const angle = Math.PI + (Math.PI / 2) * (t / (r / w))
        points.push({
          x: r + r * Math.cos(angle),
          y: r + r * Math.sin(angle),
        })
      } else {
        points.push({ x: r + (w - 2 * r) * ((t - r / w) / (1 - r / w)), y: 0 })
      }
    }

    // Right edge (top to bottom)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (t <= r / h) {
        // Top-right corner
        const angle = -Math.PI / 2 + (Math.PI / 2) * (t / (r / h))
        points.push({
          x: w - r + r * Math.cos(angle),
          y: r + r * Math.sin(angle),
        })
      } else {
        points.push({ x: w, y: r + (h - 2 * r) * ((t - r / h) / (1 - r / h)) })
      }
    }

    // Bottom edge (right to left)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (t <= r / w) {
        // Bottom-right corner
        const angle = (Math.PI / 2) * (t / (r / w))
        points.push({
          x: w - r + r * Math.cos(angle),
          y: h - r + r * Math.sin(angle),
        })
      } else {
        points.push({
          x: w - r - (w - 2 * r) * ((t - r / w) / (1 - r / w)),
          y: h,
        })
      }
    }

    // Left edge (bottom to top)
    for (let i = 0; i <= segments / 4; i++) {
      const t = i / (segments / 4)
      if (t <= r / h) {
        // Bottom-left corner
        const angle = Math.PI / 2 + (Math.PI / 2) * (t / (r / h))
        points.push({
          x: r + r * Math.cos(angle),
          y: h - r + r * Math.sin(angle),
        })
      } else {
        points.push({
          x: 0,
          y: h - r - (h - 2 * r) * ((t - r / h) / (1 - r / h)),
        })
      }
    }

    return points
  }

  const pathPoints = getPathPoints()

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        ref={badgeRef}
        className="bg-secondary/50 border-border relative border px-4 py-2 backdrop-blur-sm"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <span className="text-foreground text-sm font-medium">{children}</span>
      </div>

      {dimensions.width > 0 && (
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
            animate={{
              cx: pathPoints.map((p) => p.x),
              cy: pathPoints.map((p) => p.y),
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
            animate={{
              cx: pathPoints.map((p) => p.x),
              cy: pathPoints.map((p) => p.y),
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
            animate={{
              cx: pathPoints.map((p) => p.x),
              cy: pathPoints.map((p) => p.y),
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
