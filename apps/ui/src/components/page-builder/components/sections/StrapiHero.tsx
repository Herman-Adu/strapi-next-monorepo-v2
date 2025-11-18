import { Data } from "@repo/strapi"
import { Check } from "lucide-react"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { Starfield } from "@/components/elementary/Starfield"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

export function StrapiHero({
  component,
}: {
  readonly component: Data.Component<"sections.hero">
}) {
  const bgColor = component.bgColor ?? "transparent"
  const useStarfield = bgColor === "#000000" || bgColor === "black"

  return (
    <section
      style={{ backgroundColor: useStarfield ? "#000000" : bgColor }}
      className="relative overflow-hidden"
    >
      {useStarfield && <Starfield />}
      <Container className="relative z-10 flex flex-col gap-6 px-4 py-8 md:flex-row lg:py-12 xl:gap-0">
        <div
          className={`flex w-full flex-col justify-center ${
            component.image?.media ? "md:w-1/2" : "md:w-full"
          }`}
        >
          <h1
            className={cn(
              "mb-4 max-w-2xl text-center font-semibold text-balance",
              "text-3xl sm:text-4xl md:text-5xl lg:text-start",
              "text-primary dark:text-foreground"
            )}
          >
            {component.title}
          </h1>
          {component.subTitle && (
            <p
              className={cn(
                "mb-6 max-w-2xl text-center text-balance",
                "text-base sm:text-lg md:text-xl lg:text-start",
                useStarfield ? "text-muted-foreground" : "text-muted-foreground"
              )}
            >
              {component.subTitle}
            </p>
          )}
          {component?.steps &&
            component?.steps?.length > 0 &&
            component.steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 py-2">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <p className="text-foreground text-base sm:text-lg">
                  {step.text}
                </p>
              </div>
            ))}

          {component.links && (
            <div className="flex flex-col gap-2 pt-6 lg:flex-row lg:gap-4">
              {component.links.map((link, i) => (
                <StrapiLink
                  key={i}
                  component={link}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-400 focus:outline-none lg:w-fit"
                />
              ))}
            </div>
          )}
        </div>

        {component.image?.media && (
          <div className="flex items-center justify-center md:mt-0 md:w-1/2">
            <StrapiBasicImage
              component={component.image}
              className="max-h-[450px] w-full rounded-3xl object-cover md:max-h-[500px] lg:max-h-[550px]"
              forcedSizes={{ height: 550 }}
            />
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiHero.displayName = "StrapiHero"

export default StrapiHero
