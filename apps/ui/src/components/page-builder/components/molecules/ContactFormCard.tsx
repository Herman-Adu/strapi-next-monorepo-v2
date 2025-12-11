"use client"

import { useState } from "react"
import { Data } from "@repo/strapi"

import { ContactForm } from "@/components/elementary/forms/ContactForm"
import { GDPRCheckbox } from "@/components/page-builder/molecules/GDPRCheckbox"
import { Button } from "@/components/ui/button"
import { useContactForm } from "@/hooks/useAppForm"

/**
 * ContactFormCard - Client Component
 *
 * @description
 * Interactive contact form with GDPR compliance and submit handling.
 * Extracted as a Client Component to isolate form state management from
 * the server-rendered Contact Section layout.
 *
 * @remarks
 * - Client Component (uses useState, form mutation hooks)
 * - Manages GDPR checkbox state
 * - Handles form submission with loading/error states
 * - Styled as a card (rounded-lg border bg-card shadow-sm)
 *
 * @example
 * ```tsx
 * // In StrapiContactSection (Server Component)
 * <ContactFormCard contactFormData={component.contactForm} />
 * ```
 */
interface ContactFormCardProps {
  /** Contact form configuration from Strapi */
  contactFormData: Data.Component<"forms.contact-form"> | null | undefined
}

export function ContactFormCard({ contactFormData }: ContactFormCardProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const contactFormMutation = useContactForm()

  if (!contactFormData) return null

  return (
    <div className="bg-card flex h-full flex-col items-center rounded-lg border p-6 shadow-sm sm:p-8 lg:items-start">
      {/* Pure form fields only */}
      <ContactForm />

      {/* GDPR Checkbox - Managed by this component, not form */}
      {contactFormData.gdprLink && (
        <div className="mt-6">
          <GDPRCheckbox
            scope="contact"
            checked={agreedToTerms}
            onCheckedChange={setAgreedToTerms}
            link={{
              href: contactFormData.gdprLink.href || "#",
              label: contactFormData.gdprLink.label || "Privacy Policy",
              newTab: contactFormData.gdprLink.newTab ?? undefined,
            }}
            labelPrefix={contactFormData.gdprLabel || "I agree to the"}
            variant="glassmorphic-sm"
          />
        </div>
      )}

      {/* Submit Button - Managed by this component, not form */}
      <Button
        type="submit"
        className="mt-6 w-full"
        size="lg"
        form="contactForm"
        data-testid="contact-submit"
        disabled={
          contactFormMutation.isPending ||
          (contactFormData.gdprLink ? !agreedToTerms : false)
        }
      >
        Send Message
      </Button>
    </div>
  )
}

ContactFormCard.displayName = "ContactFormCard"
