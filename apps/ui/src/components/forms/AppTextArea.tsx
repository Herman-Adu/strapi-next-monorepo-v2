"use client"

import React from "react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/styles"
import { AppFormDescription } from "@/components/forms/AppFormDescription"
import { AppFormLabel } from "@/components/forms/AppFormLabel"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

/**
 * AppTextArea - Generic textarea form field component
 *
 * @description
 * Wraps shadcn/ui Textarea with React Hook Form integration.
 * Keeps layout agnostic - parent controls sizing via containerClassName.
 *
 * @example
 * ```tsx
 * // Standard usage
 * <AppTextArea name="message" label="Message" />
 *
 * // Dynamic height growth in flex layouts
 * <AppTextArea
 *   name="message"
 *   label="Message"
 *   containerClassName="flex-1"
 * />
 * ```
 */
type Props = {
  readonly name: string
  readonly label?: React.ReactNode
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">

export function AppTextArea({
  name,
  label,
  containerClassName,
  fieldClassName,
  description,
  ...nativeProps
}: Props) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(containerClassName)}>
          <AppFormLabel
            fieldState={fieldState}
            label={label}
            required={nativeProps.required}
          />

          <FormControl>
            <div className="relative flex items-stretch overflow-hidden">
              <Textarea
                {...nativeProps}
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                className={cn(
                  "border-input w-full rounded-sm ease-in-out",
                  {
                    "border-red-600": fieldState.invalid,
                  },
                  fieldClassName
                )}
              />
            </div>
          </FormControl>

          <AppFormDescription description={description} />

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
