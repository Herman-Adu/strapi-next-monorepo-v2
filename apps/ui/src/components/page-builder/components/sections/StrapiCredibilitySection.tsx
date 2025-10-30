import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiStatCard } from "@/components/page-builder/components/elements/StrapiStatCard"
import { StrapiCompanyLogo } from "@/components/page-builder/components/elements/StrapiCompanyLogo"

export function StrapiCredibilitySection({
  component,
}: {
  readonly component: Data.Component<"sections.credibility-section">
}) {
  return (
    <section className="relative z-10 py-16 md:py-24 border-y border-border/50">
      <Container className="mx-auto px-4">
        {/* Stats */}
        {component.stats && component.stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
            {component.stats.map((stat, index) => (
              <StrapiStatCard key={stat.id || index} component={stat} />
            ))}
          </div>
        )}

        {/* Company Logos */}
        {component.companyLogos && component.companyLogos.length > 0 && (
          <div className="pt-8 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
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
