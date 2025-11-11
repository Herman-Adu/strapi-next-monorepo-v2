"use client"

import { ReactNode, useEffect } from "react"

export default function ThemeTestLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Apply theme-adu-dev to html element for this route
    document.documentElement.classList.add("theme-adu-dev")

    return () => {
      // Remove if navigating away (unless globally applied via switcher)
      const globalTheme = localStorage.getItem("client-theme")
      if (globalTheme !== "theme-adu-dev") {
        document.documentElement.classList.remove("theme-adu-dev")
      }
    }
  }, [])

  return <>{children}</>
}
