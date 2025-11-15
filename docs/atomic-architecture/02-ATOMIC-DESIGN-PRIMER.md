# Atomic Design: A Comprehensive Primer

**Purpose**: Deep understanding of Atomic Design methodology for our Strapi + Next.js architecture

---

## What is Atomic Design?

Atomic Design is a methodology for creating design systems with five distinct levels:

```
ATOMS → MOLECULES → ORGANISMS → TEMPLATES → PAGES
```

Created by Brad Frost, it borrows from chemistry: just as atoms combine to form molecules, which combine to form organisms, UI elements combine to form increasingly complex components.

---

## The Five Levels Explained

### Level 1: ATOMS

**Definition**: The smallest, indivisible UI elements

**Characteristics**:

- Cannot be broken down further
- Highly reusable
- No business logic
- Presentation only
- Minimal dependencies

**Examples**:

- Button
- Input field
- Label
- Icon
- Text (heading, paragraph)
- Image
- Link
- Divider
- Badge
- Checkbox

**In Our Strapi Context**:

```
components/atoms/
  ├── text-style.json       // Gradient/two-tone text styling
  ├── button-variant.json   // Button style options (future)
  ├── icon.json            // Icon selection (future)
  └── divider.json         // Decorative divider (future)
```

**Frontend Example**:

```tsx
// Atom: Button
export function Button({ children, variant, size, ...props }) {
  const variantClass = getVariantClass(variant)
  const sizeClass = getSizeClass(size)

  return (
    <button className={cn(variantClass, sizeClass)} {...props}>
      {children}
    </button>
  )
}
```

**Key Point**: Atoms are **generic and reusable**. A Button doesn't know about newsletters or heroes - it's just a button.

---

### Level 2: MOLECULES

**Definition**: Simple combinations of atoms working together as a unit

**Characteristics**:

- Compose 2-5 atoms
- Single responsibility
- Reusable across contexts
- Minimal business logic
- Clear purpose

**Examples**:

- Form field (label + input + error message)
- Icon button (icon + button)
- Benefit card (icon + title + description)
- List item (icon + text)
- Search bar (input + button)
- Newsletter input (input + submit button)

**In Our Strapi Context**:

```
components/elements/  // or components/molecules/
  ├── icon-button.json      // Icon + Button + Link
  ├── list-item.json        // Icon + Title + Description
  ├── benefit-card.json     // Icon + Title + Description + Styling
  └── form-field.json       // Label + Input + Helper Text (future)
```

**Frontend Example**:

```tsx
// Molecule: IconButton
export function IconButton({ icon, label, href, variant }) {
  return (
    <Button variant={variant} asChild>
      <Link href={href}>
        <Icon name={icon} />
        {label}
      </Link>
    </Button>
  )
}
```

**Key Point**: Molecules are **simple compositions with clear purpose**. They combine atoms but don't know about page context.

---

### Level 3: ORGANISMS

**Definition**: Complex, reusable sections composed of molecules and/or atoms

**Characteristics**:

- Compose multiple molecules/atoms
- Significant business logic
- Reusable across pages/sections
- Complete, self-contained functionality
- May manage local state

**Examples**:

- Section header (badge + heading + description + styling options)
- Navigation menu
- Newsletter form (heading + input + checkbox + buttons)
- Benefits grid (multiple benefit cards + layout)
- Footer content group
- Search functionality
- User profile widget

**In Our Strapi Context**:

```
components/shared/  // or components/organisms/
  ├── section-header.json      // Badge + Heading + Description + Options
  ├── section-badge.json       // Badge display with options
  ├── section-background.json  // Background/container styling
  └── newsletter-form.json     // Complete form organism (future)
```

**Frontend Example**:

```tsx
// Organism: SectionHeader
export function SectionHeader({ header }) {
  const { heading, description, headingSize, spacing, alignment } = header

  return (
    <div className={cn(getSpacing(spacing), getAlignment(alignment))}>
      <SectionBadge badge={header.badge} />
      <Heading size={headingSize}>{heading}</Heading>
      {description && <Description>{description}</Description>}
    </div>
  )
}
```

**Key Point**: Organisms are **reusable across contexts**. A SectionHeader works in Hero, Newsletter, Features, etc.

---

### Level 4: TEMPLATES

**Definition**: Page-level layouts that show content structure without real data

**Characteristics**:

- Define page layout
- Show component relationships
- Use placeholder content
- No real data
- Focus on structure

**Examples**:

- Blog post template
- Product page template
- Landing page template
- Dashboard template

**In Our Context**:
We don't typically define templates in Strapi. Instead, Next.js page layouts serve this purpose.

**Frontend Example**:

```tsx
// Template: Article Layout
export function ArticleTemplate({ header, content, sidebar }) {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-8">
      <main>
        <SectionHeader header={header} />
        <ArticleContent content={content} />
      </main>
      <aside>
        <Sidebar widgets={sidebar} />
      </aside>
    </div>
  )
}
```

---

### Level 5: PAGES

**Definition**: Complete page instances with real content

**Characteristics**:

- Use templates
- Populated with real data
- Represent actual user experience
- Built from CMS data
- Full functionality

**In Our Context**:
Strapi sections + Next.js pages combine to create full pages.

**Frontend Example**:

```tsx
// Page: Blog Post
export async function BlogPost({ slug }) {
  const data = await getPostData(slug)

  return (
    <ArticleTemplate
      header={data.header}
      content={data.content}
      sidebar={data.sidebar}
    />
  )
}
```

---

## Atomic Design in Strapi + Next.js

### Strapi Structure

```
apps/strapi/src/components/
├── atoms/               # Smallest units (text-style, icons)
│   └── text-style.json
│
├── molecules/          # Simple combinations
│   ├── icon-button.json
│   └── list-item.json
│
├── organisms/          # Complex, reusable sections
│   ├── section-header.json
│   ├── section-badge.json
│   └── newsletter-form.json  // Future
│
└── sections/           # Page sections (compose organisms)
    ├── hero-section.json
    ├── newsletter-cta-section.json
    └── features-section.json
```

### Next.js Structure

```
apps/ui/src/components/page-builder/
├── atoms/               # Smallest UI elements
│   ├── TextStyle.tsx
│   └── Button.tsx       // Future
│
├── molecules/          # Simple compositions
│   ├── IconButton.tsx
│   └── BenefitCard.tsx  // Future
│
├── organisms/          # or 'shared/' - Complex, reusable
│   ├── SectionHeader.tsx
│   ├── SectionBadge.tsx
│   └── NewsletterForm.tsx  // Future
│
└── sections/           # Page sections
    ├── StrapiHeroSection.tsx
    └── StrapiNewsletterCTASection.tsx
```

---

## Benefits of Atomic Design

### 1. **Consistency**

- Same atoms used everywhere
- Predictable behavior
- Unified design language

### 2. **Reusability**

- Build once, use many times
- Less duplicate code
- Faster development over time

### 3. **Maintainability**

- Changes in one place affect all instances
- Easy to update styling
- Clear component hierarchy

### 4. **Scalability**

- Adding new sections is composition
- Growing library of proven components
- System gets stronger over time

### 5. **Testing**

- Test atoms independently
- Compose tested pieces
- Higher confidence in complex components

### 6. **Team Collaboration**

- Clear naming and structure
- Easy to understand
- Designers and developers speak same language

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Skipping Levels

```tsx
// BAD: Section creating atoms directly
function NewsletterSection() {
  return (
    <section>
      <button className="...">Subscribe</button> // Inline atom
    </section>
  )
}

// GOOD: Section composing organisms
function NewsletterSection() {
  return (
    <section>
      <NewsletterForm form={data.form} /> // Organism
    </section>
  )
}
```

### ❌ Mistake 2: Atoms Too Complex

```tsx
// BAD: Atom with business logic
function Button({ onClick, variant, fetchData, userId }) {
  useEffect(() => {
    fetchData(userId) // Too much logic for an atom
  }, [userId])

  return <button onClick={onClick}>{label}</button>
}

// GOOD: Pure presentation
function Button({ onClick, variant, children }) {
  return (
    <button className={getVariant(variant)} onClick={onClick}>
      {children}
    </button>
  )
}
```

### ❌ Mistake 3: Organisms Not Reusable

```tsx
// BAD: Organism tied to specific section
function NewsletterHeaderOrganism() {
  return <h2>Subscribe to Newsletter</h2> // Hardcoded
}

// GOOD: Reusable organism
function FormHeader({ heading, description }) {
  return (
    <div>
      <h2>{heading}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
```

### ❌ Mistake 4: Sections Doing Too Much

```tsx
// BAD: Section with custom atoms/molecules
function NewsletterSection() {
  return (
    <section>
      <input type="email" /> // Custom input
      <div>
        {" "}
        // Custom benefit card
        <h3>Benefit 1</h3>
        <p>Description</p>
      </div>
    </section>
  )
}

// GOOD: Section composing organisms
function NewsletterSection({ component }) {
  return (
    <SectionWrapper>
      <SectionHeader header={component.header} />
      <NewsletterForm form={component.form} />
      <BenefitsGrid benefits={component.benefits} />
    </SectionWrapper>
  )
}
```

---

## Decision Tree: What Level?

```
Is it the smallest possible unit?
  YES → ATOM
  NO ↓

Does it combine 2-5 atoms with single purpose?
  YES → MOLECULE
  NO ↓

Is it complex and reusable across contexts?
  YES → ORGANISM
  NO ↓

Does it compose organisms into page section?
  YES → SECTION (or TEMPLATE)
  NO ↓

Is it a complete page with real data?
  YES → PAGE
```

---

## Applying to Newsletter Section

### Current Structure (WRONG)

```
newsletter-cta-section (SECTION)
  ├── Custom heading rendering (should be organism)
  ├── Custom benefit cards (should be molecule)
  ├── Custom GDPR checkbox (should be molecule)
  └── Scattered atoms (should be composed)
```

### Target Structure (RIGHT)

```
newsletter-cta-section (SECTION - composition only)
  ├── SectionBadge (ORGANISM)
  ├── SectionHeader (ORGANISM)
  └── NewsletterForm (ORGANISM)
        ├── FormHeader (MOLECULE)
        ├── EmailInput (MOLECULE)
        ├── SubmitButton (ATOM)
        ├── GDPRCheckbox (MOLECULE)
        └── CTAButtons (MOLECULE array)
  └── BenefitsGrid (ORGANISM)
        └── BenefitCard (MOLECULE array)
```

---

## Next Steps

Now that you understand Atomic Design:

1. Read **03-CURRENT-STATE-ANALYSIS.md** - See where we are
2. Read **04-STRATEGIC-PLAN.md** - See where we're going
3. Begin the audit tomorrow

**Remember**: Every component must clearly fit into one atomic level. If you're unsure, it's probably too complex and needs breaking down.

---

_"Design systems are about creating a shared language between designers and developers."_  
— Brad Frost
