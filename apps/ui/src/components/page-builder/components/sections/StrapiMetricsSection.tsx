import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiStatCard } from "@/components/page-builder/components/elements/StrapiStatCard"

export function StrapiMetricsSection({
  component,
}: {
  readonly component: Data.Component<"sections.metrics-section">
}) {
  return (
    <section className="bg-muted/50 relative z-10 py-20 md:py-28">
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

        {component.metrics && component.metrics.length > 0 && (
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {component.metrics.map((metric, index) => (
              <StrapiStatCard key={metric.id || index} component={metric} />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiMetricsSection.displayName = "StrapiMetricsSection"

export default StrapiMetricsSection
