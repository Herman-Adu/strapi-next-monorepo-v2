"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useContactForm } from "@/hooks/useAppForm"
import { GDPRCheckbox } from "@/components/page-builder/molecules/GDPRCheckbox"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { AppTextArea } from "@/components/forms/AppTextArea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function ContactForm({
  gdpr,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}>) {
  const t = useTranslations("contactForm")
  const { toast } = useToast()
  const contactFormMutation = useContactForm()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: { name: "", email: "", message: "" },
  })

  const onSubmit = (values: z.infer<FormSchemaType>) => {
    contactFormMutation.mutate(values, {
      onSuccess: () => {
        toast({
          variant: "success",
          description: t("success"),
        })
        form.reset()
        setAgreedToTerms(false)
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          description: error.message || t("error"),
        })
      },
    })
  }

  return (
    <div className="flex w-full flex-col">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={contactFormName}
        className="w-full"
      >
        <AppField
          name="name"
          type="text"
          required
          label={t("name")}
          placeholder={t("namePlaceholder")}
        />
        <AppField
          name="email"
          type="text"
          autoComplete="email"
          required
          label={t("email")}
          placeholder={t("emailPlaceholder")}
        />
        <AppTextArea
          name="message"
          required
          label={t("message")}
          placeholder={t("messagePlaceholder")}
          aria-label="contact-message"
        />
      </AppForm>
      <div className="mt-5 flex w-full flex-col gap-1">
        {/* GDPR Checkbox */}
        {gdpr?.href && (
          <GDPRCheckbox
            checked={agreedToTerms}
            onCheckedChange={setAgreedToTerms}
            link={{
              href: gdpr.href || "#",
              label: gdpr.label || "Terms & Conditions",
              newTab: gdpr.newTab,
            }}
            labelPrefix="I agree to your"
            variant="glassmorphic-sm"
          />
        )}

        <Button
          type="submit"
          className="mt-4 w-full rounded-sm"
          size="lg"
          form={contactFormName}
          disabled={
            contactFormMutation.isPending ||
            (gdpr?.href ? !agreedToTerms : false)
          }
        >
          {t("submit")}
        </Button>
      </div>

      {contactFormMutation.error && (
        <div className="text-center text-red-500">
          <p>{contactFormMutation.error.message || t("error")}</p>
        </div>
      )}
    </div>
  )
}

const ContactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  message: z.string().min(10),
})

type FormSchemaType = typeof ContactFormSchema

export const contactFormName = "contactForm"
