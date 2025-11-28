import { Data } from "@repo/strapi"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { Starfield } from "@/components/elementary/Starfield"
import { ContactForm } from "@/components/elementary/forms/ContactForm"
import Paragraph from "@/components/typography/Paragraph"

export function StrapiContactForm({
  component,
}: {
  readonly component: Data.Component<"forms.contact-form">
}) {
  return (
    <div className="bg-background relative overflow-hidden" id="form-section">
      <Starfield />
      <Container className="relative z-10 flex flex-col gap-10 lg:flex-row lg:gap-40">
        <div className="flex flex-1">
          <div className="flex max-w-[400px] flex-col gap-10">
            {/* {component.title && (
              <h2
                className={cn(
                  "text-center font-semibold text-balance",
                  "text-3xl sm:text-4xl md:text-5xl lg:text-start",
                  "text-primary dark:text-foreground"
                )}
              >
                {component.title}
              </h2>
            )}
            {component.description && (
              <Paragraph className="text-muted-foreground">
                {component.description}
              </Paragraph>
            )} */}
          </div>
        </div>
        <div className="flex flex-1">
          <ContactForm
          /* gdpr={{
              href: component.gdpr?.href ?? undefined,
              label: component.gdpr?.label ?? undefined,
              newTab: component.gdpr?.newTab ?? false,
            }} */
          />
        </div>
      </Container>
    </div>
  )
}

StrapiContactForm.displayName = "StrapiContactForm"

export default StrapiContactForm
