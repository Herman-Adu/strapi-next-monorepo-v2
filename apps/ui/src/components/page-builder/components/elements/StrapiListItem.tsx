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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-primary" />
          </div>
        </div>
      )
    }
    if (component.iconType === "circle") {
      return (
        <div className="flex-shrink-0 mt-1">
          <Circle className="w-6 h-6 text-muted-foreground" />
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex gap-4">
      {renderIcon()}
      <div>
        <h3 className="text-lg font-semibold mb-2">{component.title}</h3>
        <p className="text-muted-foreground text-balance leading-relaxed">{component.description}</p>
      </div>
    </div>
  )
}

StrapiListItem.displayName = "StrapiListItem"

export default StrapiListItem
