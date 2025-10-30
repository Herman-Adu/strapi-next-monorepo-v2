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
    <footer className="relative z-10 border-t border-border/50 py-16 md:py-24">
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* CTA Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{component.heading}</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
              {component.description}
            </p>

            {component.ctaButtons && component.ctaButtons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {component.ctaButtons.map((button, index) => (
                  <StrapiIconButton
                    key={button.id || index}
                    component={button}
                    className={`text-base px-8 ${index === 1 ? "bg-transparent" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {component.logo && (
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                    <span className="font-mono text-xs font-bold text-primary-foreground">
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
