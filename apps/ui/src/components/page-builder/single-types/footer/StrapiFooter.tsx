import { AppLocale } from "@/types/general"

import { fetchFooter } from "@/lib/strapi-api/content/server"
import StrapiNewsletter from "@/components/page-builder/components/forms/StrapiNewsletter"
import StrapiFooterItem from "@/components/page-builder/components/elements/StrapiFooterItem"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiSocialLinks from "@/components/page-builder/components/utilities/StrapiSocialLinks"

export async function StrapiFooter({ locale }: { readonly locale: AppLocale }) {
  const response = await fetchFooter(locale)
  const component = response?.data

  if (component == null) {
    return null
  }

  return (
    <footer className="bg-background border-border/40 shadow-primary/10 dark:shadow-primary/15 mt-auto border-t shadow-[0_-4px_8px_-2px]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Logo/Company Section */}
          <div className="lg:col-span-1">
            {/* Company Title or Logo */}
            {component.companyTitle ? (
              <h2 className="text-foreground mb-6 text-lg font-bold tracking-wide">
                {component.companyTitle}
              </h2>
            ) : component.logoImage ? (
              <div className="mb-6">
                <StrapiImageWithLink
                  component={component.logoImage}
                  linkProps={{
                    className:
                      "inline-block hover:opacity-80 transition-opacity",
                  }}
                  imageProps={{
                    hideWhenMissing: true,
                    className: "h-12 w-auto object-contain",
                  }}
                />
              </div>
            ) : null}

            {/* Description */}
            {component.description && (
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                {component.description}
              </p>
            )}

            {/* Social Links */}
            <StrapiSocialLinks
              socialLinks={component.socialLinks ?? undefined}
              variant="footer"
              className="mb-6"
            />
          </div>

          {/* Footer Sections */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
              {component.sections?.map((section) => (
                <StrapiFooterItem key={section.id} component={section} />
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <StrapiNewsletter component={component.newsletter} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-border/40 border-t">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Copyright */}
            <div className="flex items-center">
              {component.copyRight && (
                <p className="text-muted-foreground text-sm">
                  {component.copyRight.replace(
                    "{YEAR}",
                    new Date().getFullYear().toString()
                  )}
                </p>
              )}
            </div>

            {/* Professional Attribution */}
            <div className="flex items-center">
              <p className="text-muted-foreground text-sm">
                Designed and built by{" "}
                <span className="text-foreground hover:text-primary font-medium transition-colors duration-200">
                  Fullstack Fusion
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

StrapiFooter.displayName = "StrapiFooter"

export default StrapiFooter
