import * as React from "react"

import { cn } from "@/lib/styles"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "placeholder:text-muted-foreground border-input bg-background text-foreground flex h-full min-h-36 w-full rounded-[4px] border px-4 py-3 text-sm shadow-xs focus:ring-0 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
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
