import type React from "react"

import { cn } from "@/lib/styles"

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: React.ReactNode
  vertical?: boolean
  repeat?: number
  fade?: boolean
  [key: string]: any
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  fade = true,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn("relative overflow-hidden", {
        "overflow-y-hidden": vertical,
      })}
      style={
        fade
          ? {
              maskImage: vertical
                ? "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
                : "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: vertical
                ? "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
                : "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }
          : undefined
      }
    >
      <div
        {...props}
        className={cn(
          "group flex [gap:var(--gap)] overflow-hidden [--duration:40s] [--gap:1rem]",
          {
            "flex-row p-2": !vertical,
            "flex-col px-2 py-8": vertical,
          },
          className
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                "animate-marquee flex-row": !vertical && !reverse,
                "animate-marquee-reverse flex-row": !vertical && reverse,
                "animate-marquee-vertical flex-col": vertical && !reverse,
                "animate-marquee-vertical-reverse flex-col":
                  vertical && reverse,
                "group-hover:[animation-play-state:paused]": pauseOnHover,
              })}
            >
              {children}
            </div>
          ))}
      </div>
    </div>
  )
}
