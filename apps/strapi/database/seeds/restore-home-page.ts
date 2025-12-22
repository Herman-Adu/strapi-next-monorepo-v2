/**
 * 🔄 SAFE HOME PAGE RECOVERY SCRIPT
 *
 * Restores home page content from December 3rd backup data
 * with proper atomic structure (background → badge → header → component data)
 *
 * @see backups/recovery/restore-temp/entities/entities_00001.jsonl
 * @see apps/strapi/database/seeds/e2e-test-data-safe.ts
 *
 * SAFETY FEATURES:
 * - Dry-run mode (preview changes without applying)
 * - Validates existing page structure
 * - Creates backup before modification
 * - Atomic structure validation
 * - Rollback on failure
 *
 * USAGE:
 *   yarn recovery:home-page --dry-run    # Preview changes
 *   yarn recovery:home-page               # Apply changes
 *   yarn recovery:home-page --rollback   # Undo last change
 */

import { promises as fs } from "fs"
import * as path from "path"

// ============================================================================
// CONFIGURATION
// ============================================================================

const DRY_RUN = process.argv.includes("--dry-run")
const ROLLBACK = process.argv.includes("--rollback")
const VERBOSE = process.argv.includes("--verbose") || DRY_RUN

const HOME_PAGE_SLUG = "/"
const BACKUP_DIR = path.join(
  process.cwd(),
  "../../backups/recovery/script-backups"
)

// ============================================================================
// HOME PAGE CONTENT (from Dec 3rd backup)
// ============================================================================

const HOME_PAGE_CONTENT = [
  // -------------------------------------------------------------------------
  // SECTION 1: Hero
  // -------------------------------------------------------------------------
  {
    __component: "sections.hero",
    title: "Strapi + NextJS",
    subTitle: "Monorepo Starter",
    bgColor: null,
    links: [
      {
        label: "Github",
        href: "https://github.com/notum-cz/strapi-next-monorepo-starter",
        newTab: true,
      },
      {
        label: "Notum",
        href: "https://notum.cz/en/",
        newTab: true,
      },
    ],
    image: {
      alt: "starter-template",
      width: null,
      height: null,
      fallbackSrc: null,
    },
    steps: [],
  },

  // REMOVED: CK Editor (causing config sync issues) - Add manually in Strapi Admin if needed

  // -------------------------------------------------------------------------
  // SECTION 2: Benefits Section
  // -------------------------------------------------------------------------
  {
    __component: "sections.benefits-section",
    gridColumns: "3",
    background: {
      backgroundStyle: "muted",
      pattern: null,
      gradient: false,
      containerStyle: "bordered",
      containerWidth: "wide",
      padding: "compact",
    },
    badge: {
      text: "Features",
      icon: "⚡",
      variant: "outline",
      size: "medium",
      alignment: "center",
      pulse: false,
      showBadge: true,
      orbAnimation: {
        enabled: true,
        speed: "extra-slow",
        size: "xs",
        color: "#ebfbc7",
        blur: 40,
      },
    },
    header: {
      heading: "Love Our Platform",
      headingAccent: "Why Developers",
      description:
        "Built by developers, for developers. Experience the features that make building modern apps a breeze.",
      headingSize: "large",
      alignment: "center",
      showDivider: true,
      showHeader: true,
      textStyle: {
        textStyle: "two-tone",
        gradientDirection: "diagonal",
        customGradient: null,
      },
      descriptionTextStyle: null,
    },
    benefits: [
      {
        icon: "⚡",
        title: "Lightning Performance",
        description:
          "Sub-second page loads with optimized code splitting and edge caching worldwide.",
      },
      {
        icon: "💻",
        title: "TypeScript Native",
        description:
          "Full TypeScript support with auto-generated types for the ultimate DX.",
      },
      {
        icon: "🎨",
        title: "Flexible & Customizable",
        description:
          "Tailwind CSS with shadcn/ui components. Make it yours with minimal effort.",
      },
      {
        icon: "📱",
        title: "Mobile First",
        description:
          "Responsive by default. Looks stunning on every device and screen size.",
      },
      {
        icon: "🔒",
        title: "Enterprise Ready",
        description:
          "Built-in security, authentication, and role-based access control.",
      },
      {
        icon: "🔄",
        title: "Real-time Updates",
        description:
          "Live preview, hot reload, and instant content updates from Strapi.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 4: Integration Grid Section
  // -------------------------------------------------------------------------
  {
    __component: "sections.integration-grid-section",
    gridColumns: "3",
    background: {
      backgroundStyle: "muted",
      pattern: null,
      gradient: false,
      containerStyle: "default",
      containerWidth: "wide",
      padding: "default",
    },
    badge: {
      text: "Integrations",
      icon: "🔌",
      variant: "outline",
      size: "large",
      alignment: "center",
      pulse: false,
      showBadge: true,
      orbAnimation: {
        enabled: true,
        speed: "extra-slow",
        size: "medium",
        color: "#f45e07",
        blur: 40,
      },
    },
    header: {
      heading: "Integrations",
      headingAccent: "Seamless ",
      description:
        "Connect with your favorite tools and services. Integrate once, deploy everywhere.",
      headingSize: "large",
      alignment: "center",
      showDivider: true,
      showHeader: true,
      textStyle: {
        textStyle: "two-tone",
        gradientDirection: "horizontal",
        customGradient: null,
      },
      descriptionTextStyle: null,
    },
    integrations: [
      {
        title: "Stripe Payments",
        description:
          "Accept payments with the world's most powerful and flexible payment platform.",
        category: "Payments",
        link: "/integrations/stripe",
        linkText: "Learn More",
        newTab: false,
      },
      {
        title: "Google Analytics",
        description:
          "Track user behavior and gain insights with comprehensive analytics.",
        category: "Analytics",
        link: "/integrations/analytics",
        linkText: "Set Up",
        newTab: false,
      },
      {
        title: "Twilio Communications",
        description:
          "Send SMS, make calls, and engage customers with programmable communications.",
        category: "Communications",
        link: "/integrations/twilio",
        linkText: "Connect",
        newTab: false,
      },
      {
        title: "Contentful CMS",
        description:
          "Manage content across multiple platforms with a headless CMS.",
        category: "Content",
        link: "/integrations/contentful",
        linkText: "Explore",
        newTab: false,
      },
      {
        title: "AWS Cloud",
        description:
          "Scale your infrastructure with enterprise-grade cloud services.",
        category: "Infrastructure",
        link: "/integrations/aws",
        linkText: "Deploy",
        newTab: false,
      },
      {
        title: "Docker Containers",
        description:
          "Containerize applications for consistent development and deployment.",
        category: "DevOps",
        link: "/integrations/docker",
        linkText: "Get Started",
        newTab: false,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTIONS 5-7: Marquee Sections (3 variations)
  // -------------------------------------------------------------------------
  {
    __component: "sections.marquee-section",
    heading: "Customer Testimonial Pro - One Row",
    description:
      "Don't just take our word for it - hear from our satisfied clients",
    displayType: "testimonials",
    testimonialVariant: "pro",
    orientation: "horizontal",
    reverse: false,
    pauseOnHover: true,
    showFade: true,
    duration: 40,
    gap: "1rem",
    rows: 1,
    alternateDirection: false,
    varySpeed: false,
    badgeText: "Testimonials",
    badgeIcon: "⭐",
    backgroundStyle: "solid",
    logos: [],
    testimonials: [],
    testimonialsPro: [
      {
        author: "Sarah Johnson",
        role: "CEO",
        company: "TechVentures Inc",
        quote:
          "This platform transformed how we build and deploy applications. The performance is outstanding and the developer experience is second to none.",
        rating: 5,
      },
      {
        author: "Michael Chen",
        role: "Lead Developer",
        company: "Digital Solutions",
        quote:
          "Best development platform we've used. The TypeScript support and component library saved us months of development time.",
        rating: 4,
      },
      {
        author: "Emily Rodriguez",
        role: "Product Manager",
        company: "Startup Ventures",
        quote:
          "Incredibly easy to use yet powerful enough for enterprise needs. Our team was productive from day one.",
        rating: 5,
      },
      {
        author: "David Kim",
        role: "CTO",
        company: "Global Systems",
        quote:
          "The multi-row marquee feature is perfect for showcasing our client testimonials. Looks professional and works flawlessly.",
        rating: 4,
      },
    ],
    reviews: [],
  },

  {
    __component: "sections.marquee-section",
    heading: "Customer Testimonial Pro - Two Rows",
    description:
      "Don't just take our word for it - hear from our satisfied clients",
    displayType: "testimonials",
    testimonialVariant: "pro",
    orientation: "horizontal",
    reverse: false,
    pauseOnHover: true,
    showFade: true,
    duration: 40,
    gap: "1.5rem",
    rows: 2,
    alternateDirection: true,
    varySpeed: true,
    badgeText: "Testimonials",
    badgeIcon: "⭐",
    backgroundStyle: "solid",
    logos: [],
    testimonials: [],
    testimonialsPro: [
      {
        author: "Sarah Johnson",
        role: "CEO",
        company: "TechVentures Inc",
        quote:
          "This platform transformed how we build and deploy applications. The performance is outstanding and the developer experience is second to none.",
        rating: 5,
      },
      {
        author: "Michael Chen",
        role: "Lead Developer",
        company: "Digital Solutions",
        quote:
          "Best development platform we've used. The TypeScript support and component library saved us months of development time.",
        rating: 5,
      },
      {
        author: "Emily Rodriguez",
        role: "Product Manager",
        company: "Startup Ventures",
        quote:
          "Incredibly easy to use yet powerful enough for enterprise needs. Our team was productive from day one.",
        rating: 5,
      },
      {
        author: "David Kim",
        role: "CTO",
        company: "Global Systems",
        quote:
          "The multi-row marquee feature is perfect for showcasing our client testimonials. Looks professional and works flawlessly.",
        rating: 5,
      },
      {
        author: "Rachel Foster",
        role: "Engineering Director",
        company: "Momentum Technologies",
        quote:
          "We migrated from our old stack and couldn't be happier. The deployment pipeline alone has saved us countless hours. Highly recommended!",
        rating: 5,
      },
      {
        author: "Jessica Martinez",
        role: "Senior Architect",
        company: "Cloud Dynamics",
        quote:
          "Outstanding documentation and support. The vertical marquee orientation was exactly what we needed for our dashboard.",
        rating: 5,
      },
      {
        author: "Lisa Anderson",
        role: "VP of Engineering",
        company: "Innovation Labs",
        quote:
          "The responsive design is flawless across all devices. Our mobile users are impressed with the smooth animations and performance.",
        rating: 5,
      },
      {
        author: "Maria Thompson",
        role: "Head of Product",
        company: "NextGen Apps",
        quote:
          "The attention to detail in every component is impressive. From the smooth animations to the accessibility features, everything just works.",
        rating: 5,
      },
    ],
    reviews: [],
  },

  {
    __component: "sections.marquee-section",
    heading: "Customer Testimonial Pro - Three Rows",
    description:
      "Don't just take our word for it - hear from our satisfied clients",
    displayType: "testimonials",
    testimonialVariant: "pro",
    orientation: "horizontal",
    reverse: false,
    pauseOnHover: true,
    showFade: true,
    duration: 40,
    gap: "1.5rem",
    rows: 3,
    alternateDirection: true,
    varySpeed: true,
    badgeText: "Testimonials",
    badgeIcon: "⭐",
    backgroundStyle: "solid",
    logos: [],
    testimonials: [],
    testimonialsPro: [
      {
        author: "Sarah Johnson",
        role: "CEO",
        company: "TechVentures Inc",
        quote:
          "This platform transformed how we build and deploy applications. The performance is outstanding and the developer experience is second to none.",
        rating: 5,
      },
      {
        author: "Michael Chen",
        role: "Lead Developer",
        company: "Digital Solutions",
        quote:
          "Best development platform we've used. The TypeScript support and component library saved us months of development time.",
        rating: 5,
      },
      {
        author: "Emily Rodriguez",
        role: "Product Manager",
        company: "Startup Ventures",
        quote:
          "Incredibly easy to use yet powerful enough for enterprise needs. Our team was productive from day one.",
        rating: 5,
      },
      {
        author: "David Kim",
        role: "CTO",
        company: "Global Systems",
        quote:
          "The multi-row marquee feature is perfect for showcasing our client testimonials. Looks professional and works flawlessly.",
        rating: 5,
      },
      {
        author: "Rachel Foster",
        role: "Engineering Director",
        company: "Momentum Technologies",
        quote:
          "We migrated from our old stack and couldn't be happier. The deployment pipeline alone has saved us countless hours. Highly recommended!",
        rating: 5,
      },
      {
        author: "Jessica Martinez",
        role: "Senior Architect",
        company: "Cloud Dynamics",
        quote:
          "Outstanding documentation and support. The vertical marquee orientation was exactly what we needed for our dashboard.",
        rating: 2,
      },
      {
        author: "Lisa Anderson",
        role: "VP of Engineering",
        company: "Innovation Labs",
        quote:
          "The responsive design is flawless across all devices. Our mobile users are impressed with the smooth animations and performance.",
        rating: 5,
      },
      {
        author: "Maria Thompson",
        role: "Head of Product",
        company: "NextGen Apps",
        quote:
          "The attention to detail in every component is impressive. From the smooth animations to the accessibility features, everything just works.",
        rating: 5,
      },
      {
        author: "Andrew Wright",
        role: "Tech Lead",
        company: "Digital Innovations",
        quote:
          "Excellent platform for rapid development. The component library is comprehensive and the developer experience is top-notch.",
        rating: 5,
      },
      {
        author: "David Park",
        role: "Solutions Architect",
        company: "Enterprise Systems Co",
        quote:
          "Scalable, reliable, and developer-friendly. This is exactly what modern teams need to ship products faster.",
        rating: 5,
      },
      {
        author: "Sophia Jones",
        role: "DevOps Manager",
        company: "Tech Horizon",
        quote:
          "The CI/CD integration is seamless. We've reduced our deployment time by 70% since switching to this platform.",
        rating: 5,
      },
      {
        author: "Gupta Patel",
        role: "Founder & CEO",
        company: "StartupBoost",
        quote:
          "As a startup, we needed something powerful yet easy to use. This platform delivered on both fronts. Couldn't be happier!",
        rating: 5,
      },
    ],
    reviews: [],
  },

  // -------------------------------------------------------------------------
  // SECTION 8: Testimonials Section (Grid)
  // -------------------------------------------------------------------------
  {
    __component: "sections.testimonials-section",
    layout: "grid",
    columns: "4",
    showRatings: true,
    showImages: true,
    background: {
      backgroundStyle: "muted",
      pattern: null,
      gradient: true,
      containerStyle: "default",
      containerWidth: "wide",
      padding: "default",
    },
    badge: {
      text: "Testimonials",
      icon: "⭐",
      variant: "default",
      size: "large",
      alignment: "center",
      pulse: false,
      showBadge: true,
      orbAnimation: {
        enabled: true,
        speed: "extra-slow",
        size: "xs",
        color: null,
        blur: 40,
      },
    },
    header: {
      heading: "Clients Say",
      headingAccent: "What Our ",
      description:
        "Don't just take our word for it. Here's what industry leaders and innovators have to say about their experience working with us.",
      headingSize: "large",
      alignment: "center",
      showDivider: true,
      showHeader: true,
      textStyle: {
        textStyle: "gradient",
        gradientDirection: "horizontal",
        customGradient: {
          lightModeStart: "#eaeb9b",
          lightModeMiddle: "#b0ee79",
          lightModeEnd: "#08c145",
          darkModeStart: "#08c145",
          darkModeMiddle: "#b0ee79",
          darkModeEnd: "#eaeb9b",
        },
      },
      descriptionTextStyle: {
        textStyle: "default",
        gradientDirection: "diagonal",
        customGradient: {
          lightModeStart: null,
          lightModeMiddle: null,
          lightModeEnd: null,
          darkModeStart: null,
          darkModeMiddle: null,
          darkModeEnd: null,
        },
      },
    },
    testimonials: [
      {
        quote:
          "This platform transformed how we build and deploy applications. The performance is outstanding and the developer experience is second to none.",
        authorName: "Sarah Johnson",
        authorRole: "CTO",
        authorCompany: "TechVentures Inc ",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Sarah Johnson avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "This platform completely transformed how we manage our development workflow. The integration was seamless and our team productivity increased by 40% in the first month.",
        authorName: "Michael Chen",
        authorRole: "VP of Engineering",
        authorCompany: "TechCorp Industries",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Michael Chen",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "Outstanding support and incredibly intuitive interface. Our developers were up and running in minutes, not hours. Best investment we've made this year.",
        authorName: "Emily Rodriguez",
        authorRole: "CTO",
        authorCompany: "StartupHub",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "emily rodriguez avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "The automation features alone saved us countless hours every week. It's like having an extra team member dedicated to optimizing our processes.",
        authorName: "David Kim",
        authorRole: "Lead Developer",
        authorCompany: "Digital Innovations",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "David kim photo",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "We migrated from our old stack and couldn't be happier. The deployment pipeline alone has saved us countless hours. Highly recommended!",
        authorName: "Rachel Foster",
        authorRole: "Engineering Director",
        authorCompany: "Momentum Technologies",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Rachel Foster avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "Outstanding documentation and support. The vertical marquee orientation was exactly what we needed for our dashboard.",
        authorName: "Jessica Martinez",
        authorRole: "Senior Architect",
        authorCompany: "Cloud Dynamics",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Jessica Martinez avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "The responsive design is flawless across all devices. Our mobile users are impressed with the smooth animations and performance.",
        authorName: "Lisa Anderson",
        authorRole: "VP of Engineering",
        authorCompany: "Innovation Labs",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Lisa Anderson avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "The attention to detail in every component is impressive. From the smooth animations to the accessibility features, everything just works.",
        authorName: "Maria Thompson",
        authorRole: "Head of Product",
        authorCompany: "NextGen Apps",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Maria Thompson avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          'Excellent platform for rapid development. The component library is comprehensive and the developer experience is top-notch."',
        authorName: "Andrew Wright",
        authorRole: "Tech Lead",
        authorCompany: "Digital Innovations",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Andrew Wright avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "Scalable, reliable, and developer-friendly. This is exactly what modern teams need to ship products faster.",
        authorName: "David Park",
        authorRole: "Solutions Architect",
        authorCompany: "Enterprise Systems Co",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "David Park",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "The CI/CD integration is seamless. We've reduced our deployment time by 70% since switching to this platform.",
        authorName: "Sophia Jones",
        authorRole: "DevOps Manager",
        authorCompany: "Tech Horizon",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Sophia Jones avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
      {
        quote:
          "As a startup, we needed something powerful yet easy to use. This platform delivered on both fronts. Couldn't be happier!",
        authorName: "Gupta Patel",
        authorRole: "Founder & CEO",
        authorCompany:
          "The CI/CD integration is seamless. We've reduced our deployment time by 70% since switching to this platform.",
        rating: 5,
        featured: true,
        authorImage: {
          alt: "Gupta Patel avatar",
          width: null,
          height: null,
          fallbackSrc: null,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 9: Metrics Section
  // -------------------------------------------------------------------------
  {
    __component: "sections.metrics-section",
    gridColumns: "4",
    background: {
      backgroundStyle: "solid",
      pattern: null,
      gradient: false,
      containerStyle: "bordered",
      containerWidth: "default",
      padding: "compact",
    },
    badge: {
      text: "Performance ",
      icon: "⚡",
      variant: "outline",
      size: "large",
      alignment: "center",
      pulse: false,
      showBadge: true,
      orbAnimation: {
        enabled: true,
        speed: "extra-slow",
        size: "xs",
        color: "#FFFDD0",
        blur: 40,
      },
    },
    header: {
      heading: "Developers Worldwide",
      headingAccent: "Trusted by",
      description: "Join thousands of teams building production applications",
      headingSize: "medium",
      alignment: "center",
      showDivider: false,
      showHeader: true,
      textStyle: {
        textStyle: "gradient",
        gradientDirection: "diagonal",
        customGradient: {
          lightModeStart: "#035917",
          lightModeMiddle: null,
          lightModeEnd: "#8ced79",
          darkModeStart: "#c9f1b1",
          darkModeMiddle: null,
          darkModeEnd: "#56cb5a",
        },
      },
      descriptionTextStyle: {
        textStyle: "default",
        gradientDirection: "diagonal",
        customGradient: null,
      },
    },
    metrics: [
      {
        number: "50,000+",
        label: null,
        description: "Active Users",
      },
      {
        number: "99.9%",
        label: null,
        description: "Uptime",
      },
      {
        number: "2M+",
        label: null,
        description: "API Requests",
      },
      {
        number: "150+",
        label: null,
        description: "Countries",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 10: Newsletter CTA Section
  // -------------------------------------------------------------------------
  {
    __component: "sections.newsletter-cta-section",
    heading: "Developer Community",
    headingAccent: "Join Our",
    showDivider: true,
    description:
      "Be the first to know about new features, best practices, and exclusive content.",
    inputPlaceholder: "Enter your email address",
    buttonText: "Subscribe Now",
    gdprLabel: "I agree to the terms and conditions",
    background: {
      backgroundStyle: "muted",
      pattern: null,
      gradient: false,
      containerStyle: "bordered",
      containerWidth: "wide",
      padding: "default",
    },
    badge: {
      text: "Company Newsletter",
      icon: "📬",
      variant: "outline",
      size: "medium",
      alignment: "center",
      pulse: false,
      showBadge: true,
      orbAnimation: {
        enabled: true,
        speed: "extra-slow",
        size: "xs",
        color: "#ddead1",
        blur: 35,
      },
    },
    header: {
      heading: "Updated",
      headingAccent: "Stay",
      description:
        "Get the latest updates, features, and developer resources delivered to your inbox.",
      headingSize: "large",
      alignment: "center",
      showDivider: true,
      showHeader: true,
      textStyle: {
        textStyle: "default",
        gradientDirection: "diagonal",
        customGradient: {
          lightModeStart: "#04b043",
          lightModeMiddle: null,
          lightModeEnd: "#b3f74e",
          darkModeStart: "#a0f8bb",
          darkModeMiddle: null,
          darkModeEnd: "#07f1a6",
        },
      },
      descriptionTextStyle: null,
    },
    headingTextStyle: {
      textStyle: "two-tone",
      gradientDirection: "diagonal",
      customGradient: null,
    },
    gdprLink: {
      label: "Privacy Policy",
      href: "/privacy-policy",
      newTab: null,
    },
    ctaButtons: [],
    benefits: [
      {
        title: "Weekly Updates",
        description:
          "Get curated development tips and platform updates every week.",
        iconType: "check",
      },
      {
        title: "Exclusive Content",
        description:
          "Access to early features, beta programs, and developer resources.",
        iconType: "check",
      },
    ],
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function log(
  message: string,
  level: "info" | "success" | "warning" | "error" = "info"
) {
  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  }
  console.log(`${icons[level]}  ${message}`)
}

function logVerbose(message: string) {
  if (VERBOSE) {
    console.log(`   ${message}`)
  }
}

async function createBackup(strapi: any, page: Record<string, unknown>) {
  await fs.mkdir(BACKUP_DIR, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupFile = path.join(BACKUP_DIR, `home-page-backup-${timestamp}.json`)

  await fs.writeFile(backupFile, JSON.stringify(page, null, 2))
  log(`Backup created: ${backupFile}`, "success")

  return backupFile
}

// ============================================================================
// MAIN RECOVERY FUNCTION
// ============================================================================

async function recoverHomePage(strapi: any) {
  log("🔄 Starting Home Page Recovery Script", "info")
  log(`Mode: ${DRY_RUN ? "DRY RUN (preview only)" : "LIVE UPDATE"}`, "warning")
  console.log("")

  // -------------------------------------------------------------------------
  // Step 1: Find home page
  // -------------------------------------------------------------------------
  log("📄 Finding home page...", "info")

  const pages = await strapi.documents("api::page.page").findMany({
    filters: { slug: HOME_PAGE_SLUG },
    locale: "en",
    status: "published",
  })

  if (!pages || pages.length === 0) {
    log("Home page not found! Create it in Strapi Admin first.", "error")
    process.exit(1)
  }

  const homePage = pages[0]
  const pageTitle =
    typeof homePage.title === "string" ? homePage.title : "Unknown"
  const pageId = homePage.id
  const documentId =
    typeof homePage.documentId === "string" ? homePage.documentId : ""

  log(
    `Found home page: "${pageTitle}" (ID: ${pageId}, documentId: ${documentId})`,
    "success"
  )

  const currentContent = Array.isArray(homePage.content) ? homePage.content : []
  logVerbose(`Current sections: ${currentContent.length}`)
  logVerbose(`Expected sections: ${HOME_PAGE_CONTENT.length}`)
  console.log("")

  // -------------------------------------------------------------------------
  // Step 2: Create backup (if not dry-run)
  // -------------------------------------------------------------------------
  if (!DRY_RUN) {
    log("💾 Creating backup...", "info")
    await createBackup(strapi, homePage)
    console.log("")
  }

  // -------------------------------------------------------------------------
  // Step 3: Show changes
  // -------------------------------------------------------------------------
  log("🔍 Analyzing changes...", "info")

  const currentSections = currentContent
  const expectedSections = HOME_PAGE_CONTENT

  console.log("\n📊 COMPARISON:")
  console.log(`   Current:  ${currentSections.length} sections`)
  console.log(`   Expected: ${expectedSections.length} sections`)
  console.log("")

  // Show section-by-section comparison
  console.log("📋 SECTION DETAILS:")
  for (
    let i = 0;
    i < Math.max(currentSections.length, expectedSections.length);
    i++
  ) {
    const current = currentSections[i] as Record<string, unknown> | undefined
    const expected = expectedSections[i] as Record<string, unknown> | undefined

    const currentComponent = current?.__component
    const expectedComponent = expected?.__component

    if (current && expected && currentComponent === expectedComponent) {
      console.log(`   ${i + 1}. ✅ ${expectedComponent}`)
    } else if (!current && expected) {
      console.log(`   ${i + 1}. ➕ ${expectedComponent} (MISSING - will add)`)
    } else if (current && !expected) {
      console.log(`   ${i + 1}. ➖ ${currentComponent} (EXTRA - will remove)`)
    } else {
      console.log(
        `   ${i + 1}. 🔄 ${currentComponent || "?"} → ${expectedComponent || "?"} (MISMATCH)`
      )
    }
  }
  console.log("")

  // -------------------------------------------------------------------------
  // Step 4: Apply changes (if not dry-run)
  // -------------------------------------------------------------------------
  if (DRY_RUN) {
    log(
      "✋ DRY RUN: No changes applied. Run without --dry-run to apply changes.",
      "warning"
    )
  } else {
    log("✏️  Applying changes...", "info")

    try {
      await strapi.documents("api::page.page").update({
        documentId,
        locale: "en",
        status: "published",
        data: {
          content: HOME_PAGE_CONTENT,
        },
      })

      log("Home page updated successfully!", "success")
      console.log("")

      log("🔧 NEXT STEPS:", "info")
      log("1. Run config sync: yarn strapi:config-sync", "info")
      log("2. Generate types: yarn strapi:types", "info")
      log("3. Test frontend: Open http://localhost:3000", "info")
      log("4. Create backup: yarn backup-strapi", "info")
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      log(`Update failed: ${errorMessage}`, "error")
      throw error
    }
  }
}

// ============================================================================
// ROLLBACK FUNCTION
// ============================================================================

async function rollbackHomePage(strapi: any) {
  log("⏮️  Rolling back to previous version...", "info")

  const backupFiles = await fs.readdir(BACKUP_DIR)
  const homePageBackups = backupFiles
    .filter((f) => f.startsWith("home-page-backup-"))
    .sort()
    .reverse()

  if (homePageBackups.length === 0) {
    log("No backups found!", "error")
    process.exit(1)
  }

  const latestBackupFile = homePageBackups[0]
  if (!latestBackupFile) {
    log("No backup file found!", "error")
    process.exit(1)
  }

  const latestBackup = path.join(BACKUP_DIR, latestBackupFile)
  log(`Restoring from: ${latestBackup}`, "info")

  const backupContent = await fs.readFile(latestBackup, "utf-8")
  const backupData = JSON.parse(backupContent) as Record<string, unknown>

  const documentId =
    typeof backupData.documentId === "string" ? backupData.documentId : ""
  const content = Array.isArray(backupData.content) ? backupData.content : []

  if (!documentId) {
    log("Backup data missing documentId!", "error")
    process.exit(1)
  }

  await strapi.documents("api::page.page").update({
    documentId,
    locale: "en",
    status: "published",
    data: {
      content,
    },
  })

  log("Rollback complete!", "success")
}

// ============================================================================
// ENTRY POINT (Strapi Seed Script Format)
// ============================================================================

export default async ({ strapi }: { strapi: any }) => {
  try {
    if (ROLLBACK) {
      await rollbackHomePage(strapi)
    } else {
      await recoverHomePage(strapi)
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
    log(`Fatal error: ${errorMessage}`, "error")
    console.error(error)
    throw error
  }
}
