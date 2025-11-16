# 📦 Content Modeling Documentation

> **Category:** Content Architecture  
> **Last Updated:** November 16, 2025  
> **Purpose:** Complete guide to Strapi content modeling for atomic component architecture

---

## 🎯 Overview

This section provides comprehensive documentation on content modeling in Strapi, specifically designed to support an atomic design component architecture. Based on production-proven patterns and best practices from real-world implementations.

**What You'll Learn:**

- How to structure content types for maximum reusability
- When to use collections vs components vs dynamic zones
- Relationship patterns and best practices
- Common pitfalls and how to avoid them
- Content modeling for page builder functionality

---

## 📚 Documentation Files

### Getting Started

**[00-CONTENT-MODELING-GUIDE.md](./00-CONTENT-MODELING-GUIDE.md)** 🌟  
Complete blueprint for content modeling with diagrams, examples, and decision trees.  
👉 **Start here if you're new to Strapi content modeling**

### Core Concepts

**[01-COLLECTION-TYPES.md](./01-COLLECTION-TYPES.md)**  
All 11 collection types for the company website model with field definitions and use cases.

**[02-COMPONENTS.md](./02-COMPONENTS.md)**  
Reusable component architecture - Address, SEO, Header, Footer, Link components.

**[03-DYNAMIC-ZONES.md](./03-DYNAMIC-ZONES.md)**  
Page builder functionality with HeroSection, Testimonial, and FAQBlock components.

**[04-RELATIONS.md](./04-RELATIONS.md)**  
Complete guide to relationships between content types and components.

**[05-BEST-PRACTICES.md](./05-BEST-PRACTICES.md)**  
Dos, don'ts, pitfalls to avoid, and optimization strategies.

---

## 🗺️ Content Model Architecture

### Complete Content Model Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     COLLECTION TYPES                         │
│  (Many instances, independently queryable)                   │
├─────────────────────────────────────────────────────────────┤
│ • User          • Blog           • Page                      │
│ • Country       • Category       • FAQ                       │
│ • State         • Tag            • FAQ-Category              │
│ • Team-Member   • Feature                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      COMPONENTS                              │
│  (Reusable blocks, embedded in other types)                 │
├─────────────────────────────────────────────────────────────┤
│ Shared Category:                                             │
│  📍 Address    🌐 Link                                       │
│                                                              │
│ Global Category:                                             │
│  🔍 SEO    📄 Header    📄 Footer                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DYNAMIC ZONES                             │
│  (Flexible page builder components)                         │
├─────────────────────────────────────────────────────────────┤
│  🖼️ HeroSection    💬 Testimonial    ❓ FAQBlock           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SINGLE TYPES                             │
│  (One instance only, global settings)                       │
├─────────────────────────────────────────────────────────────┤
│  ⚙️ GlobalSettings                                          │
└─────────────────────────────────────────────────────────────┘
```

### Relationship Matrix

| From Type    | Field    | To Type      | Relation Type | Purpose                |
| ------------ | -------- | ------------ | ------------- | ---------------------- |
| Blog         | author   | User         | ManyToOne     | Author attribution     |
| Blog         | category | Category     | ManyToOne     | Content categorization |
| Blog         | tags     | Tag          | ManyToMany    | Flexible tagging       |
| FAQ          | category | FAQ-Category | ManyToOne     | FAQ organization       |
| Page         | features | Feature      | ManyWay       | Feature highlights     |
| Address (C)  | state    | State        | OneWay        | Address validation     |
| Address (C)  | country  | Country      | OneWay        | Address validation     |
| FAQBlock (C) | faqs     | FAQ          | ManyWay       | Display FAQ list       |

_(C) = Component_

---

## 🎨 Atomic Design Mapping

### How Content Types Map to Atomic Levels

```
ATOMIC LEVEL    │ STRAPI TYPE              │ EXAMPLES
────────────────┼──────────────────────────┼─────────────────────
ATOMS           │ Basic Components         │ Link, Image, Button
                │ Field Types              │ Text, Number, Media
────────────────┼──────────────────────────┼─────────────────────
MOLECULES       │ Composed Components      │ Address, SEO, Navigation
                │ Simple Relations         │ state → State
────────────────┼──────────────────────────┼─────────────────────
ORGANISMS       │ Dynamic Zone Components  │ HeroSection, Testimonial
                │ Collection Types         │ Blog, Team-Member
────────────────┼──────────────────────────┼─────────────────────
TEMPLATES       │ Dynamic Zones            │ sections[], dynamic_zone[]
                │ Single Type Structure    │ GlobalSettings
────────────────┼──────────────────────────┼─────────────────────
PAGES           │ Page Collection Type     │ Specific page instances
                │ Populated Zones          │ Real content in sections
```

### Content-Driven Component Pattern

```tsx
// Strapi provides content → React components render it
┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Strapi     │      │  Next.js    │      │   Browser    │
│  Content     │─────▶│  Component  │─────▶│   Rendered   │
│    Type      │ JSON │    Tree     │ HTML │     Page     │
└──────────────┘      └─────────────┘      └──────────────┘

Example Flow:
Page (Collection)
  └─ sections (Dynamic Zone)
      ├─ HeroSection (Component) → <HeroSection data={...} />
      ├─ Testimonial (Component) → <Testimonial data={...} />
      └─ FAQBlock (Component)    → <FAQBlock data={...} />
```

---

## 🚀 Quick Reference

### When to Use Each Type

**Use Collection Type When:**

- ✅ You need multiple entries (Blog, Pages, FAQs)
- ✅ Content will be queried independently
- ✅ You need filtering, sorting, pagination
- ✅ Content is independently manageable

**Use Component When:**

- ✅ Structure repeats across types (Address, SEO)
- ✅ Content is contextually unique
- ✅ You won't query it independently
- ✅ Ensures consistency (Link structure)

**Use Dynamic Zone When:**

- ✅ Editors need flexible page building
- ✅ Section order matters
- ✅ Sections are optional
- ✅ Content blocks are reusable

**Use Single Type When:**

- ✅ Only one instance needed (GlobalSettings)
- ✅ Site-wide configuration
- ✅ Prevent duplicate entries
- ✅ Global defaults

**Use Relation When:**

- ✅ Data appears in multiple places
- ✅ You need to query connections
- ✅ Content is independently managed
- ✅ Prevents data duplication

---

## 🎓 Learning Path

### For Beginners

1. Read [00-CONTENT-MODELING-GUIDE.md](./00-CONTENT-MODELING-GUIDE.md) (20 min)
2. Review [Collection Types](./01-COLLECTION-TYPES.md) (15 min)
3. Understand [Components](./02-COMPONENTS.md) (10 min)
4. Study [Best Practices](./05-BEST-PRACTICES.md) (15 min)

### For Intermediate Users

1. Review [Dynamic Zones](./03-DYNAMIC-ZONES.md) (15 min)
2. Study [Relations](./04-RELATIONS.md) (20 min)
3. Implement a sample content type (30 min)
4. Practice with [Best Practices](./05-BEST-PRACTICES.md) patterns

### For Advanced Users

1. Optimize existing models with [Best Practices](./05-BEST-PRACTICES.md)
2. Design complex relations from [Relations guide](./04-RELATIONS.md)
3. Create custom dynamic zones
4. Review performance implications

---

## 🛠️ Implementation Checklist

### Phase 1: Setup (Week 1)

- [ ] Create all Collection Types
- [ ] Create all Components (Shared + Global)
- [ ] Create Dynamic Zone Components
- [ ] Create Single Type (GlobalSettings)

### Phase 2: Relations (Week 1-2)

- [ ] Add Collection Type relations
- [ ] Add Component relations
- [ ] Test relation queries
- [ ] Verify cascade delete behavior

### Phase 3: Dynamic Zones (Week 2)

- [ ] Add sections[] to Page
- [ ] Add dynamic_zone[] to Blog
- [ ] Test component ordering
- [ ] Verify editor experience

### Phase 4: Testing & Refinement (Week 2-3)

- [ ] Populate sample content
- [ ] Test all queries
- [ ] Verify frontend integration
- [ ] Optimize based on performance

---

## ⚠️ Common Pitfalls

### Anti-Pattern #1: Over-Componentization

```typescript
// ❌ BAD: Making everything a component
ButtonConfig (Component)
  - text, variant, size, color, hoverEffect, ...

// ✅ GOOD: Use fields when simple
HeroSection (Component)
  - ctaText: string
  - ctaVariant: 'primary' | 'secondary'
```

### Anti-Pattern #2: Deep Nesting

```typescript
// ❌ BAD: Too many levels (4+)
Page → sections → HeroSection → cta → link

// ✅ GOOD: Flatten (2-3 levels max)
Page → sections → HeroSection (with direct cta fields)
```

### Anti-Pattern #3: Collection Type for Single-Use Data

```typescript
// ❌ BAD: Allows multiple entries
SiteSettings (Collection Type)

// ✅ GOOD: Enforces single entry
GlobalSettings (Single Type)
```

**See [05-BEST-PRACTICES.md](./05-BEST-PRACTICES.md) for complete list**

---

## 🔗 Related Documentation

- [Strapi Integration](../strapi-integration/README.md) - API consumption patterns
- [Atomic Architecture](../atomic-architecture/README.md) - Component design system
- [Performance Optimization](../performance-optimization/README.md) - Query optimization

---

## 📊 Success Metrics

**Well-Designed Content Model Indicators:**

- ✅ Editors can create content without developer help
- ✅ No duplicate content entries
- ✅ Queries are fast (<100ms for simple, <500ms for complex)
- ✅ Frontend components map cleanly to content types
- ✅ Adding new page types is straightforward
- ✅ Content is reusable across channels

---

## 🆘 Getting Help

**Found an issue?**

- Check [Best Practices](./05-BEST-PRACTICES.md) first
- Search Strapi docs: https://docs.strapi.io/
- Ask in Strapi Discord: https://discord.strapi.io/

**Need examples?**

- Review [Collection Types](./01-COLLECTION-TYPES.md) for real schemas
- Check GitHub repo for implementation
- See Strapi examples: https://github.com/strapi/strapi-examples

---

**Next:** Start with [📖 Content Modeling Guide](./00-CONTENT-MODELING-GUIDE.md)
