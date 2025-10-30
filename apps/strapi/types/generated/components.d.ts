import type { Schema, Struct } from "@strapi/strapi"

export interface ElementsCompanyLogo extends Struct.ComponentSchema {
  collectionName: "components_elements_company_logos"
  info: {
    description: "Company logo with name or image"
    displayName: "CompanyLogo"
  }
  attributes: {
    image: Schema.Attribute.Media<"images">
    name: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface ElementsFeatureCard extends Struct.ComponentSchema {
  collectionName: "components_elements_feature_cards"
  info: {
    description: "Feature card with icon, title and description"
    displayName: "FeatureCard"
  }
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required
    icon: Schema.Attribute.String & Schema.Attribute.Required
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface ElementsFooterItem extends Struct.ComponentSchema {
  collectionName: "components_elements_footer_items"
  info: {
    description: ""
    displayName: "FooterItem"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface ElementsIconButton extends Struct.ComponentSchema {
  collectionName: "components_elements_icon_buttons"
  info: {
    description: "Button with icon and link"
    displayName: "IconButton"
  }
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required
    icon: Schema.Attribute.Enumeration<
      [
        "github",
        "calendar",
        "heart",
        "book-open",
        "external-link",
        "arrow-right",
      ]
    > &
      Schema.Attribute.Required
    label: Schema.Attribute.String & Schema.Attribute.Required
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    variant: Schema.Attribute.Enumeration<["default", "outline", "ghost"]> &
      Schema.Attribute.DefaultTo<"default">
  }
}

export interface ElementsListItem extends Struct.ComponentSchema {
  collectionName: "components_elements_list_items"
  info: {
    description: "List item with title, description and optional icon"
    displayName: "ListItem"
  }
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required
    iconType: Schema.Attribute.Enumeration<["check", "circle", "none"]> &
      Schema.Attribute.DefaultTo<"none">
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface ElementsStatCard extends Struct.ComponentSchema {
  collectionName: "components_elements_stat_cards"
  info: {
    description: "Statistic card with number and description"
    displayName: "StatCard"
  }
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required
    number: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface FormsContactForm extends Struct.ComponentSchema {
  collectionName: "components_forms_contact_forms"
  info: {
    displayName: "ContactForm"
  }
  attributes: {
    description: Schema.Attribute.Text
    gdpr: Schema.Attribute.Component<"utilities.link", false>
    title: Schema.Attribute.String
  }
}

export interface FormsNewsletterForm extends Struct.ComponentSchema {
  collectionName: "components_forms_newsletter_forms"
  info: {
    displayName: "Newsletter"
  }
  attributes: {
    description: Schema.Attribute.Text
    gdpr: Schema.Attribute.Component<"utilities.link", false>
    title: Schema.Attribute.String
  }
}

export interface SectionsAnimatedLogoRow extends Struct.ComponentSchema {
  collectionName: "components_sections_animated_logo_rows"
  info: {
    description: ""
    displayName: "AnimatedLogoRow"
  }
  attributes: {
    logos: Schema.Attribute.Component<"utilities.basic-image", true>
    text: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsCarousel extends Struct.ComponentSchema {
  collectionName: "components_sections_carousels"
  info: {
    description: ""
    displayName: "Carousel"
  }
  attributes: {
    images: Schema.Attribute.Component<"utilities.image-with-link", true>
    radius: Schema.Attribute.Enumeration<["sm", "md", "lg", "xl", "full"]>
  }
}

export interface SectionsCredibilitySection extends Struct.ComponentSchema {
  collectionName: "components_sections_credibility_sections"
  info: {
    description: "Stats and company logos section"
    displayName: "CredibilitySection"
  }
  attributes: {
    companyLogos: Schema.Attribute.Component<"elements.company-logo", true>
    stats: Schema.Attribute.Component<"elements.stat-card", true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 3
        },
        number
      >
  }
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: "components_sections_faqs"
  info: {
    description: ""
    displayName: "Faq"
  }
  attributes: {
    accordions: Schema.Attribute.Component<"utilities.accordions", true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsFeatureGridSection extends Struct.ComponentSchema {
  collectionName: "components_sections_feature_grid_sections"
  info: {
    description: "Reusable grid section for features, benefits, lessons"
    displayName: "FeatureGridSection"
  }
  attributes: {
    description: Schema.Attribute.Text
    footerNote: Schema.Attribute.String
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4", "6"]> &
      Schema.Attribute.DefaultTo<"3">
    heading: Schema.Attribute.String & Schema.Attribute.Required
    items: Schema.Attribute.Component<"elements.feature-card", true>
    listItems: Schema.Attribute.Component<"elements.list-item", true>
  }
}

export interface SectionsFinalCtaSection extends Struct.ComponentSchema {
  collectionName: "components_sections_final_cta_sections"
  info: {
    description: "Final call-to-action section"
    displayName: "FinalCTASection"
  }
  attributes: {
    ctaButtons: Schema.Attribute.Component<"elements.icon-button", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    description: Schema.Attribute.Text & Schema.Attribute.Required
    heading: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsFooterCtaSection extends Struct.ComponentSchema {
  collectionName: "components_sections_footer_cta_sections"
  info: {
    description: "Footer CTA section with branding and links"
    displayName: "FooterCTASection"
  }
  attributes: {
    copyright: Schema.Attribute.String & Schema.Attribute.Required
    ctaButtons: Schema.Attribute.Component<"elements.icon-button", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    description: Schema.Attribute.Text & Schema.Attribute.Required
    footerLinks: Schema.Attribute.Component<"utilities.link", true>
    heading: Schema.Attribute.String & Schema.Attribute.Required
    logo: Schema.Attribute.String & Schema.Attribute.DefaultTo<"N">
  }
}

export interface SectionsHeadingWithCtaButton extends Struct.ComponentSchema {
  collectionName: "components_sections_heading_with_cta_buttons"
  info: {
    description: ""
    displayName: "HeadingWithCTAButton"
  }
  attributes: {
    cta: Schema.Attribute.Component<"utilities.link", false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: "components_sections_heroes"
  info: {
    description: ""
    displayName: "Hero"
  }
  attributes: {
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    links: Schema.Attribute.Component<"utilities.link", true>
    steps: Schema.Attribute.Component<"utilities.text", true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHorizontalImages extends Struct.ComponentSchema {
  collectionName: "components_sections_horizontal_images"
  info: {
    description: ""
    displayName: "HorizontalImages"
  }
  attributes: {
    fixedImageHeight: Schema.Attribute.Integer
    fixedImageWidth: Schema.Attribute.Integer
    imageRadius: Schema.Attribute.Enumeration<["sm", "md", "lg", "xl", "full"]>
    images: Schema.Attribute.Component<"utilities.image-with-link", true>
    spacing: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 20
          min: 0
        },
        number
      >
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsImageWithCtaButton extends Struct.ComponentSchema {
  collectionName: "components_sections_image_with_cta_buttons"
  info: {
    description: ""
    displayName: "ImageWithCTAButton"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsLandingHero extends Struct.ComponentSchema {
  collectionName: "components_sections_landing_heroes"
  info: {
    description: "Landing page hero section with badge, heading, description and CTAs"
    displayName: "LandingHero"
  }
  attributes: {
    badge: Schema.Attribute.String & Schema.Attribute.Required
    ctaButtons: Schema.Attribute.Component<"elements.icon-button", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    description: Schema.Attribute.Text & Schema.Attribute.Required
    footerText: Schema.Attribute.String
    heading: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsNewsletterCtaSection extends Struct.ComponentSchema {
  collectionName: "components_sections_newsletter_cta_sections"
  info: {
    description: "Newsletter subscription CTA section"
    displayName: "NewsletterCTASection"
  }
  attributes: {
    benefits: Schema.Attribute.Component<"elements.list-item", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    ctaButtons: Schema.Attribute.Component<"elements.icon-button", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    description: Schema.Attribute.Text & Schema.Attribute.Required
    heading: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsRoadmapSection extends Struct.ComponentSchema {
  collectionName: "components_sections_roadmap_sections"
  info: {
    description: "Roadmap and community section"
    displayName: "RoadmapSection"
  }
  attributes: {
    description: Schema.Attribute.Text
    footerNotes: Schema.Attribute.Component<"utilities.text", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    heading: Schema.Attribute.String & Schema.Attribute.Required
    roadmapItems: Schema.Attribute.Component<"elements.list-item", true>
  }
}

export interface SectionsWorkflowSection extends Struct.ComponentSchema {
  collectionName: "components_sections_workflow_sections"
  info: {
    description: "Two-column workflow section with text and image"
    displayName: "WorkflowSection"
  }
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required
    heading: Schema.Attribute.String & Schema.Attribute.Required
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    workflowPoints: Schema.Attribute.Component<"elements.list-item", true>
  }
}

export interface SeoUtilitiesMetaSocial extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_meta_socials"
  info: {
    displayName: "metaSocial"
    icon: "project-diagram"
  }
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 65
      }>
    image: Schema.Attribute.Media<"images" | "files" | "videos">
    socialNetwork: Schema.Attribute.Enumeration<["Facebook", "Twitter"]> &
      Schema.Attribute.Required
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
  }
}

export interface SeoUtilitiesSeo extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seos"
  info: {
    description: ""
    displayName: "seo"
    icon: "search"
  }
  attributes: {
    applicationName: Schema.Attribute.String
    canonicalUrl: Schema.Attribute.String
    email: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
      }>
    metaImage: Schema.Attribute.Media<"images">
    metaRobots: Schema.Attribute.Enumeration<
      [
        "all",
        "index",
        "index,follow",
        "noindex",
        "noindex,follow",
        "noindex,nofollow",
        "none",
        "noarchive",
        "nosnippet",
        "max-snippet",
      ]
    > &
      Schema.Attribute.DefaultTo<"all">
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    og: Schema.Attribute.Component<"seo-utilities.seo-og", false>
    siteName: Schema.Attribute.String
    structuredData: Schema.Attribute.JSON
    twitter: Schema.Attribute.Component<"seo-utilities.seo-twitter", false>
  }
}

export interface SeoUtilitiesSeoOg extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_ogs"
  info: {
    displayName: "SeoOg"
    icon: "oneToMany"
  }
  attributes: {
    description: Schema.Attribute.String
    image: Schema.Attribute.Media<"images">
    title: Schema.Attribute.String
    type: Schema.Attribute.Enumeration<["website", "article"]> &
      Schema.Attribute.DefaultTo<"website">
    url: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSeoTwitter extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_twitters"
  info: {
    displayName: "SeoTwitter"
    icon: "oneToMany"
  }
  attributes: {
    card: Schema.Attribute.String
    creator: Schema.Attribute.String
    creatorId: Schema.Attribute.String
    description: Schema.Attribute.String
    images: Schema.Attribute.Media<"images", true>
    siteId: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSocialIcons extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_social_icons"
  info: {
    displayName: "SocialIcons"
  }
  attributes: {
    socials: Schema.Attribute.Component<"utilities.image-with-link", true>
    title: Schema.Attribute.String
  }
}

export interface UtilitiesAccordions extends Struct.ComponentSchema {
  collectionName: "components_utilities_accordions"
  info: {
    description: ""
    displayName: "Accordions"
  }
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required
    question: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UtilitiesBasicImage extends Struct.ComponentSchema {
  collectionName: "components_utilities_basic_images"
  info: {
    displayName: "BasicImage"
  }
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required
    fallbackSrc: Schema.Attribute.String
    height: Schema.Attribute.Integer
    media: Schema.Attribute.Media<"images" | "videos"> &
      Schema.Attribute.Required
    width: Schema.Attribute.Integer
  }
}

export interface UtilitiesCkEditorContent extends Struct.ComponentSchema {
  collectionName: "components_utilities_ck_editor_contents"
  info: {
    displayName: "CkEditorContent"
  }
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface UtilitiesImageWithLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_image_with_links"
  info: {
    description: ""
    displayName: "ImageWithLink"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface UtilitiesLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_links"
  info: {
    displayName: "Link"
  }
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required
    label: Schema.Attribute.String & Schema.Attribute.Required
    newTab: Schema.Attribute.Boolean
  }
}

export interface UtilitiesLinksWithTitle extends Struct.ComponentSchema {
  collectionName: "components_utilities_links_with_titles"
  info: {
    displayName: "LinksWithTitle"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String
  }
}

export interface UtilitiesText extends Struct.ComponentSchema {
  collectionName: "components_utilities_texts"
  info: {
    displayName: "Text"
  }
  attributes: {
    text: Schema.Attribute.String
  }
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ComponentSchemas {
      "elements.company-logo": ElementsCompanyLogo
      "elements.feature-card": ElementsFeatureCard
      "elements.footer-item": ElementsFooterItem
      "elements.icon-button": ElementsIconButton
      "elements.list-item": ElementsListItem
      "elements.stat-card": ElementsStatCard
      "forms.contact-form": FormsContactForm
      "forms.newsletter-form": FormsNewsletterForm
      "sections.animated-logo-row": SectionsAnimatedLogoRow
      "sections.carousel": SectionsCarousel
      "sections.credibility-section": SectionsCredibilitySection
      "sections.faq": SectionsFaq
      "sections.feature-grid-section": SectionsFeatureGridSection
      "sections.final-cta-section": SectionsFinalCtaSection
      "sections.footer-cta-section": SectionsFooterCtaSection
      "sections.heading-with-cta-button": SectionsHeadingWithCtaButton
      "sections.hero": SectionsHero
      "sections.horizontal-images": SectionsHorizontalImages
      "sections.image-with-cta-button": SectionsImageWithCtaButton
      "sections.landing-hero": SectionsLandingHero
      "sections.newsletter-cta-section": SectionsNewsletterCtaSection
      "sections.roadmap-section": SectionsRoadmapSection
      "sections.workflow-section": SectionsWorkflowSection
      "seo-utilities.meta-social": SeoUtilitiesMetaSocial
      "seo-utilities.seo": SeoUtilitiesSeo
      "seo-utilities.seo-og": SeoUtilitiesSeoOg
      "seo-utilities.seo-twitter": SeoUtilitiesSeoTwitter
      "seo-utilities.social-icons": SeoUtilitiesSocialIcons
      "utilities.accordions": UtilitiesAccordions
      "utilities.basic-image": UtilitiesBasicImage
      "utilities.ck-editor-content": UtilitiesCkEditorContent
      "utilities.image-with-link": UtilitiesImageWithLink
      "utilities.link": UtilitiesLink
      "utilities.links-with-title": UtilitiesLinksWithTitle
      "utilities.text": UtilitiesText
    }
  }
}
