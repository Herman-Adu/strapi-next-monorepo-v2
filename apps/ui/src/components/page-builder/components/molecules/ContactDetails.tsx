import { Data } from "@repo/strapi"
import { SectionHeader } from "@/components/page-builder/shared/SectionHeader"
import { ContactMethod } from "./ContactMethod"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"
import { StrapiCkEditorContent } from "@/components/page-builder/components/utilities/StrapiCkEditorContent"

interface ContactDetailsProps {
  details: Data.Component<"molecules.contact-details">
}

export function ContactDetails({ details }: ContactDetailsProps) {
  const { sectionHeader, contactMethods, additionalContent, ctaButtons } =
    details

  return (
    <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
      {/* Section Header */}
      {sectionHeader && (
        <SectionHeader
          header={sectionHeader}
          className="text-center lg:text-left"
        />
      )}

      {/* Contact Methods */}
      {contactMethods && contactMethods.length > 0 && (
        <div className="flex w-full flex-col gap-6">
          {contactMethods.map((method, index) => (
            <ContactMethod key={index} method={method} />
          ))}
        </div>
      )}

      {/* Additional Content (Rich Text) */}
      {additionalContent && (
        <div className="prose prose-sm dark:prose-invert w-full max-w-none">
          <StrapiCkEditorContent
            component={{ id: 0, content: additionalContent }}
          />
        </div>
      )}

      {/* CTA Buttons */}
      {ctaButtons && ctaButtons.length > 0 && (
        <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
          {ctaButtons.map((button, index) => (
            <StrapiIconButton key={index} component={button} />
          ))}
        </div>
      )}
    </div>
  )
}
