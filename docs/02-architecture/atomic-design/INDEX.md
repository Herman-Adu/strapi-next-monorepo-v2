# Atomic Architecture Documentation Index

**Welcome to your transformation journey**

---

## Quick Navigation

### 📚 Onboarding (Read First)

1. **[README.md](/docs/02-architecture-atomic-design-readme)** - Start here, reading guide
2. **[00-WELCOME.md](/docs/02-architecture-atomic-design-00-welcome)** - Journey overview
3. **[01-ETHOS.md](/docs/02-architecture-atomic-design-01-ethos)** - Our principles
4. **[02-ATOMIC-DESIGN-PRIMER.md](/docs/02-architecture-atomic-design-02-atomic-design-primer)** - Methodology deep dive
5. **[03-CURRENT-STATE-ANALYSIS.md](/docs/02-architecture-atomic-design-03-current-state-analysis)** - Where we are
6. **[04-STRATEGIC-PLAN.md](/docs/02-architecture-atomic-design-04-strategic-plan)** - 10-day roadmap
7. **[05-PAGE-THEME-ARCHITECTURE.md](/docs/02-architecture-atomic-design-05-page-theme-architecture)** - Page/theme level system

### 🔍 Component Blueprints (Before Building Complex Components)

- **[component-blueprints/00-BLUEPRINT-TEMPLATE.md](/docs/02-architecture-atomic-design-component-blueprints-00-blueprint-template)** - Analysis template
- **[component-blueprints/01-clogzilla-hero-carousel-blueprint.md](/docs/02-architecture-atomic-design-component-blueprints-01-clogzilla-hero-carousel-blueprint)** - Hero example

### ✅ Execution (Use During Work)

- **[DAY-1-CHECKLIST.md](/docs/02-architecture-atomic-design-day-1-checklist)** - Day 1 step-by-step
- **06-COMPONENT-INVENTORY.md** (Create on Day 1)
- **07-NEWSLETTER-DESIGN.md** (Create on Day 3)
- **08-PATTERNS-LIBRARY.md** (Create on Day 8)
- **09-LESSONS-LEARNED.md** (Update daily)

### 📖 Reference (Keep Open)

- **[01-ETHOS.md](/docs/02-architecture-atomic-design-01-ethos)** - Decision framework
- **[02-ATOMIC-DESIGN-PRIMER.md](/docs/02-architecture-atomic-design-02-atomic-design-primer)** - Level clarification
- **[04-STRATEGIC-PLAN.md](/docs/02-architecture-atomic-design-04-strategic-plan)** - Current phase activities

---

## Document Purposes

| Document                          | Purpose                        | When to Read                          |
| --------------------------------- | ------------------------------ | ------------------------------------- |
| README                            | Reading guide & checklist      | First, before anything                |
| 00-WELCOME                        | Journey overview & motivation  | First day, before starting            |
| 01-ETHOS                          | Principles & commitments       | First day, and when deciding          |
| 02-ATOMIC-DESIGN-PRIMER           | Deep methodology understanding | First day, and when classifying       |
| 03-CURRENT-STATE-ANALYSIS         | Problem identification         | First day, and when questioning       |
| 04-STRATEGIC-PLAN                 | Detailed 10-day roadmap        | First day, and daily for plan         |
| 05-PAGE-THEME-ARCHITECTURE        | Page/theme level hierarchy     | First day, for extended understanding |
| DAY-1-CHECKLIST                   | Day 1 step-by-step guide       | Day 1 only                            |
| component-blueprints/00-TEMPLATE  | Component analysis template    | Before building complex components    |
| component-blueprints/01-clogzilla | Hero carousel example          | Reference when creating blueprints    |
| 06-COMPONENT-INVENTORY            | Living component audit         | Create Day 1, reference daily         |
| 07-NEWSLETTER-DESIGN              | Reference implementation       | Create Day 3, reference when building |
| 08-PATTERNS-LIBRARY               | Reusable solutions             | Create Day 8, reference always        |
| 09-LESSONS-LEARNED                | Knowledge capture              | Create Day 1, update daily            |

---

## Reading Time Estimates

**Full onboarding**: 2.5-3 hours

- README: 10 min
- 00-WELCOME: 15 min
- 01-ETHOS: 15 min
- 02-ATOMIC-DESIGN-PRIMER: 15 min
- 03-CURRENT-STATE-ANALYSIS: 30 min
- 04-STRATEGIC-PLAN: 15 min
- 05-PAGE-THEME-ARCHITECTURE: 15 min
- DAY-1-CHECKLIST: 10 min
- component-blueprints/00-TEMPLATE: 20 min (skim)
- component-blueprints/01-clogzilla: 15 min (skim)

**Daily reference**: 10-15 min

- Current day in Strategic Plan
- Relevant Ethos sections
- Primer as needed

---

## How to Use This Folder

### First Time

1. Start with README.md
2. Read all onboarding docs in order
3. Take notes on questions
4. Discuss together before Day 1

### During Development

1. Check today's section in Strategic Plan
2. Use Day X checklist if available
3. Reference Ethos when deciding
4. Reference Primer when classifying
5. Update living documents daily

### When Stuck

1. Return to Ethos decision framework
2. Check Primer for atomic level clarity
3. Review Current State Analysis for context
4. Consult Strategic Plan for next steps

### When Complete

1. Review Lessons Learned
2. Update Patterns Library
3. Share with team
4. Apply to next project

---

## Folder Structure

```
docs/atomic-architecture/
├── README.md                           ← Reading guide
├── INDEX.md                            ← This file
│
├── 00-WELCOME.md                       ← Journey start
├── 01-ETHOS.md                         ← Principles
├── 02-ATOMIC-DESIGN-PRIMER.md          ← Methodology
├── 03-CURRENT-STATE-ANALYSIS.md        ← Current state
├── 04-STRATEGIC-PLAN.md                ← 10-day roadmap
├── 05-PAGE-THEME-ARCHITECTURE.md       ← Page/theme levels
│
├── DAY-1-CHECKLIST.md                  ← Day 1 guide
├── 06-COMPONENT-INVENTORY.md           ← (Create Day 1)
├── 07-NEWSLETTER-DESIGN.md             ← (Create Day 3)
├── 08-PATTERNS-LIBRARY.md              ← (Create Day 8)
├── 09-LESSONS-LEARNED.md               ← (Create Day 1, update daily)
│
├── component-blueprints/               ← Component analysis folder
│   ├── 00-BLUEPRINT-TEMPLATE.md        ← Template for analysis
│   └── 01-clogzilla-hero-carousel-blueprint.md  ← Hero example
│
├── templates/                          ← (Create as needed)
│   ├── section-template.tsx
│   ├── organism-template.tsx
│   ├── molecule-template.tsx
│   └── strapi-component-template.json
│
├── diagrams/                           ← (Create as needed)
│   ├── newsletter-component-tree.png
│   ├── atomic-hierarchy.png
│   └── data-flow.png
│
└── decisions/                          ← (Create as needed)
    ├── 001-single-vs-dual-heading.md
    ├── 002-spacing-architecture.md
    └── 003-glassmorphism-pattern.md
```

---

## Key Principles (Quick Reference)

1. **Backend Drives Frontend** - Strapi schema first, always
2. **Atomic Design Non-Negotiable** - Build smallest to largest
3. **Small, Manageable Parts** - One thing at a time
4. **Production Standards** - Maintainable, scalable, testable
5. **Learn, Document, Share** - Build institutional knowledge

---

## Success Metrics

We succeed when:

- ✅ Newsletter Section < 100 lines
- ✅ Any developer can build sections independently
- ✅ Content managers have consistent experience
- ✅ Spacing is predictable across breakpoints
- ✅ New components take hours, not days
- ✅ Team onboarding takes hours, not weeks

---

## Timeline Overview

```
Days 1-2:  Discovery & Audit
Days 3-4:  Design
Days 5-7:  Build (atoms → molecules → organisms → section)
Days 8-10: Systematize & Document
```

---

## Contact & Questions

**Stuck on concepts?**
→ Re-read relevant onboarding doc
→ Check external resources (Brad Frost's Atomic Design book)
→ Discuss together

**Stuck on implementation?**
→ Return to Ethos decision framework
→ Check if skipping steps
→ Slow down, review plan

**Stuck on timeline?**
→ That's okay, quality > speed
→ Adjust plan if needed
→ Document why and proceed

---

## Commitment

Before proceeding, commit to:

- ✅ Reading all onboarding documents
- ✅ Following plan in order
- ✅ No skipping phases
- ✅ Quality over speed
- ✅ Documentation as we go
- ✅ Learning from every step

---

## Final Notes

This folder represents a **new way of working**:

- Thoughtful over rushed
- Systematic over ad-hoc
- Quality over quantity
- Learning over knowing
- Building over fixing

**Prepare well, or be prepared to fail.**

We're preparing well. Let's succeed together.

---

**Start with: [README.md](/docs/02-architecture-atomic-design-readme)**

Good luck! 🚀

---

_Last Updated: November 14, 2025_
