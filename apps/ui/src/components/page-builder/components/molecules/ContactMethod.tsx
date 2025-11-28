import Link from "next/link"
import { Data } from "@repo/strapi"

import { Icon } from "@/components/page-builder/atoms/Icon"

interface ContactMethodProps {
  method: Data.Component<"molecules.contact-method">
}

export function ContactMethod({ method }: ContactMethodProps) {
  const { icon, title, description, link } = method

  const content = (
    <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:gap-4">
      {/* Icon */}
      {icon && icon.iconType && (
        <div className="flex-shrink-0">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <Icon
              iconType={icon.iconType}
              lucideName={icon.lucideName ?? undefined}
              emoji={icon.emoji ?? undefined}
              customImage={icon.customImage ?? undefined}
              size="lg"
              className="text-primary"
            />
          </div>
        </div>
      )}

      {/* Text Content */}
      <div className="flex-1 text-center lg:text-left">
        <h3 className="text-foreground mb-1 font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )

  // Wrap in link if provided
  if (link?.href) {
    return (
      <Link
        href={link.href}
        target={link.newTab ? "_blank" : undefined}
        rel={link.newTab ? "noopener noreferrer" : undefined}
        className="hover:bg-accent/50 -m-3 block rounded-lg p-3 transition-colors"
      >
        {content}
      </Link>
    )
  }

  return <div className="-m-3 p-3">{content}</div>
}
