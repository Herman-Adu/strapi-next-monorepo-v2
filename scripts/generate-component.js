#!/usr/bin/env node

/**
 * Component Scaffolding CLI
 *
 * Generates atomic design components with boilerplate
 * Usage: yarn generate:component --type molecule --name BlogCard
 *
 * @see docs/AUTOMATION-STRATEGY.md
 * @see docs/atomic-architecture/README.md
 */

const fs = require("fs")
const path = require("path")

// Parse command line arguments
const args = process.argv.slice(2)
const typeIndex = args.indexOf("--type")
const nameIndex = args.indexOf("--name")
const skipStoryIndex = args.indexOf("--skip-story")

if (typeIndex === -1 || nameIndex === -1) {
  console.error("❌ Missing required arguments")
  console.log("\nUsage:")
  console.log(
    "  yarn generate:component --type <atom|molecule|organism> --name <ComponentName>"
  )
  console.log("\nOptions:")
  console.log("  --skip-story     Skip generating Storybook story file")
  console.log("\nExamples:")
  console.log("  yarn generate:component --type molecule --name BlogCard")
  console.log("  yarn generate:component --type atom --name Button")
  console.log(
    "  yarn generate:component --type organism --name HeroSection --skip-story"
  )
  process.exit(1)
}

const type = args[typeIndex + 1]
const name = args[nameIndex + 1]
const skipStory = skipStoryIndex !== -1

// Validate type
const validTypes = ["atom", "molecule", "organism", "template", "page"]
if (!validTypes.includes(type)) {
  console.error(`❌ Invalid type: ${type}`)
  console.log(`   Valid types: ${validTypes.join(", ")}`)
  process.exit(1)
}

// Validate name (PascalCase)
if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
  console.error(`❌ Component name must be PascalCase: ${name}`)
  console.log("   Examples: Button, BlogCard, HeroSection")
  process.exit(1)
}

console.log(`\n🎨 Generating ${type}: ${name}...\n`)

// Determine component directory
const componentDir = path.join(
  __dirname,
  "../apps/ui/src/components",
  `${type}s`,
  name
)

// Check if component already exists
if (fs.existsSync(componentDir)) {
  console.error(`❌ Component already exists: ${componentDir}`)
  process.exit(1)
}

// Create component directory
fs.mkdirSync(componentDir, { recursive: true })

// Generate component file
const componentTemplate = `import React from "react"

export interface ${name}Props {
  /**
   * Add your props here
   */
  children?: React.ReactNode
  className?: string
}

/**
 * ${name} ${type}
 *
 * @example
 * <${name}>Content</${name}>
 */
export function ${name}({ children, className = "" }: ${name}Props) {
  return (
    <div className={\`${type.charAt(0)}-${name.toLowerCase()} \${className}\`}>
      {children}
    </div>
  )
}
`

fs.writeFileSync(path.join(componentDir, `${name}.tsx`), componentTemplate)
console.log(`✅ Created ${name}.tsx`)

// Generate index file
const indexTemplate = `export { ${name} } from "./${name}"
export type { ${name}Props } from "./${name}"
`

fs.writeFileSync(path.join(componentDir, "index.ts"), indexTemplate)
console.log(`✅ Created index.ts`)

// Generate Storybook story (unless skipped)
if (!skipStory) {
  const storyTemplate = `import type { Meta, StoryObj } from "@storybook/react"
import { ${name} } from "./${name}"

const meta: Meta<typeof ${name}> = {
  title: "${type.charAt(0).toUpperCase() + type.slice(1)}s/${name}",
  component: ${name},
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
type Story = StoryObj<typeof ${name}>

export const Default: Story = {
  args: {
    children: "${name} content goes here",
  },
}

export const CustomClass: Story = {
  args: {
    children: "${name} with custom styling",
    className: "bg-primary text-white p-4 rounded-lg",
  },
}
`

  fs.writeFileSync(
    path.join(componentDir, `${name}.stories.tsx`),
    storyTemplate
  )
  console.log(`✅ Created ${name}.stories.tsx`)
}

// Generate README
const readmeTemplate = `# ${name}

**Type:** ${type.charAt(0).toUpperCase() + type.slice(1)}

## Usage

\`\`\`tsx
import { ${name} } from "@/components/${type}s/${name}"

function MyComponent() {
  return (
    <${name}>
      Content goes here
    </${name}>
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Content to display |
| className | string | "" | Additional CSS classes |

## Examples

### Basic Usage
\`\`\`tsx
<${name}>
  Hello World
</${name}>
\`\`\`

### With Custom Styling
\`\`\`tsx
<${name} className="bg-primary text-white p-4">
  Styled content
</${name}>
\`\`\`

## Atomic Design Level

This is a **${type}** component, which means:
${
  type === "atom"
    ? "- Basic building block (buttons, inputs, labels)\n- Cannot be broken down further\n- Highly reusable"
    : type === "molecule"
      ? "- Combination of atoms (form groups, cards)\n- Simple, functional groups\n- Reusable in multiple contexts"
      : type === "organism"
        ? "- Complex UI sections (headers, forms, grids)\n- Combinations of molecules and/or atoms\n- May have specific business logic"
        : "- Page-level component"
}

## Related Components

- Add related components here

## Notes

- Add implementation notes, gotchas, or best practices here
`

fs.writeFileSync(path.join(componentDir, "README.md"), readmeTemplate)
console.log(`✅ Created README.md`)

// Summary
console.log(`\n🎉 Component generated successfully!\n`)
console.log(`📂 Location: ${componentDir}\n`)
console.log(`📝 Files created:`)
console.log(`   - ${name}.tsx (Component implementation)`)
console.log(`   - index.ts (Exports)`)
if (!skipStory) {
  console.log(`   - ${name}.stories.tsx (Storybook stories)`)
}
console.log(`   - README.md (Documentation)\n`)
console.log(`🚀 Next steps:`)
console.log(`   1. Implement your component logic in ${name}.tsx`)
console.log(`   2. Add props to ${name}Props interface`)
console.log(`   3. Update README.md with usage examples`)
if (!skipStory) {
  console.log(`   4. View in Storybook: yarn storybook`)
}
console.log(
  `   5. Import in your page: import { ${name} } from "@/components/${type}s/${name}"\n`
)
