# Strategic Plan: From Current to Ideal

**Timeline**: 10 days (flexible based on findings)  
**Goal**: Production-grade atomic architecture with Newsletter as template

---

## Overview

This plan takes us from our current tangled state to a clean, atomic architecture. We'll use Newsletter Section as our reference implementation, then systematize the pattern for all sections.

---

## Phase 1: Discovery & Audit (Days 1-2)

### Day 1 Morning: Complete Audit Setup

**Goal**: Understand everything we have

**Activities**:

1. Read all onboarding documents in `/docs/atomic-architecture/`
2. Review current Strapi component structure together
3. Create component inventory spreadsheet/document

**Deliverables**:

- ✅ Team aligned on approach
- ✅ Complete understanding of Atomic Design
- ✅ Inventory template created

**Time**: 2-3 hours

---

### Day 1 Afternoon: Strapi Component Audit

**Goal**: Map every Strapi component to atomic level

**Activities**:

1. List every component in `apps/strapi/src/components/`
2. Assign atomic level (atom/molecule/organism/section)
3. Identify duplications
4. Identify gaps
5. Document nesting relationships

**Template**:

```markdown
| Component              | Current Folder | Atomic Level | Used In          | Issues             | Notes                |
| ---------------------- | -------------- | ------------ | ---------------- | ------------------ | -------------------- |
| text-style             | atoms/         | ATOM         | section-header   | None               | ✓ Correct            |
| icon-button            | elements/      | MOLECULE     | newsletter, hero | Folder name        | Should be molecules/ |
| section-header         | shared/        | ORGANISM     | All sections     | None               | ✓ Correct            |
| newsletter-cta-section | sections/      | SECTION      | Home page        | Duplicate headings | Needs refactor       |
```

**Deliverables**:

- ✅ Complete component inventory
- ✅ Atomic level mapping
- ✅ Problem list

**Time**: 3-4 hours

---

### Day 2 Morning: Frontend Component Audit

**Goal**: Map every Next.js component to atomic level

**Activities**:

1. List every component in `apps/ui/src/components/page-builder/`
2. Assign atomic level
3. Check for consistency with Strapi structure
4. Identify custom implementations that should be extracted

**Questions to Answer**:

- Which components render Strapi data?
- Which components are UI-only?
- Which sections have custom implementations?
- What's duplicated across sections?
- What's missing?

**Deliverables**:

- ✅ Frontend component inventory
- ✅ Strapi ↔ Frontend mapping
- ✅ Extraction opportunities list

**Time**: 2-3 hours

---

### Day 2 Afternoon: Gap Analysis & Prioritization

**Goal**: Identify what we need to build

**Activities**:

1. Compare Strapi and Frontend inventories
2. List missing molecules (benefit-card, gdpr-checkbox, etc.)
3. List missing organisms (newsletter-form, benefits-grid, etc.)
4. Prioritize based on Newsletter Section needs
5. Create dependency graph

**Deliverables**:

- ✅ Missing components list (prioritized)
- ✅ Dependency graph
- ✅ Build order plan

**Time**: 2-3 hours

**End of Day 2 Checkpoint**:

- Review audit findings together
- Validate atomic level assignments
- Confirm priorities
- Adjust plan if needed

---

## Phase 2: Design (Days 3-4)

### Day 3 Morning: Newsletter Section Schema Design

**Goal**: Design ideal Strapi schema for Newsletter Section

**Activities**:

1. Start with blank canvas - what SHOULD it be?
2. Design newsletter-form organism schema
3. Design benefit-card molecule schema (if not using list-item)
4. Design benefits-grid organism schema (if needed)
5. Document data flow

**Design Questions**:

- Do we keep both `header` and custom heading? (NO - choose one)
- Should we create newsletter-form organism? (YES)
- Should we create benefit-card molecule? (Review if list-item sufficient)
- Should we create glassmorphism-card molecule? (YES - reusable pattern)

**Deliverable**:

- ✅ Ideal newsletter-cta-section.json schema (documented, not coded)
- ✅ New organism/molecule schemas designed
- ✅ Data flow diagram
- ✅ Content manager experience documented

**Time**: 3-4 hours

---

### Day 3 Afternoon: Frontend Component Design

**Goal**: Design ideal component tree for Newsletter Section

**Activities**:

1. Map schema to component hierarchy
2. Design organism interfaces (props, composition)
3. Design molecule interfaces
4. Plan spacing architecture
5. Document styling patterns

**Deliverable**:

- ✅ Component tree diagram
- ✅ TypeScript interfaces (documented, not coded)
- ✅ Spacing architecture doc
- ✅ Styling patterns doc

**Time**: 2-3 hours

---

### Day 4: Design Review & Refinement

**Goal**: Validate design before implementation

**Activities**:

1. Review schema design together
2. Walk through content manager workflow
3. Walk through developer workflow
4. Identify potential issues
5. Refine and finalize design

**Questions to Answer**:

- Is the schema intuitive for content managers?
- Are components appropriately sized?
- Is the atomic hierarchy clear?
- Can this pattern work for other sections?
- Are there any edge cases we're missing?

**Deliverables**:

- ✅ Finalized Newsletter Section design
- ✅ Identified reusable patterns
- ✅ Implementation plan
- ✅ Testing strategy

**Time**: Full day (4-6 hours)

**End of Day 4 Checkpoint**:

- Design approved
- Ready to implement
- Clear build order
- Team aligned

---

## Phase 3: Build (Days 5-7)

### Build Principles

1. **Bottom-up**: Atoms → Molecules → Organisms → Section
2. **Test at every level**: Don't move up until current level works
3. **Commit small**: Each component is a commit
4. **Document as we go**: Add comments and docs

---

### Day 5: Atoms & Molecules ✅ COMPLETE

**STATUS**: ✅ **PHASE 2 COMPLETE - NOVEMBER 20, 2025**

**Molecules Extracted & Refactored**:

1. ✅ **GlassmorphismCard** (commit c21eff0)

   - 72-line component, 130-line test file
   - Refactored from Newsletter (2 instances) and ContactForm (1 instance)
   - Props: size, glowEffect, variant, className
   - **Storybook**: 15 comprehensive stories (commit b1e534c)

2. ✅ **GDPRCheckbox** (commit 36841f1)

   - 119-line component, 175-line test file
   - Refactored from Newsletter, ContactForm, NewsletterForm
   - Variants: glassmorphic-xl, glassmorphic-sm, simple
   - **Storybook**: 18 comprehensive stories (commit afa24d1)

3. ✅ **TestimonialCard** (commit 92cf304)
   - 88-line component, 195-line test file
   - Refactored from StrapiTestimonialsSection (removed 82-line inline component)
   - Props: testimonial, showRatings, showImages, className
   - **Storybook**: 20 comprehensive stories (commit f0c7060)

**Component Reclassification**:

4. ✅ **StrapiImageWithCTAButton** (commit 6660f0d)
   - Reclassified from sections → elements
   - Schema UID unchanged (backward compatibility)
   - All tests passing

**Storybook Stories Created** (Systematic Process Validated!):

- **Total Stories**: 53 comprehensive variants across 3 molecules
- **Coverage**: All props, variants, responsive, dark mode, interactive demos
- **Real-world Examples**: Newsletter CTA, form integrations, grid/marquee layouts
- **Critical Fix**: Added CSS import to Storybook preview.ts (enables Tailwind)
- **Process Time**: 90 minutes total (30-40 min per component with systematic workflow)
- **Visual Regression**: Chromatic Build 15 - 56 baselines approved ✅

**Systematic Workflow Documented**:

1. Prerequisites: Verify Storybook CSS loading (2 min)
2. Read component implementation (5 min)
3. Read test file for variants (5 min)
4. Create comprehensive stories (15 min)
5. Test in Storybook - visual verification (5 min)
6. Fix any issues discovered (2 min)
7. Commit when verified (1 min)
8. Push to GitHub → Chromatic baseline (immediate)

**Deliverables**:

- ✅ All molecules ready, tested, and refactored
- ✅ 53 Storybook stories created and verified
- ✅ Chromatic baselines approved (Build 15)
- ✅ Systematic process documented and validated
- ✅ All commits pushed to GitHub
- ✅ Documentation updated

**Actual Time**: 2 sessions (molecule extraction + Storybook stories)
**Planned Time**: Full day (6-8 hours)
**Achievement**: ✅ EXCEEDED - Completed with comprehensive testing strategy

---

### Day 6: Organisms

**Morning: NewsletterForm Organism**

Build NewsletterForm organism:

1. Create schema in Strapi

   - Heading fields
   - Description field
   - Input placeholder
   - Button text
   - GDPR configuration
   - Reference molecules

2. Create component in Next.js

   - Compose molecules
   - Handle form state
   - Handle submission
   - Test thoroughly

3. Documentation
   - Props interface
   - Usage example
   - Content manager guide

**Afternoon: BenefitsGrid Organism (if creating)**

Build BenefitsGrid organism:

1. Create schema in Strapi (if needed)

   - Benefits array
   - Layout options
   - Styling options

2. Create component in Next.js

   - Layout logic
   - Responsive grid
   - Compose BenefitCard molecules
   - Test with varying numbers

3. Documentation
   - Usage patterns
   - Layout options
   - Best practices

**Deliverables**:

- ✅ NewsletterForm organism complete and tested
- ✅ BenefitsGrid organism complete (if needed)
- ✅ All organisms documented
- ✅ Committed to repo

**Time**: Full day (6-8 hours)

---

### Day 7: Section Refactor

**Morning: Newsletter Section Schema Update**

1. Back up current schema
2. Update newsletter-cta-section.json
   - Remove duplicate heading fields
   - Add newsletter-form organism reference
   - Add benefits-grid reference (if created)
   - Clean up scattered fields
3. Run Config Sync Export
4. Test in Strapi admin
5. Verify content manager experience

**Afternoon: Newsletter Section Component Refactor**

1. Back up current component
2. Refactor StrapiNewsletterCTASection.tsx
   - Remove custom implementations
   - Compose organisms only
   - Clean up spacing logic
   - Remove hardcoded values
3. Test with real data
4. Verify all breakpoints
5. Test all options (spacing, alignment, etc.)

**Target Structure**:

```tsx
export function StrapiNewsletterCTASection({ component }) {
  return (
    <SectionWrapper background={component.background}>
      <div className={getSectionGap(component.background?.padding)}>
        <SectionBadge badge={component.badge} />
        <SectionHeader header={component.header} />

        <div className="grid @3xl:grid-cols-[1.2fr_1fr] gap-8">
          <NewsletterForm form={component.newsletterForm} />
          <BenefitsGrid benefits={component.benefits} />
        </div>
      </div>
    </SectionWrapper>
  )
}
```

**Deliverables**:

- ✅ Newsletter Section schema refactored
- ✅ Newsletter Section component refactored
- ✅ All functionality working
- ✅ Committed to repo
- ✅ Documentation updated

**Time**: Full day (6-8 hours)

**End of Day 7 Checkpoint**:

- Newsletter Section working perfectly
- All organisms tested
- Pattern documented
- Ready to systematize

---

## Phase 4: Systematize (Days 8-10)

### Day 8: Pattern Documentation

**Goal**: Document the Newsletter pattern for reuse

**Activities**:

1. Extract reusable patterns from Newsletter
2. Document organism composition pattern
3. Document spacing architecture
4. Create section template
5. Create "How to Build a Section" guide

**Deliverables**:

- ✅ Organism Composition Pattern doc
- ✅ Section Building Guide
- ✅ Section Template (copy/paste starting point)
- ✅ Spacing Architecture finalized

**Time**: Full day (4-6 hours)

---

### Day 9: Apply Pattern to Second Section

**Goal**: Prove pattern works for other sections

**Activities**:

1. Choose second section to refactor (Hero? Features?)
2. Apply Newsletter pattern
3. Identify new organisms/molecules needed
4. Build missing pieces
5. Refactor section using pattern
6. Test thoroughly

**Deliverables**:

- ✅ Second section refactored
- ✅ Any new organisms documented
- ✅ Pattern validated
- ✅ Adjustments to guide (if needed)

**Time**: Full day (6-8 hours)

---

### Day 10: System Review & Future Planning

**Goal**: Lock in the system and plan rollout

**Activities**:

1. Review both refactored sections
2. Identify common organisms across all sections
3. Plan remaining section refactors
4. Create component generation templates
5. Plan team training
6. Update project documentation

**Deliverables**:

- ✅ System validated
- ✅ Rollout plan for remaining sections
- ✅ Component templates created
- ✅ Team training materials
- ✅ Updated project docs

**Time**: Full day (4-6 hours)

**End of Day 10 Checkpoint**:

- Two sections refactored perfectly
- Clear pattern established
- Documentation complete
- Team ready to roll out to remaining sections

---

## Success Metrics

### Quantitative

- ✅ Newsletter Section < 100 lines
- ✅ 90% code reuse across sections
- ✅ Zero duplicate implementations
- ✅ 100% components mapped to atomic levels
- ✅ All organisms have tests

### Qualitative

- ✅ Clear, documented patterns
- ✅ Content managers can build sections confidently
- ✅ Developers can build sections in hours, not days
- ✅ Spacing is predictable
- ✅ Codebase is maintainable

---

## Risk Mitigation

### Risk 1: Design Changes During Implementation

**Mitigation**:

- Lock design after Day 4
- Only change if blocker discovered
- Document why changes made

### Risk 2: Unexpected Technical Challenges

**Mitigation**:

- Build incrementally
- Test at every step
- Ask for help early
- Adjust timeline if needed

### Risk 3: Scope Creep

**Mitigation**:

- Focus ONLY on Newsletter Section
- Note improvements for later
- Stay disciplined to plan
- Celebrate small wins

### Risk 4: Rushing to "Finish"

**Mitigation**:

- Remember: Prepare well, or be prepared to fail
- Quality over speed
- It's okay to take extra time
- Better to do it right once than wrong twice

---

## Daily Workflow

### Each Morning (30 min)

1. Review yesterday's progress
2. Check today's goals
3. Identify any blockers
4. Align on priorities

### Each Evening (30 min)

1. Review what was accomplished
2. Document any learnings
3. Update plan if needed
4. Prepare for tomorrow

### Each Checkpoint

1. Stop and review
2. Validate work so far
3. Adjust plan if needed
4. Get alignment before proceeding

---

## Communication Plan

### Daily Updates

- End-of-day summary
- Wins and learnings
- Blockers and questions
- Tomorrow's focus

### Checkpoints

- Day 2: Audit complete
- Day 4: Design approved
- Day 7: Newsletter refactored
- Day 10: System validated

### Documentation

- Update docs as we go
- Capture decisions in real-time
- Note lessons learned
- Keep onboarding materials current

---

## After Day 10

### Weeks 2-3: Rollout

- Refactor remaining sections (one at a time)
- Build missing organisms as needed
- Document new patterns
- Train content managers

### Week 4: Optimization

- Performance review
- Testing infrastructure
- Design token system (if chosen)
- Automated component generation

### Ongoing

- Maintain documentation
- Refine patterns
- Share knowledge
- Continuous improvement

---

## Final Thoughts

This plan is ambitious but achievable. The key is **discipline**:

- ✅ No skipping phases
- ✅ No rushing steps
- ✅ No compromising quality
- ✅ Yes to small, complete tasks
- ✅ Yes to testing thoroughly
- ✅ Yes to documenting as we go

**Remember our ethos**: Prepare well, or be prepared to fail.

We're preparing well. We will succeed.

---

## Next Steps

1. **Tonight**: Read all onboarding documents
2. **Tomorrow Morning**: Start Day 1 audit
3. **Tomorrow Evening**: Review progress, adjust plan

**You're ready. Let's build something great.**

---

_"Plans are worthless, but planning is everything."_  
— Dwight D. Eisenhower
