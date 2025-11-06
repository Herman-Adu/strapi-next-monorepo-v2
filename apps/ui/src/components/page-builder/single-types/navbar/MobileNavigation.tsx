import { Data } from "@repo/strapi"

import { AppLocale } from "@/types/general"

import MobileNavigationClient from "@/components/page-builder/single-types/navbar/MobileNavigationClient"

interface Props {
  readonly navbar: Data.ContentType<"api::navbar.navbar">
  readonly links: NonNullable<Data.ContentType<"api::navbar.navbar">["links"]>
  readonly locale: AppLocale
  readonly session: any
  readonly signInText?: string
}

export function MobileNavigation(props: Props) {
  return <MobileNavigationClient {...props} />
}

MobileNavigation.displayName = "MobileNavigation"

export default MobileNavigation
