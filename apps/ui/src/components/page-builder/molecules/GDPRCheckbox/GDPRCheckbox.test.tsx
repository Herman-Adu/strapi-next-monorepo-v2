import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GDPRCheckbox } from "./GDPRCheckbox"

describe("GDPRCheckbox", () => {
  const mockLink = {
    href: "/privacy-policy",
    label: "Privacy Policy",
    newTab: true,
  }

  it("renders checkbox with default props", () => {
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it("renders with checked state", () => {
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        checked
        onCheckedChange={onCheckedChange}
        link={mockLink}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeChecked()
  })

  it("calls onCheckedChange when checkbox is clicked", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    await user.click(checkbox)

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("renders default label prefix", () => {
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
      />
    )

    expect(screen.getByText("I agree to the", { exact: false })).toBeInTheDocument()
  })

  it("renders custom label prefix", () => {
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
        labelPrefix="I consent to the"
      />
    )

    expect(screen.getByText("I consent to the", { exact: false })).toBeInTheDocument()
  })

  it("renders link with correct href and label", () => {
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
      />
    )

    const link = screen.getByRole("link", { name: "Privacy Policy" })
    expect(link).toHaveAttribute("href", "/privacy-policy")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("renders link without newTab attributes when newTab is false", () => {
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={{ ...mockLink, newTab: false }}
      />
    )

    const link = screen.getByRole("link", { name: "Privacy Policy" })
    expect(link).toHaveAttribute("target", "_self")
    expect(link).not.toHaveAttribute("rel")
  })

  it("renders simple variant with correct classes", () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
        variant="simple"
      />
    )

    const wrapper = container.querySelector(".text-muted-foreground")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("text-xs")
  })

  it("renders glassmorphic-xl variant", () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
        variant="glassmorphic-xl"
      />
    )

    // Should render GlassmorphismCard with rounded-xl
    const glassmorphicCard = container.querySelector(".rounded-xl")
    expect(glassmorphicCard).toBeInTheDocument()
  })

  it("renders glassmorphic-sm variant", () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
        variant="glassmorphic-sm"
      />
    )

    // Should render GlassmorphismCard with rounded-sm
    const glassmorphicCard = container.querySelector(".rounded-sm")
    expect(glassmorphicCard).toBeInTheDocument()
  })

  it("applies custom id", () => {
    const onCheckedChange = vi.fn()
    render(
      <GDPRCheckbox
        id="custom-gdpr-id"
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("id", "custom-gdpr-id")
  })

  it("applies custom className to wrapper", () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <GDPRCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        link={mockLink}
        className="custom-class"
      />
    )

    const wrapper = container.firstChild
    expect(wrapper).toHaveClass("custom-class")
  })
})
