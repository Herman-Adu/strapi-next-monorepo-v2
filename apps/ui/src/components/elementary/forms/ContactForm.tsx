"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useContactForm } from "@/hooks/useAppForm"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { AppTextArea } from "@/components/forms/AppTextArea"
import { useToast } from "@/components/ui/use-toast"

export function ContactForm() {
  const t = useTranslations("contactForm")
  const { toast } = useToast()
  const contactFormMutation = useContactForm()

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
          title: "Success!",
          variant: "success",
          description: t("success"),
          // @ts-ignore - Custom prop for E2E testing
          "data-testid": "contact-form-success-toast",
        })
        form.reset()
      },
      onError: (error) => {
        toast({
          title: "Error",
          variant: "destructive",
          description: error.message || t("error"),
        })
      },
    })
  }

  return (
    <AppForm
      form={form}
      onSubmit={onSubmit}
      id={contactFormName}
      className="flex h-full w-full flex-col gap-4"
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
        containerClassName="flex-1"
      />

      {contactFormMutation.error && (
        <div className="text-center text-red-500">
          <p>{contactFormMutation.error.message || t("error")}</p>
        </div>
      )}
    </AppForm>
  )
}

const ContactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  message: z.string().min(10),
})

type FormSchemaType = typeof ContactFormSchema

export const contactFormName = "contactForm"
