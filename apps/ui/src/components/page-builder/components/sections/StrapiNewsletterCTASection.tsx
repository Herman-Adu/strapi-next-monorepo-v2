import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"

export function StrapiNewsletterCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.newsletter-cta-section">
}) {
  return (
    <section className="cta-gradient relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 md:grid-cols-2">
            {/* Left column */}
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {component.heading}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {component.description}
              </p>

              {component.ctaButtons && component.ctaButtons.length > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row">
                  {component.ctaButtons.map((button, index) => (
                    <StrapiIconButton
                      key={button.id || index}
                      component={button}
                      className={`rounded-lg ${index === 1 ? "bg-background/50 backdrop-blur-sm" : ""}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right column - Benefits */}
            {component.benefits && component.benefits.length > 0 && (
              <div className="grid grid-cols-2 gap-8">
                {component.benefits.map((benefit, index) => (
                  <div key={benefit.id || index}>
                    <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiNewsletterCTASection.displayName = "StrapiNewsletterCTASection"

export default StrapiNewsletterCTASection
