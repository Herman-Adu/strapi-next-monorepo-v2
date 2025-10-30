import { Data } from "@repo/strapi"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export function StrapiCompanyLogo({
  component,
}: {
  readonly component: Data.Component<"elements.company-logo">
}) {
  if (component.image?.media) {
    return (
      <div className="flex items-center justify-center px-4">
        <StrapiBasicImage
          component={component.image}
          className="h-8 w-auto opacity-50"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center px-4">
      <span className="text-2xl font-bold opacity-50">{component.name}</span>
    </div>
  )
}

StrapiCompanyLogo.displayName = "StrapiCompanyLogo"

export default StrapiCompanyLogo
