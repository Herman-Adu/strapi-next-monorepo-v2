import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { Starfield } from "@/components/elementary/Starfield"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"
import { Badge } from "@/components/ui/badge"

export function StrapiLandingHero({
  component,
}: {
  readonly component: Data.Component<"sections.landing-hero">
}) {
  return (
    <section className="relative z-10 overflow-hidden py-20 md:py-32">
      <Starfield />
      <Container className="mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            {component.badge}
          </Badge>

          <h1 className="mb-6 text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
            {component.heading}
          </h1>

          <p className="text-muted-foreground mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-balance md:text-xl">
            {component.description}
          </p>

          {component.ctaButtons && component.ctaButtons.length > 0 && (
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {component.ctaButtons.map((button, index) => (
                <StrapiIconButton
                  key={button.id || index}
                  component={button}
                  className="h-12 rounded-lg px-8 text-base"
                />
              ))}
            </div>
          )}

          {component.footerText && (
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm">
              {component.footerText}
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiLandingHero.displayName = "StrapiLandingHero"

export default StrapiLandingHero
