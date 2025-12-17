/**
 * Mock API responses for E2E tests
 * Based on actual Strapi API response structure
 */

export const mockE2EPage = {
  data: {
    id: 1,
    documentId: "test-page-doc-id",
    title: "E2E Test Page",
    slug: "e2e-test-page",
    fullPath: "/e2e-test-page",
    locale: "en",
    publishedAt: "2024-01-01T00:00:00.000Z",
    seo: {
      metaTitle: "E2E Test Page",
      metaDescription: "Test page for E2E tests",
    },
    content: [
      {
        __component: "sections.newsletter-cta-section",
        id: 1,
        heading: "Stay Updated with Our Newsletter",
        description:
          "Get the latest updates and insights delivered to your inbox.",
        placeholderText: "your.email@example.com",
        buttonText: "Subscribe",
        successMessage: "Thank you for subscribing!",
        errorMessage: "Something went wrong. Please try again.",
        gdprLink: {
          label: "Privacy Policy",
          href: "/privacy",
          newTab: false,
        },
      },
      {
        __component: "sections.faq",
        id: 2,
        header: {
          heading: "Questions",
          headingAccent: "Frequently Asked",
          description: "Everything you need to know about our services",
          headingSize: "large",
          alignment: "center",
          showDivider: true,
          showHeader: true,
        },
        accordions: [
          {
            id: 1,
            question: "What technologies do you use?",
            answer:
              "We use modern technologies including Next.js, React, TypeScript, Tailwind CSS, Strapi CMS, and PostgreSQL. Our tech stack is chosen for performance, scalability, and long-term maintainability.",
          },
          {
            id: 2,
            question: "How long does a typical project take?",
            answer:
              "Project timelines vary based on scope and complexity. A typical website takes 4-8 weeks from initial consultation to launch.",
          },
          {
            id: 3,
            question: "Do you provide ongoing support?",
            answer:
              "Yes! We offer maintenance packages and ongoing support to keep your website secure, updated, and running smoothly.",
          },
          {
            id: 4,
            question: "Can you redesign my existing website?",
            answer:
              "Absolutely! We specialize in website redesigns and can modernize your existing website while preserving your brand identity and valuable content.",
          },
          {
            id: 5,
            question: "What's included in your pricing?",
            answer:
              "Our pricing includes design, development, testing, deployment, and post-launch support. We provide transparent quotes with no hidden fees.",
          },
        ],
        background: {
          backgroundStyle: "transparent",
          showBackground: false,
        },
      },
      {
        __component: "sections.contact-section",
        id: 3,
        heading: "Get in Touch",
        description: "We'd love to hear from you. Send us a message!",
        contactDetails: {
          email: "contact@example.com",
          phone: "+1 (555) 123-4567",
        },
        contactForm: {
          gdprLink: {
            label: "Privacy Policy",
            href: "/privacy",
            newTab: false,
          },
          gdprLabel: "I agree to the",
        },
      },
    ],
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
