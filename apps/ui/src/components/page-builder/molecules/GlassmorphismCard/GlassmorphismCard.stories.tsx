import type { Meta, StoryObj } from "@storybook/nextjs"
import { Check } from "lucide-react"

import { GlassmorphismCard } from "./GlassmorphismCard"

/**
 * GlassmorphismCard - Molecule Level Component
 *
 * A modern card design with glassmorphism effects used throughout the application.
 * Provides a consistent glassmorphic UI pattern for various content containers.
 *
 * **Atomic Design Level**: Molecule
 * **Composed Of**: Div containers (atoms) with gradient, border, and shadow effects
 * **Used In**: Newsletter CTA benefits, GDPR checkboxes, Contact form cards
 *
 * **Features**:
 * - Gradient background with primary color accent
 * - Border with hover states
 * - Optional animated glow effect
 * - Three size variants (sm, md, lg)
 * - Two border radius options (rounded-xl, rounded-sm)
 * - Smooth transition animations
 */
const meta: Meta<typeof GlassmorphismCard> = {
  title: "Molecules/GlassmorphismCard",
  component: GlassmorphismCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A molecule-level component providing glassmorphic card styling. Combines gradient backgrounds, borders, shadows, and optional glow effects into a reusable card interface. Used across newsletter benefits, GDPR checkboxes, and form containers.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Controls padding size of the card",
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    glowEffect: {
      control: "boolean",
      description:
        "Enables/disables the animated glow effect in top-right corner",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    variant: {
      control: "select",
      options: ["rounded-xl", "rounded-sm"],
      description: "Controls border radius of the card",
      table: {
        type: { summary: '"rounded-xl" | "rounded-sm"' },
        defaultValue: { summary: '"rounded-xl"' },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for customization",
    },
    children: {
      control: false,
      description: "Content to display inside the card",
    },
  },
}

export default meta
type Story = StoryObj<typeof GlassmorphismCard>

/**
 * Default State
 * Standard glassmorphism card with medium padding and glow effect
 */
export const Default: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Glassmorphism Card</h3>
        <p className="text-muted-foreground text-sm">
          A beautiful card with glassmorphic styling, gradient background, and
          subtle animations.
        </p>
      </div>
    ),
  },
}

/**
 * Small Size
 * Compact padding (p-3.5) used in GDPR checkboxes
 */
export const SmallSize: Story = {
  args: {
    size: "sm",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="flex items-start gap-2">
        <div className="bg-primary/10 mt-0.5 rounded p-0.5">
          <Check className="text-primary h-3 w-3" />
        </div>
        <p className="text-xs">Compact card with small padding</p>
      </div>
    ),
  },
}

/**
 * Medium Size (Default)
 * Standard padding (p-6) used in newsletter benefit cards
 */
export const MediumSize: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="space-y-3">
        <div className="bg-primary/10 inline-flex rounded-lg p-2">
          <Check className="text-primary h-5 w-5" />
        </div>
        <h4 className="font-semibold">Medium Padding Card</h4>
        <p className="text-muted-foreground text-sm">
          Standard size for benefit cards and content sections
        </p>
      </div>
    ),
  },
}

/**
 * Large Size
 * Spacious padding (p-8) for prominent content sections
 */
export const LargeSize: Story = {
  args: {
    size: "lg",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="space-y-4">
        <div className="bg-primary/10 inline-flex rounded-lg p-3">
          <Check className="text-primary h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">Large Padding Card</h3>
        <p className="text-muted-foreground">
          Spacious layout perfect for featured content, hero sections, or
          prominent call-to-action areas. Provides ample breathing room for
          content.
        </p>
      </div>
    ),
  },
}

/**
 * Rounded XL Variant (Default)
 * Larger border radius for softer appearance
 */
export const RoundedXL: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Rounded XL</h4>
        <p className="text-muted-foreground text-sm">
          Soft, rounded corners (rounded-xl) for a modern appearance
        </p>
      </div>
    ),
  },
}

/**
 * Rounded SM Variant
 * Smaller border radius for sharper appearance
 */
export const RoundedSM: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-sm",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Rounded SM</h4>
        <p className="text-muted-foreground text-sm">
          Subtle rounded corners (rounded-sm) for a crisp appearance
        </p>
      </div>
    ),
  },
}

/**
 * With Glow Effect (Default)
 * Animated glow in top-right corner on hover
 */
export const WithGlowEffect: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Glow Effect Enabled</h4>
        <p className="text-muted-foreground text-sm">
          Hover to see the animated glow effect in the top-right corner
        </p>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
}

/**
 * Enhanced Demo (Dark Background)
 * Glassomrphism effect with enhanced styling for demonstration
 */
export const EnhancedDemo: Story = {
  args: {
    size: "lg",
    glowEffect: true,
    variant: "rounded-xl",
    className:
      "border-4 border-primary/40 shadow-2xl shadow-primary/30 min-w-[400px]",
    children: (
      <div className="space-y-4">
        <div className="bg-primary/20 inline-flex rounded-lg p-3 backdrop-blur-sm">
          <Check className="text-primary h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold">Enhanced Glassmorphism Effect</h3>
        <p className="text-muted-foreground text-base">
          This example shows the glassmorphic card with enhanced borders and
          shadows to make the effect more visible. Notice the:
        </p>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Gradient background from primary color to background</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Enhanced border with primary color tint</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Prominent shadow with color</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Animated glow effect in top-right (hover to see)</span>
          </li>
        </ul>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
}

/**
 * Without Glow Effect
 * Clean card without animated glow
 */
export const WithoutGlowEffect: Story = {
  args: {
    size: "md",
    glowEffect: false,
    variant: "rounded-xl",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Glow Effect Disabled</h4>
        <p className="text-muted-foreground text-sm">
          No animated glow - cleaner appearance for minimal designs
        </p>
      </div>
    ),
  },
}

/**
 * Newsletter Benefit Card
 * Real-world example from newsletter CTA section
 */
export const NewsletterBenefitCard: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="space-y-3">
        <div className="bg-primary/10 inline-flex rounded-lg p-2">
          <Check className="text-primary h-5 w-5" />
        </div>
        <h4 className="font-semibold">Weekly Insights</h4>
        <p className="text-muted-foreground text-sm">
          Get curated content delivered to your inbox every week
        </p>
      </div>
    ),
  },
}

/**
 * GDPR Checkbox Container
 * Real-world example from GDPR checkbox component
 */
export const GDPRCheckboxContainer: Story = {
  args: {
    size: "sm",
    glowEffect: true,
    variant: "rounded-xl",
    className: "max-w-md",
    children: (
      <div className="flex items-start gap-2.5">
        <div className="bg-primary/10 mt-0.5 rounded p-0.5">
          <Check className="text-primary h-3 w-3" />
        </div>
        <label className="cursor-pointer text-xs leading-relaxed">
          I agree to the{" "}
          <button className="text-primary font-medium underline">
            terms and conditions
          </button>
        </label>
      </div>
    ),
  },
}

/**
 * Dark Mode
 * Card appearance in dark theme
 */
export const DarkMode: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Dark Mode Card</h4>
        <p className="text-muted-foreground text-sm">
          Glassmorphism effect adapts beautifully to dark themes
        </p>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
}

/**
 * Mobile View
 * Responsive layout on small screens
 */
export const Mobile: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    className: "w-full",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Mobile Optimized</h4>
        <p className="text-muted-foreground text-sm">
          Full-width card responsive to mobile viewports
        </p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

/**
 * Custom Styling
 * Card with additional custom classes
 */
export const CustomStyling: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    className: "border-2 border-primary/30 shadow-lg shadow-primary/20",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Custom Styling</h4>
        <p className="text-muted-foreground text-sm">
          Enhanced borders and shadows via className prop
        </p>
      </div>
    ),
  },
}

/**
 * Interactive Example
 * Demonstrates hover states and transitions
 */
export const Interactive: Story = {
  args: {
    size: "md",
    glowEffect: true,
    variant: "rounded-xl",
    className: "cursor-pointer",
    children: (
      <div className="space-y-2">
        <h4 className="font-semibold">Interactive Card</h4>
        <p className="text-muted-foreground text-sm">
          Hover to see border, shadow, and glow effect transitions
        </p>
      </div>
    ),
  },
}

/**
 * Super Visible Demo (For Documentation Only)
 * This is NOT how the component looks in production!
 * Enhanced opacity values to make the effect visible in Storybook.
 */
export const SuperVisibleDemo: Story = {
  render: () => (
    <div className="rounded-lg bg-slate-100 p-12 dark:bg-slate-900">
      <div className="group relative overflow-hidden rounded-xl border border-blue-500/40 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent p-6 shadow-lg transition-all duration-300 hover:border-blue-500/60 hover:shadow-blue-500/20">
        <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/30 blur-2xl transition-all group-hover:bg-blue-500/40" />
        <div className="relative space-y-3">
          <div className="inline-flex rounded-lg bg-blue-500/30 p-2">
            <Check className="h-5 w-5 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold">This is how it SHOULD look!</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The actual component uses much more subtle values (primary/5 instead
            of /30). This demo uses enhanced opacity to show what the
            glassmorphism effect looks like.
          </p>
          <p className="text-xs text-slate-500">
            Real component: from-primary/5 • border-primary/10
            <br />
            This demo: from-blue-500/30 • border-blue-500/40
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "⚠️ This story uses enhanced opacity values for visibility. The actual component is much more subtle.",
      },
    },
  },
}
