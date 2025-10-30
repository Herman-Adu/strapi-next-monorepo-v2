"use client"

export function CompanyMarquee() {
  const companies = [
    "Strapi",
    "Noimos",
    "AXI",
    "Direct Insurance",
    "Konica Minolta",
    "IT Company",
    "MeiliSearch",
    "TechCorp",
    "FinanceHub",
    "DataStream",
    "CloudScale",
    "SecureNet",
    "MediaFlow",
    "PaymentPro",
    "AnalyticsCo",
    "ContentHub",
    "EnterpriseX",
    "DevTools Inc",
    "SaaS Solutions",
    "Digital Agency",
  ]

  return (
    <div className="relative bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 py-16 dark:from-transparent dark:via-transparent dark:to-transparent">
      <h3 className="dark:text-muted-foreground mb-8 text-center text-lg font-semibold text-gray-600">
        Trusted by Industry Leaders
      </h3>
      <div className="relative overflow-hidden">
        <div className="animate-marquee hover:pause flex">
          {/* First set of companies */}
          {companies.map((company, index) => (
            <div
              key={`first-${index}`}
              className="dark:bg-card dark:border-border mx-4 flex h-20 min-w-[200px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-8 shadow-sm"
            >
              <span className="dark:text-muted-foreground text-base font-semibold whitespace-nowrap text-gray-700">
                {company}
              </span>
            </div>
          ))}
          {/* Second set of companies for seamless loop */}
          {companies.map((company, index) => (
            <div
              key={`second-${index}`}
              className="dark:bg-card dark:border-border mx-4 flex h-20 min-w-[200px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-8 shadow-sm"
            >
              <span className="dark:text-muted-foreground text-base font-semibold whitespace-nowrap text-gray-700">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
