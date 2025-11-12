"use client"

import { useState } from "react"
import { Data } from "@repo/strapi"
import { ArrowRight } from "lucide-react"

import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StrapiNewsletterCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.newsletter-cta-section">
}) {
  const [email, setEmail] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      return
    }
    setIsSubmitting(true)
    // TODO: Implement newsletter subscription logic
    // Send to API endpoint
    // Example: await fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setEmail("")
    setAgreedToTerms(false)
  }

  // Use background from Strapi, or provide default bordered style
  const backgroundConfig:
    | Data.Component<"shared.section-background">
    | undefined = component.background ?? {
    id: 0,
    backgroundStyle: "transparent" as const,
    containerStyle: "bordered" as const,
    containerWidth: "default" as const,
    padding: "spacious" as const,
    gradient: false,
  }

  return (
    <SectionWrapper background={backgroundConfig}>
      <div className="w-full space-y-12">
        <SectionBadge badge={component.badge ?? undefined} />

        <div className="mx-auto w-full max-w-6xl">
          <div className="grid w-full items-start gap-12 @2xl:gap-16 @3xl:grid-cols-[1.2fr_1fr] @4xl:gap-20">
            {/* Left column - Form */}
            <div>
              {/* Use SectionHeader if configured, otherwise fallback to legacy fields */}
              {component.header ? (
                <SectionHeader
                  header={component.header}
                  className="mb-0 text-left"
                />
              ) : (
                <div className="space-y-6">
                  <h2 className="text-primary dark:text-foreground text-3xl font-bold md:text-4xl">
                    {component.heading}
                  </h2>
                  {component.description && (
                    <p className="text-foreground/80 leading-relaxed">
                      {component.description}
                    </p>
                  )}
                </div>
              )}

              {/* Newsletter Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="flex flex-col gap-3 @lg:flex-row">
                  <Input
                    type="email"
                    placeholder={
                      component.inputPlaceholder || "Enter your email"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus:border-primary/50 border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/20 flex-1 rounded-lg border-2 px-4 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!agreedToTerms || isSubmitting}
                    className="rounded-lg shadow-md transition-shadow hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      "Subscribing..."
                    ) : (
                      <>
                        {component.buttonText || "Subscribe"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                {/* GDPR Checkbox */}
                {component.gdprLink && (
                  <div className="border-border bg-card flex items-start gap-2.5 rounded-md border p-3.5 shadow-sm">
                    <Checkbox
                      id="gdpr-consent"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked === true)
                      }
                      className="border-input bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5 border-2"
                    />
                    <Label
                      htmlFor="gdpr-consent"
                      className="text-card-foreground cursor-pointer text-sm leading-relaxed"
                    >
                      {component.gdprLabel || "I agree to the"}{" "}
                      <a
                        href={component.gdprLink.href || "#"}
                        target={component.gdprLink.newTab ? "_blank" : "_self"}
                        rel={
                          component.gdprLink.newTab
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-primary decoration-primary/30 hover:decoration-primary font-medium underline underline-offset-4 transition-colors"
                      >
                        {component.gdprLink.label}
                      </a>
                    </Label>
                  </div>
                )}
              </form>

              {/* Optional CTA Buttons */}
              {component.ctaButtons && component.ctaButtons.length > 0 && (
                <div className="mt-6 flex flex-col gap-4 @lg:flex-row">
                  {component.ctaButtons.map((button, index) => (
                    <StrapiIconButton
                      key={button.id || index}
                      component={button}
                      className={`rounded-lg ${index === 1 ? "bg-background/50 backdrop-blur-sm" : ""}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right column - Benefits */}
            {component.benefits && component.benefits.length > 0 && (
              <div className="grid w-full auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2 @2xl:gap-8">
                {component.benefits.map((benefit, index) => (
                  <div
                    key={benefit.id || index}
                    className="group border-primary/10 from-primary/5 via-background to-background hover:border-primary/20 hover:shadow-primary/5 relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="bg-primary/5 group-hover:bg-primary/10 absolute top-0 right-0 h-24 w-24 blur-2xl transition-all duration-300" />
                    <div className="relative">
                      <h3 className="text-primary dark:text-foreground mb-2 font-semibold">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

StrapiNewsletterCTASection.displayName = "StrapiNewsletterCTASection"

export default StrapiNewsletterCTASection
