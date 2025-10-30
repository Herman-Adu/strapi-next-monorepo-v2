import { Data } from "@repo/strapi"
import { Github, Calendar, Heart, BookOpen, ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const iconMap = {
  github: Github,
  calendar: Calendar,
  heart: Heart,
  "book-open": BookOpen,
  "external-link": ExternalLink,
  "arrow-right": ArrowRight,
}

export function StrapiIconButton({
  component,
  className,
}: {
  readonly component: Data.Component<"elements.icon-button">
  readonly className?: string
}) {
  if (!component.icon || !component.href) return null

  const Icon = iconMap[component.icon]

  return (
    <Button
      size="lg"
      variant={component.variant as "default" | "outline" | "ghost"}
      className={className}
      asChild
    >
      <Link href={component.href} target={component.newTab ? "_blank" : undefined}>
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {component.label}
      </Link>
    </Button>
  )
}

StrapiIconButton.displayName = "StrapiIconButton"

export default StrapiIconButton
