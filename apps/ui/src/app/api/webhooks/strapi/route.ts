import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * Webhook handler for Strapi content updates
 *
 * Triggered by Strapi webhooks on content changes (publish, update, delete)
 * Invalidates Next.js cache to reflect new content immediately
 *
 * @see docs/strapi-integration/04-WEBHOOKS.md
 * @see docs/performance-optimization/01-CACHING.md
 */

interface StrapiWebhookEvent {
  event:
    | "entry.create"
    | "entry.update"
    | "entry.delete"
    | "entry.publish"
    | "entry.unpublish"
  createdAt: string
  model: string
  entry: {
    id: number
    slug?: string
    [key: string]: any
  }
}

/**
 * Validates webhook signature to ensure request is from Strapi
 *
 * Configure in Strapi Admin:
 * Settings → Webhooks → Add webhook
 * Headers: { "x-webhook-secret": "your-secret-key" }
 */
function validateWebhookSignature(request: NextRequest): boolean {
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET

  // If no secret configured, allow in development only
  if (!webhookSecret) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️ STRAPI_WEBHOOK_SECRET not configured. Allowing webhook in development mode."
      )
      return true
    }
    console.error("❌ STRAPI_WEBHOOK_SECRET not configured")
    return false
  }

  const signature = request.headers.get("x-webhook-secret")
  return signature === webhookSecret
}

/**
 * POST handler for Strapi webhooks
 *
 * Example Strapi webhook payload:
 * {
 *   "event": "entry.publish",
 *   "createdAt": "2025-11-16T10:30:00.000Z",
 *   "model": "blog",
 *   "entry": {
 *     "id": 1,
 *     "title": "My Blog Post",
 *     "slug": "my-blog-post",
 *     "publishedAt": "2025-11-16T10:30:00.000Z"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate webhook signature
    if (!validateWebhookSignature(request)) {
      console.error("❌ Invalid webhook signature")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse webhook payload
    const payload: StrapiWebhookEvent = await request.json()
    const { event, model, entry } = payload

    console.log(`📨 Received webhook: ${event} for ${model} (ID: ${entry.id})`)

    // Track revalidated paths for response
    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    // Revalidate based on content type
    switch (model) {
      case "blog":
      case "api::blog.blog":
        if (event === "entry.publish" || event === "entry.update") {
          // Revalidate blog list page
          await revalidatePath("/blog")
          revalidatedPaths.push("/blog")

          // Revalidate specific blog post if slug exists
          if (entry.slug) {
            await revalidatePath(`/blog/${entry.slug}`)
            revalidatedPaths.push(`/blog/${entry.slug}`)
          }

          // Revalidate by tag (if using tag-based caching)
          await revalidateTag("blogs")
          revalidatedTags.push("blogs")
        }

        if (event === "entry.delete" || event === "entry.unpublish") {
          // Just revalidate list on delete/unpublish
          await revalidatePath("/blog")
          revalidatedPaths.push("/blog")
          await revalidateTag("blogs")
          revalidatedTags.push("blogs")
        }
        break

      case "page":
      case "api::page.page":
        if (event === "entry.publish" || event === "entry.update") {
          // Revalidate specific page if slug exists
          if (entry.slug) {
            await revalidatePath(`/${entry.slug}`)
            revalidatedPaths.push(`/${entry.slug}`)
          }

          // Revalidate pages list/index
          await revalidatePath("/")
          revalidatedPaths.push("/")
          await revalidateTag("pages")
          revalidatedTags.push("pages")
        }
        break

      case "global-setting":
      case "api::global-setting.global-setting":
        // Global settings affect entire site
        console.log("🌐 Global settings changed - revalidating entire site")
        await revalidatePath("/", "layout")
        revalidatedPaths.push("/ (layout)")
        await revalidateTag("global")
        revalidatedTags.push("global")
        break

      case "faq":
      case "api::faq.faq":
      case "faq-category":
      case "api::faq-category.faq-category":
        await revalidatePath("/faq")
        revalidatedPaths.push("/faq")
        await revalidateTag("faq")
        revalidatedTags.push("faq")
        break

      case "team-member":
      case "api::team-member.team-member":
        await revalidatePath("/about")
        await revalidatePath("/team")
        revalidatedPaths.push("/about", "/team")
        await revalidateTag("team")
        revalidatedTags.push("team")
        break

      default:
        // Unknown content type - log for debugging
        console.warn(
          `⚠️ Unknown content type: ${model}. No revalidation performed.`
        )
        return NextResponse.json({
          success: true,
          message: `Unknown content type: ${model}`,
          revalidated: false,
        })
    }

    console.log("✅ Cache revalidation successful")
    console.log(`   Paths: ${revalidatedPaths.join(", ") || "none"}`)
    console.log(`   Tags: ${revalidatedTags.join(", ") || "none"}`)

    return NextResponse.json({
      success: true,
      revalidated: true,
      paths: revalidatedPaths,
      tags: revalidatedTags,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler for webhook health check
 * Use this to verify webhook endpoint is accessible
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/webhooks/strapi",
    message: "Webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
