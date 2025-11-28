# E2E Testing Guide

## Prerequisites

Before running E2E tests, ensure both servers are running:

### 1. Start Strapi (Backend)

```bash
yarn workspace @repo/strapi dev
```

Wait for the message: `Server started on http://localhost:1337`

### 2. Start Next.js (Frontend)

```bash
yarn workspace @repo/ui dev
```

Wait for the message: `Ready on http://localhost:3000`

## Running E2E Tests

Once both servers are running, execute the tests:

```bash
# Run all E2E tests
yarn test:e2e

# Run with UI mode (interactive)
yarn workspace @repo/ui test:e2e:ui

# Run specific test file
yarn workspace @repo/ui playwright test e2e/homepage.spec.ts

# Run in specific browser
yarn workspace @repo/ui playwright test --project=chromium
```

## Troubleshooting

### Tests timeout immediately

- Verify Strapi is running on port 1337
- Verify Next.js is running on port 3000
- Check if the health endpoint responds: `curl http://localhost:1337/_health`

### Tests fail with "page.goto: Test timeout"

- Increase timeout in playwright.config.ts
- Check network connectivity
- Verify no firewall is blocking connections

### Strapi health check fails

- Ensure database is running and accessible
- Check Strapi logs for errors
- Verify `.env` configuration

## CI/CD Notes

In CI environments, the Playwright `webServer` configuration will automatically:

1. Wait for Strapi health check
2. Start Next.js dev server
3. Wait up to 180 seconds for servers to be ready
