# TypeScript Component Patterns

**Last Updated**: November 21, 2025  
**Status**: ✅ STANDARD ESTABLISHED

---

## 🎯 Component Props Interface Standard

### **✅ REQUIRED FOR ALL NEW COMPONENTS**

All components created from **Phase 3 onwards** MUST use separate named interfaces.

### **Standard Pattern**

````tsx
/**
 * Component description
 *
 * Features:
 * - Feature 1
 * - Feature 2
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={123}
 * />
 * ```
 */
export interface ComponentNameProps {
  /** Prop description with purpose */
  prop1: string
  /** Optional prop with default behavior explained */
  prop2?: number
  /** Complex prop with usage notes */
  prop3: SomeType
}

export function ComponentName({
  prop1,
  prop2 = 100,
  prop3,
}: ComponentNameProps) {
  // Implementation
}
````

---

## 📋 Why Separate Named Interfaces?

### **Benefits**

1. ✅ **Reusability** - Interface can be exported and imported elsewhere
2. ✅ **Documentation** - JSDoc on interface shows in IDE IntelliSense
3. ✅ **Refactoring** - Easy to find with type searches (`ComponentNameProps`)
4. ✅ **Testing** - Can import interface in test files for mocking
5. ✅ **Composition** - Can extend/intersect with other interfaces
6. ✅ **Readability** - Clean function signature, props grouped logically
7. ✅ **Consistency** - Standard pattern across entire codebase

### **Problems with Inline Types**

```tsx
// ❌ AVOID THIS PATTERN (Legacy only)
export function ComponentName({
  prop1,
  prop2,
}: {
  prop1: string
  prop2: number
}) {
  // Can't reuse type
  // Can't add JSDoc to individual props
  // Harder to find in codebase
  // Clutters function signature
}
```

---

## 🏗️ Current State & Migration Plan

### **Phase 3+ (Nov 2025 Onwards)**

**NEW STANDARD - Use Separate Interfaces:**

✅ All new molecules (e.g., `BenefitCard`, `WorkflowStep`, etc.)  
✅ All new organisms  
✅ All new atoms  
✅ Any refactored components

**Examples Following Standard:**

- ✅ `GlassmorphismCard` → `GlassmorphismCardProps`
- ✅ `TestimonialCard` → `TestimonialCardProps`
- ✅ `GDPRCheckbox` → `GDPRCheckboxProps`
- ✅ `ReviewCard` → `ReviewCardProps`

---

### **Legacy (Phase 1-2)**

**Existing Strapi\* Wrapper Components:**

⚠️ **Keep as-is** (inline types) - Don't waste time refactoring working code  
⚠️ **Refactor opportunistically** - When touching file for other reasons  
⚠️ **Not a priority** - Focus on atomic architecture first

**Affected Components (~30 files):**

- `StrapiBenefitsSection` - Inline: `{ component }: { readonly component: Data.Component<...> }`
- `StrapiFeatureGridSection` - Inline type
- `StrapiHero` - Inline type
- ...all other `Strapi*` wrapper components

**Reason for Deferral:**

1. ✅ These components already work correctly
2. ✅ Risk/reward not favorable for mass refactor now
3. ✅ Can be automated later with codemod/script
4. ✅ Focus should be on atomic architecture (Phase 3)

---

## 🤖 Future Automation Plan

### **After Phase 3 Complete**

Run automated codemod to convert all inline types to named interfaces:

```typescript
// Codemod pseudocode
function convertInlineToInterface(file) {
  // 1. Find function with inline type
  // 2. Extract inline type
  // 3. Create named interface above function
  // 4. Add JSDoc from function to interface
  // 5. Update function signature to use interface
  // 6. Export interface
}
```

**Benefits of Waiting:**

- ✅ Better understanding of patterns after Phase 3
- ✅ Can handle edge cases properly
- ✅ One-time batch operation (faster than manual)
- ✅ Consistent transformation (no human error)

---

## 📚 Examples

### **✅ CORRECT: Molecule Component**

````tsx
// apps/ui/src/components/page-builder/molecules/BenefitCard/BenefitCard.tsx

/**
 * BenefitCard - Displays a single benefit with icon and description
 *
 * Used in: BenefitsSection, FeatureGridSection
 *
 * @example
 * ```tsx
 * <BenefitCard
 *   icon="CheckCircle"
 *   title="Fast Performance"
 *   description="Lightning-fast load times"
 * />
 * ```
 */
export interface BenefitCardProps {
  /** Icon name from lucide-react */
  icon: string
  /** Benefit title/heading */
  title: string
  /** Benefit description */
  description: string
  /** Optional custom className */
  className?: string
}

export function BenefitCard({
  icon,
  title,
  description,
  className,
}: BenefitCardProps) {
  return (
    <div className={cn("benefit-card", className)}>{/* Implementation */}</div>
  )
}
````

---

### **✅ CORRECT: Shared Organism**

````tsx
// apps/ui/src/components/page-builder/shared/SectionHeader.tsx

/**
 * SectionHeader - Reusable section header organism
 *
 * Displays heading with optional accent, description, and text styling.
 * Used across all sections following atomic architecture.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   heading="Our Features"
 *   headingAccent="Powerful"
 *   description="Everything you need to succeed"
 *   textStyle={textStyleData}
 * />
 * ```
 */
export interface SectionHeaderProps {
  /** Main heading text */
  heading?: string
  /** Accented part of heading (appears first) */
  headingAccent?: string
  /** Section description */
  description?: string
  /** Text styling configuration */
  textStyle?: Data.Component<"atoms.text-style">
  /** Alignment: left, center, right */
  alignment?: "left" | "center" | "right"
  /** Show decorative divider */
  showDivider?: boolean
}

export function SectionHeader({
  heading,
  headingAccent,
  description,
  textStyle,
  alignment = "center",
  showDivider = false,
}: SectionHeaderProps) {
  // Implementation
}
````

---

### **⚠️ ACCEPTABLE (LEGACY): Strapi Wrapper**

```tsx
// apps/ui/src/components/page-builder/components/sections/StrapiBenefitsSection.tsx

/**
 * StrapiBenefitsSection - Wrapper for benefits section from Strapi
 *
 * Legacy inline type - will be refactored to named interface later
 *
 * @todo Convert to separate BenefitsSectionProps interface (post-Phase 3)
 */
export function StrapiBenefitsSection({
  component,
}: {
  readonly component: Data.Component<"sections.benefits-section">
}) {
  // Implementation
}
```

---

## 🎓 Learning & Decision History

### **Why This Standard?**

**November 21, 2025 Decision:**

- During Phase 3 folder restructure (elements → molecules)
- Analyzed existing codebase patterns
- Found inconsistency between new molecules and legacy Strapi\* components
- Decided to establish clear standard going forward
- Chose pragmatic approach: improve new code, defer legacy cleanup

**Key Insight:**

> "Don't waste time refactoring working code when we have atomic architecture to build. Lock in best practices for new work, automate legacy cleanup later when we have better understanding."

---

## ✅ Checklist for New Components

Before committing a new component:

- [ ] Component has separate named interface
- [ ] Interface is exported
- [ ] Interface has JSDoc comment
- [ ] Each prop has inline JSDoc description
- [ ] Function signature uses the interface
- [ ] Example usage in JSDoc
- [ ] Follows naming pattern: `ComponentName` + `Props`

---

## 🔗 Related Documentation

- [Component Development Guide](./development-guide.md)
- [Atomic Design Architecture](../02-architecture/atomic-design/)
- [Workflow for Component Creation](./workflow.md)

---

**Standard Locked In ✅**  
**Automated Cleanup:** Post-Phase 3  
**Decision Date:** November 21, 2025
