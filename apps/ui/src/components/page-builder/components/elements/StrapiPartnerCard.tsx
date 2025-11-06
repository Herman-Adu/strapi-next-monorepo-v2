import { Data } from "@repo/strapi"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export function StrapiPartnerCard({
  component,
}: {
  readonly component: Data.Component<"elements.partner-card">
}) {
  const CardWrapper = component.link ? "a" : "div"
  const linkProps = component.link
    ? {
        href: component.link,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {}

  return (
    <CardWrapper
      {...linkProps}
      className="border-border bg-card group flex flex-col rounded-lg border p-6 transition-all hover:shadow-lg"
    >
      {component.logo && (
        <div className="mb-4 flex h-16 items-center justify-center">
          <StrapiBasicImage
            component={component.logo}
            className="max-h-12 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100"
          />
        </div>
      )}
      <h3 className="mb-2 text-center text-lg font-semibold">
        {component.name}
      </h3>
      {component.description && (
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          {component.description}
        </p>
      )}
    </CardWrapper>
  )
}

StrapiPartnerCard.displayName = "StrapiPartnerCard"

export default StrapiPartnerCard
