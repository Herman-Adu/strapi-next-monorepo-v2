"use client"

import { useState } from "react"
import { Data } from "@repo/strapi"
import { ArrowRight } from "lucide-react"

import { useSubscriberForm } from "@/hooks/useAppForm"
import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"
import { TextStyle } from "@/components/page-builder/atoms/TextStyle"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function StrapiNewsletterCTASection({
  component,
}: {
  readonly component: Data.Component<"sections.newsletter-cta-section">
}) {
  const { toast } = useToast()
  const subscriberMutation = useSubscriberForm()
  const [email, setEmail] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms || !email) {
      return
    }

    subscriberMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Thank you for subscribing to our newsletter.",
            variant: "success",
          })

          // Reset form on success
          setEmail("")
          setAgreedToTerms(false)
        },
        onError: (error: any) => {
          // Check if it's a duplicate email error
          const isDuplicateError =
            error?.response?.data?.error?.message?.includes("unique") ||
            error?.response?.data?.error?.message?.includes("already exists") ||
            error?.message?.includes("unique")

          toast({
            title: isDuplicateError
              ? "Already Subscribed"
              : "Subscription Failed",
            description: isDuplicateError
              ? "This email is already subscribed to our newsletter."
              : "Something went wrong. Please try again.",
            variant: "destructive",
          })

          // Only log non-duplicate errors (duplicate is expected behavior)
          if (!isDuplicateError) {
            console.error("Newsletter subscription error:", error)
          }
        },
      }
    )
  }

  // SPACING ARCHITECTURE (see SPACING_ARCHITECTURE_GUIDE.md)
  // Background component controls:
  // 1. Section-level padding (none|compact|default|spacious)
  // 2. Container style (full|boxed|bordered|none)
  // This padding maps to internal section gaps (Badge → Header → Content)
  // Empty object allows SectionWrapper to use all defaults
  const backgroundConfig: Data.Component<"shared.section-background"> =
    component.background || ({} as Data.Component<"shared.section-background">)

  // Map background padding to section gaps
  // Background padding controls section-level vertical spacing (Badge → Header → Content)
  const backgroundPadding = backgroundConfig.padding ?? "default"

  const sectionGap = (
    {
      none: "gap-4",
      compact: "gap-8", // Section separation gap (matches background padding)
      default: "gap-12", // Section separation gap (matches background padding)
      spacious: "gap-16", // Section separation gap (matches background padding)
    } as const
  )[backgroundPadding]

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Uniform spacing architecture:
          - Badge→Header gap = Header→Content gap (both controlled by sectionGap from background.padding)
          - SectionHeader just renders content - parent's gap controls all vertical spacing */}
      <div className={`flex w-full flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden */}
        <SectionBadge badge={component.badge ?? undefined} />

        {/* Header - returns fragment with heading+divider and description as separate children */}
        {component.header && (
          <SectionHeader header={component.header} className="mb-0" />
        )}

        {/* Main content section */}
        <div className="w-full">
          <div className="grid w-full items-start gap-8 @2xl:gap-12 @3xl:grid-cols-[1.2fr_1fr] @4xl:gap-16">
            {/* Left column - Form */}
            <div>
              {/* Newsletter form heading and description */}
              <div className="space-y-6">
                {component.heading && (
                  <div className="relative">
                    {component.headingTextStyle?.textStyle === "two-tone" &&
                    component.headingAccent ? (
                      // Two-tone style - split into accent + heading
                      <h2 className="text-3xl font-bold md:text-4xl">
                        <span className="text-primary">
                          {component.headingAccent}
                        </span>{" "}
                        <span className="text-muted-foreground dark:text-foreground">
                          {component.heading}
                        </span>
                      </h2>
                    ) : component.headingTextStyle ? (
                      // Gradient or custom style
                      <TextStyle
                        textStyle={component.headingTextStyle}
                        as="h2"
                        className="text-3xl font-bold md:text-4xl"
                      >
                        {component.headingAccent
                          ? `${component.headingAccent} ${component.heading}`
                          : component.heading}
                      </TextStyle>
                    ) : (
                      // Default solid color
                      <h2 className="text-primary dark:text-foreground text-3xl font-bold md:text-4xl">
                        {component.heading}
                      </h2>
                    )}

                    {component.showDivider && (
                      <div className="from-primary/60 to-primary absolute -bottom-3 left-0 h-1 w-24 rounded-full bg-gradient-to-r" />
                    )}
                  </div>
                )}

                {component.description && (
                  <p className="text-foreground/80 leading-relaxed">
                    {component.description}
                  </p>
                )}
              </div>

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
                    disabled={!agreedToTerms || subscriberMutation.isPending}
                    className="rounded-lg shadow-md transition-shadow hover:shadow-lg"
                  >
                    {subscriberMutation.isPending ? (
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
                  <div className="group border-primary/10 from-primary/5 via-background to-background hover:border-primary/20 hover:shadow-primary/5 relative overflow-hidden rounded-xl border bg-gradient-to-br p-3.5 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="bg-primary/5 group-hover:bg-primary/10 absolute top-0 right-0 h-24 w-24 blur-2xl transition-all duration-300" />
                    <div className="relative flex items-start gap-2.5">
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
                          target={
                            component.gdprLink.newTab ? "_blank" : "_self"
                          }
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
              <div className="grid w-full auto-rows-fr grid-cols-1 gap-6 @2xl:gap-8">
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
