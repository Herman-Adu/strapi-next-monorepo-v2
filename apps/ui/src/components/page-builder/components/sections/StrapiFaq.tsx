import { Data } from "@repo/strapi"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
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
  return (
    <section className="bg-background">
      <Container className="py-8">
        <div className="flex flex-col items-center">
          <h2
            className={cn(
              "mb-4 text-center font-semibold text-balance",
              "text-3xl sm:text-4xl md:text-5xl",
              "text-primary dark:text-foreground"
            )}
          >
            {component.title}
          </h2>

          <p className="text-muted-foreground mb-8 text-center text-base sm:text-lg">
            {component.subTitle}
          </p>

          {component.accordions && (
            <div className="w-full">
              <Accordion type="single" collapsible className="w-full">
                {component.accordions.map((x) => (
                  <AccordionItem key={x.id} value={x.id.toString()}>
                    <AccordionTrigger>{x.question}</AccordionTrigger>
                    <AccordionContent>{x.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq
