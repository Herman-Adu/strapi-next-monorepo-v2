"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
require("@testing-library/jest-dom")
const react_1 = require("@testing-library/react")
const vitest_1 = require("vitest")
// Cleanup after each test
;(0, vitest_1.afterEach)(() => {
  ;(0, react_1.cleanup)()
})
// Mock Next.js router
vitest_1.vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vitest_1.vi.fn(),
    replace: vitest_1.vi.fn(),
    prefetch: vitest_1.vi.fn(),
    back: vitest_1.vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))
// Mock next-intl
vitest_1.vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
  useLocale: () => "en",
}))
