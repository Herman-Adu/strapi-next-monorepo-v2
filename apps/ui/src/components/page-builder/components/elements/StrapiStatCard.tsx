import { Data } from "@repo/strapi"

export function StrapiStatCard({
  component,
}: {
  readonly component: Data.Component<"elements.stat-card">
}) {
  return (
    <div className="text-center">
      <div className="mb-3 text-5xl font-bold tracking-tight md:text-6xl">
        {component.number}
      </div>
      <div className="text-muted-foreground text-sm leading-relaxed md:text-base">
        {component.description}
      </div>
    </div>
  )
}

StrapiStatCard.displayName = "StrapiStatCard"

export default StrapiStatCard
