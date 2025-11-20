import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"

import { GDPRCheckbox } from "./GDPRCheckbox"

/**
 * GDPRCheckbox - Molecule Level Component
 *
 * A reusable GDPR consent checkbox component with three styling variants.
 * Combines shadcn/ui Checkbox and Label atoms with optional GlassmorphismCard molecule.
 *
 * **Atomic Design Level**: Molecule
 * **Composed Of**:
 * - Checkbox (shadcn/ui atom)
 * - Label (shadcn/ui atom)
 * - GlassmorphismCard (molecule - glassmorphic variants only)
 *
 * **Used In**:
 * - Newsletter CTA sections (glassmorphic-xl variant)
 * - Newsletter forms (simple variant)
 * - Contact forms (simple/glassmorphic variants)
 *
 * **Features**:
 * - Three styling variants (glassmorphic-xl, glassmorphic-sm, simple)
 * - Customizable label prefix
 * - External link support with newTab option
 * - Accessible checkbox and label pairing
 * - Smooth hover transitions
 */
const meta: Meta<typeof GDPRCheckbox> = {
  title: "Molecules/GDPRCheckbox",
  component: GDPRCheckbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A molecule-level GDPR consent checkbox component. Provides three styling variants (glassmorphic-xl, glassmorphic-sm, simple) with customizable label prefix and link configuration. Composed of shadcn/ui Checkbox and Label atoms, optionally wrapped in GlassmorphismCard molecule for glassmorphic variants.",
      },
    },
  },
  argTypes: {
    id: {
      control: "text",
      description: "Checkbox HTML id attribute",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"gdpr-consent"' },
      },
    },
    checked: {
      control: "boolean",
      description: "Checkbox checked state",
      table: {
        type: { summary: "boolean" },
      },
    },
    onCheckedChange: {
      action: "checked changed",
      description: "Callback when checkbox state changes",
      table: {
        type: { summary: "(value: boolean) => void" },
      },
    },
    link: {
      control: "object",
      description: "Link configuration for GDPR terms",
      table: {
        type: {
          summary: "{ href: string; label: string; newTab?: boolean }",
        },
      },
    },
    labelPrefix: {
      control: "text",
      description: "Label prefix text (appears before the link)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"I agree to the"' },
      },
    },
    variant: {
      control: "select",
      options: ["glassmorphic-xl", "glassmorphic-sm", "simple"],
      description: "Styling variant",
      table: {
        type: {
          summary: '"glassmorphic-xl" | "glassmorphic-sm" | "simple"',
        },
        defaultValue: { summary: '"simple"' },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
}

export default meta
type Story = StoryObj<typeof GDPRCheckbox>

/**
 * Default State - Simple Variant
 * Minimal styling without glassmorphic card wrapper.
 * Default variant used in NewsletterForm and contact forms.
 */
export const Default: Story = {
  args: {
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    labelPrefix: "I agree to the",
    variant: "simple",
  },
}

/**
 * Checked State - Simple Variant
 * Shows checkbox in checked state with primary color accent
 */
export const Checked: Story = {
  args: {
    checked: true,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "simple",
  },
}

/**
 * Glassmorphic XL Variant (Default in Newsletter CTA)
 * Glassmorphic card wrapper with rounded-xl corners.
 * Used in Newsletter CTA section for visual hierarchy.
 */
export const GlasmorphicXL: Story = {
  args: {
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "glassmorphic-xl",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
}

/**
 * Glassmorphic XL Variant - Checked
 * Shows glassmorphic variant with checkbox checked
 */
export const GlasmorphicXLChecked: Story = {
  args: {
    checked: true,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "glassmorphic-xl",
  },
}

/**
 * Glassmorphic SM Variant
 * Glassmorphic card wrapper with rounded-sm corners.
 * Sharper appearance for designs requiring crisper edges.
 */
export const GlasmorphicSM: Story = {
  args: {
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "glassmorphic-sm",
  },
}

/**
 * Custom Label Prefix
 * Demonstrates custom label text before the link.
 * Default: "I agree to the" → Custom: "I consent to the"
 */
export const CustomLabelPrefix: Story = {
  args: {
    checked: false,
    link: {
      href: "/terms-and-conditions",
      label: "Terms & Conditions",
      newTab: true,
    },
    labelPrefix: "I consent to the",
    variant: "simple",
  },
}

/**
 * Link Opens in Same Tab
 * Link with newTab: false opens in current window.
 * No target="_blank" or rel="noopener noreferrer" attributes.
 */
export const LinkSameTab: Story = {
  args: {
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: false,
    },
    variant: "simple",
  },
}

/**
 * Custom Link Configuration
 * Different link href and label for various legal documents
 */
export const CustomLink: Story = {
  args: {
    checked: false,
    link: {
      href: "/terms-of-service",
      label: "Terms of Service",
      newTab: true,
    },
    labelPrefix: "I accept the",
    variant: "simple",
  },
}

/**
 * Interactive - Simple Variant
 * Demonstrates hover and interaction states for simple variant
 */
export const InteractiveSimple: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="space-y-4">
        <GDPRCheckbox
          {...args}
          checked={checked}
          onCheckedChange={setChecked}
        />
        <p className="text-muted-foreground text-xs">
          Checked: {checked ? "Yes" : "No"}
        </p>
      </div>
    )
  },
  args: {
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "simple",
  },
}

/**
 * Interactive - Glassmorphic XL
 * Demonstrates hover and interaction states for glassmorphic variant
 */
export const InteractiveGlasmorphic: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="space-y-4">
        <GDPRCheckbox
          {...args}
          checked={checked}
          onCheckedChange={setChecked}
        />
        <p className="text-muted-foreground text-xs">
          Checked: {checked ? "Yes" : "No"}
        </p>
      </div>
    )
  },
  args: {
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "glassmorphic-xl",
  },
}

/**
 * Newsletter CTA Example
 * Real-world usage from Newsletter CTA section.
 * Shows glassmorphic-xl variant with full context.
 */
export const NewsletterCTAExample: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="max-w-md space-y-4 rounded-lg bg-slate-50 p-6 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Newsletter Signup</h3>
        <p className="text-muted-foreground text-sm">
          Stay updated with our latest content
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
        <GDPRCheckbox
          {...args}
          checked={checked}
          onCheckedChange={setChecked}
        />
        <button
          disabled={!checked}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          Subscribe
        </button>
      </div>
    )
  },
  args: {
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "glassmorphic-xl",
  },
}

/**
 * Newsletter Form Example (Simple Variant)
 * Real-world usage from NewsletterForm component.
 * Shows simple variant in form context.
 */
export const NewsletterFormExample: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="max-w-sm space-y-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
        <h4 className="font-medium">Quick Subscribe</h4>
        <input
          type="email"
          placeholder="your@email.com"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
        <GDPRCheckbox
          {...args}
          checked={checked}
          onCheckedChange={setChecked}
        />
        <button
          disabled={!checked}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 w-full items-center justify-center rounded-md px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          Sign Up
        </button>
      </div>
    )
  },
  args: {
    link: {
      href: "/terms",
      label: "Terms & Conditions",
      newTab: false,
    },
    labelPrefix: "I consent to the",
    variant: "simple",
  },
}

/**
 * Custom ID Example
 * Demonstrates custom checkbox ID for form integration
 */
export const CustomID: Story = {
  args: {
    id: "newsletter-gdpr-consent",
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "simple",
  },
}

/**
 * Custom Styling
 * Additional CSS classes applied via className prop
 */
export const CustomStyling: Story = {
  args: {
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "glassmorphic-xl",
    className: "max-w-md border-primary/20 shadow-lg",
  },
}

/**
 * Mobile View - Simple
 * Responsive layout on mobile screens (simple variant)
 */
export const MobileSimple: Story = {
  args: {
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "simple",
    className: "max-w-xs",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

/**
 * Mobile View - Glassmorphic
 * Responsive layout on mobile screens (glassmorphic variant)
 */
export const MobileGlasmorphic: Story = {
  args: {
    checked: false,
    link: {
      href: "/privacy-policy",
      label: "Privacy Policy",
      newTab: true,
    },
    variant: "glassmorphic-xl",
    className: "max-w-xs",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

/**
 * All Variants Comparison
 * Side-by-side comparison of all three variants
 */
export const AllVariants: Story = {
  render: () => {
    const [checkedSimple, setCheckedSimple] = useState(false)
    const [checkedXL, setCheckedXL] = useState(false)
    const [checkedSM, setCheckedSM] = useState(false)

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Simple Variant</h4>
          <GDPRCheckbox
            checked={checkedSimple}
            onCheckedChange={setCheckedSimple}
            link={{
              href: "/privacy-policy",
              label: "Privacy Policy",
              newTab: true,
            }}
            variant="simple"
          />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Glassmorphic XL Variant</h4>
          <GDPRCheckbox
            checked={checkedXL}
            onCheckedChange={setCheckedXL}
            link={{
              href: "/privacy-policy",
              label: "Privacy Policy",
              newTab: true,
            }}
            variant="glassmorphic-xl"
          />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Glassmorphic SM Variant</h4>
          <GDPRCheckbox
            checked={checkedSM}
            onCheckedChange={setCheckedSM}
            link={{
              href: "/privacy-policy",
              label: "Privacy Policy",
              newTab: true,
            }}
            variant="glassmorphic-sm"
          />
        </div>
      </div>
    )
  },
}
