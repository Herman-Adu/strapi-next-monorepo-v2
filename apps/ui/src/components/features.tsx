const features = [
  {
    icon: "📊",
    title: "Strapi v5 with typed controllers & services",
    description:
      "Fully typed backend with controllers and services for type safety and better developer experience.",
  },
  {
    icon: "⚡",
    title: "Next.js 14 App Router",
    description:
      "Latest Next.js with SSR/ISR configured for optimal performance and SEO.",
  },
  {
    icon: "💎",
    title: "TypeScript, Prisma, Tailwind CSS, shadcn/ui",
    description:
      "Sane defaults, no yak-shaving. Start building features immediately.",
  },
  {
    icon: "🔐",
    title: "NextAuth + RBAC",
    description:
      "JWT, social providers, role-based guards for secure authentication and authorization.",
  },
  {
    icon: "🌍",
    title: "i18n & SEO presets",
    description:
      "Locale routing, sitemap, meta tags, Open Graph for international reach.",
  },
  {
    icon: "🐳",
    title: "Docker & CI pipeline",
    description:
      "Identical local/prod builds, one-command deploy for consistent environments.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="bg-background relative z-10 py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            What Ships in the Box
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            Everything you need to build production-ready applications.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-border bg-card hover:border-primary/30 rounded-xl border p-6 transition-colors"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 text-base font-semibold text-balance">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-balance">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground border-border inline-block rounded-full border px-6 py-2 text-sm">
            Full documentation — new dev onboards in &lt; 30 minutes
          </p>
        </div>
      </div>
    </section>
  )
}
