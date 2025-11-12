import { FindOne } from "../../types"

const pageTypes = ["api::page.page"]
const pageActions = ["findMany"] // We're using findMany to find the pages, but this could be adjusted to findOne per your needs

/**
 * Registers a middleware to customize the population of related fields for page documents during Strapi queries.
 *
 * This middleware intercepts document queries for the "api::page.page" content type when the action is "findMany".
 * If the request parameters include pagination with { start: 0, limit: 1 } and a 'middlewarePopulate' array,
 * it selectively applies deep population rules for specified attributes, as defined in 'pagePopulateObject'.
 *
 * The request must contain 'middlewarePopulate' (array of string keys) in the 'params' object, which is going to be mapped to 'pagePopulateObject' attributes.
 *
 */
export const registerPopulatePageMiddleware = ({ strapi }) => {
  strapi.documents.use((context, next) => {
    if (
      pageTypes.includes(context.uid) &&
      pageActions.includes(context.action)
    ) {
      const requestParams: {
        start?: number
        limit?: number
        middlewarePopulate?: Array<string>
      } = context.params
      if (
        // This is added by Strapi regardless of whether you use pagination or start & limit attributes
        // This condition will be met if the request contains {pagination: {page: 1, pageSize: 1}}
        requestParams?.start === 0 &&
        requestParams?.limit === 1 &&
        Array.isArray(requestParams?.middlewarePopulate)
      ) {
        requestParams.middlewarePopulate
          .filter((populateAttr) =>
            Object.keys(pagePopulateObject).includes(populateAttr)
          )
          .forEach((populateAttr) => {
            context.params.populate[populateAttr] =
              pagePopulateObject[populateAttr]
          })
      }
    }

    return next()
  })
}

// Temporary type assertion: marquee-section types will be generated after Strapi registers the new component schema
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      "sections.image-with-cta-button": {
        populate: { image: { populate: { media: true } }, link: true },
      },
      "sections.horizontal-images": {
        populate: {
          images: {
            populate: { image: { populate: { media: true } }, link: true },
          },
        },
      },
      "sections.hero": {
        populate: {
          links: true,
          image: { populate: { media: true } },
          steps: true,
        },
      },
      "sections.landing-hero": {
        populate: {
          ctaButtons: true,
        },
      },
      "sections.credibility-section": {
        populate: {
          stats: true,
          companyLogos: { populate: { image: true } },
        },
      },
      "sections.feature-grid-section": {
        populate: {
          items: true,
          listItems: true,
        },
      },
      // ...existing code...
      // ...existing code...
      // ...existing code...
      // ...existing code...
      // ...existing code...
      "sections.workflow-section": {
        populate: {
          workflowPoints: true,
          image: { populate: { media: true } },
        },
      },
      "sections.newsletter-cta-section": {
        populate: {
          badge: true,
          background: true,
          header: true,
          ctaButtons: true,
          benefits: true,
          gdprLink: true,
        },
      },
      "sections.roadmap-section": {
        populate: {
          roadmapItems: true,
          footerNotes: true,
        },
      },
      "sections.final-cta-section": {
        populate: {
          ctaButtons: true,
        },
      },
      "sections.footer-cta-section": {
        populate: {
          ctaButtons: true,
          footerLinks: true,
        },
      },
      "sections.heading-with-cta-button": { populate: { cta: true } },
      "sections.faq": { populate: { accordions: true } },
      "sections.carousel": {
        populate: {
          images: {
            populate: { image: { populate: { media: true } }, link: true },
          },
        },
      },
      "sections.animated-logo-row": {
        populate: { logos: { populate: { media: true } } },
      },
      "sections.benefits-section": {
        populate: { benefits: true },
      },
      "sections.metrics-section": {
        populate: { metrics: true },
      },
      "sections.tech-stack-section": {
        populate: { technologies: { populate: { image: true } } },
      },
      "sections.marquee-section": {
        populate: {
          logos: { populate: { image: true } },
          testimonials: { populate: { avatar: true } },
          testimonialsPro: { populate: { avatar: true } },
          reviews: { populate: { avatar: true } },
        },
      },
      "sections.partner-showcase-section": {
        populate: { partners: { populate: { logo: true } } },
      },
      "sections.integration-grid-section": {
        populate: { integrations: true },
      },
      "forms.newsletter-form": { populate: { gdpr: true } },
      "forms.contact-form": { populate: { gdpr: true } },
      "utilities.ck-editor-content": true,
    } as any, // Temporary: Allow marquee-section until types are generated
  },
  seo: {
    populate: {
      metaImage: true,
      twitter: { populate: { images: true } },
      og: { populate: { image: true } },
    },
  },
}
