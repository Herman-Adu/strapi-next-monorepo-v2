# 🔌 Strapi Integration Documentation

> **Category:** Strapi Integration Patterns  
> **Status:** In Development  
> **Last Updated:** November 16, 2025  
> **Complexity:** Intermediate to Advanced

---

## 📖 Overview

This section covers **everything needed to integrate Strapi with Next.js**, including API consumption patterns, authentication, type generation, webhooks, and security best practices.

### What You'll Learn

- **Environment Setup** - Configuration management across environments
- **API Client Patterns** - Querying, filtering, and population strategies
- **TypeScript Integration** - Auto-generate types from Strapi schema
- **Webhooks** - Real-time updates and cache invalidation
- **Security** - Authentication, authorization, CORS, and API tokens
- **Performance** - Caching strategies and optimization techniques

---

## 🗂️ Documentation Structure

### 📄 [00-INTEGRATION-OVERVIEW.md](./00-INTEGRATION-OVERVIEW.md)

**Quick Reference for composable architecture patterns**

- Architecture diagram (Strapi ↔ Next.js data flow)
- Composable headless CMS pattern
- REST vs GraphQL decision tree
- Integration workflow overview
- Common use cases and patterns

**When to read:** Start here for high-level understanding

---

### 🔧 [01-ENVIRONMENT-SETUP.md](./01-ENVIRONMENT-SETUP.md)

**Configuration management and environment variables**

- `.env` file structure (development, staging, production)
- Environment variable validation patterns
- API URL configuration (local vs cloud)
- Credential management (API tokens, secrets)
- `.gitignore` best practices for monorepos
- Docker environment configuration

**When to read:** Before writing any integration code

---

### 📡 [02-API-CLIENT.md](./02-API-CLIENT.md)

**Complete API consumption guide**

- Creating reusable Strapi API client
- Query patterns (find, findOne, findMany)
- Population strategies (deep, selective, performance-optimized)
- Filtering and sorting
- Pagination (offset vs cursor-based)
- Error handling patterns
- Request/response type safety

**When to read:** When building frontend data fetching

**Example Preview:**

```typescript
// Optimized query with selective population
const blogs = await strapi.find("blogs", {
  filters: { category: { slug: "tech" } },
  populate: {
    author: { fields: ["fullName"] },
    banner: { fields: ["url", "formats"] },
  },
  sort: "createdAt:desc",
  pagination: { page: 1, pageSize: 10 },
})
```

---

### 🔷 [03-TYPE-GENERATION.md](./03-TYPE-GENERATION.md)

**Automatic TypeScript type generation**

- Schema-to-types workflow
- Using `@strapi/sdk` for type inference
- Custom type generation scripts
- Type validation patterns
- Monorepo package organization
- Webhook-triggered regeneration (automation opportunity)

**When to read:** When setting up TypeScript integration

**Automation Opportunity:**  
🤖 Auto-generate types when Strapi schema changes via webhook

---

### 🎣 [04-WEBHOOKS.md](./04-WEBHOOKS.md)

**Real-time updates and cache invalidation**

- Webhook setup in Strapi admin
- Next.js API route handlers for webhooks
- Cache invalidation strategies (revalidatePath, revalidateTag)
- Event-driven architecture patterns
- Secure webhook validation
- Testing webhook flows locally (ngrok, LocalTunnel)

**When to read:** When implementing cache invalidation

**Example Preview:**

```typescript
// Webhook handler for blog updates
export async function POST(request: Request) {
  const event = await request.json()

  if (event.model === "blog" && event.entry.publishedAt) {
    await revalidatePath("/blog")
    await revalidatePath(`/blog/${event.entry.slug}`)
  }

  return Response.json({ revalidated: true })
}
```

---

### 🔒 [05-SECURITY.md](./05-SECURITY.md)

**Authentication, authorization, and secure practices**

- API token types (Read-Only, Full Access, Custom)
- Role-Based Access Control (RBAC) patterns
- CORS configuration for multi-domain deployments
- Rate limiting strategies
- Environment-based security (dev vs prod)
- Secret management (GitHub Secrets, Vercel env vars)
- Public vs private API routes in Next.js

**When to read:** Before deploying to production

---

## 🎯 Quick Start by Use Case

### I want to... 🤔

#### Fetch blog posts with author and category

**Go to:** [02-API-CLIENT.md](./02-API-CLIENT.md) → Query Patterns → Population

```typescript
const blogs = await strapi.find("blogs", {
  populate: {
    author: { fields: ["fullName"] },
    category: { fields: ["name", "slug"] },
  },
})
```

---

#### Set up type-safe API calls

**Go to:** [03-TYPE-GENERATION.md](./03-TYPE-GENERATION.md) → Schema to Types

```typescript
import type { Blog } from "@/types/strapi"

const blog: Blog = await strapi.findOne("blogs", { id: params.id })
```

---

#### Invalidate cache when content changes

**Go to:** [04-WEBHOOKS.md](./04-WEBHOOKS.md) → Cache Invalidation

```typescript
// Strapi webhook → Next.js API route
revalidatePath("/blog")
```

---

#### Configure environment variables

**Go to:** [01-ENVIRONMENT-SETUP.md](./01-ENVIRONMENT-SETUP.md) → Environment Variables

```bash
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_read_only_token
```

---

#### Secure API calls in production

**Go to:** [05-SECURITY.md](./05-SECURITY.md) → API Tokens & CORS

---

## 🏗️ Architecture Overview

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      STRAPI (Headless CMS)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Content Types → REST API → JWT Auth → Webhooks             │
│                                                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/HTTPS (API Tokens)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   NEXT.JS (Frontend)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐       ┌──────────────┐                   │
│  │  API Client  │───────│ TypeScript   │                   │
│  │  (Fetch/SDK) │       │ Types        │                   │
│  └──────────────┘       └──────────────┘                   │
│                                                              │
│  ┌──────────────┐       ┌──────────────┐                   │
│  │  Server      │───────│  Static      │                   │
│  │  Components  │       │  Generation  │                   │
│  └──────────────┘       └──────────────┘                   │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │  Cache (ISR + On-Demand Revalidation)│                  │
│  └──────────────────────────────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                  │
                  │ Webhooks (POST)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              NEXT.JS API ROUTES                              │
│              /api/webhooks/strapi                            │
│                                                              │
│  Receives content updates → Invalidates cache               │
└─────────────────────────────────────────────────────────────┘
```

### Key Integration Points

1. **Content Fetching** - Server Components fetch from Strapi REST API
2. **Type Safety** - TypeScript types generated from Strapi schema
3. **Caching** - Next.js ISR + on-demand revalidation via webhooks
4. **Security** - API tokens + CORS + environment-based configuration
5. **Real-time Updates** - Webhooks trigger cache invalidation

---

## 🛠️ Composable Architecture Pattern

### What is Composable Architecture?

**Definition:** Building applications from **independent, interchangeable services** that communicate via APIs.

### Strapi as the Content Layer

```
┌─────────────────────────────────────────────────────────────┐
│                  COMPOSABLE STACK                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Content      → Strapi (Headless CMS)                       │
│  Frontend     → Next.js (React Framework)                   │
│  Hosting      → Vercel (Next.js) + Strapi Cloud (CMS)       │
│  Media        → Cloudinary / S3                             │
│  Search       → Algolia / Meilisearch                       │
│  Analytics    → Vercel Analytics / Google Analytics         │
│  Monitoring   → Sentry / New Relic                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Benefits of Composable with Strapi

✅ **Best-of-breed** - Choose best tool for each layer  
✅ **Scalability** - Scale content layer independently from frontend  
✅ **Flexibility** - Swap services without rewriting entire app  
✅ **Future-proof** - Add new channels (mobile, IoT) without CMS changes  
✅ **Performance** - Optimize each layer independently

---

## 📊 REST vs GraphQL Decision Tree

### When to Use REST (Default)

```
Use Strapi REST API when:
├─ Fetching simple resources (blogs, pages)
├─ Predictable query patterns
├─ Smaller team without GraphQL expertise
├─ Leveraging Next.js ISR and caching
└─ Performance optimization via selective population
```

**Example:**

```typescript
// REST API - Simple and predictable
GET /api/blogs?populate=author,category&filters[slug][$eq]=my-blog
```

### When to Use GraphQL

```
Use Strapi GraphQL when:
├─ Complex nested queries with varying structures
├─ Mobile apps needing precise data shape control
├─ Team familiar with GraphQL tooling
├─ Need for schema introspection and auto-documentation
└─ Apollo Client integration
```

**Example:**

```graphql
query GetBlog($slug: String!) {
  blogs(filters: { slug: { eq: $slug } }) {
    data {
      attributes {
        title
        author {
          data {
            attributes {
              fullName
            }
          }
        }
        category {
          data {
            attributes {
              name
            }
          }
        }
      }
    }
  }
}
```

### Recommendation for This Project

**✅ Use REST API**

**Reasons:**

1. Next.js Server Components work seamlessly with REST
2. Simpler setup and debugging
3. Better caching strategies with ISR
4. Adequate for current data fetching patterns
5. Easier type generation

---

## 🚀 Implementation Checklist

### Phase 1: Environment Setup (Day 1)

```
□ Create .env.local with STRAPI_API_URL and STRAPI_API_TOKEN
□ Add .env.example for team reference
□ Configure CORS in Strapi for Next.js domain
□ Test API connection with simple fetch
```

### Phase 2: API Client (Day 1-2)

```
□ Create reusable Strapi client utility
□ Implement query, filter, and populate patterns
□ Add error handling and logging
□ Test with sample queries (blogs, pages)
```

### Phase 3: Type Generation (Day 2)

```
□ Set up @strapi/sdk or custom script
□ Generate types from Strapi schema
□ Organize types in shared package
□ Test type safety in data fetching
```

### Phase 4: Webhooks (Day 3)

```
□ Create Next.js API route for webhooks
□ Configure webhooks in Strapi admin
□ Implement cache invalidation logic
□ Test with ngrok/LocalTunnel locally
```

### Phase 5: Security (Day 3-4)

```
□ Create Read-Only API token for frontend
□ Configure environment-based tokens (dev vs prod)
□ Set up CORS for production domains
□ Test authentication and authorization
```

---

## ⚠️ Common Integration Pitfalls

### Pitfall #1: Using `populate=*` Everywhere

**❌ BAD:**

```typescript
const blogs = await fetch(`${STRAPI_API_URL}/api/blogs?populate=*`)
// Fetches ALL relations, slow!
```

**✅ GOOD:**

```typescript
const blogs = await fetch(
  `${STRAPI_API_URL}/api/blogs?populate[author][fields][0]=fullName&populate[banner][fields][0]=url`
)
// Selective, fast
```

---

### Pitfall #2: Not Using Environment Variables

**❌ BAD:**

```typescript
const STRAPI_URL = "http://localhost:1337" // Hardcoded!
```

**✅ GOOD:**

```typescript
const STRAPI_URL = process.env.STRAPI_API_URL
if (!STRAPI_URL) throw new Error("Missing STRAPI_API_URL")
```

---

### Pitfall #3: Skipping Error Handling

**❌ BAD:**

```typescript
const data = await fetch(STRAPI_URL).then((res) => res.json())
// No error handling
```

**✅ GOOD:**

```typescript
try {
  const res = await fetch(STRAPI_URL)
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`)
  const data = await res.json()
  return data
} catch (error) {
  console.error("Failed to fetch from Strapi:", error)
  return null
}
```

---

### Pitfall #4: Not Invalidating Cache After Content Changes

**❌ BAD:**

```typescript
// Editor publishes blog, but Next.js still shows old cached version
```

**✅ GOOD:**

```typescript
// Webhook triggers revalidation
export async function POST(req: Request) {
  const { model, entry } = await req.json()
  if (model === "blog") {
    revalidatePath("/blog")
  }
  return Response.json({ success: true })
}
```

---

## 🔗 Related Documentation

- [Content Modeling](../content-modeling/README.md) - Schema design
- [Performance Optimization](../performance-optimization/README.md) - Caching strategies
- [Workflows & Automation](../workflows-automation/README.md) - CI/CD integration
- [Atomic Architecture](../atomic-architecture/README.md) - Component mapping

---

## 🤖 Automation Opportunities

### Type Generation Automation

**Goal:** Auto-regenerate TypeScript types when Strapi schema changes

**Approach:**

1. Strapi webhook triggers on schema update
2. Next.js API route receives webhook
3. Script runs `strapi-to-typescript` generator
4. Commit types to Git (or publish to shared package)

**Status:** 📋 Planned

---

### Cache Invalidation Automation

**Goal:** Auto-invalidate Next.js cache when content publishes

**Approach:**

1. Configure Strapi webhooks for `entry.publish` events
2. Next.js API route calls `revalidatePath()` or `revalidateTag()`
3. Monitor invalidation success in logs

**Status:** 🏗️ In Progress

---

## 📚 Learning Path

### Beginner (1-2 days)

1. Read [01-ENVIRONMENT-SETUP.md](./01-ENVIRONMENT-SETUP.md)
2. Set up `.env` variables and test connection
3. Read [02-API-CLIENT.md](./02-API-CLIENT.md)
4. Fetch simple data (e.g., list of blogs)

### Intermediate (3-5 days)

5. Read [03-TYPE-GENERATION.md](./03-TYPE-GENERATION.md)
6. Generate and use TypeScript types
7. Read [04-WEBHOOKS.md](./04-WEBHOOKS.md)
8. Implement cache invalidation

### Advanced (1 week)

9. Read [05-SECURITY.md](./05-SECURITY.md)
10. Configure production security (API tokens, CORS)
11. Optimize queries with selective population
12. Monitor performance and iterate

---

**🎉 You're ready to integrate Strapi with Next.js!**

Start with [00-INTEGRATION-OVERVIEW.md](./00-INTEGRATION-OVERVIEW.md) for architecture context, then proceed to [01-ENVIRONMENT-SETUP.md](./01-ENVIRONMENT-SETUP.md) for hands-on configuration.
