import type { Meta, StoryObj } from "@storybook/nextjs"
import { BlogCard } from "./BlogCard"

const meta: Meta<typeof BlogCard> = {
  title: "Molecules/BlogCard",
  component: BlogCard,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content to display inside the component",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
}

export default meta
type Story = StoryObj<typeof BlogCard>

export const Default: Story = {
  args: {
    children: "BlogCard content goes here",
  },
}

export const CustomClass: Story = {
  args: {
    children: "BlogCard with custom styling",
    className: "bg-primary text-white p-4 rounded-lg",
  },
}
