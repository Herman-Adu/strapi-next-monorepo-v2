module.exports = {
  ci: {
    collect: {
      // URLs to audit
      url: [
        "http://localhost:3000",
        "http://localhost:3000/en",
        "http://localhost:3000/cs",
      ],
      // Run 3 times and median the results
      numberOfRuns: 3,
      // Start dev server before auditing
      startServerCommand: "yarn workspace @repo/ui dev",
      startServerReadyPattern: "Ready in",
      startServerReadyTimeout: 60000,
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        // Performance budgets
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
        "speed-index": ["warn", { maxNumericValue: 3400 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],

        // Accessibility (strict)
        "categories:accessibility": ["error", { minScore: 0.95 }],

        // Best Practices
        "categories:best-practices": ["warn", { minScore: 0.9 }],

        // SEO
        "categories:seo": ["warn", { minScore: 0.9 }],

        // Progressive Web App
        "categories:pwa": "off", // Optional for this project

        // Resource optimization
        "unused-css-rules": "off", // Tailwind CSS can flag this
        "unused-javascript": "off",
        "uses-responsive-images": ["warn", { maxLength: 0 }],
        "modern-image-formats": ["warn", { maxLength: 0 }],
      },
    },
    upload: {
      // Store reports temporarily for PR review
      target: "temporary-public-storage",
    },
  },
}
