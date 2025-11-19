import { Data } from "@repo/strapi"

import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function StrapiFaq({
  component,
}: {
  readonly component: Data.Component<"sections.faq">
}) {
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

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
        {component.badge && <SectionBadge badge={component.badge} />}
        {component.header && <SectionHeader header={component.header} />}

        {/* Accordions */}
        {component.accordions && component.accordions.length > 0 && (
          <div className="mx-auto w-full max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {component.accordions.map((item) => (
                <AccordionItem key={item.id} value={item.id.toString()}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq
