import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiCompanyLogo } from "@/components/page-builder/components/elements/StrapiCompanyLogo"
import { Marquee } from "@/components/ui/marquee"

export function StrapiTechStackSection({
  component,
}: {
  readonly component: Data.Component<"sections.tech-stack-section">
}) {
  const isMarquee = component.displayStyle === "marquee"

  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
        {/* Optional Badge - Above Title */}
        {component.badgeText && (
          <div className="mb-8 flex justify-center">
            <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
              {component.badgeIcon && (
                <span className="text-lg">{component.badgeIcon}</span>
              )}
              {component.badgeText}
            </span>
          </div>
        )}

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

        {component.technologies && component.technologies.length > 0 && (
          <>
            {isMarquee ? (
              <div className="mx-auto mt-8">
                {/* Marquee Container */}
                <div className="from-muted/40 via-muted/20 to-muted/40 rounded-2xl bg-gradient-to-br px-6 py-10 shadow-sm md:px-12 md:py-16">
                  <Marquee
                    pauseOnHover
                    className="[--duration:40s] [--gap:2rem]"
                  >
                    {component.technologies.map((tech, index) => (
                      <div
                        key={tech.id || index}
                        className="flex items-center justify-center"
                      >
                        <StrapiCompanyLogo component={tech} />
                      </div>
                    ))}
                  </Marquee>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-6">
                {component.technologies.map((tech, index) => (
                  <div
                    key={tech.id || index}
                    className="group border-border/40 flex items-center justify-center rounded-xl border px-6 py-8 transition-colors md:p-6"
                  >
                    <StrapiCompanyLogo component={tech} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  )
}

StrapiTechStackSection.displayName = "StrapiTechStackSection"

export default StrapiTechStackSection
