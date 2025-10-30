import { Data } from "@repo/strapi"

export function StrapiStatCard({
  component,
}: {
  readonly component: Data.Component<"elements.stat-card">
}) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2">{component.number}</div>
      <div className="text-muted-foreground">{component.description}</div>
    </div>
  )
}

StrapiStatCard.displayName = "StrapiStatCard"

export default StrapiStatCard
