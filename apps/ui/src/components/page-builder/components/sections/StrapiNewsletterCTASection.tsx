import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"

export function StrapiNewsletterCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.newsletter-cta-section">
}) {
  return (
    <section className="relative z-10 py-20 md:py-28 cta-gradient">
      <Container className="mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left column */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{component.heading}</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">{component.description}</p>

              {component.ctaButtons && component.ctaButtons.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
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
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
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
