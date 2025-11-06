import { Data } from "@repo/strapi"

export function StrapiIntegrationCard({
  component,
}: {
  readonly component: Data.Component<"elements.integration-card">
}) {
  const CardWrapper = component.link ? "a" : "div"
  const linkProps = component.link
    ? {
        href: component.link,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {}

  return (
    <CardWrapper
      {...linkProps}
      className="border-border bg-card group hover:border-primary/50 relative flex flex-col gap-3 rounded-lg border p-6 transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="text-4xl">{component.icon}</div>
        {component.category && (
          <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
            {component.category}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold">{component.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {component.description}
      </p>
      {component.link && (
        <div className="text-primary mt-2 flex items-center gap-1 text-sm font-medium">
          Learn more
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </CardWrapper>
  )
}

StrapiIntegrationCard.displayName = "StrapiIntegrationCard"

export default StrapiIntegrationCard
