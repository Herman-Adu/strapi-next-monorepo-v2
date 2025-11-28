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

  return { count, elementRef, hasAnimated }
}

function extractNumber(str: string): number {
  // Handle special case: "24/7" should not animate (return 0)
  if (str.includes("/")) return 0

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
  // Handle special case: "24/7" or similar formats - return as-is
  if (original.includes("/")) return original

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
  const { count, elementRef, hasAnimated } = useCountUp(targetNumber)

  // Extract suffix (%, +, etc.)
  const suffix = numberValue.replace(/[0-9.,KMB]/gi, "").trim()

  return (
    <div
      ref={elementRef}
      className={`flex flex-col items-center justify-center text-center transition-all duration-700 ${
        hasAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="text-primary mb-3 text-4xl font-bold tracking-tight md:text-4xl">
        {numberValue.includes("/")
          ? numberValue // Display "24/7" as-is but with fade-in animation
          : `${formatNumber(count, numberValue)}${suffix}`}
      </div>
      {/* Optional label field */}
      {component.label && (
        <div className="text-foreground mb-1 text-xs font-medium tracking-wider uppercase opacity-70">
          {component.label}
        </div>
      )}
      <div className="text-muted-foreground dark:text-foreground text-sm leading-relaxed font-semibold md:text-base">
        {component.description}
      </div>
    </div>
  )
}

StrapiStatCard.displayName = "StrapiStatCard"

export default StrapiStatCard
