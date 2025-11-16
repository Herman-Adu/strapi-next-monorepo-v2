import React from "react"

export interface BlogCardProps {
  /**
   * Add your props here
   */
  children?: React.ReactNode
  className?: string
}

/**
 * BlogCard molecule
 *
 * @example
 * <BlogCard>Content</BlogCard>
 */
export function BlogCard({ children, className = "" }: BlogCardProps) {
  return <div className={`m-blogcard ${className}`}>{children}</div>
}
