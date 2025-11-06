import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiPartnerCard } from "@/components/page-builder/components/elements/StrapiPartnerCard"

export function StrapiPartnerShowcaseSection({
  component,
}: {
  readonly component: Data.Component<"sections.partner-showcase-section">
}) {
  const gridColsClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
    "6": "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  }[component.gridColumns || "3"]

  return (
    <section className="bg-muted/30 relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            {component.heading}
          </h2>
          {component.description && (
            <p className="text-muted-foreground text-lg text-balance">
              {component.description}
            </p>
          )}
        </div>

        {component.partners && component.partners.length > 0 && (
          <div className={`grid gap-6 ${gridColsClass}`}>
            {component.partners.map((partner, index) => (
              <StrapiPartnerCard
                key={partner.id || index}
                component={partner}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiPartnerShowcaseSection.displayName = "StrapiPartnerShowcaseSection"

export default StrapiPartnerShowcaseSection
