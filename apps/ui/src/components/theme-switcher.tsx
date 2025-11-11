"use client"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get current theme on mount
    const htmlElement = document.documentElement
    const theme = htmlElement.classList.contains("theme-adu-dev")
      ? "theme-adu-dev"
      : "default"
    setCurrentTheme(theme)
    setIsLoading(false)
  }, [])

  const toggleTheme = (theme: "default" | "theme-adu-dev") => {
    const htmlElement = document.documentElement

    // Remove all theme classes
    htmlElement.classList.remove("theme-adu-dev")

    // Add new theme if not default
    if (theme !== "default") {
      htmlElement.classList.add(theme)
    }

    setCurrentTheme(theme)

    // Store preference in localStorage
    localStorage.setItem("client-theme", theme)
  }

  const applyAduDevToApp = () => {
    toggleTheme("theme-adu-dev")
  }

  const revertToGreenTheme = () => {
    toggleTheme("default")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Global Theme Switcher</CardTitle>
          <CardDescription>Loading theme controls...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>🎨 Global Theme Switcher</CardTitle>
            <CardDescription>
              Apply Adu Dev theme across entire application for testing
            </CardDescription>
          </div>
          <Badge
            variant={currentTheme === "theme-adu-dev" ? "default" : "secondary"}
            className="text-sm"
          >
            {currentTheme === "theme-adu-dev"
              ? "Adu Dev Theme Active"
              : "Green Theme Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Current Status</h4>
            {currentTheme === "theme-adu-dev" ? (
              <p className="text-muted-foreground text-sm">
                🟠 <strong>Adu Dev theme</strong> is applied to the entire
                application. Navigate to any page to see the orange branding.
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                🟢 <strong>Default green theme</strong> is active. Only this
                test page shows Adu Dev branding.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={applyAduDevToApp}
                disabled={currentTheme === "theme-adu-dev"}
                size="sm"
                className="bg-[#FF8C00] text-white hover:bg-[#E67E00]"
              >
                Apply Adu Dev Globally
              </Button>
              <Button
                onClick={revertToGreenTheme}
                disabled={currentTheme === "default"}
                variant="outline"
                size="sm"
              >
                Revert to Green Theme
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 space-y-2 rounded-lg p-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            💡 How to Use
          </h4>
          <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
            <li>
              Click <strong>&quot;Apply Adu Dev Globally&quot;</strong> to test
              orange theme across entire app
            </li>
            <li>
              Navigate to any page (navbar, footer, forms, etc.) to verify
              branding
            </li>
            <li>Check both light and dark modes with the theme toggle</li>
            <li>
              Return here and click{" "}
              <strong>&quot;Revert to Green Theme&quot;</strong> when done
              testing
            </li>
          </ol>
        </div>

        {currentTheme === "theme-adu-dev" && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/20">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ <strong>Note:</strong> Adu Dev theme is currently applied to
              the entire application. Don&apos;t forget to revert before
              committing changes!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
