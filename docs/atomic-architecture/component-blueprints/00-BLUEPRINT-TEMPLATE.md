# Component Blueprint Template

**Purpose**: Systematic analysis of complex components BEFORE implementation

---

## What is a Component Blueprint?

A blueprint is a **pre-implementation analysis** that breaks down a complex component into its atomic parts, maps data structure, and validates the approach before writing any code.

**Use this for**:

- Complex sections (hero with carousel, parallax effects, etc.)
- New component types from external sources (shadcn, v0, etc.)
- Bringing existing components into atomic structure
- Any component that makes you think "hmm, how should this be structured?"

---

## Blueprint Process

```
1. ANALYZE     → Break down visual/functional requirements
2. MAP         → Assign atomic levels to each part
3. STRUCTURE   → Design Strapi schema
4. VALIDATE    → Review for reusability and clarity
5. REFINE      → Adjust before implementation
6. DOCUMENT    → Capture decisions and approach
```

---

## Blueprint Template

### Component Name: [NAME]

**Source**: [Where did this come from? v0, shadcn, custom, client site, etc.]  
**Complexity**: [Low / Medium / High / Very High]  
**Priority**: [Low / Medium / High / Critical]

---

### 1. VISUAL & FUNCTIONAL REQUIREMENTS

#### What does it do?

[Describe the component's purpose and behavior]

#### Visual Elements

List every visible element:

- [ ] Element 1
- [ ] Element 2
- [ ] etc.

#### Interactive Elements

List all interactions:

- [ ] Interaction 1 (what happens)
- [ ] Interaction 2 (what happens)
- [ ] etc.

#### Animation/Effects

List all animations:

- [ ] Animation 1 (parallax, fade, etc.)
- [ ] Animation 2
- [ ] etc.

#### Content Manager Needs

What should content managers control?

- [ ] Editable field 1
- [ ] Editable field 2
- [ ] etc.

---

### 2. ATOMIC BREAKDOWN

Break component into atomic levels:

#### ATOMS (Smallest units)

| Element | Type | Reusable? | Exists? | Create? |
| ------- | ---- | --------- | ------- | ------- |
| Button  | atom | YES       | YES     | NO      |
| ...     | ...  | ...       | ...     | ...     |

#### MOLECULES (Simple combos)

| Element     | Composed Of   | Reusable? | Exists? | Create? |
| ----------- | ------------- | --------- | ------- | ------- |
| Icon Button | Icon + Button | YES       | YES     | NO      |
| ...         | ...           | ...       | ...     | ...     |

#### ORGANISMS (Complex groups)

| Element            | Composed Of                    | Reusable? | Exists? | Create? |
| ------------------ | ------------------------------ | --------- | ------- | ------- |
| Carousel Container | Images + Indicators + Controls | YES       | NO      | YES     |
| ...                | ...                            | ...       | ...     | ...     |

#### SECTION (Final composition)

| Element               | Composed Of                  | Specific to this section? |
| --------------------- | ---------------------------- | ------------------------- |
| Hero Carousel Section | Carousel + Overlay + Content | YES                       |

---

### 3. STRAPI SCHEMA DESIGN

#### NEW ATOMS

```json
// List any new atoms needed
{
  "name": "atom-name",
  "path": "components/atoms/atom-name.json",
  "attributes": {
    // Schema here
  }
}
```

#### NEW MOLECULES

```json
// List any new molecules needed
```

#### NEW ORGANISMS

```json
// List any new organisms needed
```

#### SECTION SCHEMA

```json
// Final section schema
{
  "collectionName": "components_sections_[name]",
  "attributes": {
    // Compose organisms here
  }
}
```

---

### 4. DATA FLOW DIAGRAM

```
Content Manager Input
  ↓
Strapi Component
  ↓
Generated Types
  ↓
Next.js Section Component
  ↓
  ├─ Organism 1
  │   ├─ Molecule 1
  │   │   ├─ Atom 1
  │   │   └─ Atom 2
  │   └─ Molecule 2
  └─ Organism 2
      └─ Atoms
```

---

### 5. REUSABILITY ANALYSIS

#### Components That Are Reusable

| Component | Can Be Used In              | Notes                     |
| --------- | --------------------------- | ------------------------- |
| Carousel  | Hero, Testimonials, Gallery | Generic carousel organism |
| ...       | ...                         | ...                       |

#### Components That Are Section-Specific

| Component    | Why Specific?          | Alternative?                    |
| ------------ | ---------------------- | ------------------------------- |
| Hero Overlay | Unique to hero styling | Could be genericized with props |
| ...          | ...                    | ...                             |

---

### 6. ALTERNATIVE APPROACHES

#### Option A: [Approach Name]

**Structure**: [How it's structured]  
**Pros**: [Advantages]  
**Cons**: [Disadvantages]  
**Reusability**: [High / Medium / Low]

#### Option B: [Another Approach]

**Structure**: [How it's structured]  
**Pros**: [Advantages]  
**Cons**: [Disadvantages]  
**Reusability**: [High / Medium / Low]

#### CHOSEN APPROACH: [Which one and why]

---

### 7. IMPLEMENTATION CHECKLIST

#### Phase 1: Atoms

- [ ] Atom 1: [name]
- [ ] Atom 2: [name]
- [ ] Test atoms independently

#### Phase 2: Molecules

- [ ] Molecule 1: [name]
- [ ] Molecule 2: [name]
- [ ] Test molecules independently

#### Phase 3: Organisms

- [ ] Organism 1: [name]
- [ ] Organism 2: [name]
- [ ] Test organisms independently

#### Phase 4: Section

- [ ] Section schema created
- [ ] Section component created
- [ ] Full integration test
- [ ] Content manager test
- [ ] Documentation updated

---

### 8. DECISIONS & RATIONALE

| Decision                | Options Considered    | Chosen   | Why      |
| ----------------------- | --------------------- | -------- | -------- |
| Carousel implementation | Custom, Embla, Swiper | [Choice] | [Reason] |
| ...                     | ...                   | ...      | ...      |

---

### 9. OPEN QUESTIONS

- [ ] Question 1: [What needs answering?]
- [ ] Question 2: [What needs answering?]

---

### 10. REVIEW CHECKLIST

Before implementing, verify:

- [ ] Every element assigned to atomic level
- [ ] No duplication of existing components
- [ ] Strapi schema designed and reviewed
- [ ] Reusability maximized
- [ ] Content manager experience considered
- [ ] Data flow clear
- [ ] Implementation order defined
- [ ] Alternatives considered
- [ ] Decisions documented
- [ ] Team reviewed and approved

---

## How to Use This Template

1. **Copy this template** to `component-blueprints/[component-name]-blueprint.md`
2. **Fill out sections** systematically (don't skip any)
3. **Review with team** before implementation
4. **Refine** based on feedback
5. **Approve** and proceed to implementation
6. **Reference** during implementation
7. **Update** with actual implementation notes

---

## Blueprint Benefits

✅ **Clarity**: Know exactly what you're building before coding  
✅ **Reusability**: Identify shared components early  
✅ **Quality**: Catch architectural issues before implementation  
✅ **Speed**: Less refactoring later  
✅ **Documentation**: Built-in component docs  
✅ **Alignment**: Team agrees on approach upfront

---

## Example: See Clogzilla Hero Blueprint

Check `component-blueprints/clogzilla-hero-carousel-blueprint.md` for a complete example of this template in action.

---

_"Measure twice, cut once."_  
— Carpenter's wisdom
