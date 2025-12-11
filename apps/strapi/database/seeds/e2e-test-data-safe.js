"use strict"
/**
 * SAFE E2E Test Data Seeding Script (Non-Destructive)
 *
 * Creates ONLY the E2E test page WITHOUT deleting existing content
 *
 * **Safety Features:**
 * - Checks if E2E test page already exists
 * - Updates existing page instead of creating duplicate
 * - Does NOT touch other pages, media, or content
 * - Preserves all existing data
 *
 * **Usage:**
 * - Local Dev: `yarn seed:e2e:safe` (from apps/strapi)
 * - CI: Use the destructive version (seed-e2e-data.ts)
 */
Object.defineProperty(exports, "__esModule", { value: true })
exports.default = async ({ strapi }) => {
  console.log("🌱 Starting SAFE E2E test data seeding (non-destructive)...")
  try {
    // ============================================================================
    // 1. CHECK IF E2E TEST PAGE ALREADY EXISTS
    // ============================================================================
    console.log("🔍 Checking for existing E2E test page...")
    const existingPages = await strapi.documents("api::page.page").findMany({
      filters: {
        slug: { $eq: "e2e-test-page" },
        locale: { $eq: "en" },
      },
      locale: "en",
    })
    let e2eTestPage
    if (existingPages && existingPages.length > 0) {
      console.log("✅ E2E test page already exists - updating...")
      // Update the existing page
      e2eTestPage = await strapi.documents("api::page.page").update({
        documentId: existingPages[0].documentId,
        data: getE2EPageData(),
        locale: "en",
      })
      console.log(`✅ Updated E2E test page (ID: ${e2eTestPage.documentId})`)
    } else {
      console.log("📄 Creating new E2E test page...")
      // Create the page
      e2eTestPage = await strapi.documents("api::page.page").create({
        data: getE2EPageData(),
        locale: "en",
      })
      console.log(`✅ Created E2E test page (ID: ${e2eTestPage.documentId})`)
    }
    // ============================================================================
    // 2. PUBLISH THE PAGE
    // ============================================================================
    console.log("📤 Publishing E2E test page...")
    await strapi.documents("api::page.page").publish({
      documentId: e2eTestPage.documentId,
      locale: "en",
    })
    console.log("✅ E2E test page published successfully")
    // ============================================================================
    // 3. SUMMARY
    // ============================================================================
    console.log("\n" + "=".repeat(60))
    console.log("🎉 Safe E2E Test Data Seeding Complete!")
    console.log("=".repeat(60))
    console.log(`✅ E2E test page: /en/e2e-test-page`)
    console.log(`✅ All existing content preserved`)
    console.log(`✅ Ready for E2E testing`)
    console.log("=".repeat(60) + "\n")
  } catch (error) {
    console.error("❌ Error during safe E2E seeding:")
    console.error(error)
    // Log detailed validation errors if available
    if (error.details?.errors) {
      console.error("\n🔍 Detailed validation errors:")
      error.details.errors.forEach((err, index) => {
        console.error(`\nError ${index + 1}:`)
        console.error(JSON.stringify(err, null, 2))
      })
    }
    throw error
  }
}
/**
 * Returns the E2E page data structure
 */
function getE2EPageData() {
  return {
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
      preventIndexing: true,
    },
    // Dynamic zone content sections
    content: [
      // -----------------------------------------------------------------------
      // SECTION 1: Newsletter CTA Section
      // -----------------------------------------------------------------------
      {
        __component: "sections.newsletter-cta-section",
        header: {
          heading: "Stay Updated with Web Development Insights",
          headingAccent: "",
          description:
            "Get the latest tips, trends, and insights delivered to your inbox. No spam, just value.",
          headingSize: "large",
          alignment: "center",
          showDivider: true,
          showHeader: true,
        },
        heading: "Subscribe to Our Newsletter",
        description:
          "Join 500+ developers and business owners staying ahead of the curve",
        inputPlaceholder: "your.email@example.com",
        buttonText: "Subscribe",
        gdprLabel: "I agree to receive marketing emails",
        gdprLink: {
          label: "Privacy Policy",
          href: "/privacy",
          newTab: false,
        },
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
        background: {
          pattern: "grid",
          style: "muted",
        },
        spacing: {
          paddingTop: "large",
          paddingBottom: "large",
        },
      },
      // -----------------------------------------------------------------------
      // SECTION 2: FAQ Section
      // -----------------------------------------------------------------------
      {
        __component: "sections.faq",
        background: {
          pattern: "none",
          style: "default",
        },
        badge: {
          text: "FAQ",
          variant: "default",
        },
        header: {
          heading: "Frequently Asked Questions",
          headingAccent: "Common",
          description: "Find answers to common questions about our services",
          headingSize: "large",
          alignment: "center",
          showDivider: true,
          showHeader: true,
        },
        accordions: [
          {
            question: "What technologies do you use?",
            answer:
              "We use modern technologies including Next.js, React, TypeScript, Tailwind CSS, and Strapi CMS. This stack ensures scalable, performant, and maintainable applications.",
          },
          {
            question: "How long does a typical project take?",
            answer:
              "Project timelines vary based on complexity. Small projects typically take 4-6 weeks, while larger enterprise applications may take 8-12 weeks or more. We'll provide a detailed timeline after understanding your requirements.",
          },
          {
            question: "Do you provide ongoing support?",
            answer:
              "Yes, we provide ongoing support and maintenance packages after launch. This includes bug fixes, security updates, feature enhancements, and technical support to ensure your application runs smoothly.",
          },
          {
            question: "Can you redesign my existing website?",
            answer:
              "Absolutely! We specialize in website redesigns and modernization. We can migrate your existing content, improve the design, enhance performance, and add new features while maintaining SEO rankings.",
          },
          {
            question: "What's included in your pricing?",
            answer:
              "Our pricing includes project planning, UI/UX design, development, testing, deployment, and training. We provide transparent pricing with no hidden fees, and offer flexible payment plans to suit your budget.",
          },
        ],
      },
      // -----------------------------------------------------------------------
      // SECTION 3: Contact Section
      // -----------------------------------------------------------------------
      {
        __component: "sections.contact-section",
        background: {
          pattern: "dots",
          style: "subtle",
        },
        badge: {
          text: "Contact",
          variant: "default",
        },
        header: {
          heading: "Get in Touch",
          headingAccent: "Let's Talk",
          description: "Have a project in mind? We'd love to hear from you.",
          headingSize: "large",
          alignment: "center",
          showDivider: true,
          showHeader: true,
        },
        detailsPosition: "left",
        contactDetails: {
          sectionHeader: {
            heading: "Contact Information",
            headingSize: "medium",
            alignment: "left",
            showHeader: true,
          },
          contactMethods: [
            {
              icon: {
                iconType: "emoji",
                emoji: "✉️",
                lucideName: null,
                customImage: null,
                size: "md",
              },
              title: "Email Us",
              description: "hello@example.com",
              link: {
                label: "Send Email",
                href: "mailto:hello@example.com",
                newTab: false,
              },
            },
            {
              icon: {
                iconType: "emoji",
                emoji: "📞",
                lucideName: null,
                customImage: null,
                size: "md",
              },
              title: "Call Us",
              description: "+1 (555) 123-4567",
              link: {
                label: "Call Now",
                href: "tel:+15551234567",
                newTab: false,
              },
            },
            {
              icon: {
                iconType: "emoji",
                emoji: "⏰",
                lucideName: null,
                customImage: null,
                size: "md",
              },
              title: "Business Hours",
              description: "Monday - Friday: 9:00 AM - 5:00 PM EST",
              link: null,
            },
          ],
        },
        contactForm: {
          gdprLabel: "I agree to the privacy policy",
          gdprLink: {
            label: "Privacy Policy",
            href: "/privacy",
            newTab: false,
          },
        },
      },
    ],
    // Published by default
    publishedAt: new Date().toISOString(),
  }
}
