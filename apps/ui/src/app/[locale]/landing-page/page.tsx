import { Benefits } from "@/components/benefits"
import { Credibility } from "@/components/credibility"
import { Features } from "@/components/features"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { LessonsSection } from "@/components/lessons-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { RoadmapSection } from "@/components/roadmap-section"
import { Starfield } from "@/components/starfield"
import { WorkflowSection } from "@/components/workflow-section"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <Header />
      <Hero />
      <Credibility />
      <Features />
      <Benefits />
      <WorkflowSection />
      <LessonsSection />
      <NewsletterSection />
      <RoadmapSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
