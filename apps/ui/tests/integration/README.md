# Integration Tests

This directory contains integration tests that verify the interaction between Next.js frontend and Strapi backend using **REAL API calls** (no mocking).

## 🎯 Purpose

Unlike E2E tests (which mock API responses), integration tests verify:

- ✅ Form submissions actually save to Strapi database
- ✅ API authentication works correctly
- ✅ Real API responses match expected structure
- ✅ Error handling at the API level

## 📁 Structure

```
tests/integration/
├── README.md                      # This file
├── form-submissions.spec.ts       # Newsletter & contact form tests
├── api-authentication.spec.ts     # Strapi token auth tests
└── api-integration.spec.ts        # General API integration tests
```

## 🚀 Running Locally

**Requirements:**

- Strapi running: `cd apps/strapi && yarn develop`
- Next.js running: `cd apps/ui && yarn dev`
- Database seeded: `cd apps/strapi && yarn seed:e2e:safe`

**Run tests:**

```bash
# All integration tests
yarn test:integration

# With UI
yarn test:integration:ui

# Specific file
yarn workspace @repo/ui playwright test tests/integration/form-submissions.spec.ts
```

## 🔧 Environment Variables

```bash
# Required for integration tests
STRAPI_URL=http://127.0.0.1:1337
E2E_TESTS_PLAYWRIGHT_API_KEY=your-token-here
```

## 🤖 CI/CD

**Workflow:** `.github/workflows/integration-tests.yml`

**Runs:**

- 📅 Weekly (Monday 3 AM UTC)
- 🖱️ Manual trigger via GitHub Actions

**Setup:**

1. Spins up PostgreSQL service
2. Builds & starts Strapi
3. Seeds database (with DROP - safe in CI)
4. Builds & starts Next.js
5. Runs integration tests
6. Uploads test reports

**Duration:** ~10-15 minutes

## 📊 E2E vs Integration Tests

| Aspect       | E2E Tests       | Integration Tests       |
| ------------ | --------------- | ----------------------- |
| **Location** | `e2e/`          | `tests/integration/`    |
| **API**      | Mocked          | Real                    |
| **Database** | Not needed      | Required                |
| **Tests**    | UI behavior     | API integration         |
| **Runs**     | Every PR        | Weekly                  |
| **Duration** | 2-3 min         | 10-15 min               |
| **Workflow** | `e2e-tests.yml` | `integration-tests.yml` |

## 🧪 What to Test Here

**DO test in integration:**

- ✅ Form submissions create database records
- ✅ API authentication with real tokens
- ✅ Real API response structure
- ✅ Database constraints and validation
- ✅ API error responses (500, 400, etc.)

**DON'T test here (use E2E instead):**

- ❌ UI element visibility
- ❌ Button click handlers
- ❌ Form validation messages
- ❌ Navigation behavior
- ❌ Responsive design

## 📝 Test Naming Convention

```typescript
// ✅ Good - describes what's being integrated
test("should submit newsletter form to real Strapi API", ...)
test("should authenticate with valid read-only token", ...)

// ❌ Bad - describes UI behavior (use E2E tests)
test("should show success message", ...)
test("should disable submit button", ...)
```

## 🔒 Database Safety

Integration tests use **real database operations**:

- **CI:** Uses `DROP SCHEMA CASCADE` (safe - ephemeral database)
- **Local:** Use `yarn seed:e2e:safe` (no DROP - preserves your data)

**Never run `yarn seed:e2e` locally!** It will delete all data.

## 📚 Resources

- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Strapi API Reference](https://docs.strapi.io/dev-docs/api/rest)
- [Integration Testing Best Practices](https://martinfowler.com/bliki/IntegrationTest.html)
