import { NextRequest, NextResponse } from "next/server"
import { env } from "@/env.mjs"

/**
 * This route handler allows asset fetching from Strapi backend even from client-side components,
 * that cannot know the URL of Strapi.
 *
 * Using AWS S3 or similar bucket will provide you with absolute path for the resource, however
 * Strapi might be used with local storage too. This means, that URLs from assets are being fetched with relative paths.
 */

export const revalidate = false

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    const path = Array.isArray(slug) ? slug.join("/") : slug

    const url = `${env.STRAPI_URL}/${path}`

    const response = await fetch(url, {
      method: request.method,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch asset: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Forward the response from Strapi
    const body = await response.arrayBuffer()
    const headers = new Headers()

    // Copy important headers
    if (response.headers.get("content-type")) {
      headers.set("content-type", response.headers.get("content-type")!)
    }
    if (response.headers.get("content-length")) {
      headers.set("content-length", response.headers.get("content-length")!)
    }
    headers.set("cache-control", "public, max-age=31536000, immutable")

    return new NextResponse(body, {
      status: response.status,
      headers,
    })
  } catch (error) {
    console.error("[Asset Proxy] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
