import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiFeatureCard } from "@/components/page-builder/components/elements/StrapiFeatureCard"
import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"

export function StrapiFeatureGridSection({
  component,
}: {
  readonly component: Data.Component<"sections.feature-grid-section">
}) {
  const gridColsClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
    "6": "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
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

        {/* Feature Cards Grid */}
        {component.items && component.items.length > 0 && (
          <div className={`grid gap-6 ${gridColsClass} mb-12`}>
            {component.items.map((item, index) => (
              <StrapiFeatureCard key={item.id || index} component={item} />
            ))}
          </div>
        )}

        {/* List Items Grid */}
        {component.listItems && component.listItems.length > 0 && (
          <div
            className={`grid gap-8 ${gridColsClass === "md:grid-cols-3" ? "md:grid-cols-2" : gridColsClass} mx-auto mb-12 max-w-4xl`}
          >
            {component.listItems.map((item, index) => (
              <StrapiListItem key={item.id || index} component={item} />
            ))}
          </div>
        )}

        {/* Footer Note */}
        {component.footerNote && (
          <div className="text-center">
            <p className="text-muted-foreground border-border inline-block rounded-full border px-6 py-2 text-sm">
              {component.footerNote}
            </p>
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiFeatureGridSection.displayName = "StrapiFeatureGridSection"

export default StrapiFeatureGridSection
