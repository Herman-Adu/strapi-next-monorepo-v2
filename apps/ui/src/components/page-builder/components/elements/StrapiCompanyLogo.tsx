import { Data } from "@repo/strapi"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export function StrapiCompanyLogo({
  component,
}: {
  readonly component: Data.Component<"elements.company-logo">
}) {
  if (component.image?.media) {
    return (
      <div className="flex items-center justify-center">
        <StrapiBasicImage
          component={component.image}
          className="h-8 w-auto opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:h-10"
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
