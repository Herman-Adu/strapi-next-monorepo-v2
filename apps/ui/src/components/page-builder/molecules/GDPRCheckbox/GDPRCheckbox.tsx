import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { GlassmorphismCard } from "@/components/page-builder/molecules/GlassmorphismCard"

/**
 * GDPRCheckbox - Reusable GDPR consent checkbox component
 *
 * Supports three styling variants:
 * - glassmorphic-xl: Glassmorphic card with rounded-xl corners
 * - glassmorphic-sm: Glassmorphic card with rounded-sm corners
 * - simple: Minimal styling without card wrapper
 *
 * @example
 * // Glassmorphic variant (Newsletter CTA)
 * <GDPRCheckbox
 *   checked={agreedToTerms}
 *   onCheckedChange={setAgreedToTerms}
 *   link={{ href: "/privacy", label: "Privacy Policy", newTab: true }}
 *   variant="glassmorphic-xl"
 * />
 *
 * @example
 * // Simple variant (NewsletterForm)
 * <GDPRCheckbox
 *   checked={agreedToTerms}
 *   onCheckedChange={setAgreedToTerms}
 *   link={{ href: "/terms", label: "Terms & Conditions" }}
 *   labelPrefix="I consent to the"
 *   variant="simple"
 * />
 */

export interface GDPRCheckboxProps {
  /** Checkbox HTML id attribute */
  id?: string
  /** Checkbox checked state */
  checked: boolean
  /** Callback when checkbox state changes */
  onCheckedChange: (value: boolean) => void
  /** Link configuration for GDPR terms */
  link: {
    href: string
    label: string
    newTab?: boolean
  }
  /** Label prefix text (appears before the link) */
  labelPrefix?: string
  /** Styling variant */
  variant?: "glassmorphic-xl" | "glassmorphic-sm" | "simple"
  /** Additional CSS classes */
  className?: string
}

export function GDPRCheckbox({
  id = "gdpr-consent",
  checked,
  onCheckedChange,
  link,
  labelPrefix = "I agree to the",
  variant = "simple",
  className,
}: Readonly<GDPRCheckboxProps>) {
  const isGlassmorphic = variant.startsWith("glassmorphic")
  const isSimple = variant === "simple"

  const checkboxContent = (
    <div
      className={
        isSimple
          ? "text-muted-foreground group flex items-start gap-2 text-xs"
          : "flex items-start gap-2.5"
      }
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
        className="border-input bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5 border-2"
      />
      <Label
        htmlFor={id}
        className={
          isSimple
            ? "hover:text-foreground cursor-pointer text-xs leading-relaxed transition-colors"
            : "text-card-foreground cursor-pointer text-sm leading-relaxed"
        }
      >
        {labelPrefix}{" "}
        <a
          href={link.href || "#"}
          target={link.newTab ? "_blank" : "_self"}
          rel={link.newTab ? "noopener noreferrer" : undefined}
          className={
            isSimple
              ? "text-primary decoration-primary group-hover:text-primary/80 underline transition-colors"
              : "text-primary decoration-primary/30 hover:decoration-primary font-medium underline underline-offset-4 transition-colors"
          }
        >
          {link.label}
        </a>
      </Label>
    </div>
  )

  if (isGlassmorphic) {
    return (
      <GlassmorphismCard
        size="sm"
        variant={variant === "glassmorphic-xl" ? "rounded-xl" : "rounded-sm"}
        className={className}
      >
        {checkboxContent}
      </GlassmorphismCard>
    )
  }

  return <div className={className}>{checkboxContent}</div>
}
