# Day 1 Preparation Checklist

**Date**: [Fill in tomorrow's date]  
**Goal**: Complete understanding before any coding begins

---

## Before You Start

### ✅ Pre-Work Completed

- [ ] Read 00-WELCOME.md
- [ ] Read 01-ETHOS.md
- [ ] Read 02-ATOMIC-DESIGN-PRIMER.md
- [ ] Read 03-CURRENT-STATE-ANALYSIS.md
- [ ] Read 04-STRATEGIC-PLAN.md
- [ ] Understand the commitment we're making

### ✅ Mental State

- [ ] Well-rested
- [ ] Clear schedule (no interruptions planned)
- [ ] Patient mindset (not rushing)
- [ ] Open to learning
- [ ] Ready to go slow to go fast

### ✅ Tools Ready

- [ ] Code editor open (VS Code)
- [ ] Strapi admin accessible
- [ ] Documentation folder bookmarked
- [ ] Note-taking app ready
- [ ] This checklist printed/visible

---

## Morning Session (2-3 hours)

### Step 1: Alignment (30 min)

**Questions to discuss:**

1. Did you read all the onboarding docs?
2. Do you understand Atomic Design?
3. Do you agree with our current state analysis?
4. Any concerns about the 10-day plan?
5. Are we aligned on the ethos?

**Outcome**: Both parties confident and aligned

---

### Step 2: Inventory Template Setup (30 min)

**Create**: `05-COMPONENT-INVENTORY.md`

**Template**:

```markdown
# Component Inventory & Atomic Mapping

**Date**: [Today's date]  
**Status**: In Progress

## Strapi Components

| Component  | Path   | Atomic Level | Used In        | Issues | Priority |
| ---------- | ------ | ------------ | -------------- | ------ | -------- |
| text-style | atoms/ | ATOM         | section-header | None   | ✅ Keep  |
| ...        | ...    | ...          | ...            | ...    | ...      |

## Frontend Components

| Component | Path   | Atomic Level | Renders Strapi | Issues | Priority |
| --------- | ------ | ------------ | -------------- | ------ | -------- |
| TextStyle | atoms/ | ATOM         | text-style     | None   | ✅ Keep  |
| ...       | ...    | ...          | ...            | ...    | ...      |

## Missing Components

| Component    | Type     | Needed For         | Priority |
| ------------ | -------- | ------------------ | -------- |
| benefit-card | MOLECULE | Newsletter Section | HIGH     |
| ...          | ...      | ...                | ...      |

## Duplications Found

| Duplicate      | Location 1     | Location 2        | Resolution               |
| -------------- | -------------- | ----------------- | ------------------------ |
| Heading system | section-header | newsletter custom | Remove newsletter custom |
| ...            | ...            | ...               | ...                      |
```

**Outcome**: Inventory template ready to fill

---

### Step 3: Strapi Components Audit (60-90 min)

**Navigate to**: `apps/strapi/src/components/`

**For each folder**:

1. List all components
2. Read the JSON schema
3. Understand what it does
4. Assign atomic level
5. Note where it's used
6. Identify any issues
7. Add to inventory

**Folders to audit**:

- [ ] `atoms/`
- [ ] `elements/`
- [ ] `forms/`
- [ ] `sections/`
- [ ] `shared/`
- [ ] `utilities/`

**Questions to answer per component**:

- What data does it hold?
- How is it composed (what does it reference)?
- Where is it used?
- Is it at the right atomic level?
- Is there duplication?
- What's missing?

**Outcome**: Complete Strapi inventory with atomic levels assigned

---

## Afternoon Session (2-3 hours)

### Step 4: Frontend Components Audit (60-90 min)

**Navigate to**: `apps/ui/src/components/page-builder/`

**For each folder**:

1. List all components
2. Read the implementation
3. Understand what it renders
4. Assign atomic level
5. Check if it renders Strapi component
6. Note any custom implementations
7. Add to inventory

**Folders to audit**:

- [ ] `atoms/`
- [ ] `components/elements/`
- [ ] `components/forms/`
- [ ] `components/sections/`
- [ ] `shared/`

**Questions to answer per component**:

- What does it render?
- Does it match a Strapi component?
- Is it at the right atomic level?
- Does it have custom logic that should be extracted?
- Could it be reused elsewhere?

**Outcome**: Complete frontend inventory with Strapi mapping

**⚠️ NEW - Testing Awareness**:

- Note which components need testing workflows
- Identify components that had refactoring issues in past
- Flag any components with unclear middleware patterns
- See [Test-Driven Refactoring](/docs/06-workflows-test-driven-refactoring) for discipline

---

### Step 5: Gap Analysis (30-45 min)

**Compare Strapi and Frontend inventories**:

1. **Missing Molecules**:

   - List molecules that should exist
   - Note what they'd be composed of
   - Identify where they're needed
   - Priority: HIGH, MEDIUM, LOW

2. **Missing Organisms**:

   - List organisms that should exist
   - Note what they'd be composed of
   - Identify where they're needed
   - Priority: HIGH, MEDIUM, LOW

3. **Duplications**:

   - List all duplicated implementations
   - Decide which to keep
   - Plan for consolidation

4. **Misclassifications**:
   - Components at wrong atomic level
   - Plan for reclassification

**Outcome**: Clear understanding of gaps and issues

---

### Step 6: Day 1 Review (30-45 min)

**Together, review**:

1. Component inventory
2. Atomic level assignments
3. Gap analysis
4. Priorities

**Questions to answer**:

- Did we find everything?
- Do atomic assignments make sense?
- What surprised us?
- What's our biggest issue?
- Are we ready for Day 2?

**Deliverables to check**:

- ✅ Complete component inventory
- ✅ Atomic level mapping
- ✅ Gap analysis
- ✅ Problem list prioritized

**Outcome**: Confident understanding of current state

---

## End of Day 1

### Completed

- [ ] All onboarding docs read
- [ ] Team aligned on approach
- [ ] Component inventory created and filled
- [ ] Atomic levels assigned
- [ ] Gaps identified
- [ ] Priorities set
- [ ] Ready for Day 2

### Captured

- [ ] Any new issues discovered
- [ ] Questions that arose
- [ ] Insights gained
- [ ] Adjustments needed to plan

### Tomorrow Preview

- Morning: Newsletter Section deep dive
- Afternoon: Design ideal schema
- Evening: Review and validate design

---

## Red Flags to Watch

**Stop if you find yourself**:

- 🚫 Rushing through the audit
- 🚫 Skipping components "we won't touch"
- 🚫 Not writing things down
- 🚫 Making assumptions instead of checking
- 🚫 Wanting to "just fix it real quick"

**These mean**: Slow down, we're missing the point of Day 1

---

## Success Criteria for Day 1

✅ **Complete inventory**: Every component documented  
✅ **Atomic clarity**: Every component has clear atomic level  
✅ **Gap awareness**: We know what's missing  
✅ **Team alignment**: Both parties understand current state  
✅ **No code written**: We didn't jump ahead  
✅ **Notes captured**: Decisions and insights documented  
✅ **Confidence**: Ready to design on Day 2

---

## Tips for Day 1

### Stay Focused

- One component at a time
- Complete each folder before moving on
- Take breaks every 60-90 minutes
- Don't get sidetracked into fixing

### Be Thorough

- Read every schema file
- Check every implementation
- Note everything, even if seems obvious
- When in doubt, document it

### Ask Questions

- Why is this component structured this way?
- Could this be simpler?
- Is this at the right level?
- What does the content manager experience?
- **NEW**: Does middleware populate pattern match schema? (See [Middleware Patterns](/docs/03-strapi-middleware-populate-patterns))

### Document Everything

- Add comments to inventory
- Note interesting discoveries
- Capture ideas for later
- Write down questions
- **NEW**: Flag components needing middleware updates
- **NEW**: Note any test-driven workflow violations

---

## Common Day 1 Challenges

### Challenge: "This is taking too long"

**Response**: Day 1 is investment. Every minute saves hours later.

### Challenge: "I already know what's wrong"

**Response**: Verify with data. Assumptions cause problems.

### Challenge: "Should we fix this bug we found?" (NEW)

**Response**: Document it. Don't fix during audit. Fixing breaks the audit flow and you'll miss other issues. Create a "bugs found" list to address systematically later with proper testing.

### Challenge: "Can't we just start fixing?"

**Response**: Not yet. We fix from solid foundation.

### Challenge: "Some components are unclear"

**Response**: Perfect! That's what we're discovering.

---

## Energy Management

### Morning Energy: Use for heavy lifting

- Complex component analysis
- Strapi schema reading
- Relationship mapping

### Afternoon Energy: Use for synthesis

- Gap identification
- Pattern recognition
- Priority setting

### Take Breaks When:

- Feeling overwhelmed
- Losing focus
- Getting frustrated
- Need to think

---

## Tomorrow Preparation

**Before leaving Day 1**:

1. Save all work
2. Commit inventory to repo
3. Note Day 2 starting point
4. Clear mind for fresh start

**Tonight**:

1. Don't think about work
2. Rest well
3. Come back fresh
4. Trust the process

---

## You've Got This

Day 1 is about **understanding**, not fixing.

Resist the urge to code.  
Embrace the patience to learn.  
Trust that this foundation will make everything faster.

**Prepare well, or be prepared to fail.**

Today, we prepare well. ✅

---

**Begin when ready. Take your time. Do it right.**

Good luck! 🚀
