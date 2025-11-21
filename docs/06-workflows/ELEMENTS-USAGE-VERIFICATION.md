# Elements Usage Verification Guide

## Purpose

Before starting the gradual `elements/` → `molecules/` migration, we need to know:

- How many pages use `elements.*` components
- Which specific element types are used
- Estimated migration workload

## Option 1: SQL Query (Fastest)

If you have direct database access (pgAdmin, TablePlus, psql):

```sql
-- Check which pages use elements.* components
SELECT
    id,
    document_id,
    title,
    slug,
    locale,
    published_at,
    (LENGTH(content::text) - LENGTH(REPLACE(content::text, '"elements.', ''))) / LENGTH('"elements.') as elements_count
FROM pages
WHERE content::text LIKE '%"elements.%'
ORDER BY elements_count DESC;

-- Summary statistics
SELECT
    COUNT(*) as total_pages_with_elements,
    SUM((LENGTH(content::text) - LENGTH(REPLACE(content::text, '"elements.', ''))) / LENGTH('"elements.')) as total_element_instances
FROM pages
WHERE content::text LIKE '%"elements.%';

-- List all unique element types used
SELECT DISTINCT
    unnest(regexp_matches(content::text, '"elements\\.[a-z-]+"', 'g')) as element_type,
    COUNT(*) as usage_count
FROM pages
WHERE content::text LIKE '%"elements.%'
GROUP BY element_type
ORDER BY usage_count DESC;
```

## Option 2: Strapi Admin UI (Recommended if no DB access)

1. **Start Strapi development server:**

   ```powershell
   cd apps/strapi
   yarn dev
   ```

2. **Open admin panel:**

   - URL: http://localhost:1337/admin
   - Login with your admin credentials

3. **Navigate to Content Manager:**

   - Sidebar → Content Manager → Collection Types → Pages

4. **Review each page:**

   - Click on each page
   - Scroll through the "Content" dynamic zone
   - Look for section components like:
     - Feature Grid Section (uses `elements.feature-card`)
     - Testimonials Section (uses `elements.testimonial-card`)
     - Integration Grid Section (uses `elements.integration-card`)
     - Partner Showcase Section (uses `elements.partner-card`)
     - Metrics Section (uses `elements.stat-card`)
     - Newsletter CTA Section (uses `elements.list-item`)
     - Benefits Section (uses `elements.feature-card`, `elements.list-item`)
     - Marquee Section (uses `elements.marquee-*`)
     - Final CTA Section (uses `elements.icon-button`)

5. **Document findings in spreadsheet:**
   - Create a simple table with: Page ID | Page Title | Sections Using Elements | Element Count

## Option 3: Export and Search (Manual but thorough)

1. **Export all pages:**

   - Strapi Admin → Content Manager → Pages
   - Click "Export" button (if available in your Strapi version)
   - Or use Strapi CLI: `yarn strapi export`

2. **Search exported JSON:**
   - Open the exported file in VS Code
   - Search for `"elements.` (with quotes)
   - Count occurrences per page

## Expected Element Types

Based on the audit, these are the 13 element types we'll be renaming:

1. `elements.icon-button` → `molecules.icon-button`
2. `elements.feature-card` → `molecules.feature-card`
3. `elements.testimonial-card` → `molecules.testimonial-card`
4. `elements.integration-card` → `molecules.integration-card`
5. `elements.partner-card` → `molecules.partner-card`
6. `elements.stat-card` → `molecules.stat-card`
7. `elements.list-item` → `molecules.list-item`
8. `elements.company-logo` → `molecules.company-logo`
9. `elements.footer-item` → `molecules.footer-item`
10. `elements.marquee-logo` → `molecules.marquee-logo`
11. `elements.marquee-review` → `molecules.marquee-review`
12. `elements.marquee-testimonial` → `molecules.marquee-testimonial`
13. `elements.marquee-testimonial-pro` → `molecules.marquee-testimonial-pro`

## What to Record

Create a migration tracker with:

| Page ID | Page Title | Slug   | Published | Elements Count | Element Types Used                          | Status      |
| ------- | ---------- | ------ | --------- | -------------- | ------------------------------------------- | ----------- |
| 1       | Home       | /      | ✅        | 12             | feature-card, testimonial-card, icon-button | Not Started |
| 2       | About      | /about | ✅        | 5              | list-item, company-logo                     | Not Started |

## Next Steps After Verification

Once you have the count:

1. **If 0 pages use elements:**

   - ✅ Safe to do direct rename (no migration needed)
   - Proceed with breaking change approach

2. **If 1-5 pages use elements:**

   - ✅ Small migration, can do manually in admin UI
   - Estimated time: 1-2 hours

3. **If 6-20 pages use elements:**

   - ⚠️ Medium migration, use gradual approach
   - Estimated time: 1-2 weeks (gradual content editor workflow)

4. **If 20+ pages use elements:**
   - ⚠️ Large migration, definitely use gradual approach
   - Consider automated migration script
   - Estimated time: 2-3 weeks

## Ready?

Once you've completed the verification, return here with the count and we'll proceed to Step 6 (backup strategy).
