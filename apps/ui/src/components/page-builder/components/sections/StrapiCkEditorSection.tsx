import React from "react"
import { Data } from "@repo/strapi"

import { SectionWrapper } from "@/components/page-builder/shared"
import CkEditorSSRRenderer from "@/components/elementary/ck-editor/CkEditorSSRRenderer"

export const StrapiCkEditorSection = ({
  component,
}: {
  readonly component: Data.Component<"sections.ck-editor-section">
}) => {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  const content = component.content?.content

  if (!content) return null

  // SPACING ARCHITECTURE - Background padding controls vertical spacing
  const backgroundPadding = backgroundConfig.padding ?? "default"
  const sectionGap = (
    {
      none: "gap-4",
      compact: "gap-8",
      default: "gap-12",
      spacious: "gap-16",
    } as const
  )[backgroundPadding]

  return (
    <SectionWrapper background={backgroundConfig}>
      <div className={`@container container flex flex-col ${sectionGap}`}>
        <CkEditorSSRRenderer htmlContent={content} className="w-full" />
      </div>
    </SectionWrapper>
  )
}

StrapiCkEditorSection.displayName = "CkEditorSection"

export default StrapiCkEditorSection
