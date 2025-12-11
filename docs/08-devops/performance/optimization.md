# ⚡ Performance Optimization Documentation

> **Category:** Performance & Scalability  
> **Status:** In Development  
> **Last Updated:** November 16, 2025  
> **Complexity:** Intermediate to Advanced  
> **Focus:** Strapi + Next.js performance patterns

---

## 📖 Overview

This section covers **performance optimization strategies** for a Strapi-powered Next.js application, focusing on **caching, database optimization, CDN configuration, image optimization, and monitoring**.

### What You'll Learn

- **Multi-layer Caching** - Strapi REST Cache + Next.js ISR + CDN
- **Database Optimization** - Indexing, query optimization, connection pooling
- **CDN Setup** - Cloudinary/S3 for media, edge caching strategies
- **Image Optimization** - Next.js Image component, Strapi media handling
- **Monitoring** - Performance budgets, real-time monitoring tools

---

## 🗂️ Documentation Structure

### 📄 [00-PERFORMANCE-OVERVIEW.md](/docs/00-performance-overview)

**High-level performance strategy**

- Multi-layer caching architecture
- Performance goals and budgets
- Common bottlenecks in Strapi + Next.js
- Measurement tools (Lighthouse, WebPageTest)
- Monitoring strategy

**When to read:** Start here for performance philosophy

---

### 💾 [01-CACHING.md](/docs/01-caching)

**Complete caching strategy**

- **Strapi REST Cache Plugin** - API response caching
- **Next.js ISR (Incremental Static Regeneration)** - Static page caching
- **CDN Edge Caching** - Cloudflare/Vercel Edge Network
- **Browser Caching** - Cache-Control headers
- **Revalidation Strategies** - On-demand, time-based, stale-while-revalidate
- **Cache Invalidation** - Webhook-triggered purging

**When to read:** When implementing caching layers

**Example Preview:**

```typescript
// Next.js ISR with 60s revalidation
export const revalidate = 60

export async function generateStaticParams() {
  const blogs = await strapi.find("blogs", { fields: ["slug"] })
  return blogs.map((blog) => ({ slug: blog.slug }))
}

// On-demand revalidation via webhook
export async function POST(request: Request) {
  const { model, entry } = await request.json()
  if (model === "blog") {
    revalidatePath("/blog")
    revalidatePath(`/blog/${entry.slug}`)
  }
  return Response.json({ revalidated: true, now: Date.now() })
}
```

---

### 🗄️ [02-DATABASE-OPTIMIZATION.md](/docs/02-database-optimization)

**Database performance tuning**

- **Indexing Strategies** - When and where to add indexes
- **Query Optimization** - Selective population, avoiding N+1 queries
- **Connection Pooling** - PostgreSQL connection limits
- **Database Caching** - Query result caching
- **Monitoring Slow Queries** - pg_stat_statements, EXPLAIN ANALYZE
- **Database Backups** - Performance impact mitigation

**When to read:** When experiencing slow API responses

**Example Preview:**

```sql
-- Add index for frequently queried slug field
CREATE INDEX idx_blogs_slug ON blogs(slug);

-- Add composite index for category + publishedAt filtering
CREATE INDEX idx_blogs_category_published
ON blogs(category_id, published_at DESC);
```

```typescript
// Avoid N+1 queries with selective population
const blogs = await strapi.entityService.findMany("api::blog.blog", {
  populate: {
    author: { fields: ["fullName"] }, // Only name, not all user fields
    category: { fields: ["name", "slug"] },
  },
})
```

---

### 🌐 [03-CDN-SETUP.md](/docs/03-cdn-setup)

**Content Delivery Network configuration**

- **Media CDN** - Cloudinary, AWS S3 + CloudFront, Vercel Blob
- **Static Asset CDN** - Vercel Edge Network, Cloudflare
- **Cache Purging** - Webhook-triggered invalidation
- **Image Transformations** - On-the-fly resizing, format optimization
- **Video Streaming** - HLS, adaptive bitrate
- **Geographic Distribution** - Edge locations and latency

**When to read:** When setting up production infrastructure

**Example Preview:**

```typescript
// Cloudinary transformation URL
const optimizedImage = `https://res.cloudinary.com/your-cloud/image/upload/w_800,f_auto,q_auto/v1/${publicId}`;

// Next.js Image with CDN
<Image
  src={strapiImage.url}
  loader={cloudinaryLoader}
  width={800}
  height={600}
  alt={strapiImage.alternativeText}
/>
```

---

### 🖼️ [04-IMAGE-OPTIMIZATION.md](/docs/04-image-optimization)

**Image performance best practices**

- **Next.js Image Component** - Automatic optimization, lazy loading
- **Strapi Media Library** - Responsive formats, multiple sizes
- **Format Selection** - WebP, AVIF, fallback to JPEG
- **Lazy Loading** - Native loading="lazy", intersection observer
- **Responsive Images** - srcset, sizes attribute
- **Placeholder Strategies** - Blur-up, LQIP (Low-Quality Image Placeholder)

**When to read:** When implementing images in components

**Example Preview:**

```tsx
import Image from "next/image"
;<Image
  src={blog.banner.url}
  alt={blog.banner.alternativeText || blog.title}
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={blog.banner.formats.thumbnail.url}
  priority={false} // Lazy load by default
/>
```

---

### 📊 [05-MONITORING.md](/docs/05-monitoring)

**Performance monitoring and alerting**

- **Real User Monitoring (RUM)** - Vercel Analytics, Google Analytics
- **Synthetic Monitoring** - Lighthouse CI, WebPageTest
- **APM (Application Performance Monitoring)** - New Relic, Datadog, Sentry
- **Performance Budgets** - LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Alerting** - Threshold-based notifications
- **Custom Metrics** - Core Web Vitals, API response times

**When to read:** When setting up production monitoring

**Example Preview:**

```javascript
// Performance budget in package.json
{
  "performanceBudget": {
    "maxLCP": 2500,
    "maxFID": 100,
    "maxCLS": 0.1,
    "maxTTFB": 600
  }
}
```

---

## 🎯 Quick Start by Use Case

### I want to... 🤔

#### Enable Next.js ISR with on-demand revalidation

**Go to:** [01-CACHING.md](/docs/01-caching) → ISR + Webhooks

```typescript
export const revalidate = 60 // Revalidate every 60s

// Webhook for on-demand revalidation
revalidatePath("/blog")
```

---

#### Optimize slow Strapi API queries

**Go to:** [02-DATABASE-OPTIMIZATION.md](/docs/02-database-optimization) → Query Optimization

```typescript
// Selective population (fast)
populate: {
  author: {
    fields: ["fullName"]
  }
}
```

---

#### Set up Cloudinary for media

**Go to:** [03-CDN-SETUP.md](/docs/03-cdn-setup) → Media CDN

```bash
npm install cloudinary
```

---

#### Lazy load images with blur placeholder

**Go to:** [04-IMAGE-OPTIMIZATION.md](/docs/04-image-optimization) → Placeholder Strategies

```tsx
<Image placeholder="blur" blurDataURL={thumbnail} />
```

---

#### Monitor Core Web Vitals

**Go to:** [05-MONITORING.md](/docs/05-monitoring) → RUM + Performance Budgets

---

## 🏗️ Multi-Layer Caching Architecture

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: BROWSER CACHE (Cache-Control headers)             │
│  Duration: 1 hour - 1 year                                   │
│  Hit: Instant load from disk/memory                          │
└─────────────────┬───────────────────────────────────────────┘
                  │ MISS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: CDN EDGE CACHE (Vercel/Cloudflare)                │
│  Duration: 60s - 1 hour                                      │
│  Hit: ~50ms (nearest edge location)                          │
└─────────────────┬───────────────────────────────────────────┘
                  │ MISS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: NEXT.JS ISR (Static Generation + Revalidation)    │
│  Duration: 60s - 1 hour                                      │
│  Hit: ~100ms (pre-rendered page)                             │
└─────────────────┬───────────────────────────────────────────┘
                  │ MISS or REVALIDATE
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: STRAPI REST CACHE PLUGIN                          │
│  Duration: 5m - 1 hour                                       │
│  Hit: ~200ms (cached API response)                           │
└─────────────────┬───────────────────────────────────────────┘
                  │ MISS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5: DATABASE QUERY (PostgreSQL)                       │
│  Duration: N/A (live query)                                  │
│  Response: ~500ms - 2s (depending on query complexity)       │
└─────────────────────────────────────────────────────────────┘
```

### Cache Hit Rates & Performance

| Layer             | Hit Rate (Goal)   | Response Time | Invalidation Method          |
| ----------------- | ----------------- | ------------- | ---------------------------- |
| Browser Cache     | 80%               | Instant       | User refresh, max-age expiry |
| CDN Edge          | 60%               | ~50ms         | Cache-Control, purge API     |
| Next.js ISR       | 40%               | ~100ms        | revalidatePath(), time-based |
| Strapi REST Cache | 20%               | ~200ms        | Webhook, plugin purge        |
| Database          | N/A (always miss) | ~500ms+       | N/A                          |

---

## 🚀 Implementation Checklist

### Phase 1: Enable Caching (Day 1)

```
□ Install Strapi REST Cache plugin
□ Configure cache duration (5m - 1h based on content type)
□ Enable Next.js ISR with revalidate property
□ Set Cache-Control headers for static assets
□ Test cache hit rates
```

### Phase 2: Database Optimization (Day 2)

```
□ Identify slow queries (Strapi admin, pg_stat_statements)
□ Add indexes to frequently queried fields (slug, category, publishedAt)
□ Optimize populate queries (selective fields only)
□ Enable connection pooling (pg_bouncer or Strapi config)
□ Monitor query performance
```

### Phase 3: CDN Setup (Day 2-3)

```
□ Choose CDN provider (Cloudinary, S3 + CloudFront, Vercel Blob)
□ Upload media to CDN
□ Configure Strapi upload provider plugin
□ Set up image transformation URLs
□ Test image delivery performance
```

### Phase 4: Image Optimization (Day 3)

```
□ Replace <img> with Next.js <Image>
□ Add blur placeholders
□ Configure responsive sizes
□ Enable lazy loading (priority={false} by default)
□ Test Lighthouse image scores
```

### Phase 5: Monitoring (Day 4)

```
□ Set up Vercel Analytics or Google Analytics
□ Configure performance budgets
□ Add custom metrics tracking (API response times)
□ Set up alerting for degraded performance
□ Run Lighthouse CI in GitHub Actions
```

---

## ⚠️ Common Performance Pitfalls

### Pitfall #1: Using `populate=*` Everywhere

**❌ BAD:**

```typescript
const blogs = await strapi.find("blogs", { populate: "*" })
// Fetches ALL relations, images in all sizes → SLOW!
```

**✅ GOOD:**

```typescript
const blogs = await strapi.find("blogs", {
  fields: ["title", "slug", "createdAt"],
  populate: {
    author: { fields: ["fullName"] },
    banner: { fields: ["url", "formats"] },
  },
})
// Only necessary data → FAST
```

**Performance Impact:** 10x query time reduction

---

### Pitfall #2: Not Using ISR (Fetching on Every Request)

**❌ BAD:**

```typescript
export default async function BlogPage({ params }) {
  const blog = await strapi.findOne("blogs", { slug: params.slug })
  // Fetches from Strapi on EVERY request → SLOW
}
```

**✅ GOOD:**

```typescript
export const revalidate = 60 // ISR with 60s revalidation

export async function generateStaticParams() {
  const blogs = await strapi.find("blogs", { fields: ["slug"] })
  return blogs.map((blog) => ({ slug: blog.slug }))
}

export default async function BlogPage({ params }) {
  const blog = await getCachedBlog(params.slug)
  // Pre-rendered, served from cache → FAST
}
```

**Performance Impact:** 50ms vs 500ms response time

---

### Pitfall #3: No Database Indexes

**❌ BAD:**

```sql
-- No indexes on slug or category
SELECT * FROM blogs WHERE slug = 'my-blog'; -- Sequential scan → SLOW
```

**✅ GOOD:**

```sql
CREATE INDEX idx_blogs_slug ON blogs(slug);
-- Index scan → FAST (100x faster)
```

**Performance Impact:** 500ms → 5ms query time

---

### Pitfall #4: Large Unoptimized Images

**❌ BAD:**

```tsx
<img src={blog.banner.url} alt={blog.title} />
// Serves 5MB original image → SLOW LCP
```

**✅ GOOD:**

```tsx
<Image
  src={blog.banner.url}
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt={blog.title}
/>
// Next.js auto-optimizes → ~50KB WebP → FAST LCP
```

**Performance Impact:** 5MB → 50KB (100x reduction)

---

### Pitfall #5: Not Monitoring Performance

**❌ BAD:**

- Deploy to production, never check performance
- Users complain about slow pages

**✅ GOOD:**

- Set up Vercel Analytics or New Relic
- Configure performance budgets
- Get alerts when LCP > 2.5s
- Fix issues proactively

---

## 🔗 Related Documentation

- [Strapi Integration](/docs/readme) - API optimization
- [Content Modeling](/docs/readme) - Query-friendly schemas
- [Workflows & Automation](/docs/readme) - CI performance testing
- [CSS Architecture](/docs/readme) - CSS optimization

---

## 🤖 Automation Opportunities

### Automated Performance Testing

**Goal:** Run Lighthouse CI on every PR

**Approach:**

1. Add Lighthouse CI to GitHub Actions
2. Fail PR if LCP > 2.5s or CLS > 0.1
3. Generate performance reports

**Status:** 📋 Planned

---

### Automated Cache Invalidation

**Goal:** Clear cache when content publishes

**Approach:**

1. Strapi webhook triggers on entry.publish
2. Next.js API route calls revalidatePath()
3. CDN purge via API (Cloudflare, Cloudinary)

**Status:** 🏗️ Partially implemented (Next.js revalidation)

---

## 📚 Learning Path

### Beginner (1-2 days)

1. Read [00-PERFORMANCE-OVERVIEW.md](/docs/00-performance-overview)
2. Understand multi-layer caching
3. Read [01-CACHING.md](/docs/01-caching)
4. Enable Next.js ISR

### Intermediate (3-5 days)

5. Read [02-DATABASE-OPTIMIZATION.md](/docs/02-database-optimization)
6. Add database indexes
7. Read [04-IMAGE-OPTIMIZATION.md](/docs/04-image-optimization)
8. Replace <img> with Next.js <Image>

### Advanced (1 week)

9. Read [03-CDN-SETUP.md](/docs/03-cdn-setup)
10. Set up CDN for media
11. Read [05-MONITORING.md](/docs/05-monitoring)
12. Configure performance monitoring and budgets

---

**⚡ You're ready to optimize performance!**

Start with [00-PERFORMANCE-OVERVIEW.md](/docs/00-performance-overview) for strategy context, then proceed to [01-CACHING.md](/docs/01-caching) for hands-on caching implementation.
