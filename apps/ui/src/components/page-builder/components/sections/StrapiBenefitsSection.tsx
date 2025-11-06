import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiFeatureCard } from "@/components/page-builder/components/elements/StrapiFeatureCard"

export function StrapiBenefitsSection({
  component,
}: {
  readonly component: Data.Component<"sections.benefits-section">
}) {
  const gridColsClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
  }[component.gridColumns || "3"]

  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
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

        {component.benefits && component.benefits.length > 0 && (
          <div className={`grid gap-6 ${gridColsClass}`}>
            {component.benefits.map((benefit, index) => (
              <StrapiFeatureCard
                key={benefit.id || index}
                component={benefit}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiBenefitsSection.displayName = "StrapiBenefitsSection"

export default StrapiBenefitsSection
