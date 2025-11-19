import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Data } from "@repo/strapi"
import { TestimonialCard } from "./TestimonialCard"

const mockTestimonial: Data.Component<"elements.testimonial-card"> = {
  id: 1,
  quote: "This product changed my life! Highly recommend to everyone.",
  authorName: "John Doe",
  authorRole: "CEO",
  authorCompany: "Tech Corp",
  rating: 5,
  featured: false,
  authorImage: {
    id: 1,
    media: {
      id: 1,
      documentId: "doc1",
      name: "author.jpg",
      alternativeText: "John Doe",
      caption: null,
      width: 100,
      height: 100,
      formats: null,
      hash: "hash",
      ext: ".jpg",
      mime: "image/jpeg",
      size: 10,
      url: "/uploads/author.jpg",
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

describe("TestimonialCard", () => {
  it("renders quote text", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)

    expect(
      screen.getByText(/This product changed my life!/i)
    ).toBeInTheDocument()
  })

  it("renders author name", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })

  it("renders author role and company", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)

    expect(screen.getByText(/CEO at Tech Corp/i)).toBeInTheDocument()
  })

  it("renders author role without company", () => {
    const testimonialWithoutCompany = {
      ...mockTestimonial,
      authorCompany: undefined,
    }
    render(<TestimonialCard testimonial={testimonialWithoutCompany} />)

    expect(screen.getByText("CEO")).toBeInTheDocument()
  })

  it("renders 5-star rating when showRatings is true", () => {
    const { container } = render(
      <TestimonialCard testimonial={mockTestimonial} showRatings />
    )

    // Count filled stars (should be 5)
    const filledStars = container.querySelectorAll(".fill-primary")
    expect(filledStars).toHaveLength(5)
  })

  it("renders partial rating correctly", () => {
    const testimonialWith3Stars = { ...mockTestimonial, rating: 3 }
    const { container } = render(
      <TestimonialCard testimonial={testimonialWith3Stars} showRatings />
    )

    // Count filled stars (should be 3)
    const filledStars = container.querySelectorAll(".fill-primary")
    expect(filledStars).toHaveLength(3)
  })

  it("does not render rating when showRatings is false", () => {
    const { container } = render(
      <TestimonialCard testimonial={mockTestimonial} showRatings={false} />
    )

    const stars = container.querySelectorAll(".h-4.w-4")
    expect(stars).toHaveLength(0)
  })

  it("renders author image when showImages is true", () => {
    render(<TestimonialCard testimonial={mockTestimonial} showImages />)

    const image = screen.getByRole("img")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("alt", "John Doe")
  })

  it("does not render author image when showImages is false", () => {
    render(<TestimonialCard testimonial={mockTestimonial} showImages={false} />)

    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("renders featured badge when testimonial is featured", () => {
    const featuredTestimonial = { ...mockTestimonial, featured: true }
    render(<TestimonialCard testimonial={featuredTestimonial} />)

    expect(screen.getByText("Featured")).toBeInTheDocument()
  })

  it("does not render featured badge when testimonial is not featured", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)

    expect(screen.queryByText("Featured")).not.toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <TestimonialCard testimonial={mockTestimonial} className="custom-class" />
    )

    const card = container.firstChild
    expect(card).toHaveClass("custom-class")
  })

  it("applies extra padding when featured", () => {
    const featuredTestimonial = { ...mockTestimonial, featured: true }
    const { container } = render(
      <TestimonialCard testimonial={featuredTestimonial} />
    )

    const card = container.firstChild
    expect(card).toHaveClass("pt-12")
  })

  it("renders quote icon", () => {
    const { container } = render(
      <TestimonialCard testimonial={mockTestimonial} />
    )

    // Quote icon should be present
    const quoteIcon = container.querySelector(".absolute.top-4.right-4")
    expect(quoteIcon).toBeInTheDocument()
  })

  it("handles testimonial without rating gracefully", () => {
    const testimonialWithoutRating = { ...mockTestimonial, rating: undefined }
    const { container } = render(
      <TestimonialCard testimonial={testimonialWithoutRating} showRatings />
    )

    // Should not render stars if rating is undefined
    const stars = container.querySelectorAll(".h-4.w-4")
    expect(stars).toHaveLength(0)
  })

  it("handles testimonial without author image gracefully", () => {
    const testimonialWithoutImage = {
      ...mockTestimonial,
      authorImage: undefined,
    }
    render(<TestimonialCard testimonial={testimonialWithoutImage} showImages />)

    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})
