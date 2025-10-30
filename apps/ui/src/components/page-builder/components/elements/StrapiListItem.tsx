import { Data } from "@repo/strapi"
import { Check, Circle } from "lucide-react"

export function StrapiListItem({
  component,
}: {
  readonly component: Data.Component<"elements.list-item">
}) {
  const renderIcon = () => {
    if (component.iconType === "check") {
      return (
        <div className="flex-shrink-0">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Check className="text-primary h-5 w-5" />
          </div>
        </div>
      )
    }
    if (component.iconType === "circle") {
      return (
        <div className="mt-1 flex-shrink-0">
          <Circle className="text-muted-foreground h-6 w-6" />
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex gap-4">
      {renderIcon()}
      <div>
        <h3 className="mb-2 text-lg font-semibold">{component.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-balance">
          {component.description}
        </p>
      </div>
    </div>
  )
}

StrapiListItem.displayName = "StrapiListItem"

export default StrapiListItem
