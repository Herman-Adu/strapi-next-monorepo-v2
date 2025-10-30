import { UID } from "@repo/strapi"

import StrapiContactForm from "@/components/page-builder/components/forms/StrapiContactForm"
import StrapiNewsletterForm from "@/components/page-builder/components/forms/StrapiNewsletterForm"
import StrapiAnimatedLogoRow from "@/components/page-builder/components/sections/StrapiAnimatedLogoRow"
import StrapiCarousel from "@/components/page-builder/components/sections/StrapiCarousel"
import StrapiCredibilitySection from "@/components/page-builder/components/sections/StrapiCredibilitySection"
import StrapiFaq from "@/components/page-builder/components/sections/StrapiFaq"
import StrapiFeatureGridSection from "@/components/page-builder/components/sections/StrapiFeatureGridSection"
import StrapiFinalCTASection from "@/components/page-builder/components/sections/StrapiFinalCTASection"
import StrapiFooterCTASection from "@/components/page-builder/components/sections/StrapiFooterCTASection"
import StrapiHeadingWithCTAButton from "@/components/page-builder/components/sections/StrapiHeadingWithCTAButton"
import StrapiHero from "@/components/page-builder/components/sections/StrapiHero"
import StrapiHorizontalImages from "@/components/page-builder/components/sections/StrapiHorizontalImages"
import StrapiImageWithCTAButton from "@/components/page-builder/components/sections/StrapiImageWithCTAButton"
import StrapiLandingHero from "@/components/page-builder/components/sections/StrapiLandingHero"
import StrapiNewsletterCTASection from "@/components/page-builder/components/sections/StrapiNewsletterCTASection"
import StrapiRoadmapSection from "@/components/page-builder/components/sections/StrapiRoadmapSection"
import StrapiWorkflowSection from "@/components/page-builder/components/sections/StrapiWorkflowSection"
import StrapiCkEditorContent from "@/components/page-builder/components/utilities/StrapiCkEditorContent"

/**
 * Mapping of Strapi Component UID to React Component
 * TODO: This should map Strapi component uid -> component path to reduce bundle size, however this became an issue with nextjs 15 update
 */

export const PageContentComponents: {
  // [K in UID.Component]?: string // TODO: Next.js 15 has issues with dynamic imports inside pages
  // eslint-disable-next-line no-unused-vars
  [K in UID.Component]?: React.ComponentType<any>
} = {
  // elements, seo-utilities, utilities
  // They are usually rendered or used deep inside other components or handlers
  // Add them here if they can be used on Page content level
  "utilities.ck-editor-content": StrapiCkEditorContent,

  // Sections
  "sections.animated-logo-row": StrapiAnimatedLogoRow,
  "sections.faq": StrapiFaq,
  "sections.carousel": StrapiCarousel,
  "sections.heading-with-cta-button": StrapiHeadingWithCTAButton,
  "sections.hero": StrapiHero,
  "sections.horizontal-images": StrapiHorizontalImages,
  "sections.image-with-cta-button": StrapiImageWithCTAButton,
  "sections.landing-hero": StrapiLandingHero,
  "sections.credibility-section": StrapiCredibilitySection,
  "sections.feature-grid-section": StrapiFeatureGridSection,
  "sections.workflow-section": StrapiWorkflowSection,
  "sections.newsletter-cta-section": StrapiNewsletterCTASection,
  "sections.roadmap-section": StrapiRoadmapSection,
  "sections.final-cta-section": StrapiFinalCTASection,
  "sections.footer-cta-section": StrapiFooterCTASection,

  // Forms
  "forms.contact-form": StrapiContactForm,
  "forms.newsletter-form": StrapiNewsletterForm,

  // Add more components here
}
