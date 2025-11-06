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
}

export function StrapiSocialLinks({ socialLinks, className }: Props) {
  if (!socialLinks || socialLinks.length === 0) return null

  return (
    <div className={cn("flex items-center", className)}>
      {socialLinks.map((link) => {
        const Icon = socialIcons[link.platform as keyof typeof socialIcons]

        if (!Icon || !link.url) return null

        return (
          <AppLink
            key={link.platform}
            href={link.url}
            openExternalInNewTab
            className={cn(
              "text-muted-foreground hover:text-foreground",
              "transition-colors duration-200",
              "hover:bg-accent rounded-md p-1"
            )}
            aria-label={link.label || link.platform || "Social media link"}
          >
            <Icon className="h-6 w-6" />
          </AppLink>
        )
      })}
    </div>
  )
}

StrapiSocialLinks.displayName = "StrapiSocialLinks"

export default StrapiSocialLinks
