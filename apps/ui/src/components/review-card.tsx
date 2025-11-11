"use client"

import Image from "next/image"
import { Star } from "lucide-react"

import { Card } from "@/components/ui/card"

interface ReviewCardProps {
  name: string
  position: string
  company: string
  rating: number
  review: string
  avatar: string
  date: string
}

export function ReviewCard({
  name,
  position,
  company,
  rating,
  review,
  avatar,
  date,
}: ReviewCardProps) {
  return (
    <Card className="group border-border bg-card hover:shadow-primary/10 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Decorative accent bar */}
      <div className="from-primary via-primary/50 absolute top-0 left-0 h-1 w-full bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex h-full flex-col p-6 md:p-8">
        {/* Header with avatar and info */}
        <div className="mb-6 flex items-start gap-4">
          <div className="relative">
            <div className="ring-border group-hover:ring-primary/20 h-14 w-14 overflow-hidden rounded-2xl ring-2 transition-all duration-300 group-hover:ring-4">
              <Image
                src={avatar || "/placeholder.svg"}
                alt={name}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Verified badge */}
            <div className="bg-primary absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full">
              <svg
                className="text-primary-foreground h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-card-foreground mb-1 text-lg leading-tight font-semibold">
              {name}
            </h3>
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground text-sm leading-tight">
                {position}
              </p>
              <p className="text-primary text-xs leading-tight font-medium">
                {company}
              </p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 transition-all duration-300 ${
                  index < rating
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-xs font-medium">
            {date}
          </span>
        </div>

        {/* Review text */}
        <blockquote className="relative flex-1">
          <div className="text-primary/10 absolute -top-2 -left-2 font-serif text-6xl leading-none select-none">
            &ldquo;
          </div>
          <p className="text-card-foreground/90 relative leading-relaxed text-pretty">
            {review}
          </p>
        </blockquote>

        {/* Bottom accent - now always at bottom */}
        <div className="border-border/50 mt-6 border-t pt-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <div className="bg-primary h-1.5 w-1.5 rounded-full" />
            <span>Verified Purchase</span>
          </div>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div className="from-primary/0 via-primary/0 to-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  )
}
