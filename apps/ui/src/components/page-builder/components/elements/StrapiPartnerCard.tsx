import Image from "next/image"
import { Data } from "@repo/strapi"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

export function StrapiPartnerCard({
  component,
}: {
  readonly component: Data.Component<"elements.partner-card">
}) {
  // ✅ Use new linkText and newTab fields with fallbacks
  const linkText = component.linkText ?? "Learn More"
  const shouldOpenInNewTab = component.newTab ?? true
  const hasLink = Boolean(component.link)

  return (
    <div className="border-border bg-card group flex flex-col rounded-lg border p-6 transition-all hover:shadow-lg">
      {component.logo && (
        <div className="mb-4 flex h-16 items-center justify-center">
          <Image
            src={formatStrapiMediaUrl(component.logo.url)}
            alt={component.logo.alternativeText || component.name}
            width={component.logo.width || 200}
            height={component.logo.height || 80}
            className="max-h-12 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100"
          />
        </div>
      )}
      <h3 className="mb-2 text-center text-lg font-semibold">
        {component.name}
      </h3>
      {component.description && (
        <p className="text-muted-foreground mb-4 text-center text-sm leading-relaxed">
          {component.description}
        </p>
      )}
      {hasLink && (
        <a
          href={component.link!}
          target={shouldOpenInNewTab ? "_blank" : undefined}
          rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-auto rounded-md px-4 py-2 text-center text-sm font-medium transition-colors"
        >
          {linkText}
        </a>
      )}
    </div>
  )
}

StrapiPartnerCard.displayName = "StrapiPartnerCard"

export default StrapiPartnerCard
