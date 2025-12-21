import { defineConfig, devices } from "@playwright/test"
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: ".", // Search from root to find both tests/e2e/ and tests/integration/
  testMatch: ["**/tests/e2e/**/*.spec.ts", "**/tests/integration/**/*.spec.ts"], // Explicit patterns
  /* MSW is started via webServer command script - no global setup needed */
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI ? "http://127.0.0.1:3000" : "http://localhost:3000",
    /* Collect trace - always on for debugging, retained on failures */
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",
    screenshot: "only-on-failure",
    video: process.env.CI ? "retain-on-failure" : "off", // Video only on CI
    /* Headed mode - set HEADED=1 to run with visible browser for debugging */
    headless: process.env.HEADED ? false : true,
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        // CI: Chromium only for speed
        {
          name: "chromium",
          use: {
            ...devices["Desktop Chrome"],
            // CI-specific browser args to fix HTTPS auto-upgrade and connectivity issues
            launchOptions: {
              args: [
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process,AutoupgradeToHttps,HttpsUpgrades",
                "--allow-insecure-localhost",
                "--ignore-certificate-errors",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--proxy-server='direct://'",
                "--proxy-bypass-list=*",
              ],
            },
          },
        },
      ]
    : [
        // Local: All browsers
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
        {
          name: "firefox",
          use: { ...devices["Desktop Firefox"] },
        },
        {
          name: "webkit",
          use: { ...devices["Desktop Safari"] },
        },
      ],

  /* Run your local dev server before starting the tests */
  webServer: {
    // Start MSW BEFORE Next.js to avoid race conditions
    command: "npx tsx scripts/start-e2e-with-msw.ts",
    url: process.env.CI ? "http://127.0.0.1:3000" : "http://localhost:3000",
    reuseExistingServer: !process.env.CI, // Fresh server in CI, reuse locally
    timeout: 180 * 1000,
    stdout: "pipe", // Capture server logs
    stderr: "pipe",
  },
})
