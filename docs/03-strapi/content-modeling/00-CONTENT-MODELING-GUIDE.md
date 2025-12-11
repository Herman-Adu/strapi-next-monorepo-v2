# 📘 Complete Content Modeling Guide

> **Status:** Production-Ready Blueprint  
> **Last Updated:** November 16, 2025  
> **Based On:** 12 comprehensive resources + production case studies  
> **Diagrams:** Included with complete architecture

---

## 🎯 What is Content Modeling?

Content modeling is the process of defining and structuring content so it can be **managed, reused, and delivered consistently** across different platforms.

### The Power of Content Modeling

> "Content modeling is not about how things look. It's about what they mean and how they connect." — Marcelo Lewin, Headless Creator

**Traditional CMS:**  
Content + Presentation are tightly coupled (themes, templates)

**Headless CMS (Strapi):**  
Content structure and intent only. Presentation handled by frontend (Next.js)

---

## 🌟 7 Key Benefits

### 1. Content Reusability

Use the same content across web, mobile, apps, and IoT without duplication.

### 2. Improved Editorial Experience

Editors work with structured, predictable forms instead of fighting chaotic fields.

### 3. Faster Development

Developers stop restructuring messy data. Clean models accelerate builds and iterations.

### 4. Better Collaboration

Aligns developers, editors, and designers around a common content framework.

### 5. Future-Proof

Abstracting content from presentation makes adapting to new platforms easier.

### 6. Scalability

Well-modeled content scales with growing datasets and complexity.

### 7. Reduced Costs

Avoids rework, duplication, and migration issues, saving time and money long-term.

---

## 🏗️ Strapi Content Type System

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  STRAPI CONTENT TYPES                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │  COLLECTION      │        │   SINGLE         │          │
│  │  TYPES           │        │   TYPES          │          │
│  │                  │        │                  │          │
│  │  • Blog Posts    │        │  • Global        │          │
│  │  • Pages         │        │    Settings      │          │
│  │  • Team Members  │        │  • Homepage      │          │
│  │  • FAQs          │        │    Config        │          │
│  │                  │        │                  │          │
│  │  (Multiple       │        │  (Single         │          │
│  │   instances)     │        │   instance)      │          │
│  └──────────────────┘        └──────────────────┘          │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │             COMPONENTS                        │          │
│  │                                               │          │
│  │  Reusable content blocks used in             │          │
│  │  multiple content types:                     │          │
│  │                                               │          │
│  │  • Address    • SEO         • Link           │          │
│  │  • Header     • Footer                       │          │
│  │                                               │          │
│  │  Can be: Single | Repeatable                 │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │           DYNAMIC ZONES                       │          │
│  │                                               │          │
│  │  Flexible fields holding multiple             │          │
│  │  component types in any order:               │          │
│  │                                               │          │
│  │  • HeroSection                                │          │
│  │  • Testimonial                                │          │
│  │  • FAQBlock                                   │          │
│  │                                               │          │
│  │  Perfect for page builders                    │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Complete Company Website Content Model

### Collection Types (11 total)

#### 1. User (Auto-generated)

```typescript
{
  "collectionName": "up_users",
  "attributes": {
    "fullName": { "type": "string" },
    "email": { "type": "email", "required": true, "unique": true },
    "phone": { "type": "string" },
    "address": {
      "type": "component",
      "component": "shared.address",
      "repeatable": false
    },
    "blogs": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::blog.blog",
      "mappedBy": "author"
    }
  }
}
```

**Purpose:** System users + blog authors. Automatically created by Strapi.

#### 2. Blog

```typescript
{
  "collectionName": "blogs",
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title" },
    "body": { "type": "richtext" },
    "banner": { "type": "media", "multiple": false },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "blogs"
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category",
      "inversedBy": "blogs"
    },
    "tags": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::tag.tag",
      "inversedBy": "blogs"
    },
    "seo": {
      "type": "component",
      "component": "global.seo"
    },
    "dynamic_zone": {
      "type": "dynamiczone",
      "components": ["dynamic-zone.faq-block"]
    }
  }
}
```

**Purpose:** Blog posts with author, categories, tags, and optional FAQ sections.

#### 3. Category

```typescript
{
  "collectionName": "categories",
  "attributes": {
    "name": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "name" },
    "blogs": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::blog.blog",
      "mappedBy": "category"
    }
  }
}
```

**Purpose:** Blog categorization (e.g., "Tech", "Culture", "Events").

#### 4. Tag

```typescript
{
  "collectionName": "tags",
  "attributes": {
    "name": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "name" },
    "blogs": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::blog.blog",
      "mappedBy": "tags"
    }
  }
}
```

**Purpose:** Flexible tagging (e.g., "Headless CMS", "Strapi 5", "Content Modeling").

#### 5. Page

```typescript
{
  "collectionName": "pages",
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title" },
    "content": { "type": "richtext" },
    "seo": {
      "type": "component",
      "component": "global.seo"
    },
    "features": {
      "type": "relation",
      "relation": "manyWay",
      "target": "api::feature.feature"
    },
    "sections": {
      "type": "dynamiczone",
      "components": [
        "dynamic-zone.hero-section",
        "dynamic-zone.testimonial",
        "dynamic-zone.faq-block"
      ]
    }
  }
}
```

**Purpose:** Individual website pages (Home, About, Services) with flexible sections.

#### 6-11. Remaining Collection Types

**FAQ:**

```typescript
{ question: string, answer: longtext, category: Relation<FAQ-Category> }
```

**FAQ-Category:**

```typescript
{ name: string, faqs: Relation<FAQ>[] }
```

**Team-Member:**

```typescript
{
  name: string,
  role: string,
  bio: longtext,
  photo: media,
  socialLinks: Component<Link>[]
}
```

**Feature:**

```typescript
{
  title: string,
  description: longtext,
  link: Component<Link>
}
```

**State:**

```typescript
{ name: string, code: string }
```

**Country:**

```typescript
{ name: string, code: string }
```

---

### Components (5 total)

#### Shared Components

**📍 Address**

```typescript
{
  "collectionName": "components_shared_addresses",
  "attributes": {
    "streetNumber": { "type": "integer" },
    "streetName": { "type": "string", "required": true },
    "city": { "type": "string", "required": true },
    "geoLocation": { "type": "json" },
    "state": {
      "type": "relation",
      "relation": "oneWay",
      "target": "api::state.state"
    },
    "country": {
      "type": "relation",
      "relation": "oneWay",
      "target": "api::country.country"
    }
  }
}
```

**Why Component?** Structure repeats (User, Company addresses) but each instance is unique.

**🌐 Link**

```typescript
{
  "collectionName": "components_shared_links",
  "attributes": {
    "label": { "type": "string", "required": true },
    "url": { "type": "string", "required": true },
    "icon": { "type": "media", "multiple": false }
  }
}
```

**Why Component?** Universal link structure used everywhere (nav, footer, CTAs, social).

#### Global Components

**🔍 SEO**

```typescript
{
  "collectionName": "components_global_seos",
  "attributes": {
    "metaTitle": { "type": "string" },
    "metaDescription": { "type": "text" },
    "keywords": { "type": "text" },
    "canonicalUrl": { "type": "string" }
  }
}
```

**Why Component?** Every page/blog needs SEO, but data is unique per entry.

**📄 Header**

```typescript
{
  "collectionName": "components_global_headers",
  "attributes": {
    "logo": { "type": "media", "multiple": false },
    "links": {
      "type": "component",
      "component": "shared.link",
      "repeatable": true
    }
  }
}
```

**Why Component?** Centralized header management. Editors update without code changes.

**📄 Footer**

```typescript
{
  "collectionName": "components_global_footers",
  "attributes": {
    "logo": { "type": "media", "multiple": false },
    "copyright": { "type": "string" },
    "links": {
      "type": "component",
      "component": "shared.link",
      "repeatable": true
    }
  }
}
```

**Why Component?** Same reasoning as Header.

---

### Dynamic Zone Components (3 total)

**🖼️ HeroSection**

```typescript
{
  "collectionName": "components_dynamic_zone_hero_sections",
  "category": "dynamic-zone",
  "attributes": {
    "title": { "type": "string", "required": true },
    "subtitle": { "type": "text" },
    "image": { "type": "media", "multiple": false }
  }
}
```

**Why Dynamic Zone?** Not all pages need a hero. Editors drag-and-drop where needed.

**💬 Testimonial**

```typescript
{
  "collectionName": "components_dynamic_zone_testimonials",
  "category": "dynamic-zone",
  "attributes": {
    "quote": { "type": "text", "required": true },
    "authorName": { "type": "string", "required": true },
    "authorRole": { "type": "string" },
    "authorPhoto": { "type": "media", "multiple": false }
  }
}
```

**Why Dynamic Zone?** Contextual. Might appear on Home, Product, or Success Stories pages.

**❓ FAQBlock**

```typescript
{
  "collectionName": "components_dynamic_zone_faq_blocks",
  "category": "dynamic-zone",
  "attributes": {
    "title": { "type": "string" },
    "faqs": {
      "type": "relation",
      "relation": "manyWay",
      "target": "api::faq.faq"
    }
  }
}
```

**Why Dynamic Zone?** FAQs optional per page. Editors add only where relevant (Pricing, Support).

---

### Single Type (1 total)

**⚙️ GlobalSettings**

```typescript
{
  "singleType": true,
  "collectionName": "global_settings",
  "attributes": {
    "siteName": { "type": "string", "required": true },
    "companyName": { "type": "string", "required": true },
    "taxId": { "type": "string" },
    "logo": { "type": "media", "multiple": false },
    "defaultSEO": {
      "type": "component",
      "component": "global.seo"
    },
    "header": {
      "type": "component",
      "component": "global.header"
    },
    "footer": {
      "type": "component",
      "component": "global.footer"
    },
    "address": {
      "type": "component",
      "component": "shared.address"
    },
    "socialLinks": {
      "type": "component",
      "component": "shared.link",
      "repeatable": true
    }
  }
}
```

**Why Single Type?** Site-wide config. Only one instance needed. Prevents accidental duplicates.

---

## 🔗 Relations Complete Guide

### Relation Types in Strapi

| Type             | Description          | Example            |
| ---------------- | -------------------- | ------------------ |
| **One-way**      | A → B (no inverse)   | Address → State    |
| **One-to-one**   | A ↔ B (both sides)  | User ↔ Profile    |
| **One-to-many**  | A ← B[]              | Category ← Blogs[] |
| **Many-to-one**  | A[] → B              | Blogs[] → Category |
| **Many-to-many** | A[] ↔ B[]           | Blogs[] ↔ Tags[]  |
| **Many-way**     | A → B[] (no inverse) | Page → Features[]  |

### All Relations in Company Website Model

#### Collection Type Relations

```typescript
// Blog Relations
Blog → author (ManyToOne → User)
  // Many blogs belong to one author
Blog → category (ManyToOne → Category)
  // Many blogs belong to one category
Blog → tags (ManyToMany → Tag)
  // Blogs can have many tags, tags can have many blogs

// FAQ Relations
FAQ → category (ManyToOne → FAQ-Category)
  // Many FAQs belong to one category

// Page Relations
Page → features (ManyWay → Feature)
  // Page references many features (no inverse)
```

#### Component Relations

```typescript
// Address Relations
Address → state (OneWay → State)
  // Address references one state (no inverse)
Address → country (OneWay → Country)
  // Address references one country (no inverse)

// FAQBlock Relations
FAQBlock → faqs (ManyWay → FAQ)
  // FAQBlock references many FAQs (no inverse)
```

---

## 🎨 Decision Tree: What Type Should I Use?

### Start Here 👇

```
Do you need MULTIPLE entries?
│
├─ YES → Is content QUERYABLE independently?
│   │
│   ├─ YES → COLLECTION TYPE
│   │        Examples: Blog, Page, Team-Member
│   │
│   └─ NO → Is structure REPEATING?
│       │
│       ├─ YES → COMPONENT (Repeatable)
│       │        Examples: Link[], socialLinks[]
│       │
│       └─ NO → Reconsider design
│
└─ NO → Is it GLOBAL/site-wide?
    │
    ├─ YES → SINGLE TYPE
    │        Examples: GlobalSettings, HomepageConfig
    │
    └─ NO → Is structure REUSABLE?
        │
        ├─ YES → COMPONENT (Single)
        │        Examples: SEO, Address
        │
        └─ NO → Use FIELDS directly
                 Examples: title, description
```

### For Page Builder Sections

```
Do editors need FLEXIBLE ordering?
│
├─ YES → Are sections OPTIONAL?
│   │
│   ├─ YES → DYNAMIC ZONE
│   │        Examples: HeroSection, Testimonial
│   │
│   └─ NO → Fixed sections? Use Components
│
└─ NO → Fixed layout? Use Components
```

---

## ⚠️ Common Pitfalls & Solutions

### Pitfall #1: Over-Componentization

**❌ BAD:**

```typescript
// Making EVERYTHING a component
ButtonConfig (Component) {
  text, variant, size, color, shadow,
  hoverEffect, borderRadius, fontWeight...
}
```

**✅ GOOD:**

```typescript
// Use fields when simple
HeroSection (Component) {
  ctaText: string,
  ctaVariant: 'primary' | 'secondary'
}
```

**Rule:** If it's < 3 fields and not reused elsewhere, use direct fields.

---

### Pitfall #2: Deep Nesting (Performance Killer)

**❌ BAD (4 levels):**

```typescript
Page
  → sections (Dynamic Zone)
    → HeroSection (Component)
      → cta (Component)
        → link (Component) // TOO DEEP!
```

**✅ GOOD (2-3 levels max):**

```typescript
Page
  → sections (Dynamic Zone)
    → HeroSection (Component with direct cta fields)
```

**Rule:** Limit to 2-3 nesting levels. Performance degrades beyond that.

---

### Pitfall #3: Collection Type for Single-Use Data

**❌ BAD:**

```typescript
SiteSettings (Collection Type)
// Editors accidentally create multiple entries
```

**✅ GOOD:**

```typescript
GlobalSettings (Single Type)
// Enforces single instance
```

**Rule:** If you only need ONE, use Single Type.

---

### Pitfall #4: Component Instead of Relation

**❌ BAD:**

```typescript
Blog {
  author: Component<AuthorDetails> {
    name, bio, photo
  }
}
// Duplicates author data per blog!
```

**✅ GOOD:**

```typescript
Blog {
  author: Relation<User>
}
// References existing user, no duplication
```

**Rule:** If content exists independently and is queried separately, use Relation.

---

### Pitfall #5: Not Using Dynamic Zones for Page Builders

**❌ BAD:**

```typescript
Page {
  heroSection: Component<HeroSection>,
  testimonials: Component<Testimonial>[],
  faqSection: Component<FAQBlock>
}
// Fixed structure, no flexibility
```

**✅ GOOD:**

```typescript
Page {
  sections: DynamicZone<HeroSection | Testimonial | FAQBlock>
}
// Editors choose sections and order
```

**Rule:** Use Dynamic Zones when section composition varies per page.

---

## 🚀 Implementation Steps

### Phase 1: Create Collection Types (Day 1)

```bash
# In Strapi Admin Panel: Content-Type Builder

✅ Country (name, code)
✅ State (name, code)
✅ Category (name, slug)
✅ Tag (name, slug)
✅ Blog (title, slug, body, banner)
✅ Page (title, slug, content)
✅ FAQ (question, answer)
✅ FAQ-Category (name)
✅ Team-Member (name, role, bio, photo)
✅ Feature (title, description)
```

### Phase 2: Create Components (Day 1-2)

```bash
# Category: shared/
✅ Address (streetNumber, streetName, city, geoLocation)
✅ Link (label, url, icon)

# Category: global/
✅ SEO (metaTitle, metaDescription, keywords, canonicalUrl)
✅ Header (logo, links[])
✅ Footer (logo, copyright, links[])

# Category: dynamic-zone/
✅ HeroSection (title, subtitle, image)
✅ Testimonial (quote, authorName, authorRole, authorPhoto)
✅ FAQBlock (title, faqs[])
```

### Phase 3: Create Single Type (Day 2)

```bash
✅ GlobalSettings (all global components and fields)
```

### Phase 4: Add Relations (Day 2-3)

```bash
# Collection Type Relations
✅ Blog → author (ManyToOne → User)
✅ Blog → category (ManyToOne → Category)
✅ Blog → tags (ManyToMany → Tag)
✅ FAQ → category (ManyToOne → FAQ-Category)
✅ Page → features (ManyWay → Feature)

# Component Relations
✅ Address → state (OneWay → State)
✅ Address → country (OneWay → Country)
✅ FAQBlock → faqs (ManyWay → FAQ)
```

### Phase 5: Add Dynamic Zones (Day 3)

```bash
# Page collection type
✅ sections[] (HeroSection, Testimonial, FAQBlock)

# Blog collection type
✅ dynamic_zone[] (FAQBlock only)
```

### Phase 6: Add Components to Types (Day 3)

```bash
# Components in Components
✅ Header → links (Component<Link>[])
✅ Footer → links (Component<Link>[])
✅ Feature → link (Component<Link>)

# Components in Single Types
✅ GlobalSettings → header, footer, defaultSEO, address, socialLinks[]

# Components in Collection Types
✅ User → address
✅ Page → seo
✅ Blog → seo
```

---

## 🎯 Best Practices Summary

### ✅ DO

1. **Plan with diagrams** before building in Strapi
2. **Focus on content intent**, not visual design
3. **Use Relations** for independently queryable content
4. **Use Components** for reusable structure without independent queries
5. **Use Dynamic Zones** for flexible page building
6. **Limit nesting** to 2-3 levels maximum
7. **Query selectively** - only populate what you need
8. **Use Single Types** for global, one-off content
9. **Name with intent** - `--color-danger` not `--red-500`
10. **Test with real content** early and often

### ❌ DON'T

1. **Don't make everything a component** - use fields when < 3
2. **Don't nest deeply** (4+ levels)
3. **Don't use Collection Types for single entries**
4. **Don't duplicate data** - use Relations instead
5. **Don't skip SEO components** on content types
6. **Don't query with `populate=*`** - be specific
7. **Don't tie structure to design** - think content, not layout
8. **Don't create Relations without inverse consideration**
9. **Don't forget to categorize components** (shared vs global vs dynamic-zone)
10. **Don't skip performance testing** with populated queries

---

## 📊 Query Optimization Examples

### ❌ BAD Query (Over-fetching)

```typescript
// Fetches EVERYTHING (slow!)
const blogs = await strapi.entityService.findMany("api::blog.blog", {
  populate: "*",
})
```

### ✅ GOOD Query (Selective)

```typescript
// Only fetches what you need
const blogs = await strapi.entityService.findMany("api::blog.blog", {
  fields: ["title", "slug", "createdAt"],
  populate: {
    author: {
      fields: ["fullName"],
    },
    category: {
      fields: ["name", "slug"],
    },
  },
  filters: {
    category: {
      slug: { $eq: "tech" },
    },
  },
  sort: "createdAt:desc",
  pagination: {
    page: 1,
    pageSize: 10,
  },
})
```

---

## 🔗 Next Steps

1. **Implement in Strapi:** Follow Phase 1-6 checklist
2. **Populate Sample Data:** Test all relations and queries
3. **Frontend Integration:** Map to Next.js components ([See Strapi Integration docs](/docs/readme))
4. **Performance Testing:** Monitor query times
5. **Iterate:** Refine based on editor feedback and performance data

---

## 📚 Related Documentation

- [Collection Types Reference](/docs/01-collection-types) - Detailed schemas
- [Components Reference](/docs/02-components) - Component patterns
- [Dynamic Zones Guide](/docs/03-dynamic-zones) - Page builder setup
- [Relations Deep Dive](/docs/04-relations) - Relationship patterns
- [Best Practices](/docs/05-best-practices) - Comprehensive do's and don'ts

---

**🎉 You now have a production-ready content model blueprint!**

Start implementing in Strapi Content-Type Builder or use Strapi AI to accelerate the process.
