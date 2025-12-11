"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MoveRight } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useSubscriberForm } from "@/hooks/useAppForm"
import { GDPRCheckbox } from "@/components/page-builder/molecules/GDPRCheckbox"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function NewsletterForm({
  gdpr,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}> = {}) {
  const { toast } = useToast()
  const subscriberMutation = useSubscriberForm()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(NewsletterFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<FormSchemaType>) {
    subscriberMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter.",
          variant: "success",
          // @ts-ignore - Custom prop for E2E testing
          "data-testid": "newsletter-form-success-toast",
        })
        form.reset()
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
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={newsletterForm}
        className="w-full"
      >
        <div className="relative">
          <AppField
            name="email"
            type="text"
            autoComplete="email"
            required
            fieldClassName="h-14 bg-background text-foreground"
            aria-label="email"
            placeholder="Enter your email"
          />
          <Button
            type="submit"
            className="absolute top-1/2 right-3 -translate-y-1/2 md:w-fit"
            form={newsletterForm}
            data-testid="newsletter-footer-submit"
            aria-label="Submit form"
            disabled={
              subscriberMutation.isPending ||
              (gdpr?.href ? !agreedToTerms : false)
            }
          >
            {subscriberMutation.isPending ? (
              <span className="size-4 animate-spin">⏳</span>
            ) : (
              <MoveRight className="size-4" />
            )}
          </Button>
        </div>
      </AppForm>

      {/* GDPR Checkbox */}
      {gdpr?.href && (
        <GDPRCheckbox
          scope="newsletter-footer"
          checked={agreedToTerms}
          onCheckedChange={setAgreedToTerms}
          link={{
            href: gdpr.href,
            label: gdpr.href || "terms and conditions",
            newTab: gdpr.newTab,
          }}
          labelPrefix={gdpr.label || ""}
          variant="simple"
        />
      )}
    </div>
  )
}

const NewsletterFormSchema = z.object({
  email: z.string().email(),
})

type FormSchemaType = typeof NewsletterFormSchema

export const newsletterForm = "newsletterForm"
