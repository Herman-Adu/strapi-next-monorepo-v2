"use client"

import { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import { Data } from "@repo/strapi"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

import { AppLocale } from "@/types/general"

import { cn } from "@/lib/styles"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import AppLink from "@/components/elementary/AppLink"
import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import { ThemeToggle } from "@/components/elementary/ThemeToggle"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

interface Props {
  readonly navbar: Data.ContentType<"api::navbar.navbar">
  readonly links: NonNullable<Data.ContentType<"api::navbar.navbar">["links"]>
  readonly locale: AppLocale
  readonly session: any
  readonly signInText?: string
}

export function MobileNavigationClient({
  navbar,
  links,
  locale,
  session,
  signInText = "Sign in",
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)") // md breakpoint

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true)
      // Delay animation to allow DOM to render first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before removing from DOM
      setTimeout(() => setIsOpen(false), 300)
    }
  }

  const closeMenu = () => {
    setIsAnimating(false)
    setTimeout(() => setIsOpen(false), 300)
  }

  // Close menu when viewport changes to desktop
  useEffect(() => {
    if (isDesktop && isOpen) {
      setIsOpen(false)
      setIsAnimating(false)
    }
  }, [isDesktop, isOpen])

  const mobileMenuContent = isOpen ? (
    <>
      {/* Backdrop with glassmorphism */}
      <div
        className={cn(
          "fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={closeMenu}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeMenu()
        }}
        aria-label="Close mobile menu"
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[9999] w-80 max-w-sm md:hidden",
          "h-full overflow-hidden",
          "bg-background border-border/40 border-l",
          "shadow-2xl",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          isAnimating ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="border-border/20 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center"
                onClick={closeMenu}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    closeMenu()
                  }
                }}
              >
                {navbar.logoImage ? (
                  <StrapiImageWithLink
                    component={navbar.logoImage}
                    linkProps={{
                      className:
                        "flex items-center space-x-2 hover:opacity-80 transition-opacity",
                    }}
                    imageProps={{
                      hideWhenMissing: true,
                      className: "h-8 w-auto object-contain",
                    }}
                  />
                ) : (
                  <AppLink
                    href="/"
                    className="flex items-center space-x-2 text-xl font-bold transition-opacity hover:opacity-80"
                  >
                    <Image
                      src="/images/logo.svg"
                      alt="logo"
                      width={120}
                      height={32}
                      className="h-8 w-auto object-contain"
                    />
                  </AppLink>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeMenu}
                className={cn(
                  "inline-flex items-center justify-center rounded-md p-2",
                  "text-foreground/60 hover:text-foreground hover:bg-accent/50",
                  "transition-colors duration-200"
                )}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          <div>
            {links.map((link, index) => (
              <div key={link.href}>
                <div
                  className="flex items-center justify-between py-3"
                  onClick={closeMenu}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      closeMenu()
                    }
                  }}
                >
                  <StrapiLink
                    component={link}
                    className={cn(
                      "text-left text-lg font-medium",
                      "text-foreground/90 hover:text-foreground",
                      "transition-colors duration-200"
                    )}
                  />
                </div>
                {/* More visible separator line */}
                {index < links.length - 1 && (
                  <div className="bg-border/80 h-px w-full" />
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            {!session?.user ? (
              <>
                <AppLink
                  href="/auth/signin"
                  onClick={closeMenu}
                  className={cn(
                    "flex w-full items-center justify-center rounded-lg px-6 py-4",
                    "border-primary text-primary hover:bg-primary hover:text-primary-foreground border",
                    "font-medium transition-all duration-200",
                    "text-center"
                  )}
                >
                  Login
                </AppLink>
                <AppLink
                  href="/auth/signup"
                  onClick={closeMenu}
                  className={cn(
                    "flex w-full items-center justify-center rounded-lg px-6 py-4",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    "font-medium transition-colors duration-200",
                    "text-center"
                  )}
                >
                  Sign up
                </AppLink>
              </>
            ) : (
              <div className="text-center">
                <p className="text-foreground/80">Welcome back!</p>
              </div>
            )}

            {/* Theme and Locale Controls */}
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <LocaleSwitcher locale={locale} />
              </div>
            </div>
          </div>
        </nav>

        {/* Footer with Social Links */}
        <div className="border-border/20 flex-shrink-0 border-t px-6 py-6">
          {/* Copyright */}
          <p className="text-muted-foreground text-center text-xs">
            © 2025 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </>
  ) : null

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={toggleMenu}
          className={cn(
            "inline-flex items-center justify-center rounded-md p-2",
            "text-foreground/60 hover:text-foreground hover:bg-accent",
            "focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none",
            "transition-colors duration-200"
          )}
          aria-expanded={isOpen}
          aria-label="Toggle mobile menu"
        >
          <span className="sr-only">
            {isOpen ? "Close main menu" : "Open main menu"}
          </span>
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Render mobile menu in portal to escape stacking context */}
      {mounted && typeof document !== "undefined"
        ? createPortal(mobileMenuContent, document.body)
        : null}
    </>
  )
}

MobileNavigationClient.displayName = "MobileNavigationClient"

export default MobileNavigationClient
