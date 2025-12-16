import { test, expect } from "@playwright/test"

/**
 * INTEGRATION TESTS - Strapi API Authenticated Write Operations
 *
 * Tests for endpoints that require authentication for write/mutation operations.
 * These endpoints handle form submissions, data creation, updates, and deletions.
 *
 * Architecture Tier: AUTHENTICATED WRITE (Token Required)
 * - Newsletter subscriptions (POST /api/subscribers)
 * - Contact form submissions (POST /api/contact-messages)
 * - Content updates (PUT /api/*)
 * - Content deletions (DELETE /api/*)
 *
 * Requirements:
 * - Strapi running on http://localhost:1337
 * - E2E_TESTS_PLAYWRIGHT_API_KEY environment variable set
 * - Strapi Authenticated role configured with write permissions
 *
 * Run: yarn test:integration
 * CI: Runs weekly via integration-tests.yml workflow
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337"
const API_TOKEN = process.env.E2E_TESTS_PLAYWRIGHT_API_KEY

test.describe("Strapi API - Authenticated Write Operations", () => {
  test("should reject subscriber creation without token", async ({
    request,
  }) => {
    const response = await request.post(`${STRAPI_URL}/api/subscribers`, {
      data: {
        data: {
          email: "test@example.com",
          gdprConsent: true,
        },
      },
    })

    // Write operations should always require authentication
    expect([400, 401, 403]).toContain(response.status())
  })

  test("should create subscriber with valid token", async ({ request }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const testEmail = `integration-test-${Date.now()}@example.com`

    const response = await request.post(`${STRAPI_URL}/api/subscribers`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        data: {
          email: testEmail,
          gdprConsent: true,
        },
      },
    })

    // Should succeed with valid token
    expect([200, 201]).toContain(response.status())

    if (response.ok()) {
      const data = await response.json()
      expect(data.data).toBeDefined()
      expect(data.data.attributes.email).toBe(testEmail)
    }
  })

  test("should reject contact message without token", async ({ request }) => {
    const response = await request.post(`${STRAPI_URL}/api/contact-messages`, {
      data: {
        data: {
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
          gdprConsent: true,
        },
      },
    })

    // Write operations should always require authentication
    expect([400, 401, 403]).toContain(response.status())
  })

  test("should create contact message with valid token", async ({
    request,
  }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.post(`${STRAPI_URL}/api/contact-messages`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        data: {
          name: "Integration Test",
          email: `test-${Date.now()}@example.com`,
          message: "Automated integration test message",
          gdprConsent: true,
        },
      },
    })

    // Should succeed with valid token
    expect([200, 201]).toContain(response.status())

    if (response.ok()) {
      const data = await response.json()
      expect(data.data).toBeDefined()
      expect(data.data.attributes.name).toBe("Integration Test")
    }
  })

  test("should reject write with invalid token", async ({ request }) => {
    const response = await request.post(`${STRAPI_URL}/api/subscribers`, {
      headers: {
        Authorization: "Bearer invalid-token-12345",
        "Content-Type": "application/json",
      },
      data: {
        data: {
          email: "test@example.com",
          gdprConsent: true,
        },
      },
    })

    expect([401, 403]).toContain(response.status())
  })

  test("should validate required fields on write", async ({ request }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.post(`${STRAPI_URL}/api/subscribers`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        data: {
          // Missing required fields
        },
      },
    })

    // Should return validation error
    expect([400, 422]).toContain(response.status())
  })

  test("should prevent duplicate email subscriptions", async ({ request }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const testEmail = `duplicate-test-${Date.now()}@example.com`

    // First submission
    await request.post(`${STRAPI_URL}/api/subscribers`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        data: {
          email: testEmail,
          gdprConsent: true,
        },
      },
    })

    // Second submission with same email
    const response = await request.post(`${STRAPI_URL}/api/subscribers`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        data: {
          email: testEmail,
          gdprConsent: true,
        },
      },
    })

    // Should reject duplicate (400 or 409 conflict)
    expect([400, 409]).toContain(response.status())
  })

  test("should handle malformed JSON in write requests", async ({
    request,
  }) => {
    if (!API_TOKEN) {
      test.skip()
      return
    }

    const response = await request.post(`${STRAPI_URL}/api/subscribers`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: "invalid-json-string",
    })

    // Should return bad request
    expect([400, 422]).toContain(response.status())
  })
})
