"use client"

import { useEffect, useRef, useState } from "react"
import { Data } from "@repo/strapi"

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          const startTime = Date.now()
          const startValue = 0

          const animate = () => {
            const currentTime = Date.now()
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t)
            const currentCount = Math.floor(
              startValue + (end - startValue) * easeOutQuad(progress)
            )

            setCount(currentCount)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          animate()
        }
      },
      { threshold: 0.3 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return { count, elementRef }
}

function extractNumber(str: string): number {
  // Extract number from strings like "50,000+", "99.9%", "2M+", etc.
  const cleaned = str.replace(/[^0-9.]/g, "")
  const num = parseFloat(cleaned)

  // Handle multipliers (K, M, B)
  if (str.includes("K") || str.includes("k")) return num * 1000
  if (str.includes("M") || str.includes("m")) return num * 1000000
  if (str.includes("B") || str.includes("b")) return num * 1000000000

  return num
}

function formatNumber(num: number, original: string): string {
  // Preserve the original format
  if (original.includes("K") || original.includes("k")) {
    return (num / 1000).toFixed(original.includes(".") ? 1 : 0) + "K"
  }
  if (original.includes("M") || original.includes("m")) {
    return (num / 1000000).toFixed(original.includes(".") ? 1 : 0) + "M"
  }
  if (original.includes("B") || original.includes("b")) {
    return (num / 1000000000).toFixed(original.includes(".") ? 1 : 0) + "B"
  }

  // For percentages and regular numbers
  if (original.includes(".")) {
    return num.toFixed(1)
  }

  return num.toLocaleString()
}

export function StrapiStatCard({
  component,
}: {
  readonly component: Data.Component<"molecules.stat-card">
}) {
  // Fallback to "0" if number is null/undefined
  const numberValue = component.number ?? "0"
  const targetNumber = extractNumber(numberValue)
  const { count, elementRef } = useCountUp(targetNumber)

  // Extract suffix (%, +, etc.)
  const suffix = numberValue.replace(/[0-9.,KMB]/gi, "").trim()

  return (
    <div
      ref={elementRef}
      className="flex flex-col items-center justify-center text-center"
    >
      <div className="text-primary mb-3 text-4xl font-bold tracking-tight md:text-4xl">
        {formatNumber(count, numberValue)}
        {suffix}
      </div>
      <div className="text-muted-foreground dark:text-foreground text-sm leading-relaxed font-semibold md:text-base">
        {component.description}
      </div>
    </div>
  )
}

StrapiStatCard.displayName = "StrapiStatCard"

export default StrapiStatCard
