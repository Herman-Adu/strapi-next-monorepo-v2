import { Data } from "@repo/strapi"

export function StrapiFeatureCard({
  component,
}: {
  readonly component: Data.Component<"elements.feature-card">
}) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
      <div className="text-4xl">{component.icon}</div>
      <h3 className="text-xl font-semibold">{component.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{component.description}</p>
    </div>
  )
}

StrapiFeatureCard.displayName = "StrapiFeatureCard"

export default StrapiFeatureCard
