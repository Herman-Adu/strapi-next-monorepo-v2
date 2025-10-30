import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"

export function StrapiFinalCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.final-cta-section">
}) {
  return (
    <section className="cta-gradient relative z-10 py-24 md:py-32">
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            {component.heading}
          </h2>

          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg text-balance">
            {component.description}
          </p>

          {component.ctaButtons && component.ctaButtons.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {component.ctaButtons.map((button, index) => (
                <StrapiIconButton
                  key={button.id || index}
                  component={button}
                  className={`h-12 rounded-lg px-8 text-base ${index === 1 ? "bg-background/50 backdrop-blur-sm" : ""}`}
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
