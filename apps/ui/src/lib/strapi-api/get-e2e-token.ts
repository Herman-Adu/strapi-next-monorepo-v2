import { env } from "@/env.mjs"

/**
 * Get the appropriate API token for Strapi requests.
 *
 * Environment-aware token selection:
 * - CI/E2E Tests: Uses E2E_TESTS_PLAYWRIGHT_API_KEY (full-access) when defined
 * - Production/Local: Falls back to STRAPI_REST_READONLY_API_KEY (read-only)
 *
 * This ensures tests use full-access tokens in CI while maintaining
 * read-only security for production/development SSR.
 */
export const getE2eToken = (): string => {
  return env.E2E_TESTS_PLAYWRIGHT_API_KEY || env.STRAPI_REST_READONLY_API_KEY
}
