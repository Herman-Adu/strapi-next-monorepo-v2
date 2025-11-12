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

export interface ElementsIntegrationCard extends Struct.ComponentSchema {
  collectionName: "components_elements_integration_cards"
  info: {
    description: "Integration card with icon, title, description, category and link"
    displayName: "IntegrationCard"
  }
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        "Payments",
        "Analytics",
        "Communications",
        "Content",
        "Infrastructure",
        "DevOps",
        "Security",
        "Marketing",
        "Productivity",
        "Other",
      ]
    > &
      Schema.Attribute.Required
    description: Schema.Attribute.Text & Schema.Attribute.Required
    icon: Schema.Attribute.Media<"images"> & Schema.Attribute.Required
    link: Schema.Attribute.String
    linkText: Schema.Attribute.String & Schema.Attribute.DefaultTo<"Learn More">
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    title: Schema.Attribute.String & Schema.Attribute.Required
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

export interface ElementsMarqueeLogo extends Struct.ComponentSchema {
  collectionName: "components_elements_marquee_logos"
  info: {
    description: "Logo item for marquee displays"
    displayName: "MarqueeLogo"
  }
  attributes: {
    altText: Schema.Attribute.String
    image: Schema.Attribute.Media<"images"> & Schema.Attribute.Required
    link: Schema.Attribute.String
    name: Schema.Attribute.String & Schema.Attribute.Required
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    showBackground: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
  }
}

export interface ElementsMarqueeReview extends Struct.ComponentSchema {
  collectionName: "components_elements_marquee_reviews"
  info: {
    description: "Review/comment item for marquee displays"
    displayName: "MarqueeReview"
  }
  attributes: {
    avatar: Schema.Attribute.Media<"images">
    body: Schema.Attribute.Text & Schema.Attribute.Required
    name: Schema.Attribute.String & Schema.Attribute.Required
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5
          min: 1
        },
        number
      >
    username: Schema.Attribute.String
  }
}

export interface ElementsMarqueeTestimonial extends Struct.ComponentSchema {
  collectionName: "components_elements_marquee_testimonials"
  info: {
    description: "Testimonial item for marquee displays"
    displayName: "MarqueeTestimonial"
  }
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required
    avatar: Schema.Attribute.Media<"images">
    company: Schema.Attribute.String
    quote: Schema.Attribute.Text & Schema.Attribute.Required
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5
          min: 1
        },
        number
      >
    role: Schema.Attribute.String
  }
}

export interface ElementsMarqueeTestimonialPro extends Struct.ComponentSchema {
  collectionName: "components_elements_marquee_testimonials_pro"
  info: {
    description: "Pro Block testimonial with emerald accents and enhanced styling"
    displayName: "MarqueeTestimonialPro"
  }
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required
    avatar: Schema.Attribute.Media<"images">
    company: Schema.Attribute.String
    quote: Schema.Attribute.Text & Schema.Attribute.Required
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5
          min: 1
        },
        number
      >
    role: Schema.Attribute.String
  }
}

export interface ElementsPartnerCard extends Struct.ComponentSchema {
  collectionName: "components_elements_partner_cards"
  info: {
    description: "Partner showcase card with logo, name, description and link"
    displayName: "PartnerCard"
  }
  attributes: {
    description: Schema.Attribute.Text
    link: Schema.Attribute.String
    linkText: Schema.Attribute.String & Schema.Attribute.DefaultTo<"Learn More">
    logo: Schema.Attribute.Media<"images">
    name: Schema.Attribute.String & Schema.Attribute.Required
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
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

export interface SectionsBenefitsSection extends Struct.ComponentSchema {
  collectionName: "components_sections_benefits_sections"
  info: {
    description: "Benefits section with heading and feature cards"
    displayName: "BenefitsSection"
  }
  attributes: {
    benefits: Schema.Attribute.Component<"elements.feature-card", true>
    description: Schema.Attribute.Text
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4"]> &
      Schema.Attribute.DefaultTo<"3">
    heading: Schema.Attribute.String & Schema.Attribute.Required
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

export interface SectionsIntegrationGridSection extends Struct.ComponentSchema {
  collectionName: "components_sections_integration_grid_sections"
  info: {
    description: "Grid of integrations or tools with categories"
    displayName: "Integration Grid Section"
  }
  attributes: {
    description: Schema.Attribute.Text
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4", "6"]> &
      Schema.Attribute.DefaultTo<"3">
    heading: Schema.Attribute.String & Schema.Attribute.Required
    integrations: Schema.Attribute.Component<"elements.integration-card", true>
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

export interface SectionsMarqueeSection extends Struct.ComponentSchema {
  collectionName: "components_sections_marquee_sections"
  info: {
    description: "Flexible marquee section for logos, testimonials, reviews with multi-row support"
    displayName: "MarqueeSection"
  }
  attributes: {
    alternateDirection: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    backgroundStyle: Schema.Attribute.Enumeration<
      ["solid", "transparent", "muted", "bordered"]
    > &
      Schema.Attribute.DefaultTo<"solid">
    badgeIcon: Schema.Attribute.String
    badgeText: Schema.Attribute.String
    description: Schema.Attribute.Text
    displayType: Schema.Attribute.Enumeration<
      ["logos", "testimonials", "reviews"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"logos">
    duration: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 120
          min: 5
        },
        number
      > &
      Schema.Attribute.DefaultTo<40>
    gap: Schema.Attribute.String & Schema.Attribute.DefaultTo<"1rem">
    heading: Schema.Attribute.String
    logos: Schema.Attribute.Component<"elements.marquee-logo", true>
    orientation: Schema.Attribute.Enumeration<["horizontal", "vertical"]> &
      Schema.Attribute.DefaultTo<"horizontal">
    pauseOnHover: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    reviews: Schema.Attribute.Component<"elements.marquee-review", true>
    rows: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 3
          min: 1
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>
    showFade: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    testimonials: Schema.Attribute.Component<
      "elements.marquee-testimonial",
      true
    >
    testimonialsPro: Schema.Attribute.Component<
      "elements.marquee-testimonial-pro",
      true
    >
    testimonialVariant: Schema.Attribute.Enumeration<["classic", "pro"]> &
      Schema.Attribute.DefaultTo<"classic">
    varySpeed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
  }
}

export interface SectionsMetricsSection extends Struct.ComponentSchema {
  collectionName: "components_sections_metrics_sections"
  info: {
    description: "Metrics/statistics section with stat cards"
    displayName: "MetricsSection"
  }
  attributes: {
    backgroundStyle: Schema.Attribute.Enumeration<
      ["transparent", "muted", "theme-subtle", "theme-muted"]
    > &
      Schema.Attribute.DefaultTo<"muted">
    badge: Schema.Attribute.String
    badgeAnimation: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    badgeAnimationSpeed: Schema.Attribute.Enumeration<
      ["extra-slow", "slow", "medium", "fast"]
    > &
      Schema.Attribute.DefaultTo<"slow">
    badgeBorderRadius: Schema.Attribute.Enumeration<
      ["sm", "md", "lg", "full"]
    > &
      Schema.Attribute.DefaultTo<"md">
    badgeIcon: Schema.Attribute.String
    badgeOrbGlow: Schema.Attribute.Enumeration<
      ["subtle", "normal", "intense"]
    > &
      Schema.Attribute.DefaultTo<"normal">
    badgeOrbSize: Schema.Attribute.Enumeration<["small", "medium", "large"]> &
      Schema.Attribute.DefaultTo<"large">
    badgeSize: Schema.Attribute.Enumeration<["small", "medium", "large"]> &
      Schema.Attribute.DefaultTo<"medium">
    containerStyle: Schema.Attribute.Enumeration<["default", "bordered"]> &
      Schema.Attribute.DefaultTo<"default">
    description: Schema.Attribute.Text
    heading: Schema.Attribute.String & Schema.Attribute.Required
    headingAccent: Schema.Attribute.String
    headingStyle: Schema.Attribute.Enumeration<
      ["default", "gradient", "two-tone"]
    > &
      Schema.Attribute.DefaultTo<"default">
    metrics: Schema.Attribute.Component<"elements.stat-card", true>
  }
}

export interface SectionsNewsletterCtaSection extends Struct.ComponentSchema {
  collectionName: "components_sections_newsletter_cta_sections"
  info: {
    description: "Newsletter subscription CTA section with GDPR compliance"
    displayName: "NewsletterCTASection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    benefits: Schema.Attribute.Component<"elements.list-item", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    buttonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Subscribe">
    ctaButtons: Schema.Attribute.Component<"elements.icon-button", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    description: Schema.Attribute.Text & Schema.Attribute.Required
    gdprLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"I agree to the terms and conditions">
    gdprLink: Schema.Attribute.Component<"utilities.link", false> &
      Schema.Attribute.Required
    heading: Schema.Attribute.String & Schema.Attribute.Required
    inputPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Enter your email">
  }
}

export interface SectionsPartnerShowcaseSection extends Struct.ComponentSchema {
  collectionName: "components_sections_partner_showcase_sections"
  info: {
    description: "Showcase partners, clients or collaborators"
    displayName: "Partner Showcase Section"
  }
  attributes: {
    description: Schema.Attribute.Text
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4", "6"]> &
      Schema.Attribute.DefaultTo<"3">
    heading: Schema.Attribute.String & Schema.Attribute.Required
    partners: Schema.Attribute.Component<"elements.partner-card", true>
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

export interface SectionsTechStackSection extends Struct.ComponentSchema {
  collectionName: "components_sections_tech_stack_sections"
  info: {
    description: "Technology stack showcase section"
    displayName: "TechStackSection"
  }
  attributes: {
    badgeIcon: Schema.Attribute.String
    badgeText: Schema.Attribute.String
    description: Schema.Attribute.Text
    displayStyle: Schema.Attribute.Enumeration<["grid", "marquee"]> &
      Schema.Attribute.DefaultTo<"grid">
    heading: Schema.Attribute.String & Schema.Attribute.Required
    technologies: Schema.Attribute.Component<"elements.company-logo", true>
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

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: "components_shared_open_graphs"
  info: {
    displayName: "openGraph"
    icon: "project-diagram"
  }
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200
      }>
    ogImage: Schema.Attribute.Media<"images">
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70
      }>
    ogType: Schema.Attribute.String
    ogUrl: Schema.Attribute.String
  }
}

export interface SharedSectionBackground extends Struct.ComponentSchema {
  collectionName: "components_shared_section_backgrounds"
  info: {
    description: "Reusable background and container styling for sections"
    displayName: "Section Background"
    icon: "paintBrush"
  }
  attributes: {
    backgroundStyle: Schema.Attribute.Enumeration<
      [
        "solid",
        "transparent",
        "muted",
        "bordered",
        "theme-subtle",
        "theme-muted",
      ]
    > &
      Schema.Attribute.DefaultTo<"solid">
    containerStyle: Schema.Attribute.Enumeration<["default", "bordered"]> &
      Schema.Attribute.DefaultTo<"default">
    containerWidth: Schema.Attribute.Enumeration<
      ["default", "narrow", "wide", "full"]
    > &
      Schema.Attribute.DefaultTo<"default">
    gradient: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    padding: Schema.Attribute.Enumeration<
      ["default", "compact", "spacious", "none"]
    > &
      Schema.Attribute.DefaultTo<"default">
    pattern: Schema.Attribute.String
  }
}

export interface SharedSectionBadge extends Struct.ComponentSchema {
  collectionName: "components_shared_section_badges"
  info: {
    description: "Reusable badge component for section headers"
    displayName: "Section Badge"
    icon: "tag"
  }
  attributes: {
    animation: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    animationSpeed: Schema.Attribute.Enumeration<
      ["extra-slow", "slow", "medium", "fast"]
    > &
      Schema.Attribute.DefaultTo<"slow">
    icon: Schema.Attribute.String
    orbSize: Schema.Attribute.Enumeration<["small", "medium", "large"]> &
      Schema.Attribute.DefaultTo<"medium">
    pulse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    size: Schema.Attribute.Enumeration<["small", "medium", "large"]> &
      Schema.Attribute.DefaultTo<"medium">
    text: Schema.Attribute.String
    variant: Schema.Attribute.Enumeration<
      ["default", "secondary", "outline", "ghost"]
    > &
      Schema.Attribute.DefaultTo<"default">
  }
}

export interface SharedSectionHeader extends Struct.ComponentSchema {
  collectionName: "components_shared_section_headers"
  info: {
    description: "Reusable header component with heading, description, and styling options"
    displayName: "Section Header"
    icon: "heading"
  }
  attributes: {
    alignment: Schema.Attribute.Enumeration<["left", "center", "right"]> &
      Schema.Attribute.DefaultTo<"center">
    description: Schema.Attribute.Text
    heading: Schema.Attribute.String & Schema.Attribute.Required
    headingAccent: Schema.Attribute.String
    headingSize: Schema.Attribute.Enumeration<
      ["small", "medium", "large", "xl"]
    > &
      Schema.Attribute.DefaultTo<"large">
    headingStyle: Schema.Attribute.Enumeration<
      ["default", "gradient", "two-tone"]
    > &
      Schema.Attribute.DefaultTo<"default">
    showDivider: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    spacing: Schema.Attribute.Enumeration<["compact", "default", "spacious"]> &
      Schema.Attribute.DefaultTo<"default">
  }
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: "components_shared_seos"
  info: {
    displayName: "seo"
    icon: "search"
  }
  attributes: {
    canonicalURL: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
        minLength: 50
      }>
    metaImage: Schema.Attribute.Media<"images">
    metaRobots: Schema.Attribute.String
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    metaViewport: Schema.Attribute.String
    openGraph: Schema.Attribute.Component<"shared.open-graph", false>
    structuredData: Schema.Attribute.JSON
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

export interface UtilitiesSocialLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_social_links"
  info: {
    displayName: "social-link"
    icon: "oneToOne"
  }
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required
    platform: Schema.Attribute.Enumeration<
      ["Twitter", "GitHub", "LinkedIn", "Facebook", "Instagram"]
    >
    url: Schema.Attribute.String & Schema.Attribute.Required
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
      "elements.integration-card": ElementsIntegrationCard
      "elements.list-item": ElementsListItem
      "elements.marquee-logo": ElementsMarqueeLogo
      "elements.marquee-review": ElementsMarqueeReview
      "elements.marquee-testimonial": ElementsMarqueeTestimonial
      "elements.marquee-testimonial-pro": ElementsMarqueeTestimonialPro
      "elements.partner-card": ElementsPartnerCard
      "elements.stat-card": ElementsStatCard
      "forms.contact-form": FormsContactForm
      "forms.newsletter-form": FormsNewsletterForm
      "sections.animated-logo-row": SectionsAnimatedLogoRow
      "sections.benefits-section": SectionsBenefitsSection
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
      "sections.integration-grid-section": SectionsIntegrationGridSection
      "sections.landing-hero": SectionsLandingHero
      "sections.marquee-section": SectionsMarqueeSection
      "sections.metrics-section": SectionsMetricsSection
      "sections.newsletter-cta-section": SectionsNewsletterCtaSection
      "sections.partner-showcase-section": SectionsPartnerShowcaseSection
      "sections.roadmap-section": SectionsRoadmapSection
      "sections.tech-stack-section": SectionsTechStackSection
      "sections.workflow-section": SectionsWorkflowSection
      "seo-utilities.meta-social": SeoUtilitiesMetaSocial
      "seo-utilities.seo": SeoUtilitiesSeo
      "seo-utilities.seo-og": SeoUtilitiesSeoOg
      "seo-utilities.seo-twitter": SeoUtilitiesSeoTwitter
      "seo-utilities.social-icons": SeoUtilitiesSocialIcons
      "shared.open-graph": SharedOpenGraph
      "shared.section-background": SharedSectionBackground
      "shared.section-badge": SharedSectionBadge
      "shared.section-header": SharedSectionHeader
      "shared.seo": SharedSeo
      "utilities.accordions": UtilitiesAccordions
      "utilities.basic-image": UtilitiesBasicImage
      "utilities.ck-editor-content": UtilitiesCkEditorContent
      "utilities.image-with-link": UtilitiesImageWithLink
      "utilities.link": UtilitiesLink
      "utilities.links-with-title": UtilitiesLinksWithTitle
      "utilities.social-link": UtilitiesSocialLink
      "utilities.text": UtilitiesText
    }
  }
}
