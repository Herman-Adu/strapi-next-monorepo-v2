# Reference Documentation

Quick reference guides and command listings for daily development.

## Contents

- **[MONOREPO_COMMAND_REFERENCE.md](./MONOREPO_COMMAND_REFERENCE.md)** - Complete yarn command reference

  - E2E testing commands (Playwright)
  - Build commands (UI, Strapi, both)
  - Development commands (orchestrated, parallel)
  - Test commands (E2E, Integration, Unit)
  - Formatting & linting commands
  - Strapi seeding & token generation
  - Database backup commands
  - **Usage:** 20+ times/day reference
  - **Last Updated:** December 18, 2025

- **[populate-patterns.md](./populate-patterns.md)** - Strapi populate query patterns

  - Deep population examples
  - Nested relation handling
  - Performance optimization tips

- **[project-status.md](./project-status.md)** - Current project state

  - Component inventory
  - Feature completion status
  - Known issues tracking

- **[quick-reference.md](./quick-reference.md)** - Quick lookups
  - Common patterns
  - Frequently used snippets
  - Environment variable references

## Quick Access

### Most Used Commands

**E2E Tests:**

```bash
yarn workspace @repo/ui playwright test
yarn workspace @repo/ui playwright test --ui
```

**Build & Dev:**

```bash
yarn dev                 # Orchestrated development
yarn build              # Build both apps
yarn format            # Format all files
```

**Database:**

```bash
yarn backup:strapi     # Create backup
yarn seed:safe         # Safe E2E test data
```

See [MONOREPO_COMMAND_REFERENCE.md](./MONOREPO_COMMAND_REFERENCE.md) for complete list.
