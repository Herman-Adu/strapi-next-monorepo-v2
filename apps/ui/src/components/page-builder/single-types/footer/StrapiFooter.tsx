import { AppLocale } from "@/types/general"

import { fetchFooter } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import StrapiNewsletter from "@/components/page-builder/components/forms/StrapiNewsletter"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
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
                <div key={section.id} className="flex flex-col">
                  <h3 className="text-foreground mb-4 text-base font-semibold tracking-wide">
                    {section.title}
                  </h3>
                  <div className="flex flex-col space-y-3">
                    {section.links?.map((link, i) => (
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
                </div>
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
