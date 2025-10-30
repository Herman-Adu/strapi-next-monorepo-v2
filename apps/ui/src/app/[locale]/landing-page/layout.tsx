import { Geist, Geist_Mono } from "next/font/google"

//import { Analytics } from "@vercel/analytics/next"

import type { Metadata } from "next"
import type React from "react"

import { LandingThemeWrapper } from "@/components/landing-theme-wrapper"
import { ThemeProvider } from "@/components/theme-provider"

import "../../../styles/globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Strapi + Next.js Starter | NOTUM Technologies",
  description:
    "Production-ready Strapi v5 + Next.js 15 template. Real code, fast iteration. Used in 10+ enterprise projects.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <LandingThemeWrapper>
        <div
          className={`${geist.variable} ${geistMono.variable}`}
          suppressHydrationWarning
        >
          <div className="bg-background text-foreground min-h-screen">
            {children}
          </div>
        </div>
      </LandingThemeWrapper>
      {/* <Analytics /> */}
    </ThemeProvider>
  )
}
