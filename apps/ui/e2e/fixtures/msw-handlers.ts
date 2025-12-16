import { http, HttpResponse } from "msw"
import { mockE2EPage, mockNavbar, mockFooter } from "./mock-data"

/**
 * MSW Request Handlers for E2E Tests
 *
 * These handlers intercept network requests at the Node.js level,
 * enabling SSR (Server-Side Rendering) mocking that Playwright's
 * page.route() cannot achieve.
 *
 * MSW intercepts both:
 * - Browser requests (client-side)
 * - Node.js fetch calls (server-side SSR)
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337"

export const handlers = [
  // Mock pages API endpoint
  // Matches: GET /api/pages?filters[path][$eq]=/e2e-test-page&locale=en&populate=deep
  http.get(`${STRAPI_URL}/api/pages`, ({ request }) => {
    const url = new URL(request.url)
    const path = url.searchParams.get("filters[path][$eq]")

    // Return mock E2E test page for test path
    if (path?.includes("e2e-test-page")) {
      return HttpResponse.json({
        data: [mockE2EPage.data],
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 1,
            total: 1,
          },
        },
      })
    }

    // Return empty array for other paths (404 behavior)
    return HttpResponse.json({
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
    })
  }),

  // Mock navbar API endpoint
  // Matches: GET /api/navbar?populate=deep
  http.get(`${STRAPI_URL}/api/navbar`, () => {
    return HttpResponse.json(mockNavbar)
  }),

  // Mock footer API endpoint
  // Matches: GET /api/footer?populate=deep
  http.get(`${STRAPI_URL}/api/footer`, () => {
    return HttpResponse.json(mockFooter)
  }),

  // Mock newsletter subscription endpoint (POST)
  // This intercepts the Next.js API route proxy request
  http.post("*/api/public-proxy/subscribers", async ({ request }) => {
    const body = (await request.json()) as { email: string }

    return HttpResponse.json(
      {
        success: true,
        message: "Successfully subscribed!",
        data: {
          id: 1,
          email: body.email,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  }),

  // Mock contact form submission endpoint (POST)
  // This intercepts the Next.js API route proxy request
  http.post("*/api/public-proxy/contact-submissions", async ({ request }) => {
    const body = (await request.json()) as {
      name: string
      email: string
      message: string
    }

    return HttpResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
        data: {
          id: 1,
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  }),
]
