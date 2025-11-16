import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { BlogCard } from "./BlogCard"

describe("BlogCard", () => {
  it("renders children correctly", () => {
    render(<BlogCard>Test Content</BlogCard>)
    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <BlogCard className="custom-class">Content</BlogCard>
    )
    const element = container.querySelector(".custom-class")
    expect(element).toBeInTheDocument()
  })

  it("has correct atomic design class", () => {
    const { container } = render(<BlogCard>Content</BlogCard>)
    const element = container.querySelector(".m-blogcard")
    expect(element).toBeInTheDocument()
  })
})
