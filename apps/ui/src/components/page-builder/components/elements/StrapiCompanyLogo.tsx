import Image from "next/image"
import { Data } from "@repo/strapi"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

export function StrapiCompanyLogo({
  component,
}: {
  readonly component: Data.Component<"elements.company-logo">
}) {
  if (component.image) {
    const src = formatStrapiMediaUrl(component.image.url)
    return (
      <div className="flex items-center justify-center">
        <Image
          src={src}
          alt={component.image.alternativeText || component.name}
          width={component.image.width || 160}
          height={component.image.height || 80}
          className="h-8 w-auto opacity-60 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 hover:opacity-100 hover:grayscale-0 md:h-12 lg:h-14"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <span className="text-muted-foreground text-lg font-semibold opacity-60 transition-opacity hover:opacity-100 md:text-xl">
        {component.name}
      </span>
    </div>
  )
}

StrapiCompanyLogo.displayName = "StrapiCompanyLogo"

export default StrapiCompanyLogo
