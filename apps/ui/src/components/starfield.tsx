"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function Starfield() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current || theme === "light") {
      if (canvasRef.current) canvasRef.current.innerHTML = ""
      return
    }

    const stars = 100
    const container = canvasRef.current

    container.innerHTML = ""

    for (let i = 0; i < stars; i++) {
      const star = document.createElement("div")
      star.className = "star"
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 3}s`
      star.style.opacity = `${Math.random() * 0.5 + 0.3}`
      star.style.background = "white"
      container.appendChild(star)
    }

    return () => {
      container.innerHTML = ""
    }
  }, [theme])

  return (
    <div ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
  )
}
