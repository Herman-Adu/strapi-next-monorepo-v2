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
    <section className="border-border/50 relative z-10 border-y py-16 md:py-24">
      <Container className="mx-auto px-4">
        {/* Stats */}
        {component.stats && component.stats.length > 0 && (
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {component.stats.map((stat, index) => (
              <StrapiStatCard key={stat.id || index} component={stat} />
            ))}
          </div>
        )}

        {/* Company Logos */}
        {component.companyLogos && component.companyLogos.length > 0 && (
          <div className="border-border/50 border-t pt-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
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
