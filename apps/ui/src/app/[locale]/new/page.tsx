import { ReviewCard } from "@/components/page-builder/molecules/ReviewCard"

export default function ReviewPage() {
  return (
    <main className="bg-background min-h-screen p-8 md:p-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Customer Reviews
          </h1>
          <p className="text-muted-foreground text-lg">
            What our customers are saying about us
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ReviewCard
            name="Sarah Johnson"
            position="CEO"
            company="TechCorp"
            aria-label="Review from Sarah Johnson"
            rating={5}
            review="This product has completely transformed how we approach design. The attention to detail and intuitive interface makes it a joy to use every single day."
            avatar="/images/sarah-johnson.png"
            date="2 weeks ago"
          />

          <ReviewCard
            name="Michael Chen"
            position="Product Manager"
            company="InnovateLab"
            aria-label="Review from Michael Chen"
            rating={5}
            review="Exceptional quality and performance. Our team productivity has increased by 40% since implementation. The customer support is also outstanding."
            avatar="/images/michael-chen.jpg"
            date="1 month ago"
          />

          <ReviewCard
            name="Emily Rodriguez"
            position="Director of Operations"
            company="GrowthCo"
            aria-label="Review from Emily Rodriguez"
            rating={4}
            review="A game-changer for our organization. The seamless integration with our existing tools saved us countless hours of work."
            avatar="/images/emily-rodriguez.png"
            date="3 weeks ago"
          />

          <ReviewCard
            name="David Park"
            position="CEO"
            company="CloudScale"
            aria-label="Review from David Park"
            rating={5}
            review="Beautiful design meets powerful functionality. This is exactly what we needed to take our creative process to the next level."
            avatar="/images/david-park.jpg"
            date="1 week ago"
          />

          <ReviewCard
            name="Jessica Martinez"
            position="Marketing Director"
            company="BrandHub"
            aria-label="Review from Jessica Martinez"
            rating={5}
            review="The ROI has been incredible. We've streamlined our entire workflow and our team couldn't be happier with the results."
            avatar="/images/jessica-martinez.jpg"
            date="2 months ago"
          />

          <ReviewCard
            name="Alex Thompson"
            position="VP of Sales"
            company="SalesForce Pro"
            aria-label="Review from Alex Thompson"
            rating={4}
            review="Thoroughly impressed with the user experience. Every feature feels thoughtfully crafted with the end user in mind."
            avatar="/images/alex-thompson.jpg"
            date="3 days ago"
          />

          <ReviewCard
            name="Rachel Kim"
            position="Head of Product"
            company="DesignStudio"
            aria-label="Review from Rachel Kim"
            rating={5}
            review="The technical architecture is solid and scales beautifully. We've processed millions of transactions without a single hiccup."
            avatar="/images/rachel-kim.jpg"
            date="5 days ago"
          />

          <ReviewCard
            name="James Williams"
            position="Analytics Lead"
            company="DataMetrics"
            aria-label="Review from James Williams"
            rating={5}
            review="Our campaigns have never performed better. The analytics and insights provided are absolutely invaluable for decision-making."
            avatar="/images/james-williams.jpg"
            date="1 week ago"
          />

          <ReviewCard
            name="Sofia Patel"
            position="Operations Manager"
            company="LogisticsHub"
            aria-label="Review from Sofia Patel"
            rating={4}
            review="Clean API documentation and excellent developer experience. Integration was smooth and the support team was very responsive."
            avatar="/images/sofia-patel.jpg"
            date="4 weeks ago"
          />

          <ReviewCard
            name="Marcus Lee"
            position="Founder"
            company="StartupLab"
            aria-label="Review from Marcus Lee"
            rating={5}
            review="Our sales cycle has shortened by 30%. The automation features are incredibly powerful yet so easy to configure."
            avatar="/images/marcus-lee.jpg"
            date="2 weeks ago"
          />

          <ReviewCard
            name="Amanda Foster"
            position="IT Director"
            company="TechSolutions"
            aria-label="Review from Amanda Foster"
            rating={5}
            review="As a startup, we needed something that could grow with us. This platform delivered beyond expectations at every stage."
            avatar="/images/amanda-foster.jpg"
            date="6 weeks ago"
          />

          <ReviewCard
            name="Ryan Cooper"
            position="Team Lead"
            company="CollabSpace"
            aria-label="Review from Ryan Cooper"
            rating={4}
            review="The reporting capabilities are fantastic. We can now visualize complex data in ways that actually make sense to stakeholders."
            avatar="/images/ryan-cooper.jpg"
            date="10 days ago"
          />
        </div>
      </div>
    </main>
  )
}
