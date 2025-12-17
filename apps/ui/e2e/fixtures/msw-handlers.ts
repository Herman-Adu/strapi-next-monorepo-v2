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
  // Mock Strapi health check endpoint
  // This is required for setup.ts to validate Strapi is running
  http.get(`${STRAPI_URL}/_health`, () => {
    return HttpResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  }),

  // Mock pages API endpoint
  // Matches: GET /api/pages?filters[fullPath][$eq]=/e2e-test-page&locale=en&populate=deep
  // Note: Changed from filters[path] to filters[fullPath] to match actual API calls
  http.get(`${STRAPI_URL}/api/pages`, ({ request }) => {
    // eslint-disable-next-line no-console
    console.log(
      `[MSW Handler] Received request: ${request.method} ${request.url}`
    )
    const url = new URL(request.url)

    // Check both fullPath (actual) and path (legacy) for compatibility
    const fullPath = url.searchParams.get("filters[fullPath][$eq]")
    const path = url.searchParams.get("filters[path][$eq]")
    const searchPath = fullPath || path

    // eslint-disable-next-line no-console
    console.log(
      `[MSW Handler DEBUG] fullPath param: ${fullPath}, path param: ${path}, searchPath: ${searchPath}`
    )

    // Return mock E2E test page for test path
    if (searchPath?.includes("e2e-test-page")) {
      const responseData = {
        data: [mockE2EPage.data],
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 1,
            total: 1,
          },
        },
      }

      // eslint-disable-next-line no-console
      console.log(`[MSW Handler] ✅ Matched e2e-test-page request`)
      // eslint-disable-next-line no-console
      console.log(
        `[MSW Handler DEBUG] Returning mock data with ${responseData.data.length} page(s)`
      )
      // eslint-disable-next-line no-console
      console.log(
        `[MSW Handler DEBUG] Page object keys: ${Object.keys(responseData.data[0]).join(", ")}`
      )
      // eslint-disable-next-line no-console
      console.log(
        `[MSW Handler DEBUG] Content array length: ${responseData.data[0].content?.length || 0}`
      )
      // eslint-disable-next-line no-console
      console.log(
        `[MSW Handler DEBUG] Content components: ${responseData.data[0].content?.map((c: any) => c.__component).join(", ") || "none"}`
      )

      return HttpResponse.json(responseData)
    }

    // Return empty array for other paths (404 behavior)
    // eslint-disable-next-line no-console
    console.log(`[MSW Handler] ❌ No match for path: ${searchPath}`)
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
  // Next.js proxy forwards POST /api/public-proxy/subscribers → STRAPI_URL/subscribers
  // MSW intercepts at the Strapi URL level
  // Path must match API_ENDPOINTS["api::subscriber.subscriber"] = "/subscribers"
  http.post(`${STRAPI_URL}/subscribers`, async ({ request }) => {
    const body = (await request.json()) as { data: { email: string } }

    // eslint-disable-next-line no-console
    console.log("[MSW Handler] Newsletter subscription:", body)

    // Return format matching Strapi's expected response
    return HttpResponse.json(
      {
        data: {
          id: 1,
          attributes: {
            email: body.data.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
      { status: 200 }
    )
  }),

  // Mock contact form submission endpoint (POST)
  // Next.js proxy forwards POST /api/public-proxy/contact-messages → STRAPI_URL/contact-messages
  // MSW intercepts at the Strapi URL level
  // Path must match API_ENDPOINTS["api::contact-message.contact-message"] = "/contact-messages"
  http.post(`${STRAPI_URL}/contact-messages`, async ({ request }) => {
    const body = (await request.json()) as {
      data: {
        name: string
        email: string
        message: string
      }
    }

    // eslint-disable-next-line no-console
    console.log("[MSW Handler] Contact form submission:", body)

    // Return format matching Strapi's expected response
    return HttpResponse.json(
      {
        data: {
          id: 1,
          attributes: {
            ...body.data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
      { status: 200 }
    )
  }),
]
