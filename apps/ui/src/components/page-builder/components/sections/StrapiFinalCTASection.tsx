import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"

export function StrapiFinalCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.final-cta-section">
}) {
  return (
    <section className="relative z-10 py-24 md:py-32 cta-gradient">
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {component.heading}
          </h2>

          <p className="text-lg text-muted-foreground mb-10 text-balance max-w-2xl mx-auto">
            {component.description}
          </p>

          {component.ctaButtons && component.ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {component.ctaButtons.map((button, index) => (
                <StrapiIconButton
                  key={button.id || index}
                  component={button}
                  className={`text-base px-8 h-12 rounded-lg ${index === 1 ? "bg-background/50 backdrop-blur-sm" : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiFinalCTASection.displayName = "StrapiFinalCTASection"

export default StrapiFinalCTASection
