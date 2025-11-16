# BlogCard

**Type:** Molecule

## Usage

```tsx
import { BlogCard } from "@/components/molecules/BlogCard"

function MyComponent() {
  return <BlogCard>Content goes here</BlogCard>
}
```

## Props

| Prop      | Type      | Default | Description            |
| --------- | --------- | ------- | ---------------------- |
| children  | ReactNode | -       | Content to display     |
| className | string    | ""      | Additional CSS classes |

## Examples

### Basic Usage

```tsx
<BlogCard>Hello World</BlogCard>
```

### With Custom Styling

```tsx
<BlogCard className="bg-primary p-4 text-white">Styled content</BlogCard>
```

## Atomic Design Level

This is a **molecule** component, which means:

- Combination of atoms (form groups, cards)
- Simple, functional groups
- Reusable in multiple contexts

## Related Components

- Add related components here

## Notes

- Add implementation notes, gotchas, or best practices here
