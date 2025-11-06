"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Data } from "@repo/strapi"
import { Instagram, Linkedin, Twitter, X } from "lucide-react"

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
  readonly isOpen: boolean
  readonly onClose: () => void
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A mobile menu panel that displays links and action buttons.
 * It is used as a nested component in the MobileNavigation component.
 *
 * @param {Data.ContentType<"api::navbar.navbar">} navbar - The navbar data from Strapi.
 * @param {NonNullable<Data.ContentType<"api::navbar.navbar">["links"]>} links - The links data from the navbar.
 * @param {AppLocale} locale - The current locale.
 * @param {any} session - The current user session.
 * @param {string} [signInText="Sign in"] - The text to display for the sign in button.
 * @param {boolean} isOpen - Whether the menu is open or not.
 * @param {function} onClose - The function to call when the menu is closed.
 */
/*******  9f6a8a3f-8f18-4149-8170-acac407ee1a9  *******/
export function MobileMenuPanel({
  navbar,
  links,
  locale,
  session,
  signInText = "Sign in",
  isOpen,
  onClose,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)") // md breakpoint

  // Close menu when viewport changes to desktop
  useEffect(() => {
    if (isDesktop && isOpen) {
      onClose()
    }
  }, [isDesktop, isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with glassmorphism */}
      <div
        className={cn(
          "fixed inset-0 z-[9998] bg-black/20 backdrop-blur-md md:hidden",
          "transition-opacity duration-300 ease-out"
        )}
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label="Close mobile menu"
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[9999] w-80 max-w-sm md:hidden",
          "h-screen", // Use viewport height
          "bg-background/95 border-border/40 border-l backdrop-blur-xl",
          "shadow-2xl shadow-black/10",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="border-border/20 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center"
                onClick={onClose}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onClose()
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
                onClick={onClose}
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
                  onClick={onClose}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onClose()
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
                  onClick={onClose}
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
                  onClick={onClose}
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
          {/* Social Media Icons */}
          <div className="mb-4 flex items-center justify-center space-x-6">
            <a
              href="/#"
              className="text-foreground/60 hover:text-foreground transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="/#"
              className="text-foreground/60 hover:text-foreground transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="/#"
              className="text-foreground/60 hover:text-foreground transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-center text-xs">
            © 2025 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}

MobileMenuPanel.displayName = "MobileMenuPanel"
