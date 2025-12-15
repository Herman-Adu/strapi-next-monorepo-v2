/**
 * Mock API responses for E2E tests
 * Based on actual Strapi API response structure
 */

export const mockE2EPage = {
  data: {
    id: 1,
    attributes: {
      title: "E2E Test Page",
      slug: "e2e-test-page",
      fullPath: "/e2e-test-page",
      locale: "en",
      publishedAt: "2024-01-01T00:00:00.000Z",
      seo: {
        metaTitle: "E2E Test Page",
        metaDescription: "Test page for E2E tests",
      },
      sections: [
        {
          __component: "sections.newsletter-cta-section",
          id: 1,
          heading: "Stay Updated with Our Newsletter",
          description: "Get the latest updates and insights delivered to your inbox.",
          placeholderText: "your.email@example.com",
          buttonText: "Subscribe",
          successMessage: "Thank you for subscribing!",
          errorMessage: "Something went wrong. Please try again.",
        },
        {
          __component: "sections.faq",
          id: 2,
          heading: "Frequently Asked Questions",
          questions: [
            {
              id: 1,
              question: "What is this platform?",
              answer: "This is a comprehensive platform for managing content and data.",
            },
            {
              id: 2,
              question: "How do I get started?",
              answer: "Simply sign up and follow our onboarding guide.",
            },
            {
              id: 3,
              question: "Is there customer support?",
              answer: "Yes! We offer 24/7 customer support via email and chat.",
            },
          ],
        },
        {
          __component: "sections.contact-section",
          id: 3,
          heading: "Get in Touch",
          description: "We'd love to hear from you. Send us a message!",
          email: "contact@example.com",
          phone: "+1 (555) 123-4567",
        },
      ],
    },
  },
  meta: {},
}

export const mockNavbar = {
  data: {
    id: 1,
    attributes: {
      links: [
        { id: 1, label: "Home", url: "/", isExternal: false },
        { id: 2, label: "About", url: "/about", isExternal: false },
      ],
    },
  },
}

export const mockFooter = {
  data: {
    id: 1,
    attributes: {
      links: [
        { id: 1, label: "Privacy", url: "/privacy", isExternal: false },
        { id: 2, label: "Terms", url: "/terms", isExternal: false },
      ],
    },
  },
}
