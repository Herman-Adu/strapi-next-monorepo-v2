# ❓ FAQ Section - Test Data

**Component**: FAQ Section  
**Type**: Section (Organism)  
**Use Cases**: Frequently asked questions, help center, support

---

## Component Structure (Order: Top to Bottom in Strapi)

```
FAQ Section
├── 1. Background (shared.section-background) ← Top of form
├── 2. Badge (shared.section-badge) ← Second field
├── 3. Header (shared.section-header) ← Third field
└── 4. Accordions (utilities.accordions) ← Bottom of form (main content)
```

**Visual Layout:**

```
┌─────────────────────────────────┐
│ FAQ Section                      │
├─────────────────────────────────┤
│ 1. Background (shared)          │ ← Container/styling (top of form)
│ 2. Badge (shared)               │ ← Decoration
│ 3. Header (shared)              │ ← Section title
│ 4. Accordions (utilities)       │ ← Main content (bottom of form)
└─────────────────────────────────┘
```

---

## 🔌 Electrical Engineering Company

### Background Component

- **Background Style**: `transparent`
- **Container Style**: `boxed`
- **Container Width**: `default`
- **Padding**: `default`
- **Gradient**: `false`

### Badge Component (Optional)

- **Text**: "FAQ"
- **Icon**: "💡"
- **Variant**: `outline`
- **Size**: `medium`
- **Alignment**: `center`
- **Show Badge**: `true`
- **Orb Animation**: Enable

### Header Component

- **Heading**: "Common Questions About Our Services"
- **Description**: "Get answers to frequently asked questions about electrical services, pricing, and safety."
- **Heading Size**: `large`
- **Show Header**: `true`
- **Show Divider**: `true`

### Accordions Component (Add at Bottom)

#### FAQ 1

- **Question**: "Are you licensed and insured?"
- **Answer**: "Yes, all our electricians are fully licensed master electricians with comprehensive liability insurance. We carry worker's compensation and maintain all required certifications for residential and commercial electrical work."

#### FAQ 2

- **Question**: "Do you provide 24/7 emergency service?"
- **Answer**: "Absolutely. Electrical emergencies don't wait for business hours. Our certified electricians are available 24/7 for urgent repairs including power outages, electrical fires, and hazardous situations. Call our emergency hotline anytime."

#### FAQ 3

- **Question**: "How much does electrical work cost?"
- **Answer**: "We provide free, detailed written estimates before starting any work. Pricing depends on the scope of work, materials needed, and project complexity. Standard service calls start at $95, with all additional work quoted upfront—no hidden fees or surprise charges."

#### FAQ 4

- **Question**: "Will my electrical work pass inspection?"
- **Answer**: "Yes, guaranteed. All our installations meet or exceed local electrical codes and are completed to pass inspection on the first try. We handle all permit applications and coordinate with inspectors to ensure full compliance."

#### FAQ 5

- **Question**: "How quickly can you respond to service calls?"
- **Answer**: "For emergencies, we typically arrive within 1-2 hours. For scheduled appointments, we offer same-day or next-day service in most cases. We respect your time and always provide a specific arrival window."

#### FAQ 6

- **Question**: "Do you work on commercial properties?"
- **Answer**: "Yes. We have extensive experience with commercial electrical systems including offices, retail spaces, hospitals, schools, and industrial facilities. Our team is equipped to handle projects of any size while minimizing disruption to your operations."

---

## 💻 Web Development Agency

### Background Component

- **Background Style**: `transparent`
- **Container Style**: `boxed`
- **Container Width**: `default`
- **Padding**: `default`
- **Gradient**: `false`

### Badge Component (Optional)

- **Text**: "Questions?"
- **Icon**: "❓"
- **Variant**: `outline`
- **Size**: `medium`
- **Alignment**: `center`
- **Show Badge**: `true`
- **Orb Animation**: Enable

### Header Component

- **Heading**: "Frequently Asked Questions"
- **Description**: "Find answers to common questions about our web development services, process, and pricing."
- **Heading Size**: `large`
- **Show Header**: `true`
- **Show Divider**: `true`

### Accordions Component (Add at Bottom)

#### FAQ 1

- **Question**: "What technologies do you use?"
- **Answer**: "We build with modern, production-ready technologies including Next.js, React, TypeScript, Tailwind CSS, and Strapi CMS. All applications are hosted on enterprise-grade infrastructure (Vercel, AWS) and optimized for performance, SEO, and scalability."

#### FAQ 2

- **Question**: "How long does a typical project take?"
- **Answer**: "Most websites are delivered within 4-6 weeks depending on complexity. Custom web applications typically take 8-12 weeks. We use an agile development process with weekly demos and updates to keep you informed every step of the way."

#### FAQ 3

- **Question**: "Do you provide ongoing support after launch?"
- **Answer**: "Yes! All packages include 30 days of post-launch support for bug fixes and adjustments. We also offer monthly maintenance plans that include updates, security patches, content changes, and technical support. We're here for the long term."

#### FAQ 4

- **Question**: "Can you redesign my existing website?"
- **Answer**: "Absolutely. We specialize in website redesigns and migrations. We'll analyze your current site, preserve what works, and modernize the design and functionality. We can migrate from any platform including WordPress, Wix, Squarespace, or custom builds."

#### FAQ 5

- **Question**: "What's included in your pricing?"
- **Answer**: "All projects include custom design, development, mobile optimization, SEO setup, performance optimization, testing, deployment, and training. We provide transparent, upfront pricing with detailed proposals—no hidden fees or surprise charges."

#### FAQ 6

- **Question**: "Can you integrate with my existing tools?"
- **Answer**: "Yes. We have experience integrating with payment processors (Stripe, PayPal), CRMs (HubSpot, Salesforce), email platforms (Mailchimp, SendGrid), analytics (Google Analytics), and custom APIs. Our headless architecture makes integrations straightforward."

#### FAQ 7

- **Question**: "Do you offer e-commerce development?"
- **Answer**: "Yes. We build custom e-commerce solutions with product catalogs, shopping carts, payment processing, inventory management, and order tracking. We integrate with Stripe, Shopify, or custom payment solutions depending on your needs."

#### FAQ 8

- **Question**: "Will my website be mobile-friendly?"
- **Answer**: "Guaranteed. We design mobile-first, meaning your site will look perfect on smartphones and tablets. All websites are fully responsive and tested across devices and browsers before launch. Over 60% of traffic is mobile—we never compromise on mobile experience."

---

## 👨‍💻 Developer Portfolio

### Background Component

- **Background Style**: `transparent`
- **Container Style**: `boxed`
- **Container Width**: `default`
- **Padding**: `default`
- **Gradient**: `false`

### Badge Component (Optional)

- **Text**: "FAQ"
- **Icon**: "💬"
- **Variant**: `outline`
- **Size**: `medium`
- **Alignment**: `center`
- **Show Badge**: `true`
- **Orb Animation**: Enable

### Header Component

- **Heading**: "Working Together: FAQ"
- **Description**: "Common questions about my freelance services, availability, and development process."
- **Heading Size**: `large`
- **Show Header**: `true`
- **Show Divider**: `true`

### Accordions Component (Add at Bottom)

#### FAQ 1

- **Question**: "What's your development process?"
- **Answer**: "I follow an agile approach with weekly sprints. After initial discovery and planning, I provide regular updates and demos. You'll have full visibility into progress via GitHub, project management tools, and weekly video calls. No surprises—transparent communication throughout."

#### FAQ 2

- **Question**: "What's your hourly rate?"
- **Answer**: "My standard rate is $150/hour for freelance work. I also offer fixed-price projects for well-defined scopes. Long-term contracts (3+ months) are available at reduced rates. All engagements include detailed proposals with scope, timeline, and pricing upfront."

#### FAQ 3

- **Question**: "Are you available for full-time positions?"
- **Answer**: "I'm open to both contract and full-time opportunities depending on the project and team. Currently, I'm available for contract work starting immediately. For full-time roles, I can start within 2-4 weeks notice."

#### FAQ 4

- **Question**: "What stack do you specialize in?"
- **Answer**: "Full-stack TypeScript is my specialty: React/Next.js on frontend, Node.js/Express on backend, PostgreSQL/MongoDB for databases. I'm also experienced with AWS, Docker, CI/CD pipelines, and modern DevOps practices. 8+ years of production experience."

#### FAQ 5

- **Question**: "Can you work with my existing codebase?"
- **Answer**: "Yes. I'm comfortable jumping into existing projects, refactoring legacy code, and adding new features to established applications. I've worked with codebases ranging from early-stage startups to enterprise applications with millions of users."

#### FAQ 6

- **Question**: "Do you provide code documentation?"
- **Answer**: "Always. All code is thoroughly documented with inline comments, README files, architecture diagrams, and setup instructions. I believe in writing code that others can easily understand and maintain long-term."

---

## 📚 Learning Platform

### Background Component

- **Background Style**: `muted`
- **Container Style**: `boxed`
- **Container Width**: `default`
- **Padding**: `default`
- **Gradient**: `false`

### Badge Component (Optional)

- **Text**: "Support"
- **Icon**: "🎓"
- **Variant**: `outline`
- **Size**: `medium`
- **Alignment**: `center`
- **Show Badge**: `true`
- **Orb Animation**: Enable

### Header Component

- **Heading**: "Student Questions & Support"
- **Description**: "Everything you need to know about enrollment, courses, career support, and learning outcomes."
- **Heading Size**: `large`
- **Show Header**: `true`
- **Show Divider**: `true`

### Accordions Component (Add at Bottom)

#### FAQ 1

- **Question**: "Do I need prior coding experience?"
- **Answer**: "No! Our beginner courses start from absolute zero. We teach programming fundamentals before moving to advanced topics. Many of our successful graduates came from non-technical backgrounds including teaching, retail, and hospitality."

#### FAQ 2

- **Question**: "How long does it take to complete the bootcamp?"
- **Answer**: "Our full-time bootcamp is 12 weeks (40 hours/week). Part-time bootcamp is 24 weeks (15-20 hours/week). Self-paced courses provide lifetime access—complete them at your own speed. Most students find jobs within 3 months of graduation."

#### FAQ 3

- **Question**: "What's the job placement rate?"
- **Answer**: "87% of our graduates land developer jobs within 3 months of completing the program. We provide comprehensive career support including resume reviews, mock interviews, portfolio building, and direct introductions to hiring partners."

#### FAQ 4

- **Question**: "Do you offer payment plans or financing?"
- **Answer**: "Yes. We offer flexible payment plans with 0% interest, income share agreements (pay after you get a job), and partnerships with education financing companies. We also accept GI Bill benefits for veterans."

#### FAQ 5

- **Question**: "Can I get a refund if the course isn't right for me?"
- **Answer**: "Absolutely. We offer a 14-day money-back guarantee. If you're not satisfied within the first two weeks, we'll provide a full refund—no questions asked. Your success is our priority."

#### FAQ 6

- **Question**: "What kind of support do I get during the course?"
- **Answer**: "You'll have access to live instructor office hours, 1-on-1 mentorship sessions, an active Discord community with 50,000+ students, code reviews, and lifetime access to course updates. We're here to help you succeed."

#### FAQ 7

- **Question**: "Do you provide career services after graduation?"
- **Answer**: "Yes. Career support includes resume writing, LinkedIn optimization, mock technical interviews, job search strategy, salary negotiation coaching, and introductions to our network of 500+ hiring partners. Support continues until you land your first developer job."

#### FAQ 8

- **Question**: "What technologies will I learn?"
- **Answer**: "You'll master in-demand technologies including JavaScript, React, Node.js, TypeScript, Next.js, databases (SQL/NoSQL), Git/GitHub, REST APIs, testing, and deployment. Our curriculum is updated quarterly to match current industry trends."

#### FAQ 9

- **Question**: "Can I learn part-time while working?"
- **Answer**: "Yes! Our part-time bootcamp is designed for working professionals. Classes meet evenings and weekends, with flexible scheduling. Recorded sessions are available for review. Thousands of students have successfully balanced work and learning."

#### FAQ 10

- **Question**: "Will I build a portfolio during the course?"
- **Answer**: "Absolutely. You'll complete 10+ real-world projects including a full-stack web application, API integrations, and a capstone project of your choice. All projects are portfolio-ready and hosted on GitHub—perfect for showcasing to employers."

---

## 💡 Usage Tips

### Content Guidelines

- **Keep answers concise** - 2-4 sentences ideal, max 1 paragraph
- **Be specific** - Include numbers, timelines, concrete details
- **Front-load value** - Answer the question in the first sentence
- **Anticipate follow-ups** - Address common concerns proactively
- **Use positive language** - "Yes" and "Absolutely" instead of "No, but..."

### Organization Strategies

**Group by Topic:**

- General Questions
- Pricing & Payment
- Process & Timeline
- Technical Details
- Support & Maintenance

**Order by Priority:**

1. Most frequently asked first
2. Decision-making questions early
3. Technical details later
4. Contact/next steps last

### UX Best Practices

- **Max 8-10 FAQs** - Too many overwhelms users
- **Start collapsed** - Clean initial view
- **Expand one at a time** - Focus user attention
- **Add "Still have questions?" CTA** at bottom
- **Link to detailed docs** for complex topics

---

## 🎨 Display Variations

### Simple Accordion (Recommended)

```
Question text
↓ Expand
Full answer with formatting
Support links if needed
```

### Two-Column Layout

```
Left: Questions          Right: Answers
Category headers         Expanded by default
Side-by-side view       Desktop only
```

### Search-First FAQ

```
Search bar at top
Filter questions as you type
Show matching FAQs
Highlight search terms
```

---

## ✅ Component Order Verification

**CRITICAL**: The FAQ Section fields appear in this order in Strapi (top to bottom):

```
1. Background (shared.section-background)    ← Top of form
2. Badge (shared.section-badge)              ← Second
3. Header (shared.section-header)            ← Third
4. Accordions (utilities.accordions)         ← Bottom of form
```

**How to Configure:**

1. Add FAQ Section component to your page
2. The fields will automatically appear in the correct order above
3. Fill them in from top to bottom:
   - Background: Set container styles
   - Badge: Optional decoration
   - Header: Section title and description
   - Accordions: Add your FAQ items (this will be at the bottom)

**Why this order matters:**

- Background controls container/spacing (foundation)
- Badge and Header provide section context
- Accordions contain the main FAQ content (at bottom where it belongs)
- Order is controlled by config file, not schema

---

**Last Updated**: November 24, 2025  
**Component**: FAQ Section (sections.faq)  
**Dependencies**: Background, Badge, Header, Accordions
