/**
 * Script to generate SQL query to check which pages use elements.* components
 * This helps us understand the scope of the elements → molecules migration
 *
 * Run this manually in your PostgreSQL client (pgAdmin, TablePlus, psql, etc.)
 */

console.log("🔍 SQL Query to Check Elements Usage\n")
console.log("=".repeat(80))
console.log("\nCopy and run this query in your PostgreSQL client:\n")
console.log("=".repeat(80))
console.log(`
-- Check which pages use elements.* components
SELECT 
    id,
    document_id,
    title,
    slug,
    locale,
    published_at,
    -- Count how many times "elements." appears in the content
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

-- Total pages in database
SELECT COUNT(*) as total_pages FROM pages;

-- List all unique element types used
SELECT DISTINCT
    unnest(regexp_matches(content::text, '"elements\\.[a-z-]+"', 'g')) as element_type,
    COUNT(*) as usage_count
FROM pages
WHERE content::text LIKE '%"elements.%'
GROUP BY element_type
ORDER BY usage_count DESC;
`)
console.log("=".repeat(80))
console.log("\n📝 Alternative: Use Strapi Admin to check pages manually:")
console.log("   1. Start Strapi: cd apps/strapi && yarn dev")
console.log("   2. Open admin panel: http://localhost:1337/admin")
console.log("   3. Go to Content Manager → Pages")
console.log("   4. Review each page's content sections\n")
console.log("=".repeat(80))
console.log("\n💡 If you don't have database access, you can:")
console.log(
  "   1. Export all pages via Strapi admin (Content Manager → Export)"
)
console.log("   2. Search the exported JSON for '\"elements.'")
console.log("   3. Or start Strapi dev server and use the admin UI\n")
