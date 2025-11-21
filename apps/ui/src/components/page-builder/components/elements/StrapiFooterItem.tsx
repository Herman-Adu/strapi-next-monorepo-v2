import { Data } from "@repo/strapi"

import { cn } from "@/lib/styles"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

/**
 * StrapiFooterItem - Strapi wrapper for footer item molecule
 *
 * Renders a footer section with title and links.
 * Designed for footer navigation columns.
 *
 * @example
 * <StrapiFooterItem component={footerItemData} />
 */
export function StrapiFooterItem({
  component,
}: {
  readonly component: Data.Component<"molecules.footer-item">
}) {
  if (!component.title) return null

  return (
    <div className="flex flex-col">
      <h3 className="text-foreground mb-4 text-base font-semibold tracking-wide">
        {component.title}
      </h3>
      {component.links && component.links.length > 0 && (
        <div className="flex flex-col space-y-3">
          {component.links.map((link, i) => (
            <StrapiLink
              key={String(link.id) + i}
              component={link}
              className={cn(
                "relative w-fit px-0 py-1 text-sm font-medium transition-colors duration-200",
                "text-muted-foreground hover:text-foreground",
                "no-underline hover:no-underline",
                "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5",
                "after:bg-primary after:scale-x-0 after:transition-transform after:duration-200",
                "hover:after:scale-x-100"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

StrapiFooterItem.displayName = "StrapiFooterItem"

export default StrapiFooterItem
