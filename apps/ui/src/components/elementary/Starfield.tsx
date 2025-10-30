"use client"

import { useEffect, useRef } from "react"

export function Starfield() {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const container = canvasRef.current
    const starCount = 100

    // Clear existing stars
    container.innerHTML = ""

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "star"
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 3}s`
      star.style.animationDuration = `${2 + Math.random() * 3}s`

      // Random star sizes
      const size = Math.random() * 2 + 1
      star.style.width = `${size}px`
      star.style.height = `${size}px`

      container.appendChild(star)
    }
  }, [])

  return (
    <div
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 hidden dark:block"
      aria-hidden="true"
    />
  )
}
