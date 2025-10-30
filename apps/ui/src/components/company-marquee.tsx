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
    <div className="relative py-16 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-transparent dark:via-transparent dark:to-transparent">
      <h3 className="text-center text-lg font-semibold text-gray-600 dark:text-muted-foreground mb-8">
        Trusted by Industry Leaders
      </h3>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee hover:pause">
          {/* First set of companies */}
          {companies.map((company, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center justify-center min-w-[200px] h-20 px-8 mx-4 rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm shrink-0"
            >
              <span className="text-base font-semibold text-gray-700 dark:text-muted-foreground whitespace-nowrap">
                {company}
              </span>
            </div>
          ))}
          {/* Second set of companies for seamless loop */}
          {companies.map((company, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center justify-center min-w-[200px] h-20 px-8 mx-4 rounded-xl bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm shrink-0"
            >
              <span className="text-base font-semibold text-gray-700 dark:text-muted-foreground whitespace-nowrap">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
