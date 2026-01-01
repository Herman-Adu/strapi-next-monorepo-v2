# E2E Testing Guide

> **📖 Full Documentation**: See [`docs/13-testing/MSW-CONSOLIDATION.md`](../../docs/13-testing/MSW-CONSOLIDATION.md) for the complete MSW testing guide.

---

## Quick Start

### Running E2E Tests

```bash
# Run all E2E tests (MSW mocked - no Strapi needed!)
yarn workspace @repo/ui playwright test

# Specific test file
yarn workspace @repo/ui playwright test tests/e2e/contact-form.spec.ts

# With UI mode (interactive)
yarn workspace @repo/ui playwright test --ui
```

### Key Points

- ✅ **No Strapi required** - MSW mocks all API calls
- ✅ **Fast execution** - Tests run in 2-3 minutes
- ✅ **Consistent data** - No database side effects
- ✅ **95%+ CI success** - Reliable and stable

### Architecture

```
Playwright → Next.js (port 3000) → MSW Bridge (port 1337) → Mock Data
                                      ↑
                                Real Strapi NOT running ❌
```

---

## Common Issues

### Tests Timeout

**Cause**: Port 1337 conflict (Real Strapi running)

**Solution**: Stop Strapi before running E2E tests

```powershell
# Check what's using port 1337
netstat -ano | findstr :1337

# Kill the process
taskkill /PID <PID> /F
```

---

## Documentation

**For complete MSW testing documentation, see:**

📖 **[MSW Testing Consolidation Guide](../../docs/13-testing/MSW-CONSOLIDATION.md)**

This includes:
- Why MSW? (Problem solved)
- Architecture deep dive
- Writing tests with MSW
- Mock data patterns
- Troubleshooting guide
- Migration from old approaches
- Success metrics

---

## Integration Tests

For tests requiring **real Strapi backend**, see:

📖 **[Integration Testing Guide](../../docs/13-testing/README.md#integration-tests)**

Integration tests are different from E2E:
- E2E: MSW mocked (no Strapi)
- Integration: Real Strapi + database

---

_This file is a pointer to the main documentation. All detailed content lives in `docs/13-testing/MSW-CONSOLIDATION.md`._
