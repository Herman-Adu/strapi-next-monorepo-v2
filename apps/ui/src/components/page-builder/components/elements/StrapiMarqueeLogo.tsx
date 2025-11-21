import Image from "next/image"
import Link from "next/link"
import { Data } from "@repo/strapi"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

export function StrapiMarqueeLogo({
  component,
  isVertical = false,
}: {
  readonly component: Data.Component<"molecules.marquee-logo">
  readonly isVertical?: boolean
}) {
  const logoImage = component.image ? (
    <Image
      src={formatStrapiMediaUrl(component.image.url)}
      alt={component.altText || component.name || "Logo"}
      width={component.image.width || 160}
      height={component.image.height || 80}
      className="h-10 w-auto opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 sm:h-12 lg:h-14"
    />
  ) : (
    <span className="text-muted-foreground text-base font-semibold opacity-60 transition-opacity hover:opacity-100 sm:text-lg lg:text-xl">
      {component.name}
    </span>
  )

  // Wrapper classes for background styling
  const wrapperClasses = cn(
    "@container flex items-center justify-center px-4 transition-all sm:px-6 md:px-8 lg:px-10",
    isVertical ? "w-full" : "w-[180px] shrink-0 @md:w-[200px] @lg:w-[240px]",
    component.showBackground && [
      "rounded-lg border border-border/50 bg-muted/30 p-4 shadow-sm",
      "hover:border-border hover:bg-muted/50 hover:shadow-md",
    ]
  )

  if (component.link) {
    const shouldOpenInNewTab = component.newTab ?? true // Default to true for external links

    return (
      <Link
        href={component.link}
        className={wrapperClasses}
        target={shouldOpenInNewTab ? "_blank" : undefined}
        rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
      >
        {logoImage}
      </Link>
    )
  }

  return <div className={wrapperClasses}>{logoImage}</div>
}

StrapiMarqueeLogo.displayName = "StrapiMarqueeLogo"

export default StrapiMarqueeLogo
