import Image from "next/image"
import { Data } from "@repo/strapi"
import { getTranslations } from "next-intl/server"

import { AppLocale } from "@/types/general"

import { getAuth } from "@/lib/auth"
import { fetchNavbar } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import AppLink from "@/components/elementary/AppLink"
import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import { ThemeToggle } from "@/components/elementary/ThemeToggle"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import StrapiSocialLinks from "@/components/page-builder/components/utilities/StrapiSocialLinks"
import { LoggedUserMenu } from "@/components/page-builder/single-types/navbar/LoggedUserMenu"
import MobileNavigation from "@/components/page-builder/single-types/navbar/MobileNavigation"

const hardcodedLinks: NonNullable<
  Data.ContentType<"api::navbar.navbar">["links"]
> = []

export async function StrapiNavbar({ locale }: { readonly locale: AppLocale }) {
  const response = await fetchNavbar(locale)
  const navbar = response?.data

  if (navbar == null) {
    return null
  }

  const t = await getTranslations("navbar")

  const links = (navbar.links ?? [])
    .filter((link) => link.href)
    .concat(...hardcodedLinks)

  const session = await getAuth()

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 border-border/100 sticky top-0 z-50 w-full border-b shadow-[0_4px_8px_-2px_rgba(59,130,246,0.15)] backdrop-blur-md transition-colors duration-300 dark:shadow-[0_4px_8px_-2px_rgba(96,165,250,0.15)]">
      <div
        className="container mx-auto flex h-[80px] items-center px-4 sm:px-6 lg:px-8"
        suppressHydrationWarning
      >
        <div
          className="flex w-full items-center justify-between"
          suppressHydrationWarning
        >
          {/* Logo - Left Column */}
          <div className="flex flex-shrink-0 items-center">
            {navbar.logoImage ? (
              <StrapiImageWithLink
                component={navbar.logoImage}
                linkProps={{
                  className:
                    "flex items-center hover:opacity-80 transition-opacity p-0",
                }}
                imageProps={{
                  hideWhenMissing: true,
                  className: "h-8 w-auto object-contain",
                }}
              />
            ) : (
              <AppLink
                href="/"
                className="flex items-center p-0 text-xl font-bold transition-opacity hover:opacity-80"
              >
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  height={32}
                  width={120}
                  className="h-8 w-auto object-contain"
                />
              </AppLink>
            )}
          </div>

          {/* Navigation Links - Center (Desktop) */}
          <nav className="hidden items-center space-x-4 md:flex lg:space-x-6 xl:space-x-8">
            {links.map((link) => (
              <StrapiLink
                component={link}
                key={link.href}
                className={cn(
                  "relative px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 lg:px-3",
                  "text-foreground/80 hover:text-foreground",
                  "no-underline hover:no-underline", // Override default link underline
                  "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5",
                  "after:bg-primary after:scale-x-0 after:transition-transform after:duration-200",
                  "hover:after:scale-x-100"
                )}
              />
            ))}
          </nav>

          {/* Social Links - Center Column (Mobile/Tablet only) */}
          <div className="-mx-1 flex flex-shrink-0 items-center md:hidden">
            <StrapiSocialLinks
              socialLinks={navbar.socialLinks ?? undefined}
              className="flex items-center gap-4"
            />
          </div>

          {/* Actions - Right Column */}
          <div className="-mr-2 flex flex-shrink-0 items-center space-x-2 md:mr-0 md:space-x-0 lg:space-x-4">
            {/* Hide ThemeToggle on small screens, show from md onwards */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Hide LocaleSwitcher on small screens, show from md onwards */}
            <div className="hidden md:block">
              <LocaleSwitcher locale={locale} />
            </div>

            {session?.user ? (
              <nav className="flex items-center space-x-2">
                <LoggedUserMenu user={session.user} />
              </nav>
            ) : (
              <AppLink
                href="/auth/signin"
                className={cn(
                  "hidden h-9 items-center rounded-md px-3 text-sm font-medium md:inline-flex",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "focus:ring-primary transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                )}
              >
                {t("actions.signIn")}
              </AppLink>
            )}

            {/* Mobile Navigation Button Only */}
            <div className="md:hidden">
              <MobileNavigation
                navbar={navbar}
                links={links}
                locale={locale}
                session={session}
                signInText={t("actions.signIn")}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
