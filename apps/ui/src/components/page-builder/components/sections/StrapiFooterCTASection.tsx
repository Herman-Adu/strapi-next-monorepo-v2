import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

export function StrapiFooterCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.footer-cta-section">
}) {
  return (
    <footer className="border-border/50 relative z-10 border-t py-16 md:py-24">
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* CTA Section */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">
              {component.heading}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed text-balance">
              {component.description}
            </p>

            {component.ctaButtons && component.ctaButtons.length > 0 && (
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                {component.ctaButtons.map((button, index) => (
                  <StrapiIconButton
                    key={button.id || index}
                    component={button}
                    className={`px-8 text-base ${index === 1 ? "bg-transparent" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Bottom */}
          <div className="border-border/50 border-t pt-8">
            <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
              <div className="flex items-center gap-2">
                {component.logo && (
                  <div className="bg-primary flex h-6 w-6 items-center justify-center rounded">
                    <span className="text-primary-foreground font-mono text-xs font-bold">
                      {component.logo}
                    </span>
                  </div>
                )}
                <span>{component.copyright}</span>
              </div>

              {component.footerLinks && component.footerLinks.length > 0 && (
                <div className="flex gap-6">
                  {component.footerLinks.map((link, index) => (
                    <StrapiLink
                      key={link.id || index}
                      component={link}
                      className="hover:text-foreground transition-colors"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

StrapiFooterCTASection.displayName = "StrapiFooterCTASection"

export default StrapiFooterCTASection
