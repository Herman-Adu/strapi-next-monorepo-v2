"use client"

import { useMutation } from "@tanstack/react-query"

import { PublicStrapiClient } from "@/lib/strapi-api"

export function useContactForm() {
  return useMutation({
    mutationFn: (values: { name: string; email: string; message: string }) => {
      const path = PublicStrapiClient.getStrapiApiPathByUId(
        "api::contact-message.contact-message"
      )

      return PublicStrapiClient.fetchAPI(
        path,
        undefined,
        {
          method: "POST",
          body: JSON.stringify({ data: values }),
        },
        { useProxy: true }
      )
    },
  })
}

export function useSubscriberForm() {
  return useMutation({
    mutationFn: async (values: { email: string }) => {
      const path = PublicStrapiClient.getStrapiApiPathByUId(
        "api::subscriber.subscriber"
      )

      try {
        return await PublicStrapiClient.fetchAPI(
          path,
          undefined,
          {
            method: "POST",
            body: JSON.stringify({ data: values }),
          },
          { useProxy: true }
        )
      } catch (error: any) {
        // Check if it's a duplicate email error (expected behavior)
        const isDuplicateError =
          error?.response?.data?.error?.message?.includes("unique") ||
          error?.message?.includes("unique") ||
          error?.message?.includes("already exists")

        // Re-throw the error to be caught by onError callback in components
        // But suppress console logging for duplicate errors
        if (isDuplicateError) {
          // Create a new error without stack trace to avoid console pollution
          const silentError = new Error(error.message)
          silentError.name = "DuplicateEmailError"
          Object.assign(silentError, error)
          throw silentError
        }

        // For non-duplicate errors, re-throw as-is
        throw error
      }
    },
  })
}
