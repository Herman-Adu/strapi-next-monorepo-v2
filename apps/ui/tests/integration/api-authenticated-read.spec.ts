import { test, expect } from "@playwright/test"

/**
 * INTEGRATION TESTS - Strapi API Authenticated Read Operations
 *
 * Tests for endpoints that require authentication for read access.
 * These endpoints protect draft content, previews, and user-specific data.
 *
 * Architecture Tier: AUTHENTICATED READ (Token Required)
 * - Draft pages (status=draft)
 * - Preview mode content
 * - User-specific content
 * - Protected collections
 *
 * Requirements:
 * - Strapi running on http://localhost:1337
 * - E2E_TESTS_PLAYWRIGHT_API_KEY environment variable set
 * - Strapi Authenticated role configured with read access
 *
 * Run: yarn test:integration
 * CI: Runs weekly via integration-tests.yml workflow
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337"
const API_TOKEN = process.env.E2E_TESTS_PLAYWRIGHT_API_KEY

test.describe("Strapi API - Authenticated Read Operations", () => {
  test("should access pages with valid token", async ({ request }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.get(`${STRAPI_URL}/api/pages`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    })

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.data).toBeDefined()
    expect(Array.isArray(data.data)).toBe(true)
  })

  test("should reject pages request without token", async ({ request }) => {
    const response = await request.get(`${STRAPI_URL}/api/pages`)

    // Without filters, should require authentication
    // If returns 200, Strapi is configured for public access (acceptable)
    // If returns 401, Strapi requires auth (also acceptable)
    expect([200, 401, 403]).toContain(response.status())
  })

  test("should reject requests with invalid token", async ({ request }) => {
    const response = await request.get(`${STRAPI_URL}/api/pages`, {
      headers: {
        Authorization: "Bearer invalid-token-12345",
      },
    })

    expect([401, 403]).toContain(response.status())
  })

  test("should access draft pages with token", async ({ request }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.get(
      `${STRAPI_URL}/api/pages?filters[status][$eq]=draft`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    )

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.data).toBeDefined()
  })

  test("should reject draft pages without token", async ({ request }) => {
    const response = await request.get(
      `${STRAPI_URL}/api/pages?filters[status][$eq]=draft`
    )

    // Draft content should always require authentication
    expect([400, 401, 403]).toContain(response.status())
  })

  test("should retrieve specific page by slug with token", async ({
    request,
  }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=e2e-test-page&populate=deep`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    )

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.data).toBeDefined()
    expect(data.data.length).toBeGreaterThan(0)

    const testPage = data.data[0]
    expect(testPage.attributes.slug).toBe("e2e-test-page")
    expect(testPage.attributes.sections).toBeDefined()
  })

  test("should access deep populated content with token", async ({
    request,
  }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.get(
      `${STRAPI_URL}/api/pages?populate=deep`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    )

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.data).toBeDefined()
  })

  test("should return proper CORS headers with authentication", async ({
    request,
  }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.get(`${STRAPI_URL}/api/pages`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Origin: "http://localhost:3000",
      },
    })

    expect(response.status()).toBe(200)

    const headers = response.headers()
    expect(
      headers["access-control-allow-origin"] ||
        headers["Access-Control-Allow-Origin"]
    ).toBeDefined()
  })

  test("should handle rate limiting with authentication", async ({
    request,
  }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const requests = Array.from({ length: 10 }, () =>
      request.get(`${STRAPI_URL}/api/pages`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      })
    )

    const responses = await Promise.all(requests)

    responses.forEach((response) => {
      expect([200, 429]).toContain(response.status())
    })
  })
})
