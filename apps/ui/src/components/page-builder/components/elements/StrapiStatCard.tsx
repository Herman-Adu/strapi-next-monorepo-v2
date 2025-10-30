import { Data } from "@repo/strapi"

export function StrapiStatCard({
  component,
}: {
  readonly component: Data.Component<"elements.stat-card">
}) {
  return (
    <div className="text-center">
      <div className="mb-2 text-4xl font-bold md:text-5xl">
        {component.number}
      </div>
      <div className="text-muted-foreground">{component.description}</div>
    </div>
  )
}

StrapiStatCard.displayName = "StrapiStatCard"

export default StrapiStatCard
