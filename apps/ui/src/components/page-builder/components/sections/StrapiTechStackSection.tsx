import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiCompanyLogo } from "@/components/page-builder/components/elements/StrapiCompanyLogo"

export function StrapiTechStackSection({
  component,
}: {
  readonly component: Data.Component<"sections.tech-stack-section">
}) {
  const isMarquee = component.displayStyle === "marquee"

  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
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
              <div className="relative overflow-hidden">
                <div className="animate-marquee flex gap-12">
                  {component.technologies.map((tech, index) => (
                    <div key={tech.id || index} className="flex-shrink-0">
                      <StrapiCompanyLogo component={tech} />
                    </div>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {component.technologies.map((tech, index) => (
                    <div
                      key={`duplicate-${tech.id || index}`}
                      className="flex-shrink-0"
                    >
                      <StrapiCompanyLogo component={tech} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {component.technologies.map((tech, index) => (
                  <StrapiCompanyLogo key={tech.id || index} component={tech} />
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
