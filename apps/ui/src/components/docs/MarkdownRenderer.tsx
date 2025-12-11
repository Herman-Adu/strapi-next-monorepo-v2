"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"
import { normalizeLegacyLink } from "@/lib/docs/link-utils"
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
  className?: string
  onRender?: () => void
}

export function MarkdownRenderer({
  content,
  className = "",
  onRender,
}: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
    onRender?.()
  }, [onRender])

  if (!isReady) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="bg-muted h-8 w-3/4 rounded" />
        <div className="bg-muted h-4 w-full rounded" />
        <div className="bg-muted h-4 w-5/6 rounded" />
      </div>
    )
  }

  return (
    <article
      ref={containerRef}
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

// Custom components for ReactMarkdown
const markdownComponents: Components = {
  // Transform all links to use Next.js Link and normalize legacy formats
  a: ({ href, children, ...props }) => {
    if (!href) {
      return <a {...props}>{children}</a>
    }

    // External links - open in new tab
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    }

    // Anchor links (same page)
    if (href.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      )
    }

    // Internal documentation links - normalize and use Next.js Link
    const normalizedHref = normalizeLegacyLink(href)

    return (
      <Link href={normalizedHref} {...props}>
        {children}
      </Link>
    )
  },
}
