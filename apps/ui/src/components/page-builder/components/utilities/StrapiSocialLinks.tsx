import { Data } from "@repo/strapi"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"

import { cn } from "@/lib/styles"
import AppLink from "@/components/elementary/AppLink"

const socialIcons = {
  Twitter: Twitter,
  GitHub: Github,
  LinkedIn: Linkedin,
  Facebook: Facebook,
  Instagram: Instagram,
} as const

interface Props {
  readonly socialLinks: Data.Component<"utilities.social-link">[] | undefined
  readonly className?: string
  readonly variant?: "navbar" | "footer"
}

export function StrapiSocialLinks({
  socialLinks,
  className,
  variant = "navbar",
}: Props) {
  if (!socialLinks || socialLinks.length === 0) return null

  // Variant-based styles
  const isFooter = variant === "footer"
  const iconClasses = isFooter ? "h-7 w-7" : "h-6 w-6"
  const gapClasses = isFooter ? "gap-3" : ""

  return (
    <div className={cn("flex items-center", gapClasses, className)}>
      {socialLinks.map((link) => {
        const Icon = socialIcons[link.platform as keyof typeof socialIcons]

        if (!Icon || !link.url) return null

        return (
          <AppLink
            key={link.platform}
            href={link.url}
            openExternalInNewTab
            className={cn(
              "text-primary hover:text-muted-foreground",
              "transition-colors duration-200",
              "rounded-md p-1"
            )}
            aria-label={link.label || link.platform || "Social media link"}
          >
            <Icon className={iconClasses} />
          </AppLink>
        )
      })}
    </div>
  )
}

StrapiSocialLinks.displayName = "StrapiSocialLinks"

export default StrapiSocialLinks
