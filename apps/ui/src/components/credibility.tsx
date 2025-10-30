export function Credibility() {
  return (
    <section className="relative z-10 py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto mb-20">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-3">10+</div>
            <p className="text-muted-foreground text-sm md:text-base">
              Enterprise sites (insurance, fintech, telco, SaaS)
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-3">100 000+</div>
            <p className="text-muted-foreground text-sm md:text-base">Monthly visitors, zero downtime since launch</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-3">5</div>
            <p className="text-muted-foreground text-sm md:text-base">
              Countries with teams trusting our starter, backed by SLA support
            </p>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl py-12 px-6">
          <h3 className="text-center text-lg font-semibold mb-8 text-muted-foreground">Trusted by Industry Leaders</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
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
