# UI Authentication Issue - Fixed Dec 24, 2025

## Problem

After migrating from Docker PostgreSQL to Local PostgreSQL 17, the Next.js frontend (port 3000) showed errors:

```
Console UnauthorizedError
Missing or invalid credentials

[BaseStrapiClient] Strapi API request error:
  name: 'UnauthorizedError',
  message: 'Missing or invalid credentials',
  status: 401
```

**Symptoms:**

- ✅ Strapi admin panel (http://localhost:1337/admin) worked perfectly
- ✅ PostgreSQL 17 had all 138 tables with complete data
- ✅ 5 pages visible in Strapi Content Manager
- ❌ Next.js frontend showed "Page not found" with authentication errors

## Root Cause

The API token in `apps/ui/.env.local` became **invalid** after the database migration:

1. Old token was created in Docker PostgreSQL (port 5432)
2. Data was migrated to Local PostgreSQL 17 (port 5433)
3. API tokens are stored in the database with hashed values
4. The old token from Docker didn't exist or wasn't valid in the migrated database

**Technical Detail:**

- API tokens are stored in `admin_api_tokens` table
- They're hashed on creation (can't be recovered, only regenerated)
- Next.js uses these tokens to authenticate with Strapi REST API
- Invalid token = 401 Unauthorized on all API calls

## Solution

Generated a new Read-Only API token using the existing generation script:

### Steps Taken

1. **Generated new token** via Strapi script:

   ```powershell
   cd apps/strapi
   node scripts/run-generate-token.js
   ```

2. **Token created successfully:**

   ```
   Token Name: Frontend Read-Only Token
   Token Type: read-only
   Lifespan: null (never expires)
   Description: Read-only token for Next.js frontend (Navbar, Footer, Pages)
   ```

3. **Updated `apps/ui/.env.local`:**

   - Line 39: `STRAPI_REST_READONLY_API_KEY=fe5bf6c388edbed48be82d91bde94e29a553f78f0c40cb58d77d29b300f11a79e40487b9863b2706cd68599e4731ffb01ef96bc28a7687b3f36a915a56276a0597590d17ffa95e7279c4103eeb215f25a5ee26ca1c321f40b4c5b3aaed5b87d93a9473c5f64bb5fc715a2174a5add7fe3e33573cc2d9541191fa982653724905`
   - Line 88: `STRAPI_API_TOKEN=fe5bf6c388edbed48be82d91bde94e29a553f78f0c40cb58d77d29b300f11a79e40487b9863b2706cd68599e4731ffb01ef96bc28a7687b3f36a915a56276a0597590d17ffa95e7279c4103eeb215f25a5ee26ca1c321f40b4c5b3aaed5b87d93a9473c5f64bb5fc715a2174a5add7fe3e33573cc2d9541191fa982653724905`

4. **Restart Next.js dev server:**
   ```powershell
   # Stop current server (Ctrl+C in terminal)
   cd apps/ui
   yarn dev
   ```

## Verification Steps

After restarting Next.js, verify:

1. **No 401 errors in terminal:**

   ```
   ✅ http: GET /api/auth/session 200 in 76ms
   ✅ GET /api-page:page (from strapi)
   ```

2. **Homepage loads successfully:**

   - Visit http://localhost:3000
   - Should see homepage content (not "Page not found")

3. **All pages accessible:**

   - http://localhost:3000 (Index)
   - http://localhost:3000/contact (Contact)
   - http://localhost:3000/features (Features)
   - http://localhost:3000/landing (Landing)
   - http://localhost:3000/e2e-test-page (E2E Test Page)

4. **Browser console clean:**
   - Open DevTools (F12)
   - No red authentication errors
   - All Strapi API calls return 200 OK

## Prevention for Future Migrations

When migrating databases or switching between Docker/Local PostgreSQL:

1. **Always regenerate API tokens** after database changes
2. **Check .env.local files** - both UI and Strapi may need updates
3. **Test authentication** before assuming frontend works
4. **Document token locations:**
   - Strapi Admin: Settings → API Tokens
   - Next.js: `apps/ui/.env.local` (lines 39 and 88)
   - Script: `apps/strapi/database/seeds/generate-api-token.ts`

## Related Files

- `apps/ui/.env.local` - Updated with new token
- `apps/strapi/.env` - Database connection (unchanged)
- `apps/strapi/database/seeds/generate-api-token.ts` - Token generator
- `apps/strapi/scripts/run-generate-token.js` - Runner script

## Timeline

- **Dec 22, 2025 23:20**: PostgreSQL migration completed
- **Dec 24, 2025 15:30**: UI issue reported (401 errors)
- **Dec 24, 2025 15:37**: New token generated
- **Dec 24, 2025 15:38**: .env.local updated
- **Dec 24, 2025 15:40**: Next.js restart pending

## Success Criteria

- ✅ New API token generated
- ✅ .env.local updated with new token
- ⏳ Next.js server restarted (user action required)
- ⏳ Frontend loading without 401 errors
- ⏳ All 5 pages accessible

---

**Status:** Fix implemented, restart required  
**Next Step:** User restarts Next.js dev server (`yarn dev` in apps/ui)
