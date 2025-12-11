# 🌱 E2E Test Data Seeding Guide

**Created**: November 30, 2025  
**Last Updated**: November 30, 2025  
**Status**: ✅ Active  
**Audience**: Developers

---

## 🎯 PURPOSE

This guide explains how to seed test data in Strapi for end-to-end (E2E) testing. It covers the factory pattern approach, file structure, and step-by-step workflows.

**Related Docs:**

- [E2E Testing Overview](/docs/13-testing-e2e-readme) - General E2E testing guide
- [Case Study: Best Practices](/docs/13-testing-e2e-strapi-seeding-case-study) - Deep-dive analysis

---

## 📖 OVERVIEW

### What is Test Data Seeding?

Test data seeding is the process of populating the database with **known, predictable data** before running E2E tests.

**Why We Need It:**

- ✅ Tests require consistent data to verify functionality
- ✅ Database resets between test runs ensure clean state
- ✅ Reproducible test results across environments (local, CI)

### Our Approach: Factory Pattern

We use **TypeScript seed scripts** (factory pattern) instead of SQL dumps.

**Benefits:**

- ✅ **Version controlled** - Changes tracked in Git
- ✅ **Maintainable** - Update code, not SQL
- ✅ **Flexible** - Easy to add new test scenarios
- ✅ **Type-safe** - TypeScript catches errors
- ✅ **Self-documenting** - Code explains what data exists

**Tradeoff:**

- ⚠️ **Slower** - ~50 seconds vs ~5 seconds for SQL restore
- ✅ **Acceptable** - E2E tests run weekly, not on every push

---

## 📂 FILE STRUCTURE

```
apps/strapi/
├── database/
│   └── seeds/
│       └── e2e-test-data.ts          # 🔑 Seed data definition
│
├── scripts/
│   ├── run-seed.js                    # Strapi bootstrap + seed runner
│   ├── seed-e2e-data.sh               # Main orchestration (bash)
│   ├── seed-e2e-data.ps1              # Windows PowerShell version
│   └── check-strapi-built.sh          # Prerequisites checker
│
├── .env                               # DATABASE_URL configuration
└── package.json                       # Scripts: seed:e2e, seed:e2e:win
```

---

## 🚀 QUICK START

### Prerequisites

1. **PostgreSQL Running** (Docker recommended)

   ```bash
   docker ps | grep postgres
   ```

2. **Strapi Built** (creates database schema)

   ```bash
   yarn build:strapi
   ```

3. **Environment Variables** (`.env` file in `apps/strapi/`)
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/strapi_dev
   ```

### Running the Seed Script

```bash
# Navigate to Strapi directory
cd apps/strapi

# Run seeding (resets database!)
yarn seed:e2e

# Windows alternative (PowerShell has issues - use Git Bash)
yarn seed:e2e:win
```

**Expected Output:**

```
🌱 E2E Test Data Seeding
========================================
📊 Checking database connection...
✅ Connected to database: strapi_dev
🔍 Verifying Strapi build...
✅ Strapi build verified
🗑️  Resetting database (drop + recreate schema)...
✅ Database reset complete
🔄 Creating database schema from Strapi build...
✅ Database schema created
🌱 Seeding E2E test data...
✅ E2E test page created successfully!
✅ Seed verification passed - data persisted to database
✅ Seeding complete
```

---

## 📝 SEED SCRIPT WALKTHROUGH

### 1. Seed Data Definition (`e2e-test-data.ts`)

**Purpose**: Defines what test data to create

**Key Sections:**

```typescript
export default async ({ strapi }: { strapi: any }) => {
  // 1. CREATE E2E TEST PAGE
  const e2eTestPage = await strapi.documents("api::page.page").create({
    data: {
      title: "E2E Test Page",
      slug: "e2e-test-page",
      fullPath: "/e2e-test-page",

      // SEO metadata
      seo: {
        /* ... */
      },

      // Dynamic sections (Newsletter, FAQ, Contact)
      content: [
        // Section 1: Newsletter CTA
        { __component: "sections.newsletter-cta-section" /* ... */ },

        // Section 2: FAQ
        { __component: "sections.faq-section" /* ... */ },

        // Section 3: Contact
        { __component: "sections.contact-section" /* ... */ },
      ],

      status: "published",
    },
  })

  // 2. VERIFY DATA CREATED
  const verification = await strapi.documents("api::page.page").count({
    filters: { slug: "e2e-test-page", locale: "en" },
  })

  if (verification !== 1) {
    throw new Error(`Expected 1 page, found ${verification}`)
  }

  console.log("✅ Seed verification passed")
}
```

**What This Creates:**

- 1 published page at `/e2e-test-page`
- Newsletter CTA section with form
- FAQ section with 5 questions
- Contact section with contact methods

---

### 2. Seed Runner (`run-seed.js`)

**Purpose**: Bootstraps Strapi and executes seed function

**Key Steps:**

```javascript
// 1. Handle async errors globally
process.on("unhandledRejection", (reason) => {
  if (reason.message?.includes("aborted")) {
    return // Known connection pool cleanup issue
  }
  console.error("Unhandled Promise Rejection:", reason)
  process.exit(1)
})

// 2. Bootstrap Strapi
const { createStrapi } = require("@strapi/strapi")
const strapi = await createStrapi({ distDir: "./dist" }).load()

// 3. Load and execute seed function
const seedFunction = require("../database/seeds/e2e-test-data.ts").default
await seedFunction({ strapi })

// 4. Cleanup
await strapi.destroy()
```

**Best Practices Applied:**

- ✅ Global error handler (Tarn connection pool cleanup)
- ✅ Explicit Strapi bootstrap
- ✅ TypeScript seed files (via ts-node)
- ✅ Graceful cleanup

---

### 3. Orchestration Script (`seed-e2e-data.sh`)

**Purpose**: Coordinates full seeding workflow

**Workflow Steps:**

#### Step 0: Load Environment

```bash
# Load DATABASE_URL from .env
export $(grep -v '^#' .env | grep DATABASE_URL | xargs)
```

#### Step 1: Verify Database Connection

```bash
# Check DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL not set"
  exit 1
fi
```

#### Step 2: Check Prerequisites

```bash
# Verify Strapi build exists
bash scripts/check-strapi-built.sh
```

#### Step 3: Reset Database

```bash
# Safety check: Prevent production wipes
if [[ ! "$DB_NAME" =~ (test|dev|e2e) ]] && [ "$CI" != "true" ]; then
  read -p "Type 'yes' to confirm deletion: " -r
  [[ ! "$REPLY" == "yes" ]] && exit 1
fi

# Drop and recreate schema
psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
```

#### Step 4: Create Database Schema

```bash
# Run build to create tables (Strapi v5 has no db:migrate)
NODE_ENV=production yarn build
```

#### Step 5: Seed Data

```bash
# Execute seed script
node scripts/run-seed.js
```

#### Step 6: Completion Summary

```bash
echo "🎉 E2E Test Data Seeding Complete!"
echo "Test page available at: http://localhost:3000/en/e2e-test-page"
```

---

### 4. Prerequisites Checker (`check-strapi-built.sh`)

**Purpose**: Verifies Strapi build exists before seeding

**Checks:**

```bash
# 1. dist/ directory exists
[ ! -d "dist" ] && echo "❌ Strapi not built" && exit 1

# 2. Required paths exist
REQUIRED_PATHS=("dist/build" "dist/config" "dist/src")
for path in "${REQUIRED_PATHS[@]}"; do
  [ ! -e "$path" ] && echo "❌ Missing: $path" && exit 1
done
```

**Why Important:**

- ✅ Prevents cryptic errors from missing build
- ✅ Clear error messages with instructions
- ✅ Faster feedback (fail fast)

---

## 🔧 CUSTOMIZING SEED DATA

### Adding New Test Data

**Example: Add a Blog Post**

1. **Edit `e2e-test-data.ts`**:

   ```typescript
   // After creating the page, create a blog post
   const blogPost = await strapi.documents("api::blog-post.blog-post").create({
     data: {
       title: "E2E Test Blog Post",
       slug: "e2e-test-blog-post",
       content: "This is a test blog post for E2E testing.",
       author: "Test Author",
       publishedAt: new Date(),
       status: "published",
     },
   })
   ```

2. **Add verification**:

   ```typescript
   const postCount = await strapi.documents("api::blog-post.blog-post").count({
     filters: { slug: "e2e-test-blog-post" },
   })

   if (postCount !== 1) {
     throw new Error(`Expected 1 blog post, found ${postCount}`)
   }
   ```

3. **Test locally**:

   ```bash
   yarn seed:e2e
   ```

4. **Verify in Strapi admin**:
   ```
   http://localhost:1337/admin/content-manager/collection-types/api::blog-post.blog-post
   ```

---

### Modifying Existing Data

**Example: Change Newsletter Section**

1. **Edit `e2e-test-data.ts`**:

   ```typescript
   {
     __component: "sections.newsletter-cta-section",
     heading: "Updated Newsletter Heading",  // Changed
     description: "New description text",    // Changed
     // ... rest unchanged
   }
   ```

2. **Re-seed**:

   ```bash
   yarn seed:e2e
   ```

3. **Update E2E tests** if assertions changed:
   ```typescript
   await expect(page.locator("h2")).toHaveText("Updated Newsletter Heading")
   ```

---

## 🐛 TROUBLESHOOTING

### Issue: "DATABASE_URL not set"

**Cause**: `.env` file missing or DATABASE_URL not defined

**Solution**:

```bash
# Create .env file in apps/strapi/
cd apps/strapi
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/strapi_dev
EOF
```

---

### Issue: "Strapi build not found"

**Cause**: Strapi not built (no `dist/` directory)

**Solution**:

```bash
# Build Strapi
yarn build:strapi

# Or build everything
yarn build
```

---

### Issue: "Cannot find module 'ts-node'"

**Cause**: Missing TypeScript dependencies

**Solution**:

```bash
# Install dependencies
yarn install

# Or specifically install ts-node
yarn add -D ts-node @types/node
```

---

### Issue: "Seed creates duplicate pages"

**Cause**: Not resetting database before seeding

**Solution**:
The seed script automatically resets the database. If you see duplicates:

```bash
# Manually reset database
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-build and seed
yarn build:strapi
yarn seed:e2e
```

---

### Issue: "fullPath is null"

**Cause**: Background job didn't run (rare in E2E seeding)

**Solution**:

1. Check Strapi admin: Content Manager → InternalJob
2. Look for pending `RECALCULATE_FULLPATH` job
3. Click "Recalculate all fullpaths" button

**Note**: E2E seed script sets `fullPath` directly, so this shouldn't happen.

---

### Issue: "Connection pool errors"

**Symptom**: `Error: aborted` during cleanup

**Status**: ✅ **Already handled** - Global error handler suppresses this

**Why it happens**: Tarn connection pool throws async error during cleanup (known Knex/Tarn issue)

**How we handle it**:

```javascript
process.on("unhandledRejection", (reason) => {
  if (reason.message?.includes("aborted")) {
    return // Safe to ignore - cleanup issue
  }
  // All other errors still fail the script
})
```

---

## ⚡ PERFORMANCE CONSIDERATIONS

### Current Performance

- **Full Seed Time**: ~50 seconds
  - Database reset: ~2s
  - Build (schema creation): ~25s
  - Seeding: ~15s
  - Verification: ~1s

### Optimization Options

#### Option 1: SQL Snapshots (Future)

**Pros:**

- ✅ Much faster (~5 seconds total)
- ✅ Ideal for local development

**Cons:**

- ❌ Not version-controlled (binary SQL dump)
- ❌ Harder to maintain
- ❌ Brittle (breaks with schema changes)

**Implementation:**

```bash
# Create snapshot (after factory seed)
pg_dump "$DATABASE_URL" > tests/fixtures/e2e-snapshot.sql

# Restore snapshot
psql "$DATABASE_URL" < tests/fixtures/e2e-snapshot.sql
```

#### Option 2: Conditional Build (Implemented)

**Current Approach:**

- ✅ Check if build exists (`check-strapi-built.sh`)
- ✅ Skip rebuild if `dist/` exists
- ✅ Saves ~25 seconds on subsequent runs

**Developer Workflow:**

```bash
# One-time build (or when code changes)
yarn build:strapi

# Fast seeding (no rebuild)
yarn seed:e2e  # ~25 seconds
```

#### Option 3: Parallel Seeding (Future)

**Idea**: Create multiple test data sets in parallel

**Potential Gain**: 20-30% faster

**Complexity**: High (requires transaction handling)

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Keep seed data minimal** - Only create what E2E tests need
2. **Use realistic data** - Matches production structure
3. **Verify after seeding** - Ensure data persisted correctly
4. **Document test data** - Comment what each piece is for
5. **Version control changes** - Commit seed script updates
6. **Test seeding locally** - Before pushing to CI

### DON'T ❌

1. **Don't seed production data** - Keep it simple and focused
2. **Don't hardcode IDs** - Strapi auto-generates them
3. **Don't skip verification** - Always confirm data created
4. **Don't commit .env files** - Keep secrets out of Git
5. **Don't modify seed scripts without testing** - Always run `yarn seed:e2e` after changes

---

## 📊 CI/CD INTEGRATION

### GitHub Actions Workflow

**File**: `.github/workflows/e2e-tests.yml`

**Seeding Step:**

```yaml
- name: Seed E2E Test Data
  run: |
    cd apps/strapi
    yarn seed:e2e
  env:
    DATABASE_URL: postgresql://postgres:postgres@localhost:5432/strapi_test
```

**Key Points:**

- ✅ Runs after Strapi build
- ✅ Uses test database (not dev/prod)
- ✅ Automated - no manual intervention
- ✅ Logs available in GitHub Actions

---

## 📚 ADDITIONAL RESOURCES

### Internal Documentation

- [E2E Testing Guide](/docs/13-testing-e2e-readme) - Overview of E2E testing
- [Case Study: Seeding Best Practices](/docs/13-testing-e2e-strapi-seeding-case-study) - Deep-dive analysis
- [Best Practice Checklist](/docs/best_practice_checklist) - Universal development guidelines

### External Resources

- [Strapi Document Service API](https://docs.strapi.io/dev-docs/api/document-service)
- [PostgreSQL psql Commands](https://www.postgresql.org/docs/current/app-psql.html)
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)

---

## ✅ QUICK REFERENCE

### Common Commands

```bash
# Seed test data
yarn seed:e2e

# Build Strapi (prerequisite)
yarn build:strapi

# Check if build exists
bash scripts/check-strapi-built.sh

# Manually reset database
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# View seeded data in Strapi admin
http://localhost:1337/admin/content-manager/collection-types/api::page.page
```

### File Locations

| File                              | Purpose                    |
| --------------------------------- | -------------------------- |
| `database/seeds/e2e-test-data.ts` | Seed data definition       |
| `scripts/run-seed.js`             | Strapi bootstrap + runner  |
| `scripts/seed-e2e-data.sh`        | Main orchestration         |
| `scripts/check-strapi-built.sh`   | Prerequisites checker      |
| `.env`                            | DATABASE_URL configuration |

---

**Questions?** See [Troubleshooting](#-troubleshooting) or check the [Case Study](/docs/13-testing-e2e-strapi-seeding-case-study) for detailed examples! 🌱
