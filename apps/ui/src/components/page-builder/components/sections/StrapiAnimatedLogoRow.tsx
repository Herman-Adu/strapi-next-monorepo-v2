import { Data } from "@repo/strapi"

import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import { cn } from "@/lib/styles"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export function StrapiAnimatedLogoRow({
  component,
}: {
  readonly component: Data.Component<"sections.animated-logo-row">
}) {
  removeThisWhenYouNeedMe("StrapiAnimatedLogoRow")

  if (!component.logos) return null

  const sliderImages = [...component.logos, ...component.logos]

  return (
    <section className="relative z-10 py-16 md:py-20">
      <div className="@container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-primary/20 from-primary/5 shadow-primary/10 mx-auto flex min-h-[300px] items-center rounded-2xl border-2 bg-gradient-to-br to-transparent p-8 shadow-lg @2xl:p-12 @4xl:p-16">
          <div className="w-full space-y-8 @2xl:space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold @2xl:text-4xl @4xl:text-5xl">
                {component.text}
              </h2>
            </div>

            <div className="relative w-full overflow-hidden">
              <div
                className="w-full"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                }}
              >
                <div
                  className={cn(
                    "infinite-scroll-horizontal flex gap-14",
                    component.logos?.length > 10 && "justify-center"
                  )}
                >
                  {sliderImages.map((logo, index) => (
                    <div
                      key={String(logo.id) + index}
                      className="opacity-70 grayscale dark:invert"
                    >
                      <StrapiBasicImage
                        component={logo}
                        forcedSizes={{ width: 200 }}
                        priority={index < 10}
                        loading="eager"
                        className="z-10 max-h-10 w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

StrapiAnimatedLogoRow.displayName = "StrapiAnimatedLogoRow"

export default StrapiAnimatedLogoRow
