import type { Schema, Struct } from "@strapi/strapi"

export interface AtomsGradientColors extends Struct.ComponentSchema {
  collectionName: "components_atoms_gradient_colors"
  info: {
    description: "\uD83D\uDCA1 Theme Defaults - Light: #16a34a \u2192 #84cc16 \u2192 #e8f5e9 | Dark: #22c55e \u2192 #a3e635 \u2192 #f0fdf4. Leave fields EMPTY to use theme colors automatically. Only customize when you need brand-specific or seasonal gradients."
    displayName: "Custom Gradient Colors"
    icon: "palette"
  }
  attributes: {
    darkModeEnd: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    darkModeMiddle: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    darkModeStart: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    lightModeEnd: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    lightModeMiddle: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    lightModeStart: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
  }
}

export interface AtomsOrbAnimation extends Struct.ComponentSchema {
  collectionName: "components_atoms_orb_animations"
  info: {
    description: "Reusable orbiting light effect for badges, cards, buttons, containers, etc."
    displayName: "Orb Animation"
    icon: "circle"
  }
  attributes: {
    blur: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100
          min: 0
        },
        number
      > &
      Schema.Attribute.DefaultTo<40>
    color: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    size: Schema.Attribute.Enumeration<["xs", "small", "medium", "large"]> &
      Schema.Attribute.DefaultTo<"medium">
    speed: Schema.Attribute.Enumeration<
      ["extra-slow", "slow", "medium", "fast"]
    > &
      Schema.Attribute.DefaultTo<"slow">
  }
}

export interface AtomsTextStyle extends Struct.ComponentSchema {
  collectionName: "components_atoms_text_styles"
  info: {
    description: "Styling options for any text element (headings, subheadings, labels, etc.)"
    displayName: "Text Style Options"
    icon: "paintBrush"
  }
  attributes: {
    customGradient: Schema.Attribute.Component<"atoms.gradient-colors", false>
    gradientDirection: Schema.Attribute.Enumeration<
      ["diagonal", "horizontal", "vertical", "radial"]
    > &
      Schema.Attribute.DefaultTo<"diagonal">
    textStyle: Schema.Attribute.Enumeration<
      ["default", "gradient", "two-tone"]
    > &
      Schema.Attribute.DefaultTo<"default">
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

export interface MoleculesCompanyLogo extends Struct.ComponentSchema {
  collectionName: "components_molecules_company_logos"
  info: {
    description: "Company logo with name or image"
    displayName: "CompanyLogo"
  }
  attributes: {
    image: Schema.Attribute.Media<"images">
    name: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface MoleculesFeatureCard extends Struct.ComponentSchema {
  collectionName: "components_molecules_feature_cards"
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

export interface MoleculesFooterItem extends Struct.ComponentSchema {
  collectionName: "components_molecules_footer_items"
  info: {
    description: ""
    displayName: "FooterItem"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface MoleculesIconButton extends Struct.ComponentSchema {
  collectionName: "components_molecules_icon_buttons"
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

export interface MoleculesIntegrationCard extends Struct.ComponentSchema {
  collectionName: "components_molecules_integration_cards"
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

export interface MoleculesListItem extends Struct.ComponentSchema {
  collectionName: "components_molecules_list_items"
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

export interface MoleculesMarqueeLogo extends Struct.ComponentSchema {
  collectionName: "components_molecules_marquee_logos"
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

export interface MoleculesMarqueeReview extends Struct.ComponentSchema {
  collectionName: "components_molecules_marquee_reviews"
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

export interface MoleculesMarqueeTestimonial extends Struct.ComponentSchema {
  collectionName: "components_molecules_marquee_testimonials"
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

export interface MoleculesMarqueeTestimonialPro extends Struct.ComponentSchema {
  collectionName: "components_molecules_marquee_testimonials_pro"
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

export interface MoleculesPartnerCard extends Struct.ComponentSchema {
  collectionName: "components_molecules_partner_cards"
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

export interface MoleculesStatCard extends Struct.ComponentSchema {
  collectionName: "components_molecules_stat_cards"
  info: {
    description: "Statistic card with number and description"
    displayName: "StatCard"
  }
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required
    number: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface MoleculesTestimonialCard extends Struct.ComponentSchema {
  collectionName: "components_molecules_testimonial_cards"
  info: {
    description: "Individual testimonial with author info, quote, and rating"
    displayName: "TestimonialCard"
  }
  attributes: {
    authorCompany: Schema.Attribute.String
    authorImage: Schema.Attribute.Component<"utilities.basic-image", false>
    authorName: Schema.Attribute.String & Schema.Attribute.Required
    authorRole: Schema.Attribute.String
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    quote: Schema.Attribute.Text & Schema.Attribute.Required
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5
          min: 1
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>
  }
}

export interface SectionsBenefitsSection extends Struct.ComponentSchema {
  collectionName: "components_sections_benefits_sections"
  info: {
    description: "Benefits section with atomic architecture (badge, header, background) and feature cards"
    displayName: "BenefitsSection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    benefits: Schema.Attribute.Component<"molecules.feature-card", true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4"]> &
      Schema.Attribute.DefaultTo<"3">
    header: Schema.Attribute.Component<"shared.section-header", false>
  }
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: "components_sections_faqs"
  info: {
    description: "FAQ section with atomic architecture (badge, header, background)"
    displayName: "Faq"
  }
  attributes: {
    accordions: Schema.Attribute.Component<"utilities.accordions", true>
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    header: Schema.Attribute.Component<"shared.section-header", false>
  }
}

export interface SectionsFeatureGridSection extends Struct.ComponentSchema {
  collectionName: "components_sections_feature_grid_sections"
  info: {
    description: "Reusable grid section with atomic architecture (badge, header, background) for features, benefits, and lessons"
    displayName: "FeatureGridSection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    footerNote: Schema.Attribute.String
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4", "6"]> &
      Schema.Attribute.DefaultTo<"3">
    header: Schema.Attribute.Component<"shared.section-header", false>
    items: Schema.Attribute.Component<"molecules.feature-card", true>
    listItems: Schema.Attribute.Component<"molecules.list-item", true>
  }
}

export interface SectionsFinalCtaSection extends Struct.ComponentSchema {
  collectionName: "components_sections_final_cta_sections"
  info: {
    description: "Final call-to-action section with atomic architecture (badge, header, background)"
    displayName: "FinalCTASection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    ctaButtons: Schema.Attribute.Component<"molecules.icon-button", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    header: Schema.Attribute.Component<"shared.section-header", false>
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
    description: "Horizontal scrolling images section with atomic architecture (badge, header, background)"
    displayName: "HorizontalImages"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    fixedImageHeight: Schema.Attribute.Integer
    fixedImageWidth: Schema.Attribute.Integer
    header: Schema.Attribute.Component<"shared.section-header", false>
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
    description: "Grid of integrations with atomic architecture (badge, header, background)"
    displayName: "Integration Grid Section"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4", "6"]> &
      Schema.Attribute.DefaultTo<"3">
    header: Schema.Attribute.Component<"shared.section-header", false>
    integrations: Schema.Attribute.Component<
      "molecules.integration-card",
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
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
    ctaButtons: Schema.Attribute.Component<"molecules.icon-button", true> &
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
    logos: Schema.Attribute.Component<"molecules.marquee-logo", true>
    orientation: Schema.Attribute.Enumeration<["horizontal", "vertical"]> &
      Schema.Attribute.DefaultTo<"horizontal">
    pauseOnHover: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    reviews: Schema.Attribute.Component<"molecules.marquee-review", true>
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
      "molecules.marquee-testimonial",
      true
    >
    testimonialsPro: Schema.Attribute.Component<
      "molecules.marquee-testimonial-pro",
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
    description: "Metrics/statistics section with stat cards - Standardized atomic architecture"
    displayName: "MetricsSection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    header: Schema.Attribute.Component<"shared.section-header", false>
    metrics: Schema.Attribute.Component<"molecules.stat-card", true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
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
    benefits: Schema.Attribute.Component<"molecules.list-item", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    buttonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Subscribe">
    ctaButtons: Schema.Attribute.Component<"molecules.icon-button", true> &
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
    header: Schema.Attribute.Component<"shared.section-header", false>
    heading: Schema.Attribute.String & Schema.Attribute.Required
    headingAccent: Schema.Attribute.String
    headingTextStyle: Schema.Attribute.Component<"atoms.text-style", false>
    inputPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Enter your email">
    showDivider: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
  }
}

export interface SectionsPartnerShowcaseSection extends Struct.ComponentSchema {
  collectionName: "components_sections_partner_showcase_sections"
  info: {
    description: "Showcase partners with atomic architecture (badge, header, background)"
    displayName: "Partner Showcase Section"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    gridColumns: Schema.Attribute.Enumeration<["2", "3", "4", "6"]> &
      Schema.Attribute.DefaultTo<"3">
    header: Schema.Attribute.Component<"shared.section-header", false>
    partners: Schema.Attribute.Component<"molecules.partner-card", true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
  }
}

export interface SectionsRoadmapSection extends Struct.ComponentSchema {
  collectionName: "components_sections_roadmap_sections"
  info: {
    description: "Roadmap and community section with atomic architecture (badge, header, background)"
    displayName: "RoadmapSection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    footerNotes: Schema.Attribute.Component<"utilities.text", true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2
        },
        number
      >
    header: Schema.Attribute.Component<"shared.section-header", false>
    roadmapItems: Schema.Attribute.Component<"molecules.list-item", true>
  }
}

export interface SectionsTestimonialsSection extends Struct.ComponentSchema {
  collectionName: "components_sections_testimonials_sections"
  info: {
    description: "Testimonials showcase with marquee or grid layout"
    displayName: "TestimonialsSection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    columns: Schema.Attribute.Enumeration<["2", "3", "4"]> &
      Schema.Attribute.DefaultTo<"3">
    header: Schema.Attribute.Component<"shared.section-header", false>
    layout: Schema.Attribute.Enumeration<["marquee", "grid"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"grid">
    showImages: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    showRatings: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    testimonials: Schema.Attribute.Component<
      "molecules.testimonial-card",
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
  }
}

export interface SectionsWorkflowSection extends Struct.ComponentSchema {
  collectionName: "components_sections_workflow_sections"
  info: {
    description: "Two-column workflow section with atomic architecture (badge, header, background)"
    displayName: "WorkflowSection"
  }
  attributes: {
    background: Schema.Attribute.Component<"shared.section-background", false>
    badge: Schema.Attribute.Component<"shared.section-badge", false>
    header: Schema.Attribute.Component<"shared.section-header", false>
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    workflowPoints: Schema.Attribute.Component<"molecules.list-item", true>
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
        "theme-pastel",
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
    alignment: Schema.Attribute.Enumeration<["left", "center", "right"]> &
      Schema.Attribute.DefaultTo<"center">
    icon: Schema.Attribute.String
    orbAnimation: Schema.Attribute.Component<"atoms.orb-animation", false>
    pulse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    showBadge: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
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
    descriptionTextStyle: Schema.Attribute.Component<"atoms.text-style", false>
    heading: Schema.Attribute.String & Schema.Attribute.Required
    headingAccent: Schema.Attribute.String
    headingSize: Schema.Attribute.Enumeration<
      ["small", "medium", "large", "xl"]
    > &
      Schema.Attribute.DefaultTo<"large">
    showDivider: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    showHeader: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    textStyle: Schema.Attribute.Component<"atoms.text-style", false>
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
      "atoms.gradient-colors": AtomsGradientColors
      "atoms.orb-animation": AtomsOrbAnimation
      "atoms.text-style": AtomsTextStyle
      "forms.contact-form": FormsContactForm
      "forms.newsletter-form": FormsNewsletterForm
      "molecules.company-logo": MoleculesCompanyLogo
      "molecules.feature-card": MoleculesFeatureCard
      "molecules.footer-item": MoleculesFooterItem
      "molecules.icon-button": MoleculesIconButton
      "molecules.integration-card": MoleculesIntegrationCard
      "molecules.list-item": MoleculesListItem
      "molecules.marquee-logo": MoleculesMarqueeLogo
      "molecules.marquee-review": MoleculesMarqueeReview
      "molecules.marquee-testimonial": MoleculesMarqueeTestimonial
      "molecules.marquee-testimonial-pro": MoleculesMarqueeTestimonialPro
      "molecules.partner-card": MoleculesPartnerCard
      "molecules.stat-card": MoleculesStatCard
      "molecules.testimonial-card": MoleculesTestimonialCard
      "sections.benefits-section": SectionsBenefitsSection
      "sections.faq": SectionsFaq
      "sections.feature-grid-section": SectionsFeatureGridSection
      "sections.final-cta-section": SectionsFinalCtaSection
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
      "sections.testimonials-section": SectionsTestimonialsSection
      "sections.workflow-section": SectionsWorkflowSection
      "seo-utilities.meta-social": SeoUtilitiesMetaSocial
      "seo-utilities.seo": SeoUtilitiesSeo
      "seo-utilities.seo-og": SeoUtilitiesSeoOg
      "seo-utilities.seo-twitter": SeoUtilitiesSeoTwitter
      "seo-utilities.social-icons": SeoUtilitiesSocialIcons
      "shared.section-background": SharedSectionBackground
      "shared.section-badge": SharedSectionBadge
      "shared.section-header": SharedSectionHeader
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
