"use client"

import { useEffect, useRef, useState } from "react"
import Markdown from "markdown-to-jsx"

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
      <Markdown>{content}</Markdown>
    </article>
  )
}
