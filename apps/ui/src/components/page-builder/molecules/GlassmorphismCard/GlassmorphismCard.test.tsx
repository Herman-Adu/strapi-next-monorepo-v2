import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GlassmorphismCard } from "./GlassmorphismCard"

describe("GlassmorphismCard", () => {
  it("renders children correctly", () => {
    render(
      <GlassmorphismCard>
        <p>Test content</p>
      </GlassmorphismCard>
    )

    expect(screen.getByText("Test content")).toBeInTheDocument()
  })

  it("applies default size (md) padding", () => {
    const { container } = render(
      <GlassmorphismCard>
        <p>Test</p>
      </GlassmorphismCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("p-6")
  })

  it("applies small size padding when size=sm", () => {
    const { container } = render(
      <GlassmorphismCard size="sm">
        <p>Test</p>
      </GlassmorphismCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("p-3.5")
  })

  it("applies large size padding when size=lg", () => {
    const { container } = render(
      <GlassmorphismCard size="lg">
        <p>Test</p>
      </GlassmorphismCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("p-8")
  })

  it("applies default rounded-xl variant", () => {
    const { container } = render(
      <GlassmorphismCard>
        <p>Test</p>
      </GlassmorphismCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("rounded-xl")
  })

  it("applies rounded-sm variant when specified", () => {
    const { container } = render(
      <GlassmorphismCard variant="rounded-sm">
        <p>Test</p>
      </GlassmorphismCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("rounded-sm")
  })

  it("renders glow effect by default", () => {
    const { container } = render(
      <GlassmorphismCard>
        <p>Test</p>
      </GlassmorphismCard>
    )

    const glowEffect = container.querySelector('[aria-hidden="true"]')
    expect(glowEffect).toBeInTheDocument()
  })

  it("does not render glow effect when glowEffect=false", () => {
    const { container } = render(
      <GlassmorphismCard glowEffect={false}>
        <p>Test</p>
      </GlassmorphismCard>
    )

    const glowEffect = container.querySelector('[aria-hidden="true"]')
    expect(glowEffect).not.toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <GlassmorphismCard className="custom-class">
        <p>Test</p>
      </GlassmorphismCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("custom-class")
  })

  it("has correct glassmorphism base classes", () => {
    const { container } = render(
      <GlassmorphismCard>
        <p>Test</p>
      </GlassmorphismCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("group")
    expect(card).toHaveClass("relative")
    expect(card).toHaveClass("overflow-hidden")
    expect(card).toHaveClass("border")
    expect(card).toHaveClass("bg-gradient-to-br")
    expect(card).toHaveClass("from-primary/5")
    expect(card).toHaveClass("via-background")
    expect(card).toHaveClass("to-background")
  })
})
