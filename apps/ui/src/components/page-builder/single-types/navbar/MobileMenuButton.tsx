"use client"

import { X } from "lucide-react"

import { cn } from "@/lib/styles"

interface Props {
  readonly isOpen: boolean
  readonly onToggle: () => void
}

export function MobileMenuButton({ isOpen, onToggle }: Props) {
  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={onToggle}
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
  )
}

MobileMenuButton.displayName = "MobileMenuButton"
