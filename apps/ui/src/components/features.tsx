const features = [
  {
    icon: "📊",
    title: "Strapi v5 with typed controllers & services",
    description: "Fully typed backend with controllers and services for type safety and better developer experience.",
  },
  {
    icon: "⚡",
    title: "Next.js 14 App Router",
    description: "Latest Next.js with SSR/ISR configured for optimal performance and SEO.",
  },
  {
    icon: "💎",
    title: "TypeScript, Prisma, Tailwind CSS, shadcn/ui",
    description: "Sane defaults, no yak-shaving. Start building features immediately.",
  },
  {
    icon: "🔐",
    title: "NextAuth + RBAC",
    description: "JWT, social providers, role-based guards for secure authentication and authorization.",
  },
  {
    icon: "🌍",
    title: "i18n & SEO presets",
    description: "Locale routing, sitemap, meta tags, Open Graph for international reach.",
  },
  {
    icon: "🐳",
    title: "Docker & CI pipeline",
    description: "Identical local/prod builds, one-command deploy for consistent environments.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative z-10 py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">What Ships in the Box</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Everything you need to build production-ready applications.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2 text-balance text-base">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-balance leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground border border-border rounded-full px-6 py-2 inline-block">
            Full documentation — new dev onboards in &lt; 30 minutes
          </p>
        </div>
      </div>
    </section>
  )
}
