import type { Meta, StoryObj } from "@storybook/nextjs"
import { Data } from "@repo/strapi"

import { TestimonialCard } from "./TestimonialCard"

/**
 * TestimonialCard - Molecule Level Component
 *
 * A reusable testimonial card displaying customer reviews with ratings, author info, and images.
 * Designed to work in both grid and marquee layouts.
 *
 * **Atomic Design Level**: Molecule
 * **Composed Of**:
 * - Quote icon (Lucide React atom)
 * - Star rating icons (Lucide React atoms)
 * - StrapiBasicImage (utility component for images)
 * - Text elements (atoms)
 * - Card container (atom)
 *
 * **Used In**:
 * - Testimonials section (grid layout)
 * - Marquee component (horizontal scroll)
 * - Reviews pages
 *
 * **Features**:
 * - Optional 5-star rating display
 * - Optional author image
 * - Featured badge for highlighted testimonials
 * - Hover effects (border, shadow transitions)
 * - Quote icon decoration
 * - Flexible layout (grid/marquee)
 */
const meta: Meta<typeof TestimonialCard> = {
  title: "Molecules/TestimonialCard",
  component: TestimonialCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A molecule-level testimonial card component. Displays customer testimonials with optional ratings, author images, and featured badges. Composed of quote icons, star ratings, images, and text atoms. Used in testimonial grids and marquee layouts.",
      },
    },
  },
  argTypes: {
    testimonial: {
      control: "object",
      description: "Testimonial data from Strapi",
      table: {
        type: { summary: 'Data.Component<"elements.testimonial-card">' },
      },
    },
    showRatings: {
      control: "boolean",
      description: "Whether to show star ratings",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    showImages: {
      control: "boolean",
      description: "Whether to show author images",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
}

export default meta
type Story = StoryObj<typeof TestimonialCard>

// Mock testimonial data with image
const mockTestimonialWithImage: Data.Component<"elements.testimonial-card"> = {
  id: 1,
  quote:
    "This product has completely transformed how we work. The team is more productive, and our clients are happier than ever. Highly recommend!",
  authorName: "Sarah Johnson",
  authorRole: "CEO",
  authorCompany: "Tech Innovations Inc",
  rating: 5,
  featured: false,
  authorImage: {
    id: 1,
    media: {
      id: 1,
      documentId: "doc1",
      name: "author.jpg",
      alternativeText: "Sarah Johnson",
      caption: null,
      width: 100,
      height: 100,
      formats: null,
      hash: "hash",
      ext: ".jpg",
      mime: "image/jpeg",
      size: 10,
      url: "https://i.pravatar.cc/100?img=1",
      previewUrl: null,
      provider: "local",
      provider_metadata: null,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      publishedAt: "2024-01-01",
      locale: null,
    },
  },
} as Data.Component<"elements.testimonial-card">

// Mock testimonial without image
const mockTestimonialNoImage: Data.Component<"elements.testimonial-card"> = {
  ...mockTestimonialWithImage,
  id: 2,
  authorName: "Michael Chen",
  authorRole: "Product Manager",
  authorCompany: "Digital Solutions",
  authorImage: undefined,
} as Data.Component<"elements.testimonial-card">

// Featured testimonial
const mockFeaturedTestimonial: Data.Component<"elements.testimonial-card"> = {
  ...mockTestimonialWithImage,
  id: 3,
  quote:
    "Outstanding service! The attention to detail and commitment to quality is unmatched. This has been a game-changer for our business.",
  authorName: "Emily Rodriguez",
  authorRole: "Marketing Director",
  authorCompany: "Creative Agency",
  featured: true,
  authorImage: {
    ...mockTestimonialWithImage.authorImage!,
    media: {
      ...mockTestimonialWithImage.authorImage!.media,
      url: "https://i.pravatar.cc/100?img=5",
      alternativeText: "Emily Rodriguez",
    },
  },
} as Data.Component<"elements.testimonial-card">

// 3-star rating testimonial
const mockTestimonial3Stars: Data.Component<"elements.testimonial-card"> = {
  ...mockTestimonialWithImage,
  id: 4,
  quote:
    "Good product overall. There's room for improvement, but it gets the job done.",
  authorName: "David Kim",
  authorRole: "Software Engineer",
  authorCompany: undefined,
  rating: 3,
  authorImage: {
    ...mockTestimonialWithImage.authorImage!,
    media: {
      ...mockTestimonialWithImage.authorImage!.media,
      url: "https://i.pravatar.cc/100?img=12",
      alternativeText: "David Kim",
    },
  },
} as Data.Component<"elements.testimonial-card">

/**
 * Default State
 * Standard testimonial card with 5-star rating and author image
 */
export const Default: Story = {
  args: {
    testimonial: mockTestimonialWithImage,
    showRatings: true,
    showImages: true,
  },
}

/**
 * Featured Testimonial
 * Highlighted testimonial with "Featured" badge and extra top padding
 */
export const Featured: Story = {
  args: {
    testimonial: mockFeaturedTestimonial,
    showRatings: true,
    showImages: true,
  },
}

/**
 * Without Rating
 * Testimonial card with ratings hidden (showRatings: false)
 */
export const WithoutRating: Story = {
  args: {
    testimonial: mockTestimonialWithImage,
    showRatings: false,
    showImages: true,
  },
}

/**
 * Without Author Image
 * Testimonial card with image hidden (showImages: false)
 */
export const WithoutImage: Story = {
  args: {
    testimonial: mockTestimonialWithImage,
    showRatings: true,
    showImages: false,
  },
}

/**
 * No Image Data
 * Testimonial without authorImage in data (graceful handling)
 */
export const NoImageData: Story = {
  args: {
    testimonial: mockTestimonialNoImage,
    showRatings: true,
    showImages: true,
  },
}

/**
 * 3-Star Rating
 * Testimonial with partial rating (3 out of 5 stars)
 */
export const ThreeStarRating: Story = {
  args: {
    testimonial: mockTestimonial3Stars,
    showRatings: true,
    showImages: true,
  },
}

/**
 * Minimal (No Ratings, No Images)
 * Clean testimonial showing only quote and author info
 */
export const Minimal: Story = {
  args: {
    testimonial: mockTestimonialWithImage,
    showRatings: false,
    showImages: false,
  },
}

/**
 * Author Role Only (No Company)
 * Testimonial showing author role without company affiliation
 */
export const AuthorRoleOnly: Story = {
  args: {
    testimonial: mockTestimonial3Stars, // This one has no company
    showRatings: true,
    showImages: true,
  },
}

/**
 * Short Quote
 * Testimonial with brief quote for compact layouts
 */
export const ShortQuote: Story = {
  args: {
    testimonial: {
      ...mockTestimonialWithImage,
      quote: "Excellent product! Highly recommend.",
    },
    showRatings: true,
    showImages: true,
  },
}

/**
 * Long Quote
 * Testimonial with extensive quote demonstrating text wrapping
 */
export const LongQuote: Story = {
  args: {
    testimonial: {
      ...mockTestimonialWithImage,
      quote:
        "This product has exceeded all our expectations. From the initial onboarding process to the ongoing support, everything has been seamless. Our team's productivity has increased by 40%, and we've received overwhelmingly positive feedback from our clients. The features are robust, the interface is intuitive, and the customer service team is always responsive and helpful. We couldn't be happier with our decision to switch to this solution.",
    },
    showRatings: true,
    showImages: true,
  },
}

/**
 * Fixed Width (Marquee Layout)
 * Testimonial with fixed width for use in horizontal scrolling marquee
 */
export const MarqueeWidth: Story = {
  args: {
    testimonial: mockTestimonialWithImage,
    showRatings: true,
    showImages: true,
    className: "w-[400px]",
  },
}

/**
 * Custom Styling
 * Testimonial with additional custom classes
 */
export const CustomStyling: Story = {
  args: {
    testimonial: mockFeaturedTestimonial,
    showRatings: true,
    showImages: true,
    className: "border-primary/30 shadow-lg max-w-md",
  },
}

/**
 * Grid Layout Example
 * Multiple testimonials in a grid layout
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <TestimonialCard
        testimonial={mockFeaturedTestimonial}
        showRatings
        showImages
      />
      <TestimonialCard
        testimonial={mockTestimonialWithImage}
        showRatings
        showImages
      />
      <TestimonialCard
        testimonial={mockTestimonial3Stars}
        showRatings
        showImages
      />
      <TestimonialCard
        testimonial={{
          ...mockTestimonialWithImage,
          id: 5,
          authorName: "Jessica Lee",
          authorRole: "Designer",
          authorCompany: "Creative Studio",
          quote: "Beautiful design and smooth user experience!",
          authorImage: {
            ...mockTestimonialWithImage.authorImage!,
            media: {
              ...mockTestimonialWithImage.authorImage!.media,
              url: "https://i.pravatar.cc/100?img=9",
              alternativeText: "Jessica Lee",
            },
          },
        }}
        showRatings
        showImages
      />
      <TestimonialCard
        testimonial={{
          ...mockTestimonialWithImage,
          id: 6,
          authorName: "Alex Thompson",
          authorRole: "CTO",
          authorCompany: "StartupCo",
          quote:
            "The technical support is outstanding. They helped us integrate seamlessly.",
          authorImage: {
            ...mockTestimonialWithImage.authorImage!,
            media: {
              ...mockTestimonialWithImage.authorImage!.media,
              url: "https://i.pravatar.cc/100?img=14",
              alternativeText: "Alex Thompson",
            },
          },
        }}
        showRatings
        showImages
      />
      <TestimonialCard
        testimonial={{
          ...mockTestimonialWithImage,
          id: 7,
          authorName: "Maria Garcia",
          authorRole: "Operations Manager",
          authorCompany: undefined,
          rating: 4,
          quote: "Solid product with great features. Very satisfied!",
          authorImage: {
            ...mockTestimonialWithImage.authorImage!,
            media: {
              ...mockTestimonialWithImage.authorImage!.media,
              url: "https://i.pravatar.cc/100?img=20",
              alternativeText: "Maria Garcia",
            },
          },
        }}
        showRatings
        showImages
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
}

/**
 * Marquee Layout Example (Horizontal Scroll)
 * Testimonials with fixed widths for horizontal scrolling
 */
export const MarqueeLayout: Story = {
  render: () => (
    <div className="flex gap-6 overflow-x-auto pb-4">
      <TestimonialCard
        testimonial={mockFeaturedTestimonial}
        showRatings
        showImages
        className="w-[400px] flex-shrink-0"
      />
      <TestimonialCard
        testimonial={mockTestimonialWithImage}
        showRatings
        showImages
        className="w-[400px] flex-shrink-0"
      />
      <TestimonialCard
        testimonial={mockTestimonial3Stars}
        showRatings
        showImages
        className="w-[400px] flex-shrink-0"
      />
      <TestimonialCard
        testimonial={{
          ...mockTestimonialWithImage,
          id: 8,
          authorName: "Ryan Baker",
          authorRole: "Freelance Developer",
          authorCompany: undefined,
          quote: "Perfect for my workflow. Saves me hours every week!",
          authorImage: {
            ...mockTestimonialWithImage.authorImage!,
            media: {
              ...mockTestimonialWithImage.authorImage!.media,
              url: "https://i.pravatar.cc/100?img=33",
              alternativeText: "Ryan Baker",
            },
          },
        }}
        showRatings
        showImages
        className="w-[400px] flex-shrink-0"
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
}

/**
 * All Rating Variations
 * Side-by-side comparison of different star ratings
 */
export const AllRatings: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">5 Stars</h4>
        <TestimonialCard
          testimonial={{
            ...mockTestimonialWithImage,
            rating: 5,
            quote: "Absolutely perfect! Couldn't ask for more.",
          }}
          showRatings
          showImages
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">4 Stars</h4>
        <TestimonialCard
          testimonial={{
            ...mockTestimonialWithImage,
            rating: 4,
            quote: "Great product with minor room for improvement.",
          }}
          showRatings
          showImages
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">3 Stars</h4>
        <TestimonialCard
          testimonial={{
            ...mockTestimonialWithImage,
            rating: 3,
            quote: "Good, but could be better in some areas.",
          }}
          showRatings
          showImages
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
}

/**
 * Display Options Comparison
 * All combinations of showRatings and showImages
 */
export const DisplayOptions: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Ratings + Images (Default)</h4>
        <TestimonialCard
          testimonial={mockTestimonialWithImage}
          showRatings
          showImages
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Ratings Only</h4>
        <TestimonialCard
          testimonial={mockTestimonialWithImage}
          showRatings
          showImages={false}
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Images Only</h4>
        <TestimonialCard
          testimonial={mockTestimonialWithImage}
          showRatings={false}
          showImages
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Minimal (No Ratings/Images)</h4>
        <TestimonialCard
          testimonial={mockTestimonialWithImage}
          showRatings={false}
          showImages={false}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
}

/**
 * Mobile View
 * Testimonial card on mobile viewport
 */
export const Mobile: Story = {
  args: {
    testimonial: mockFeaturedTestimonial,
    showRatings: true,
    showImages: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

/**
 * Dark Mode
 * Testimonial card appearance in dark theme
 */
export const DarkMode: Story = {
  args: {
    testimonial: mockFeaturedTestimonial,
    showRatings: true,
    showImages: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
}

/**
 * Hover State Demo
 * Demonstrates hover effects (border and shadow transitions)
 */
export const HoverDemo: Story = {
  args: {
    testimonial: mockTestimonialWithImage,
    showRatings: true,
    showImages: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover over the card to see border color and shadow transitions. The quote icon also changes opacity on hover.",
      },
    },
  },
}
