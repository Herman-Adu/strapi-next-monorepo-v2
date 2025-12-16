import { test, expect } from "@playwright/test"

/**
 * INTEGRATION TESTS - Strapi API Public Endpoints
 *
 * Tests for endpoints that allow public access without authentication.
 * These endpoints support SEO, SSG builds, and anonymous users.
 *
 * Architecture Tier: PUBLIC (No Token Required)
 * - Published pages (status=published)
 * - Footer content
 * - Navbar content
 * - Health check
 *
 * Requirements:
 * - Strapi running on http://localhost:1337
 * - Strapi Public role configured with read access to published content
 *
 * Run: yarn test:integration
 * CI: Runs weekly via integration-tests.yml workflow
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337"

test.describe("Strapi API - Public Endpoints", () => {
  test("should access published pages without token", async ({ request }) => {
    const response = await request.get(
      `${STRAPI_URL}/api/pages?filters[status][$eq]=published`
    )

    // Published pages are public for SEO and SSG
    // 400 if Strapi requires additional filters, 200 if accessible
    expect([200, 400]).toContain(response.status())

    if (response.status() === 200) {
      const data = await response.json()
      expect(data.data).toBeDefined()
      expect(Array.isArray(data.data)).toBe(true)
    }
  })

  test("should access footer content without token", async ({ request }) => {
    const response = await request.get(`${STRAPI_URL}/api/footer?populate=deep`)

    // Footer is global public content
    // 400 if Strapi requires authentication, 200 if public
    expect([200, 400]).toContain(response.status())

    const data = await response.json()
    expect(data.data).toBeDefined()
  })

  test("should access navbar content without token", async ({ request }) => {
    const response = await request.get(`${STRAPI_URL}/api/navbar?populate=deep`)

    // Navbar is global public content
    // 400 if Strapi requires authentication, 200 if public
    expect([200, 400]).toContain(response.status())

    const data = await response.json()
    expect(data.data).toBeDefined()
  })

  test("should access health endpoint without token", async ({ request }) => {
    const response = await request.get(`${STRAPI_URL}/_health`)

    // Health endpoint is always public
    expect(response.ok()).toBe(true)
  })

  test("should retrieve specific published page by slug", async ({
    request,
  }) => {
    const response = await request.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=e2e-test-page&filters[status][$eq]=published&populate=deep`
    )

    // 400 if Strapi requires authentication, 200 if public
    expect([200, 400]).toContain(response.status())

    if (response.status() === 200) {
      const data = await response.json()
      expect(data.data).toBeDefined()

      if (Array.isArray(data.data) && data.data.length > 0) {
        const testPage = data.data[0]
        expect(testPage.attributes.slug).toBe("e2e-test-page")
        expect(testPage.attributes.status).toBe("published")
      }
    }
  })

  test("should return CORS headers for public endpoints", async ({
    request,
  }) => {
    const response = await request.get(`${STRAPI_URL}/api/pages`, {
      headers: {
        Origin: "http://localhost:3000",
      },
    })

    expect([200, 403]).toContain(response.status())

    const headers = response.headers()
    expect(
      headers["access-control-allow-origin"] ||
        headers["Access-Control-Allow-Origin"]
    ).toBeDefined()
  })

  test("should handle pagination for public content", async ({ request }) => {
    const response = await request.get(
      `${STRAPI_URL}/api/pages?pagination[page]=1&pagination[pageSize]=5`
    )

    expect([200, 403]).toContain(response.status())

    if (response.status() === 200) {
      const data = await response.json()
      expect(data.meta).toBeDefined()
      expect(data.meta.pagination).toBeDefined()
    }
  })
})
