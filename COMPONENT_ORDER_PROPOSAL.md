# Component Order Proposal

## Current Order in Strapi Admin

When editing a section (e.g., Testimonials, Newsletter CTA), content managers see:

```
┌─────────────────────────────────────┐
│ 📛 Badge                            │
│   ├─ Label                          │
│   ├─ Icon                           │
│   └─ Show Badge (toggle)            │
├─────────────────────────────────────┤
│ 📝 Header                           │
│   ├─ Heading                        │
│   ├─ Heading Accent                 │
│   ├─ Description                    │
│   ├─ Text Style                     │
│   ├─ Alignment                      │
│   └─ Show Divider                   │
├─────────────────────────────────────┤
│ 🎨 Background                       │  ← Controls container styling
│   ├─ Background Style               │
│   ├─ Container Style (bordered)     │
│   ├─ Container Width (narrow/wide)  │
│   ├─ Padding (compact/spacious)     │  ← Controls ALL section gaps
│   └─ Gradient                       │
├─────────────────────────────────────┤
│ 📦 Component-Specific Fields        │
│   ├─ Testimonials (repeatable)      │
│   ├─ Layout (grid/marquee)          │
│   ├─ Columns (2/3/4)                │
│   └─ Show Ratings/Images            │
└─────────────────────────────────────┘
```

**Problem:** Background is buried at the bottom, but it controls the most fundamental styling (container, padding, gaps)

---

## Proposed Order - "Style First, Content Second"

```
┌─────────────────────────────────────┐
│ 🎨 Section Background               │  ← MOVED TO TOP
│   ├─ Background Style               │
│   ├─ Container Style (bordered)     │
│   ├─ Container Width (narrow/wide)  │
│   ├─ Padding (compact/spacious)     │  ← Sets section vertical spacing
│   └─ Gradient                       │
├─────────────────────────────────────┤
│ 📛 Badge                            │
│   ├─ Label                          │
│   ├─ Icon                           │
│   └─ Show Badge (toggle)            │
├─────────────────────────────────────┤
│ 📝 Header                           │
│   ├─ Heading                        │
│   ├─ Heading Accent                 │
│   ├─ Description                    │
│   ├─ Text Style                     │
│   ├─ Alignment                      │
│   └─ Show Divider                   │
├─────────────────────────────────────┤
│ 📦 Component-Specific Fields        │
│   ├─ Testimonials (repeatable)      │
│   ├─ Layout (grid/marquee)          │
│   ├─ Columns (2/3/4)                │
│   └─ Show Ratings/Images            │
└─────────────────────────────────────┘
```

---

## Benefits

### 1. **Logical Flow - Container → Decoration → Content**

Content managers think:

1. **First:** "How should this section be styled/contained?" (Background)
2. **Then:** "What optional decorations?" (Badge, Header)
3. **Finally:** "What's the actual content?" (Testimonials, Forms, etc)

### 2. **Clear Hierarchy**

```
🎨 Background           ← Controls CONTAINER
   ├─ padding           → Controls ALL vertical gaps (Badge→Header→Content)
   ├─ containerWidth    → Controls horizontal containment
   └─ containerStyle    → Bordered or default

📛 Badge                ← Optional DECORATION

📝 Header               ← Optional CONTENT HEADER

📦 Content              ← Core CONTENT
```

### 3. **Reduces Confusion**

**Current problem:**

- Content manager adjusts Badge, Header, Content
- Scrolls to bottom
- Finds Background with `padding` setting
- **"Wait, this controls spacing? Why is it at the bottom?"**

**With new order:**

- **Section Background at top** = "This is where I control the container and spacing"
- Sets padding: compact/default/spacious
- Badge/Header/Content inherit that spacing architecture

### 4. **Matches Mental Model**

Like designing a poster:

1. **Pick your canvas/frame** (Background - container width, style, padding)
2. **Add decorative elements** (Badge - optional flair)
3. **Add the title** (Header - optional heading/description)
4. **Fill with content** (Component fields - the main payload)

---

## Implementation Impact

### Schema Changes Required

All section schemas (e.g., `testimonials-section.json`) have this attribute order:

```json
{
  "attributes": {
    "badge": { ... },           // Current position 1
    "header": { ... },          // Current position 2
    "background": { ... },      // Current position 3
    "testimonials": { ... }     // Current position 4
  }
}
```

**Proposed:**

```json
{
  "attributes": {
    "background": { ... },      // NEW position 1 ← MOVED UP
    "badge": { ... },           // NEW position 2
    "header": { ... },          // NEW position 3
    "testimonials": { ... }     // NEW position 4 (unchanged)
  }
}
```

### Affected Files

Would need to reorder in these schemas:

- `sections/testimonials-section.json`
- `sections/newsletter-cta-section.json`
- `sections/feature-grid-section.json`
- `sections/benefits-section.json`
- `sections/metrics-section.json`
- (All other sections with background component)

**NOTE:** Frontend code doesn't care about order - only Strapi Admin UI is affected

---

## Consistency Across Sections

After this change, **ALL sections** would follow the same pattern:

```
1. Section Background (container styling)
2. Badge (optional decoration)
3. Header (optional content heading)
4. Component-specific fields
```

Even if future sections have different content types (videos, charts, maps), the first 3 are always the same → **Predictable for content managers**

---

## Decision Points

### Option A: Implement Now

- Reorder all section schemas
- Export Config Sync
- Benefits: Cleaner, more logical for content managers
- Downside: Schema changes across ~10-15 files

### Option B: Implement After Testing

- Test Marquee layout first
- Commit current working state
- Then do schema reordering as separate PR
- Benefits: Safer, iterative
- Downside: Content managers still see Background at bottom during testing

### Option C: Don't Change

- Keep current order
- Document that Background controls spacing
- Benefits: No schema changes needed
- Downside: Less intuitive for content managers

---

## Recommendation

**Option B: Implement After Testing**

Rationale:

1. Current spacing architecture is working perfectly ✅
2. Marquee testing is priority ✅
3. Schema reordering is **cosmetic** (doesn't affect functionality)
4. Better to commit working code, then refine UX in separate commit

**Workflow:**

1. Test Marquee layout (now)
2. Commit & push working code (testimonials complete)
3. New PR: Reorder schemas for better UX
4. Export Config Sync with new order
5. Document in COMPONENT_DEVELOPMENT_GUIDE.md

---

## Visual Summary

```
┌──────────────────────────────────────────────────────────────┐
│                    MENTAL MODEL                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   "Style the container first, then fill with content"       │
│                                                              │
│   🎨 Background  →  Sets the stage (container/spacing)      │
│   📛 Badge       →  Optional decoration                     │
│   📝 Header      →  Optional title/description              │
│   📦 Content     →  The actual payload                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Current order fights this mental model by putting Background at position 3**

**Proposed order embraces it by putting Background at position 1**
