# Session Recovery: E2E Token Authentication Fix

**Date**: December 15, 2025  
**Session Focus**: Implementing Strapi 5 Best Practices & Debugging API Token Authentication  
**Status**: ⏸️ In Progress - Debugging Required

---

## 🎯 Session Objective

Fix persistent 401 Unauthorized errors in E2E workflow API token authentication by implementing Strapi 5 best practices and adding comprehensive debugging.

---

## 📊 Current Status

### ✅ Completed Today

1. **Strapi 5 Best Practices Research** ✅
   - Researched official Strapi 5 documentation
   - Identified correct token storage mechanism:
     - `accessKey`: SHA512 hash for validation
     - `encryptedKey`: Optional encrypted plain token for admin viewing
     - Client sends plain token in Authorization header
     - Strapi hashes received token and compares with database

2. **Implemented Strapi 5 Features** ✅
   - **Commit**: `3a68cbf` - feat(strapi): implement Strapi 5 best practices
   - Added `ENCRYPTION_KEY` support in `config/admin.ts`
   - Enhanced seed script with token encryption (AES-256-CBC)
   - Added 90-day token expiration for security
   - Updated workflow with `ENCRYPTION_KEY` environment variable
   - Added GitHub Secret: `ENCRYPTION_KEY`

3. **Fixed Issues** ✅
   - **Commit**: `31afdea` - Prettier formatting + encryption error handling
   - Applied prettier to `test-token-hash.js`
   - Added try-catch around encryption logic
   - Validated encryption key length (must be >= 32 bytes)
   - Ensured seed completes even if encryption fails

4. **Added Debugging Tools** ✅
   - **Commit**: `4231c92` - Token debugging script
   - Created `apps/strapi/scripts/debug-token.sh`
   - Checks token exists in database
   - Compares database hash with computed hash
   - Tests API authentication with detailed output
   - Added debug step to e2e-tests.yml workflow

### ❌ Still Failing

**E2E Workflow Authentication**: API token returns 401 Unauthorized

```bash
🔐 Testing API token authentication...
[2025-12-15 00:48:44.799] http: GET /api/pages (7 ms) 401
HTTP Status: 401
❌ API token authentication FAILED!
Response: {"data":null,"error":{"status":401,"name":"UnauthorizedError","message":"Missing or invalid credentials"}}
```

---

## 🔍 Investigation Findings

### Official Strapi 5 Documentation Research

**Key Findings** (from https://docs.strapi.io/cms/features/api-tokens):

1. **Token Storage**:
   - Database table: `admin_api_tokens`
   - `accessKey` field: SHA512 hash (required) - used for validation
   - `encryptedKey` field: Encrypted plain token (optional) - for admin panel viewing

2. **Token Usage**:
   - Client sends: `Authorization: Bearer <PLAIN_TOKEN>`
   - Strapi receives plain token → hashes it → compares with `accessKey` in database
   - Hash format: SHA512 with base64 OR hex encoding (both work)

3. **Encryption Key (New in Strapi 5)**:
   - Optional feature for persistent token visibility in admin panel
   - Without it: tokens viewable only once after creation
   - With it: tokens viewable anytime in admin UI
   - Uses AES-256-CBC encryption

4. **No Breaking Changes**:
   - Strapi v4 → v5 maintains backward compatibility
   - Token hashing mechanism unchanged (SHA512)
   - New `encryptedKey` field is optional (nullable)

### Current Implementation

**Seed Script** (`apps/strapi/database/seeds/e2e-test-data.ts`):
```typescript
// Hash token with SHA512 base64
const hashedToken = crypto
  .createHash("sha512")
  .update(plainToken)
  .digest("base64")

// Optional encryption for admin panel viewing
let encryptedToken: string | undefined
if (encryptionKey) {
  // AES-256-CBC encryption with error handling
  encryptedToken = encrypt(plainToken, encryptionKey)
}

// Create token with 90-day expiration
await strapi.db.query("admin::api-token").create({
  data: {
    accessKey: hashedToken,        // SHA512 hash for validation
    encryptedKey: encryptedToken,  // Encrypted for viewing (optional)
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    type: "full-access"
  }
})
```

**Authentication Test** (`.github/workflows/e2e-tests.yml`):
```bash
curl -H "Authorization: Bearer ${{ secrets.E2E_API_TOKEN }}" \
  http://127.0.0.1:1337/api/pages
```

### Mystery: Why 401 Still Occurs?

**Possible Causes**:

1. **Token Mismatch** ⚠️ MOST LIKELY
   - GitHub Secret `E2E_API_TOKEN` value doesn't match seeded token value
   - Different token used in seed vs. authentication test

2. **Seed Not Running**
   - Workflow logs don't show seed output
   - Lint job failing prevents E2E job from running with latest code

3. **Token Expiration**
   - Just added 90-day expiration - could old tokens be expired?
   - But we're creating fresh tokens in seed

4. **Environment Variable Timing**
   - Token not available when needed
   - But we set it before build and seed steps

---

## 🛠️ Debugging Tools Added

### 1. Debug Script: `apps/strapi/scripts/debug-token.sh`

**Purpose**: Diagnose token authentication issues

**What It Does**:
- ✅ Checks if token exists in database (`admin_api_tokens` table)
- ✅ Shows database hash prefix and length
- ✅ Computes expected hash from `E2E_API_TOKEN` environment variable
- ✅ Compares database hash with computed hash
- ✅ Tests API authentication and shows HTTP status
- ✅ Provides troubleshooting tips

**Usage**:
```bash
export DATABASE_URL="postgresql://strapi:password@localhost:5432/strapi_dev"
export E2E_API_TOKEN="your-token-here"
cd apps/strapi
./scripts/debug-token.sh
```

**Expected Output**:
```
🔍 API Token Debugging
========================================

1. Checking database for API token...
✅ Token found in database:
 e2e-readonly-token | full-access | lK7xH3qP9vJ4rN8xT2y | 88 | 2025-03-15 00:48:44

2. Computing expected hash from E2E_API_TOKEN...
Full hash: lK7xH3qP9vJ4rN8xT2yW6zB5cD1fG3hK9mL0pQ7sR4tU6vX8yA2bC5dE7fG9hJ1k
Prefix: lK7xH3qP9vJ4rN8xT2y
Length: 88

3. Testing API authentication...
HTTP Status: 200
✅ Authentication successful!
```

### 2. Workflow Debug Step

**Added After Seed Step**:
```yaml
- name: Debug - Verify Token in Database
  run: |
    cd apps/strapi
    chmod +x scripts/debug-token.sh
    ./scripts/debug-token.sh || echo "⚠️  Debug script failed, continuing..."
  env:
    DATABASE_URL: postgresql://strapi:${{ secrets.E2E_DB_PASSWORD }}@localhost:5432/strapi_dev
    E2E_DB_PASSWORD: ${{ secrets.E2E_DB_PASSWORD }}
    E2E_API_TOKEN: ${{ secrets.E2E_API_TOKEN }}
```

**What It Will Show**:
- Whether token exists in database after seeding
- Hash prefix comparison (database vs. computed)
- Identifies token value mismatch
- Shows authentication test result BEFORE Strapi starts

---

## 📝 Files Changed

### Latest Commits

1. **3a68cbf** - feat(strapi): implement Strapi 5 best practices for API tokens
   - `apps/strapi/config/admin.ts` - Added `secrets.encryptionKey`
   - `apps/strapi/database/seeds/e2e-test-data.ts` - Token encryption + expiration
   - `apps/strapi/test-token-hash.js` - Database verification instructions
   - `.github/workflows/e2e-tests.yml` - Added `ENCRYPTION_KEY` env var

2. **31afdea** - fix(strapi): prettier format and improve encryption error handling
   - `apps/strapi/test-token-hash.js` - Prettier formatting
   - `apps/strapi/database/seeds/e2e-test-data.ts` - Error handling for encryption

3. **4231c92** - feat(ci): add token debugging script for authentication troubleshooting
   - `apps/strapi/scripts/debug-token.sh` - NEW debugging script
   - `.github/workflows/e2e-tests.yml` - Added debug step

### Key Files

- **Seed Script**: `apps/strapi/database/seeds/e2e-test-data.ts`
- **Admin Config**: `apps/strapi/config/admin.ts`
- **E2E Workflow**: `.github/workflows/e2e-tests.yml`
- **Debug Script**: `apps/strapi/scripts/debug-token.sh` (NEW)
- **Test Script**: `apps/strapi/test-token-hash.js`

---

## 🔄 Next Steps (Tomorrow)

### 1. Review Debug Output from Next Workflow Run

**Look For**:
- ✅ Does token exist in database?
- ✅ Does database hash prefix match computed hash prefix?
- ✅ Are both hashes 88 characters (base64)?
- ❌ If prefixes DON'T match → Token value mismatch

### 2. If Token Mismatch Found

**Action**: Verify GitHub Secret value
```bash
# Check what token value is in GitHub Secret E2E_API_TOKEN
# Compare with what's expected/documented
```

**Fix**: Update GitHub Secret to match documented token or vice versa

### 3. If Hashes Match But Still 401

**Possible Issues**:
- Token type permissions (full-access vs read-only)
- Strapi internal validation logic changed
- Database field name mismatch
- Timing issue (token not committed to DB before auth test)

**Actions**:
- Check Strapi logs for detailed authentication error
- Verify `admin_api_tokens` table schema
- Test authentication with manually created token via Strapi admin UI
- Compare database state before/after seed

### 4. If Debug Script Fails

**Possible Issues**:
- Seed step not running at all
- Database connection issues
- Token not persisting to database

**Actions**:
- Check seed script logs in workflow
- Verify PostgreSQL service is running
- Test seed script locally

---

## 📚 Reference Documentation

### Official Strapi Resources

1. **API Tokens**: https://docs.strapi.io/cms/features/api-tokens
2. **Secure API Keys**: https://strapi.io/blog/how-to-store-API-keys-securely
3. **Authentication**: https://strapi.io/blog/authentication-and-authorization

### Key Concepts

**Token Storage (Strapi 5)**:
```
Client              Strapi               Database
------              ------               --------
PLAIN_TOKEN  →  Hash(PLAIN_TOKEN)  →  accessKey: HASH
                                        encryptedKey: ENCRYPTED_PLAIN
```

**Validation Flow**:
```
1. Client sends: Authorization: Bearer PLAIN_TOKEN
2. Strapi receives PLAIN_TOKEN
3. Strapi computes: SHA512(PLAIN_TOKEN).digest('base64')
4. Strapi queries: SELECT * FROM admin_api_tokens WHERE accessKey = COMPUTED_HASH
5. If found + not expired → 200 OK
6. If not found or expired → 401 Unauthorized
```

**Hash Formats** (both work):
- Base64: 88 characters (e.g., `lK7xH3qP9vJ4rN8xT2y...`)
- Hex: 128 characters (e.g., `8f3a9b2c1d4e5f6g7h8i...`)

---

## 🔑 GitHub Secrets

### Required Secrets

1. **E2E_API_TOKEN** ✅
   - Plain text API token value
   - Must match token used in seed script
   - Used in Authorization header

2. **E2E_DB_PASSWORD** ✅
   - PostgreSQL password for `strapi` user
   - Used in DATABASE_URL connection string

3. **ENCRYPTION_KEY** ✅ (NEW)
   - Base64 encoded 32-byte key
   - For encrypting tokens in `encryptedKey` field
   - Optional - tokens work without it
   - Generated with: `openssl rand -base64 32`

4. **CHROMATIC_PROJECT_TOKEN** ✅
   - For Chromatic visual testing
   - Not related to API token authentication

---

## ⚠️ Known Issues

### 1. Lint Failure

**Issue**: `apps/strapi/test-token-hash.js` prettier formatting
**Status**: ✅ FIXED in commit 31afdea
**Next Run**: Should pass lint

### 2. API Authentication 401

**Issue**: Token authentication fails with "Missing or invalid credentials"
**Status**: ❌ INVESTIGATING with debug script
**Hypothesis**: Token value mismatch between GitHub Secret and seeded value
**Next Run**: Debug script will show hash comparison

### 3. Seed Logs Not Showing

**Issue**: Workflow logs don't show seed output
**Status**: ⚠️ UNCLEAR - might be due to lint failure preventing E2E job
**Next Run**: Watch for seed step output after lint passes

---

## 💡 Lessons Learned

1. **Strapi 5 Token Storage**:
   - `API_TOKEN_SALT` is NOT used for token hashing
   - Token hashing is pure SHA512 without salt
   - `encryptedKey` is optional (new in v5)

2. **Debugging Strategy**:
   - Add verification steps after data mutations (seed)
   - Compare expected vs actual values (hash comparison)
   - Test authentication immediately after seeding

3. **Best Practices Implemented**:
   - Token expiration (90 days) for security
   - Encrypted storage for admin viewing
   - Comprehensive error handling
   - Detailed debugging output

---

## 🎯 Success Criteria

**E2E Workflow Should**:
- ✅ Pass lint checks
- ✅ Build Strapi and UI
- ✅ Seed database with test data
- ✅ Show debug output with matching hashes
- ✅ Authenticate successfully (HTTP 200)
- ✅ Run Playwright E2E tests
- ✅ Report results

**Current State**:
- ✅ Lint should pass (fixed)
- ✅ Build passes
- ⚠️ Seed status unclear (no logs)
- ⏳ Debug output pending (new script)
- ❌ Authentication fails (401)
- ❌ Tests don't run (blocked by auth)

---

## 📞 Quick Start Tomorrow

```bash
# 1. Check latest workflow run
# Go to: https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions

# 2. Look for "Debug - Verify Token in Database" step output

# 3. Compare hashes:
#    Database hash prefix: [from debug output]
#    Computed hash prefix: [from debug output]
#    Should match? YES

# 4. If hashes DON'T match:
#    → E2E_API_TOKEN secret value is wrong
#    → Update GitHub Secret

# 5. If hashes DO match but still 401:
#    → Check token type permissions
#    → Check expiration date
#    → Check Strapi logs for details
```

---

**Last Updated**: December 15, 2025, 00:50 UTC  
**Next Session**: Review debug script output and resolve token mismatch  
**Priority**: HIGH - E2E tests blocked until authentication works
