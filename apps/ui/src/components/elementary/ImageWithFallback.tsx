/* eslint-disable jsx-a11y/alt-text */
"use client"

import { SyntheticEvent, useEffect, useState } from "react"
import Image from "next/image"

import { ImageExtendedProps } from "@/types/next"

import { FALLBACK_IMAGE_PATH } from "@/lib/constants"

import { ImageWithBlur } from "./ImageWithBlur"

export const ImageWithFallback = ({
  fallbackSrc,
  src: originalSrc,
  blurOff,
  ...imgProps
}: ImageExtendedProps & { blurOff?: boolean }) => {
  const [src, setSrc] = useState(
    originalSrc ?? fallbackSrc ?? FALLBACK_IMAGE_PATH
  )

  useEffect(() => {
    setSrc(originalSrc ?? fallbackSrc ?? FALLBACK_IMAGE_PATH)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalSrc])

  const handleLoadError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    // Only log errors for valid image sources, not fallback attempts
    if (src !== FALLBACK_IMAGE_PATH) {
      console.warn(`Failed to load image from ${src}, using fallback`)
    }

    if (fallbackSrc && src !== fallbackSrc) {
      setSrc(fallbackSrc)
    } else if (src !== FALLBACK_IMAGE_PATH) {
      setSrc(FALLBACK_IMAGE_PATH)
    }

    imgProps?.onError?.(e)
  }

  if (blurOff) {
    return <Image src={src} {...imgProps} onError={handleLoadError} />
  }

  return <ImageWithBlur src={src} {...imgProps} onError={handleLoadError} />
}
