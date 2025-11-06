import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiCompanyLogo } from "@/components/page-builder/components/elements/StrapiCompanyLogo"
import { StrapiStatCard } from "@/components/page-builder/components/elements/StrapiStatCard"

export function StrapiCredibilitySection({
  component,
}: {
  readonly component: Data.Component<"sections.credibility-section">
}) {
  return (
    <section className="bg-background relative z-10 overflow-hidden py-20 md:py-32">
      <Container className="mx-auto px-4">
        {/* Stats */}
        {component.stats && component.stats.length > 0 && (
          <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
            {component.stats.map((stat, index) => (
              <StrapiStatCard key={stat.id || index} component={stat} />
            ))}
          </div>
        )}

        {/* Company Logos */}
        {component.companyLogos && component.companyLogos.length > 0 && (
          <div className="px-8 py-12">
            <h3 className="text-muted-foreground mb-12 text-center text-sm font-medium tracking-wider uppercase">
              Trusted by Industry Leaders
            </h3>
            <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
              {component.companyLogos.map((logo, index) => (
                <StrapiCompanyLogo key={logo.id || index} component={logo} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiCredibilitySection.displayName = "StrapiCredibilitySection"

export default StrapiCredibilitySection
