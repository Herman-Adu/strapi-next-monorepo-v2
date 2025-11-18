import { Data } from "@repo/strapi"

import { NewsletterForm } from "@/components/elementary/forms/NewsletterForm"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

interface Props {
  readonly component: Data.Component<"forms.newsletter-form"> | undefined | null
}

export function StrapiNewsletter({ component }: Props) {
  if (!component) return null

  return (
    <div className="flex flex-col">
      {component.title && (
        <h3 className="text-foreground mb-4 text-base font-semibold tracking-wide">
          {component.title}
        </h3>
      )}

      {component.description && (
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          {component.description}
        </p>
      )}

      <div className="mb-4">
        <NewsletterForm
          gdpr={
            component.gdpr
              ? {
                  href: component.gdpr.href || undefined,
                  label: component.gdpr.label || undefined,
                  newTab: component.gdpr.newTab || false,
                }
              : undefined
          }
        />
      </div>

      {component.gdpr && (
        <div className="text-muted-foreground text-xs">
          Note: By subscribing, you agree to our{" "}
          <StrapiLink
            component={component.gdpr}
            className="hover:text-foreground underline underline-offset-2 transition-colors duration-200"
          />
        </div>
      )}
    </div>
  )
}

StrapiNewsletter.displayName = "StrapiNewsletter"

export default StrapiNewsletter
