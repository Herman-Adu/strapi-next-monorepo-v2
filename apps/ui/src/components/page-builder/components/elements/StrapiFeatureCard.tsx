import { Data } from "@repo/strapi"

export function StrapiFeatureCard({
  component,
}: {
  readonly component: Data.Component<"elements.feature-card">
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-6 transition-shadow hover:shadow-lg">
      <div className="text-4xl">{component.icon}</div>
      <h3 className="text-xl font-semibold">{component.title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {component.description}
      </p>
    </div>
  )
}

StrapiFeatureCard.displayName = "StrapiFeatureCard"

export default StrapiFeatureCard
