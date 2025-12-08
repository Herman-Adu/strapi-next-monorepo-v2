/**
 * E2E Test Data Seeding Script
 *
 * Creates test data required for Playwright E2E tests at /en/e2e-test-page
 *
 * **Required Test Data:**
 * - Page: E2E Test Page (slug: e2e-test-page)
 * - Sections: Newsletter CTA, FAQ (5 questions), Contact Form
 * - API Token: Read-only token for Next.js authentication
 *
 * **Usage:**
 * - Local: `yarn seed:e2e` (from apps/strapi)
 * - CI: Automatically run before E2E tests
 *
 * **Why Factory Pattern?**
 * - Maintainability: Update seed data by editing this script (not SQL)
 * - Version Control: Changes tracked in git
 * - Flexibility: Easy to add/modify test scenarios
 * - Documentation: Code is self-documenting
 *
 * **Tradeoff:**
 * - Slower than SQL snapshot (~30-60s vs ~5-10s)
 * - Acceptable for CI since tests run weekly, not on every push
 */

import crypto from "crypto"

export default async ({ strapi }: { strapi: any }) => {
  console.log("🌱 Starting E2E test data seeding...")

  try {
    // ============================================================================
    // 0. CREATE READ-ONLY API TOKEN FOR E2E TESTS
    // ============================================================================

    console.log("🔑 Creating read-only API token for E2E tests...")

    // Delete existing e2e-readonly-token if it exists
    const existingTokens = await strapi.db
      .query("admin::api-token")
      .findMany({ where: { name: "e2e-readonly-token" } })

    for (const token of existingTokens) {
      await strapi.db
        .query("admin::api-token")
        .delete({ where: { id: token.id } })
      console.log(`   ♻️  Deleted existing token: ${token.name}`)
    }

    // The plain text token that will be used in CI
    const plainToken = "e2e-test-token-12345678901234567890123456789012"

    // Strapi stores the SHA512 hash of the token, not the plain text
    const hashedToken = crypto
      .createHash("sha512")
      .update(plainToken)
      .digest("base64")

    // Create new API token with full-access permissions for E2E tests
    // Note: Using full-access because read-only type doesn't grant API access by default
    const apiToken = await strapi.db.query("admin::api-token").create({
      data: {
        name: "e2e-readonly-token",
        description: "API token for E2E tests with full read access",
        type: "full-access", // Changed from "read-only" - need API access
        accessKey: hashedToken, // SHA512 hash of the token
        lifespan: null, // null = never expires
        permissions: [], // full-access type has all permissions
      },
    })

    console.log(`✅ API token created: ${apiToken.name}`)
    console.log(`   📝 Plain token: ${plainToken}`)
    console.log(
      `   💡 Set this in CI: STRAPI_REST_READONLY_API_KEY=${plainToken}`
    )

    // ============================================================================
    // 1. CREATE E2E TEST PAGE WITH ALL REQUIRED SECTIONS
    // ============================================================================

    console.log("📄 Creating E2E test page...")

    const e2eTestPage = await strapi.documents("api::page.page").create({
      data: {
        // Basic page info
        title: "E2E Test Page",
        slug: "e2e-test-page",
        fullPath: "/e2e-test-page",

        // SEO metadata
        seo: {
          metaTitle: "E2E Test Page - Web Development Agency",
          metaDescription:
            "Test page for end-to-end testing with newsletter, FAQ, and contact sections",
          keywords: "testing, e2e, playwright",
          preventIndexing: true, // Don't index test pages
        },

        // Dynamic zone content sections
        content: [
          // -----------------------------------------------------------------------
          // SECTION 1: Newsletter CTA Section
          // -----------------------------------------------------------------------
          {
            __component: "sections.newsletter-cta-section",

            // Header with gradient text
            header: {
              heading: "Web Development Insights",
              headingAccent: "Stay Updated with",
              description:
                "Get the latest tips, trends, and insights delivered to your inbox. No spam, just value.",
              headingSize: "large",
              alignment: "center",
              showDivider: true,
              showHeader: true,
            },

            // Newsletter form fields
            heading: "Subscribe to Our Newsletter",
            description:
              "Join 500+ developers and business owners staying ahead of the curve",
            inputPlaceholder: "your.email@example.com",
            buttonText: "Subscribe",

            // GDPR compliance
            gdprLabel: "I agree to receive marketing emails",
            gdprLink: {
              label: "Privacy Policy",
              href: "/privacy",
              newTab: false,
            },

            // Benefits list
            benefits: [
              {
                title: "Weekly insights",
                description: "Weekly insights and tutorials",
                iconType: "check",
              },
              {
                title: "Easy unsubscribe",
                description: "Unsubscribe anytime with one click",
                iconType: "check",
              },
            ],

            // Background styling
            background: {
              backgroundStyle: "solid",
              showBackground: true,
            },
          },

          // -----------------------------------------------------------------------
          // SECTION 2: FAQ Section (5 Questions for Web Development Agency)
          // -----------------------------------------------------------------------
          {
            __component: "sections.faq",

            header: {
              heading: "Questions",
              headingAccent: "Frequently Asked",
              description:
                "Everything you need to know about our web development services",
              headingSize: "large",
              alignment: "center",
              showDivider: true,
              showHeader: true,
            },

            accordions: [
              {
                question: "What technologies do you use?",
                answer:
                  "We use modern, industry-leading technologies including Next.js, React, TypeScript, Tailwind CSS, Strapi CMS, and PostgreSQL. Our tech stack is chosen for performance, scalability, and long-term maintainability.",
              },
              {
                question: "How long does a typical project take?",
                answer:
                  "Project timelines vary based on scope and complexity. A simple website takes 4-6 weeks, while more complex applications can take 8-12 weeks or longer. We provide detailed timeline estimates during the discovery phase.",
              },
              {
                question: "Do you provide ongoing support after launch?",
                answer:
                  "Yes! We offer flexible support and maintenance packages to keep your website secure, updated, and running smoothly. Support includes bug fixes, updates, performance monitoring, and feature enhancements.",
              },
              {
                question: "Can you redesign my existing website?",
                answer:
                  "Absolutely. We specialize in both new builds and redesigns. We can modernize your existing site while preserving what works, improving performance, and enhancing user experience.",
              },
              {
                question: "What's included in your pricing?",
                answer:
                  "Our pricing includes discovery and planning, custom design, development, testing, deployment, training, and 30 days of post-launch support. We provide transparent, fixed-price quotes with no hidden fees.",
              },
            ],

            background: {
              backgroundStyle: "solid",
              showBackground: true,
            },
          },

          // -----------------------------------------------------------------------
          // SECTION 3: Contact Section (2-column: details + form)
          // -----------------------------------------------------------------------
          {
            __component: "sections.contact-section",

            header: {
              heading: "Build Something Great Together",
              headingAccent: "Let's",
              description:
                "Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.",
              headingSize: "large",
              alignment: "center",
              showDivider: true,
              showHeader: true,
            },

            detailsPosition: "left",

            // Contact details (left column)
            contactDetails: {
              sectionHeader: {
                heading: "Get in Touch",
                headingAccent: null,
                description: "Reach out through any of these channels",
                headingSize: "medium",
                alignment: "left",
                showDivider: false,
                showHeader: true,
              },
              contactMethods: [
                {
                  icon: {
                    iconType: "lucide",
                    lucideName: "Mail",
                    size: "md",
                  },
                  title: "Email",
                  description: "hello@example.com",
                  link: {
                    label: "Send Email",
                    href: "mailto:hello@example.com",
                    newTab: false,
                  },
                },
                {
                  icon: {
                    iconType: "lucide",
                    lucideName: "Phone",
                    size: "md",
                  },
                  title: "Phone",
                  description: "+1 (555) 123-4567",
                  link: {
                    label: "Call Now",
                    href: "tel:+15551234567",
                    newTab: false,
                  },
                },
                {
                  icon: {
                    iconType: "lucide",
                    lucideName: "MapPin",
                    size: "md",
                  },
                  title: "Location",
                  description: "San Francisco, CA",
                },
              ],
            },

            // Contact form (right column)
            contactForm: {
              gdprLabel: "I agree to the privacy policy",
              gdprLink: {
                label: "Privacy Policy",
                href: "/privacy",
                newTab: false,
              },
            },

            background: {
              backgroundStyle: "solid",
              showBackground: true,
            },
          },
        ],

        // i18n: Set English locale
        locale: "en",
      },
      // Publish the document immediately
      status: "published",
    })

    console.log("✅ E2E test page created successfully!")
    console.log(`   Page ID: ${e2eTestPage.documentId}`)
    console.log(`   Slug: ${e2eTestPage.slug}`)
    console.log(`   Full Path: ${e2eTestPage.fullPath}`)
    console.log(`   Locale: ${e2eTestPage.locale}`)
    console.log(`   Published: ${e2eTestPage.publishedAt ? "Yes" : "No"}`)
    console.log(`   Sections: ${e2eTestPage.content?.length || 0}`)

    // ============================================================================
    // 2. VERIFY SECTIONS WERE CREATED
    // ============================================================================

    const sectionTypes =
      e2eTestPage.content?.map((section: any) => section.__component) || []
    console.log("\n📦 Created sections:")
    sectionTypes.forEach((type: string, index: number) => {
      console.log(`   ${index + 1}. ${type}`)
    })

    // ============================================================================
    // 3. VERIFY DATA PERSISTENCE (BEFORE STRAPI SHUTDOWN)
    // ============================================================================

    console.log("\n🔍 Verifying seed data persistence...")

    const verification = await strapi.documents("api::page.page").count({
      filters: { slug: "e2e-test-page", locale: "en" },
    })

    if (verification !== 1) {
      throw new Error(
        `Seed verification failed: Expected 1 page, found ${verification}`
      )
    }

    console.log("✅ Seed verification passed - data persisted to database")

    console.log("\n🎉 E2E test data seeding complete!")
    console.log(
      "   Ready for Playwright tests at: http://localhost:3000/en/e2e-test-page"
    )
  } catch (error) {
    console.error("❌ E2E test data seeding failed:", error.message)

    // If it's a validation error, show the detailed errors
    if (error.details && error.details.errors) {
      console.error("\n📋 Validation errors:")
      error.details.errors.forEach((err: any, index: number) => {
        console.error(
          `   ${index + 1}. ${err.path?.join(".") || "unknown"}: ${err.message}`
        )
      })
    }

    throw error // Re-throw to fail CI if seeding fails
  }
}
