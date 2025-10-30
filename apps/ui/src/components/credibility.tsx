export function Credibility() {
  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-20 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-3 text-4xl font-bold md:text-5xl">10+</div>
            <p className="text-muted-foreground text-sm md:text-base">
              Enterprise sites (insurance, fintech, telco, SaaS)
            </p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-4xl font-bold md:text-5xl">100 000+</div>
            <p className="text-muted-foreground text-sm md:text-base">
              Monthly visitors, zero downtime since launch
            </p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-4xl font-bold md:text-5xl">5</div>
            <p className="text-muted-foreground text-sm md:text-base">
              Countries with teams trusting our starter, backed by SLA support
            </p>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl px-6 py-12">
          <h3 className="text-muted-foreground mb-8 text-center text-lg font-semibold">
            Trusted by Industry Leaders
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 md:gap-12">
            <div className="text-2xl font-bold">meilisearch</div>
            <div className="text-2xl font-bold">strapi</div>
            <div className="text-2xl font-bold">noimos</div>
            <div className="text-2xl font-bold">axi</div>
            <div className="text-2xl font-bold">direct insurance</div>
            <div className="text-2xl font-bold">KONICA MINOLTA</div>
          </div>
        </div>
      </div>
    </section>
  )
}
