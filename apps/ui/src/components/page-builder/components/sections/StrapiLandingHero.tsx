import { Data } from "@repo/strapi"

import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/elementary/Container"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"

export function StrapiLandingHero({
  component,
}: {
  readonly component: Data.Component<"sections.landing-hero">
}) {
  return (
    <section className="relative z-10 py-20 md:py-32">
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            {component.badge}
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            {component.heading}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-balance leading-relaxed">
            {component.description}
          </p>

          {component.ctaButtons && component.ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {component.ctaButtons.map((button, index) => (
                <StrapiIconButton
                  key={button.id || index}
                  component={button}
                  className="text-base px-8 h-12 rounded-lg"
                />
              ))}
            </div>
          )}

          {component.footerText && (
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{component.footerText}</p>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiLandingHero.displayName = "StrapiLandingHero"

export default StrapiLandingHero
