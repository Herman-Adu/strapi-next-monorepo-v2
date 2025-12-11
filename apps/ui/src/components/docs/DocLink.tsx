import Link from "next/link"
import { DOC_METADATA_MAP, filenameToSlug } from "@/lib/docs/loader"

/**
 * Generate a union type of all valid documentation slugs
 * This ensures TypeScript compile-time validation for all doc links
 */
type ValidDocSlug = keyof typeof validSlugsMap

// Create a const object mapping slugs to true for type inference
const validSlugsMap = Object.fromEntries(
  Object.keys(DOC_METADATA_MAP).map((filePath) => [
    filenameToSlug(filePath),
    true as const,
  ])
)

interface DocLinkProps {
  /**
   * The documentation slug - must be a valid registered slug
   * TypeScript will enforce this at compile-time
   */
  slug: ValidDocSlug

  /**
   * Link text to display
   */
  children: React.ReactNode

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Optional anchor within the page
   */
  anchor?: string
}

/**
 * Type-safe documentation link component
 *
 * Usage:
 * ```tsx
 * <DocLink slug="04-components-workflow">Component Workflow</DocLink>
 * <DocLink slug="02-architecture-theme-system" anchor="color-tokens">
 *   Theme Colors
 * </DocLink>
 * ```
 *
 * TypeScript will error if you use an invalid slug:
 * ```tsx
 * <DocLink slug="invalid-slug">Won't compile!</DocLink>
 * ```
 */
export function DocLink({ slug, children, className, anchor }: DocLinkProps) {
  const href = anchor ? `/docs/${slug}#${anchor}` : `/docs/${slug}`

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

/**
 * Helper to check if a string is a valid slug at runtime
 * Useful for validating user input or dynamic slugs
 */
export function isValidDocSlug(slug: string): boolean {
  return slug in validSlugsMap
}

/**
 * Get all valid slugs for autocomplete, validation, etc.
 */
export function getAllDocSlugs(): string[] {
  return Object.keys(validSlugsMap)
}
