import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export function StrapiWorkflowSection({
  component,
}: {
  readonly component: Data.Component<"sections.workflow-section">
}) {
  return (
    <section className="relative z-10 py-20 md:py-28 bg-muted/30">
      <Container className="mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{component.heading}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{component.description}</p>

            {component.workflowPoints && component.workflowPoints.length > 0 && (
              <div className="space-y-6">
                {component.workflowPoints.map((point, index) => (
                  <StrapiListItem key={point.id || index} component={point} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            {component.image?.media ? (
              <StrapiBasicImage
                component={component.image}
                className="rounded-lg shadow-lg"
                forcedSizes={{ height: 400 }}
              />
            ) : (
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Screenshot placeholder</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiWorkflowSection.displayName = "StrapiWorkflowSection"

export default StrapiWorkflowSection
