import * as React from "react"

import { cn } from "@/lib/styles"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "placeholder:text-muted-foreground border-input bg-background text-foreground flex h-full w-full rounded-[4px] border px-4 py-3 text-sm shadow-xs focus:ring-0 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-32 @sm:min-h-36 @md:min-h-40 @lg:min-h-48",
          "max-h-64 @md:max-h-80 @lg:max-h-96 @xl:max-h-[600px]",
          className
        )}
        style={{ resize: "none" }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
